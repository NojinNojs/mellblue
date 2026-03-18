<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Receipt - {{ $order->order_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.6;
            background: #fff;
        }
        .page { padding: 40px 45px; }

        /* ── Header ─── */
        .header { padding-bottom: 24px; border-bottom: 1px solid #ddd; margin-bottom: 28px; }
        .header table { width: 100%; }
        .brand { font-size: 26px; font-weight: 700; color: #1a1a2e; letter-spacing: 3px; }
        .brand-sub { font-size: 9px; color: #888; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
        .inv-label { text-align: right; font-size: 9px; color: #888; text-transform: uppercase; letter-spacing: 1.5px; }
        .inv-number { text-align: right; font-size: 13px; font-weight: 700; color: #1a1a2e; margin-top: 2px; }
        .inv-date { text-align: right; font-size: 10px; color: #666; margin-top: 2px; }

        /* ── Info Columns ─── */
        .info-row { width: 100%; margin-bottom: 28px; }
        .info-row td { vertical-align: top; }
        .info-title { font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; }
        .info-name { font-size: 12px; font-weight: 700; color: #1a1a2e; }
        .info-text { font-size: 10px; color: #555; line-height: 1.7; }

        /* ── Divider ─── */
        .divider { border: none; border-top: 1px solid #e5e5e5; margin: 24px 0; }

        /* ── Items Table ─── */
        .items { width: 100%; border-collapse: collapse; margin-bottom: 0; }
        .items th {
            font-size: 8px;
            font-weight: 700;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 8px 10px;
            border-bottom: 2px solid #1a1a2e;
            text-align: left;
        }
        .items th.r { text-align: right; }
        .items th.c { text-align: center; }
        .items td {
            padding: 12px 10px;
            font-size: 11px;
            border-bottom: 1px solid #f0f0f0;
            color: #333;
            vertical-align: top;
        }
        .items td.r { text-align: right; }
        .items td.c { text-align: center; }
        .items .product-name { font-weight: 600; color: #1a1a2e; }
        .items .variant { font-size: 9px; color: #888; margin-top: 1px; }

        /* ── Totals ─── */
        .totals { width: 100%; margin-top: 4px; margin-bottom: 28px; }
        .totals td { padding: 5px 10px; font-size: 10px; }
        .totals .lbl { text-align: right; color: #888; width: 85%; }
        .totals .val { text-align: right; font-weight: 600; color: #333; }
        .totals .total-row td {
            padding-top: 10px;
            border-top: 2px solid #1a1a2e;
            font-size: 13px;
            font-weight: 700;
            color: #1a1a2e;
        }

        /* ── Detail Section ─── */
        .detail-section { margin-bottom: 24px; }
        .detail-title {
            font-size: 8px;
            font-weight: 700;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid #eee;
        }
        .detail-grid { width: 100%; }
        .detail-grid td { padding: 4px 0; font-size: 10px; vertical-align: top; }
        .detail-grid .dl { color: #888; width: 120px; }
        .detail-grid .dv { color: #333; font-weight: 600; }

        /* ── Status ─── */
        .status {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .st-completed { background: #d1fae5; color: #065f46; }
        .st-shipping { background: #dbeafe; color: #1e40af; }
        .st-processing { background: #e0e7ff; color: #3730a3; }
        .st-pending { background: #fef3c7; color: #92400e; }
        .st-cancelled { background: #fee2e2; color: #991b1b; }

        /* ── Footer ─── */
        .footer { border-top: 1px solid #ddd; padding-top: 20px; text-align: center; margin-top: 10px; }
        .footer-thanks { font-size: 12px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
        .footer-contact { font-size: 9px; color: #888; line-height: 1.6; }
        .footer-brand { font-size: 8px; font-weight: 700; color: #1a1a2e; letter-spacing: 2px; margin-top: 10px; }
        .footer-legal { font-size: 8px; color: #bbb; margin-top: 4px; }
    </style>
</head>
<body>
<div class="page">

    <!-- ═══ HEADER ═══ -->
    <div class="header">
        <table>
            <tr>
                <td style="width: 50%; vertical-align: bottom;">
                    <div class="brand">MELLBLUE</div>
                    <div class="brand-sub">Premium Artisan Treats</div>
                </td>
                <td style="width: 50%; vertical-align: bottom;">
                    <div class="inv-label">Invoice</div>
                    <div class="inv-number">{{ $order->order_number }}</div>
                    <div class="inv-date">{{ $order->created_at->format('d F Y') }} &bull; {{ $order->created_at->format('H:i') }} WIB</div>
                </td>
            </tr>
        </table>
    </div>

    <!-- ═══ BILLING & SHIPPING ═══ -->
    <table class="info-row">
        <tr>
            <td style="width: 48%; padding-right: 20px;">
                <div class="info-title">Billed To</div>
                <div class="info-name">{{ $order->shipping_name }}</div>
                <div class="info-text">{{ $order->shipping_phone }}</div>
                @if($order->customer && $order->customer->email)
                <div class="info-text">{{ $order->customer->email }}</div>
                @endif
            </td>
            <td style="width: 32%; padding-right: 20px;">
                <div class="info-title">Ship To</div>
                <div class="info-text">{{ $order->shipping_address }}</div>
                <div class="info-text">{{ $order->shipping_city }}</div>
                @if($order->tracking_number)
                <div class="info-text" style="margin-top: 4px; font-weight: 600; color: #1a1a2e;">Resi: {{ $order->tracking_number }}</div>
                @endif
            </td>
            <td style="width: 20%; text-align: right;">
                <div class="info-title">Status</div>
                @php
                    $sc = match($order->status) {
                        'completed' => 'st-completed',
                        'shipping' => 'st-shipping',
                        'processing' => 'st-processing',
                        'cancelled' => 'st-cancelled',
                        default => 'st-pending',
                    };
                @endphp
                <span class="status {{ $sc }}">{{ str_replace('_', ' ', $order->status) }}</span>
            </td>
        </tr>
    </table>

    <hr class="divider">

    <!-- ═══ ITEMS ═══ -->
    <table class="items">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 45%;">Description</th>
                <th class="c" style="width: 10%;">Qty</th>
                <th class="r" style="width: 20%;">Unit Price</th>
                <th class="r" style="width: 20%;">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $i => $item)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>
                    <div class="product-name">{{ $item->product_name }}</div>
                    @if($item->variant_name)
                    <div class="variant">{{ $item->variant_name }}</div>
                    @endif
                </td>
                <td class="c">{{ $item->quantity }}</td>
                <td class="r">Rp {{ number_format($item->unit_price, 0, ',', '.') }}</td>
                <td class="r" style="font-weight: 600;">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- ═══ TOTALS ═══ -->
    <table class="totals">
        <tr>
            <td class="lbl">Subtotal</td>
            <td class="val">Rp {{ number_format($order->subtotal, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="lbl">Shipping</td>
            <td class="val">{{ $order->shipping_cost > 0 ? 'Rp ' . number_format($order->shipping_cost, 0, ',', '.') : 'Free' }}</td>
        </tr>
        @if(isset($order->unique_code) && $order->unique_code > 0)
        <tr>
            <td class="lbl">Unique Code</td>
            <td class="val">Rp {{ number_format($order->unique_code, 0, ',', '.') }}</td>
        </tr>
        @endif
        <tr class="total-row">
            <td class="lbl">Total</td>
            <td class="val">Rp {{ number_format($order->total, 0, ',', '.') }}</td>
        </tr>
    </table>

    <!-- ═══ PAYMENT ═══ -->
    @if($payment)
    <div class="detail-section">
        <div class="detail-title">Payment Information</div>
        <table class="detail-grid">
            <tr>
                <td class="dl">Method</td>
                <td class="dv">{{ ucfirst(str_replace('_', ' ', $payment->method)) }}</td>
            </tr>
            <tr>
                <td class="dl">Status</td>
                <td class="dv">{{ ucfirst($payment->status) }}</td>
            </tr>
            @if($payment->sender_account)
            <tr>
                <td class="dl">Sender Account</td>
                <td class="dv">{{ $payment->sender_account }}</td>
            </tr>
            @endif
            @if($payment->verified_at)
            <tr>
                <td class="dl">Verified At</td>
                <td class="dv">{{ \Carbon\Carbon::parse($payment->verified_at)->format('d M Y, H:i') }} WIB</td>
            </tr>
            @endif
        </table>
    </div>
    @endif

    <!-- ═══ FOOTER ═══ -->
    <div class="footer">
        <div class="footer-thanks">Thank You for Your Order!</div>
        <div class="footer-contact">
            Questions? Contact us at {{ config('app.phone') ?? '+6281234567890' }}
        </div>
        <div class="footer-brand">MELLBLUE &mdash; Premium Artisan Treats</div>
        <div class="footer-legal">This is a computer-generated document. No signature is required.</div>
    </div>

</div>
</body>
</html>
