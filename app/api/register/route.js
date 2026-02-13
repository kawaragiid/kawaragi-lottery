import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nama, id_komunitas, no_wa } = body;

    if (!nama || !id_komunitas || !no_wa) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    const { data, error } = await supabase.from("peserta").insert([{ nama, id_komunitas, no_wa }]).select();

    if (error) {
      return NextResponse.json({ error: "Nomor WA atau ID sudah terdaftar" }, { status: 400 });
    }

    const nomor = data[0].nomor_undian;
    const formatted = `KWRG-${String(nomor).padStart(4, "0")}`;

    return NextResponse.json({ nomor: formatted });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
