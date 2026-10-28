import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Pastikan user sudah login
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

    // 2. Pastikan order milik user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, payment_status")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order tidak ditemukan atau tidak memiliki akses." },
        { status: 404 }
      );
    }

    // 3. Validasi status order
    if (
      order.status !== "pending" &&
      order.status !== "draft" &&
      order.status !== "cancelled"
    ) {
      return NextResponse.json(
        { error: "Hanya order yang pending/draft/cancelled yang dapat dihapus." },
        { status: 400 }
      );
    }

    // 4. Hapus item turunan terlebih dahulu (mencegah error Foreign Key constraint)
    await supabase.from("order_items").delete().eq("order_id", id);

    // 5. Hapus order utama
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Delete order failed:", deleteError.message);
      return NextResponse.json(
        { error: `Gagal menghapus order: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Order berhasil dihapus." });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat menghapus order." },
      { status: 500 }
    );
  }
}