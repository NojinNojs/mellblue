<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService)
    {
    }

    public function index()
    {
        $orders = Order::with(['customer:id,name,email', 'items'])
            ->latest()
            ->paginate(15)
            ->through(fn($order) => $this->orderService->formatOrder($order));

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['customer:id,name,email', 'items', 'payments.verifier:id,name', 'latestPayment']);

        return Inertia::render('admin/orders/show', [
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
                'customer' => $order->customer,
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
                'latest_payment' => $order->latestPayment ? [
                    'id' => $order->latestPayment->id,
                    'type' => $order->latestPayment->type,
                    'method' => $order->latestPayment->method,
                    'proof_image_url' => $this->resolveImageUrl($order->latestPayment->proof_image_url),
                    'sender_account' => $order->latestPayment->sender_account,
                    'amount' => $order->latestPayment->amount,
                    'status' => $order->latestPayment->status,
                    'reject_reason' => $order->latestPayment->reject_reason,
                    'verified_at' => $order->latestPayment->verified_at,
                    'verifier' => $order->latestPayment->verifier?->name,
                ] : null,
            ],
        ]);
    }

    public function verify(Request $request, Order $order)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'reject_reason' => 'required_if:action,reject|nullable|string',
        ]);

        $payment = $order->latestPayment;

        if (!$payment) {
            return back()->withErrors(['error' => 'No payment found for this order.']);
        }

        if ($request->action === 'approve') {
            $payment->update([
                'status' => 'verified',
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);
            $order->update(['status' => 'processing']);

            // Deduct from actual stock now that payment is confirmed
            foreach ($order->items as $item) {
                if ($item->variant_id) {
                    $item->variant?->decrement('stock', $item->quantity);
                    $item->variant?->decrement('stock_reserved', $item->quantity);
                } else {
                    $item->product?->decrement('stock', $item->quantity);
                    $item->product?->decrement('stock_reserved', $item->quantity);
                }
            }
        } else {
            $payment->update([
                'status' => 'rejected',
                'reject_reason' => $request->reject_reason,
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);
            $order->update(['status' => 'pending']);
        }

        return back()->with('success', 'Payment verification updated.');
    }

    public function ship(Request $request, Order $order)
    {
        $request->validate([
            'tracking_number' => 'required|string|max:100',
        ]);

        $order->update([
            'status' => 'shipping',
            'tracking_number' => $request->tracking_number,
        ]);

        return back()->with('success', 'Order marked as shipped.');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,waiting_confirmation,pending_payment,paid,processing,shipping,completed,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        return back()->with('success', 'Order status updated successfully.');
    }
}
