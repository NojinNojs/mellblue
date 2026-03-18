<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class OrderService
{
    public function __construct(private ProductService $productService)
    {
    }
    /**
     * Fetch all orders for a user with formatted items.
     */
    public function getUserOrders(int $userId): Collection
    {
        return Order::where('customer_id', $userId)
            ->with(['items.product.images'])
            ->latest()
            ->get()
            ->map(fn(Order $order) => $this->formatOrder($order));
    }

    /**
     * Create a new order with stock reservation.
     *
     * @throws \Exception
     */
    public function createOrder(int $userId, array $data): Order
    {
        DB::beginTransaction();

        try {
            // Lock the product row to prevent race condition (overselling)
            $product = Product::where('id', $data['product_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $variant = null;
            if (!empty($data['variant_id'])) {
                $variant = $product->variants()->where('id', $data['variant_id'])->firstOrFail();
            }

            // Determine available stock and unit price
            $availableStock = $variant
                ? ($variant->stock - $variant->stock_reserved)
                : $product->available_stock;

            if ($availableStock < $data['quantity']) {
                throw new \Exception('Insufficient stock. Only ' . $availableStock . ' units available.');
            }

            $unitPrice = $product->base_price + ($variant?->price_adjustment ?? 0);
            $subtotal = $unitPrice * $data['quantity'];

            // Reserve stock
            if ($variant) {
                $variant->increment('stock_reserved', $data['quantity']);
            } else {
                $product->increment('stock_reserved', $data['quantity']);
            }

            // Build order number (dashes instead of slashes for URL safety)
            $orderNumber = 'INV-' . now()->format('Y') . '-' . now()->format('m') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_id' => $userId,
                'status' => 'pending',
                'shipping_name' => $data['shipping_name'],
                'shipping_phone' => $data['shipping_phone'],
                'shipping_address' => $data['shipping_address'],
                'shipping_city' => $data['shipping_city'] ?? '',
                'subtotal' => $subtotal,
                'shipping_cost' => $data['shipping_cost'] ?? 0,
                'total' => $subtotal + ($data['shipping_cost'] ?? 0),
                'payment_deadline' => now()->addHours(24),
                'notes' => $data['notes'] ?? null,
            ]);

            // Build product snapshot for immutable history
            $productSnapshot = [
                'public_id' => $product->public_id,
                'category' => $product->category?->name,
                'description' => $product->description,
                'image' => $product->image,
                'images' => $product->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $this->productService->getImageUrl($img->image_url),
                ])->values()->all(),
                'status' => $product->status,
            ];

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'variant_id' => $variant?->id,
                'product_name' => $product->name,
                'variant_name' => $variant?->name,
                'unit_price' => $unitPrice,
                'quantity' => $data['quantity'],
                'subtotal' => $subtotal,
                'product_snapshot' => $productSnapshot,
            ]);

            DB::commit();
            return $order;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Cancel an order and release the reserved stock.
     *
     * @throws \Exception
     */
    public function cancelOrder(Order $order): void
    {
        if (in_array($order->status, ['shipped', 'completed', 'cancelled'])) {
            throw new \Exception('Order cannot be cancelled in its current status.');
        }

        DB::transaction(function () use ($order) {
            // Release reserved stock for each item
            foreach ($order->items as $item) {
                if ($item->variant_id) {
                    $item->variant?->decrement('stock_reserved', $item->quantity);
                } else {
                    $item->product?->decrement('stock_reserved', $item->quantity);
                }
            }

            $order->update(['status' => 'cancelled']);
        });
    }

    /**
     * Reusable order DTO formatter.
     */
    public function formatOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'customer' => $order->relationLoaded('customer') ? $order->customer : null,
            'shipping_name' => $order->shipping_name,
            'subtotal' => $order->subtotal,
            'shipping_cost' => $order->shipping_cost,
            'total' => $order->total,
            'created_at' => $order->created_at->format('Y-m-d H:i:s'),
            'items' => $order->items->map(fn($item) => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'variant_name' => $item->variant_name,
                'unit_price' => $item->unit_price,
                'quantity' => $item->quantity,
                'subtotal' => $item->subtotal,
                'image' => $item->product_snapshot['images'][0]['url'] ?? $item->product_snapshot['image'] ?? null,
            ])->values()->all(),
        ];
    }
}
