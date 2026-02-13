"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckStatus() {
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Cek apakah nomor WA ada di tabel registrations
      const { data, error } = await supabase.from("registrations").select("whatsapp").eq("whatsapp", whatsapp).single();

      if (error || !data) {
        // Jika tidak ditemukan, arahkan ke daftar
        setErrorMsg("Nomor tidak terdaftar. Mengarahkan ke form pendaftaran...");
        setTimeout(() => {
          router.push("/register");
        }, 2000);
      } else {
        // Jika ditemukan, simpan status login sederhana (opsional) dan masuk ke waiting room
        router.push("/waiting-room");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111] border border-white/10 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Verifikasi Peserta</h2>
        <p className="text-gray-400 text-sm text-center mb-8">Masukkan nomor WhatsApp yang kamu gunakan saat mendaftar untuk masuk ke Waiting Room.</p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 text-center">Nomor WhatsApp</label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center text-xl tracking-widest text-white focus:border-pink-500 outline-none transition-all"
              placeholder="081234567xxx"
            />
          </div>

          <button disabled={loading} className="w-full bg-pink-600 hover:bg-pink-500 text-white py-4 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50">
            {loading ? "MENGECEK..." : "MASUK WAITING ROOM"}
          </button>

          {errorMsg && <p className="text-center text-sm text-pink-400 animate-pulse">{errorMsg}</p>}

          <div className="text-center">
            <Link href="/" className="text-xs text-gray-600 hover:text-white transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
