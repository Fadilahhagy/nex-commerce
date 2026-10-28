import { NextResponse } from "next/server";
import MidtransClient from "midtrans-client";
import { createClient } from "@/lib/supabase/server";

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const orderId = body.orderId;

    if (typeof orderId !== "string" || !orderId) {
      return NextResponse.json(
        { error: "ID pesanan tidak valid." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, user_id, status, total_amount, payment_status, midtrans_order_id, midtrans_snap_token"
      )
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (orderError) {
      console.error("Order query failed:", orderError.message);
      return NextResponse.json(
        { error: "Gagal mengambil pesanan." },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (
      order.status !== "pending" ||
      !["unpaid", "pending"].includes(order.payment_status)
    ) {
      return NextResponse.json(
        { error: "Pesanan ini tidak bisa dibayar." },
        { status: 400 }
      );
    }

    const amount = Number(order.total_amount);

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Total pembayaran tidak valid." },
        { status: 400 }
      );
    }

    // Jika token sudah tersimpan, gunakan kembali transaksi yang sama.
    if (order.midtrans_order_id && order.midtrans_snap_token) {
      return NextResponse.json({
        token: order.midtrans_snap_token,
      });
    }

    // Buat ID baru hanya jika belum ada transaksi yang tersimpan.
    // Jika ID lama ada tetapi token tidak tersimpan, jangan membuat
    // transaksi baru secara otomatis karena transaksi lama mungkin aktif.
    if (order.midtrans_order_id) {
      return NextResponse.json(
        {
          error:
            "Transaksi sudah tercatat tetapi token tidak tersedia. Perlu pemeriksaan transaksi sebelum mencoba lagi.",
        },
        { status: 409 }
      );
    }

    const midtransOrderId = `NEXUS-${crypto.randomUUID()}`;

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
    });

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        midtrans_order_id: midtransOrderId,
        midtrans_snap_token: transaction.token,
        payment_status: "pending",
      })
      .eq("id", order.id)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .in("payment_status", ["unpaid", "pending"])
      .is("midtrans_order_id", null)
      .select("id")
      .maybeSingle();

    if (updateError || !updatedOrder) {
      console.error("Payment update failed:", {
        error: updateError?.message,
        code: updateError?.code,
      });

      return NextResponse.json(
        {
          error:
            "Transaksi dibuat, tetapi gagal menghubungkannya ke pesanan. Periksa status transaksi sebelum mencoba lagi.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error) {
    console.error("Midtrans create transaction failed:", error);

    return NextResponse.json(
      { error: "Gagal membuat transaksi pembayaran." },
      { status: 500 }
    );
  }
}