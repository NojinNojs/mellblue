<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use App\Services\ProductService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
        private ProductService $productService
    ) {
    }

    /**
     * List all orders for the authenticated user.
     */
    public function index()
    {
        $orders = $this->orderService->getUserOrders(Auth::id());

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show the checkout page for a given product.
     */
    public function create(Request $request)
    {
        $product = Product::with(['images', 'variants', 'category:id,name'])
            ->where('public_id', $request->query('product_id'))
            ->firstOrFail();

        return Inertia::render('checkout', [
            'product' => $this->productService->formatProduct($product),
            'user' => Auth::user(),
        ]);
    }

    /**
     * Store a new order for the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
            'shipping_name' => 'required|string|max:100',
            'shipping_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string|max:100',
            'notes' => 'nullable|string',
        ]);

        try {
            $order = $this->orderService->createOrder(Auth::id(), $validated);
            return redirect()->route('orders.show', $order->order_number);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage() ?: 'Failed to create order.');
        }
    }

    /**
     * Show a single order (only accessible by the order's customer).
     */
    public function show(Order $order)
    {
        if ($order->customer_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['items', 'latestPayment']);

        return Inertia::render('orders/show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'shipping_name' => $order->shipping_name,
                'shipping_phone' => $order->shipping_phone,
                'shipping_address' => $order->shipping_address,
                'shipping_city' => $order->shipping_city,
                'subtotal' => $order->subtotal,
                'shipping_cost' => $order->shipping_cost,
                'total' => $order->total,
                'payment_deadline' => $order->payment_deadline,
                'notes' => $order->notes,
                'created_at' => $order->created_at?->toISOString(),
                'items' => $order->items->map(fn($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'variant_name' => $item->variant_name,
                    'unit_price' => $item->unit_price,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->subtotal,
                    'image' => $item->product_snapshot['images'][0]['url'] ?? $item->product_snapshot['image'] ?? null,
                    'product_snapshot' => $item->product_snapshot,
                ])->values()->all(),
                'payment' => $order->latestPayment ? [
                    'proof_image_url' => $this->resolveImageUrl($order->latestPayment->proof_image_url),
                    'method' => $order->latestPayment->method,
                    'amount' => $order->latestPayment->amount,
                    'status' => $order->latestPayment->status,
                    'reject_reason' => $order->latestPayment->reject_reason,
                ] : null,
            ],
        ]);
    }

    /**
     * Cancel the given order (only by the customer).
     */
    public function cancel(Order $order)
    {
        if ($order->customer_id !== Auth::id()) {
            abort(403);
        }

        try {
            $this->orderService->cancelOrder($order);
            return back()->with('success', 'Order cancelled successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Upload payment proof for a pending order.
     */
    public function uploadPayment(Request $request, Order $order)
    {
        if ($order->customer_id !== Auth::id()) {
            abort(403);
        }

        if (!in_array($order->status, ['pending', 'pending_payment'])) {
            return back()->with('error', 'Payment cannot be uploaded for this order status.');
        }

        $validated = $request->validate([
            'sender_account_number' => 'required|string|max:255',
            'proof_image' => 'required|image|max:5120', // 5MB max
        ]);

        $path = $request->file('proof_image')->store('payments', 'public');

        \App\Models\Payment::create([
            'order_id' => $order->id,
            'type' => 'payment',
            'method' => 'bank_transfer',
            'proof_image_url' => $path,
            'sender_account' => $validated['sender_account_number'],
            'amount' => $order->total,
            'status' => 'pending',
            'created_at' => now(),
        ]);

        $order->update(['status' => 'waiting_confirmation']);

        return back()->with('success', 'Payment proof uploaded successfully.');
    }
    /**
     * Mark the order as completed (by the customer).
     */
    public function complete(Order $order)
    {
        if ($order->customer_id !== Auth::id()) {
            abort(403);
        }

        if ($order->status !== 'shipping') {
            return back()->with('error', 'Only orders that have been shipped can be marked as completed.');
        }

        $order->update(['status' => 'completed']);

        return back()->with('success', 'Order marked as completed. Thank you for shopping with us!');
    }

    /**
     * Download a PDF receipt for the given order.
     */
    public function receipt(Order $order)
    {
        if ($order->customer_id !== Auth::id()) {
            abort(403);
        }

        // Only allow receipt for orders that are past pending payment
        if (in_array($order->status, ['pending', 'pending_payment'])) {
            return back()->with('error', 'Receipt is not available for unpaid orders.');
        }

        $order->load(['items', 'latestPayment']);

        $payment = $order->latestPayment;

        $pdf = Pdf::loadView('receipts.order', compact('order', 'payment'));
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("Receipt-{$order->order_number}.pdf");
    }
}
