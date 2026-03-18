<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PaymentService
{
    /**
     * Handle payment proof file upload and db persistence.
     * @throws \Exception
     */
    public function uploadPaymentProof(Order $order, UploadedFile $file, ?string $senderAccountNumber): void
    {
        if (!$file->isValid()) {
            throw new \Exception('Payment proof upload failed: Invalid file.');
        }

        try {
            $filename = $file->hashName();
            $storagePath = 'payment-proofs/' . $filename;

            Storage::disk('public')->put($storagePath, file_get_contents($file->getPathname()));

            Payment::create([
                'order_id' => $order->id,
                'proof_image_url' => $storagePath,
                'sender_account' => $senderAccountNumber,
            ]);

            $order->update(['status' => 'waiting_confirmation']);
        } catch (\Throwable $e) {
            \Log::error('Payment proof storage failed: ' . $e->getMessage());
            throw new \Exception('Failed to process payment proof.');
        }
    }
}
