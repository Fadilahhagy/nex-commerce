
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  console.log("MIDTRANS WEBHOOK HIT:", request.url);
  
  try {
    const body = await request.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serverKey || !supabaseUrl || !serviceRoleKey) {
      console.error("Webhook environment variables belum lengkap.");

      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    // 1. Verifikasi signature dari Midtrans.
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      transaction_id,
      payment_type,
      fraud_status,
    } = body;

    if (
      typeof order_id !== "string" ||
      typeof status_code !== "string" ||
      typeof gross_amount !== "string" ||
      typeof signature_key !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid notification." },
        { status: 400 }
      );
    }

    const expectedSignature = createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    const received = Buffer.from(signature_key, "hex");
    const expected = Buffer.from(expectedSignature, "hex");

    if (
      received.length !== expected.length ||
      !timingSafeEqual(received, expected)
    ) {
      return NextResponse.json(
        { error: "Invalid signature." },
        { status: 403 }
      );
    }

    // 2. Gunakan Supabase admin hanya di server.
    const supabase = createSupabaseClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 3. Cari order berdasarkan ID transaksi Midtrans.
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, total_amount, payment_status")
      .eq("midtrans_order_id", order_id)
      .maybeSingle();

    if (orderError) {
      console.error("Order lookup failed:", orderError.message);

      return NextResponse.json(
        { error: "Failed to find order." },
        { status: 500 }
      );
    }


  if (!order) {
    // Midtrans menyediakan notifikasi tes dengan order_id
    // khusus yang bukan order asli NEXUS.
    if (order_id.startsWith("payment_notif_test_")) {
      console.log("Midtrans test notification received.");

      return NextResponse.json({
        received: true,
        message: "Test notification received.",
      });
    }

    console.error("Order not found for Midtrans order_id:", order_id);

    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

    // 4. Pastikan nominal yang dikirim cocok dengan database.
    const expectedAmount = Number(order.total_amount);
    const receivedAmount = Number(gross_amount);

    if (
      !Number.isFinite(receivedAmount) ||
      receivedAmount !== expectedAmount
    ) {
      return NextResponse.json(
        { error: "Transaction amount mismatch." },
        { status: 400 }
      );
    }


    // 5. Petakan status dari Midtrans.
    let paymentStatus:
      | "pending"
      | "paid"
      | "failed"
      | "expired"
      | "refunded"
      | null = null;

    if (
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept")
    ) {
      paymentStatus = "paid";
    } else if (transaction_status === "pending") {
      paymentStatus = "pending";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "failure" ||
      transaction_status === "cancel"
    ) {
      paymentStatus = "failed";
    } else if (transaction_status === "expire") {
      paymentStatus = "expired";
    } else if (
      transaction_status === "refund" ||
      transaction_status === "partial_refund"
    ) {
      paymentStatus = "refunded";
    }

    // Abaikan status yang belum ditangani.
    if (!paymentStatus) {
      return NextResponse.json({ received: true });
    }

    // Jangan biarkan notifikasi biasa menurunkan status
    // pembayaran yang sudah berhasil. Refund tetap diproses.
    if (
      order.payment_status === "paid" &&
      paymentStatus !== "refunded"
    ) {
      return NextResponse.json({ received: true });
    }

    const updates: Record<string, string | null> = {
      payment_status: paymentStatus,
      midtrans_transaction_id:
        typeof transaction_id === "string" ? transaction_id : null,
      payment_method:
        typeof payment_type === "string" ? payment_type : null,
    };

    if (paymentStatus === "paid") {
      updates.paid_at = new Date().toISOString();
      updates.status = "paid";
    }

    // 6. Simpan perubahan ke database.
    const { error: updateError } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", order.id)
      .eq("midtrans_order_id", order_id);

    if (updateError) {
      console.error("Payment update failed:", updateError.message);

      return NextResponse.json(
        { error: "Failed to update payment." },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });


  } catch (error) {
    console.error("Midtrans webhook error:", error);

    return NextResponse.json(
      { error: "Notification processing failed." },
      { status: 500 }
    );
  }
}