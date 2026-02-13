"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

// Pindahkan FieldWrapper ke luar agar tidak menyebabkan remount saat re-render
const FieldWrapper = ({ label, children, icon }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold ml-1">
      {icon} {label}
    </label>
    {children}
  </div>
);

export default function FormRegistration() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [idStatus, setIdStatus] = useState({ available: null, loading: false });

  // Gunakan state untuk input agar menjadi controlled component
  const [formData, setFormData] = useState({
    kawaragi_id: "",
    full_name: "",
    email: "",
    whatsapp: "",
  });

  const router = useRouter();

  // 1. FUNGSI CEK ID
  const checkIdAvailability = async (id) => {
    const cleanId = id.toLowerCase().trim();
    if (cleanId.length < 3) {
      setIdStatus({ available: null, loading: false });
      return;
    }

    setIdStatus((prev) => ({ ...prev, loading: true }));

    const { data, error } = await supabase.from("registrations").select("kawaragi_id").eq("kawaragi_id", cleanId).maybeSingle();

    if (error) {
      console.error("Gagal cek ID:", error.message);
      setIdStatus({ available: null, loading: false });
    } else {
      setIdStatus({ available: data ? false : true, loading: false });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Khusus WhatsApp, hanya izinkan angka
    if (name === "whatsapp") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "kawaragi_id") {
      checkIdAvailability(value);
    }
  };

  // 2. FUNGSI KIRIM DATA
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi WhatsApp: Harus mulai dengan 0 dan panjang 11-13
    const waRegex = /^0\d{10,12}$/;
    if (!waRegex.test(formData.whatsapp)) {
      setMessage("Nomor WhatsApp harus diawali angka 0 dan terdiri dari 11-13 digit!");
      return;
    }

    if (idStatus.available === false) {
      setMessage("Gagal: Username ini sudah digunakan!");
      return;
    }

    setLoading(true);
    setMessage("");

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      kawaragi_id: formData.kawaragi_id.toLowerCase().trim(),
    };

    const { error } = await supabase.from("registrations").insert([payload]);

    if (error) {
      if (error.code === "23505") {
        if (error.message.includes("kawaragi_id")) setMessage("Username sudah terpakai!");
        else if (error.message.includes("whatsapp")) setMessage("Nomor WhatsApp sudah terdaftar!");
        else setMessage("Email sudah terdaftar!");
      } else {
        setMessage("Terjadi kesalahan: " + error.message);
      }
    } else {
      setMessage("Tiket Undian Berhasil Dibuat! Mengalihkan...");
      setTimeout(() => {
        router.push("/waiting-room");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans">
      {/* TOMBOL BACK KE HOME */}
      <button onClick={() => router.push("/")} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors text-xs font-bold tracking-widest uppercase group">
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <div className="relative group w-full max-w-md">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-pink-600/20 to-purple-900/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

        <div className="relative bg-[#0a0a0a] border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-block px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full mb-4">
              <span className="text-pink-500 text-[9px] font-black tracking-[0.3em] uppercase">Lottery Event</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3">
              Valentine <span className="bg-linear-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">Draw</span>
            </h2>
            <p className="text-gray-500 text-xs font-light leading-relaxed">
              Daftarkan diri kamu untuk ikut undian eksklusif <br /> dan dapatkan username unik di komunitas Kawaragi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* INPUT: KAWARAGI ID */}
            <FieldWrapper
              label="Username Undian (ID)"
              icon={
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            >
              <div className="relative">
                <input
                  name="kawaragi_id"
                  type="text"
                  required
                  value={formData.kawaragi_id}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className={`w-full bg-white/2 border ${
                    idStatus.available === false ? "border-red-500/40" : idStatus.available === true ? "border-green-500/40" : "border-white/10"
                  } rounded-2xl px-5 py-4 text-white placeholder:text-gray-800 focus:outline-none focus:border-pink-500/50 transition-all text-sm`}
                  placeholder="Contoh: kirei_valentine"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-bold tracking-widest uppercase">
                  {idStatus.loading && <span className="text-gray-600 animate-pulse">Checking...</span>}
                  {idStatus.available === true && <span className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">Tersedia</span>}
                  {idStatus.available === false && <span className="text-red-500">Terpakai</span>}
                </div>
              </div>
              <p className="text-[9px] text-gray-600 italic px-1">ID ini akan digunakan sebagai identitas kamu saat pengundian.</p>
            </FieldWrapper>

            {/* INPUT: NAMA LENGKAP */}
            <FieldWrapper
              label="Nama Lengkap"
              icon={
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.333 0 4 .667 4 2V15H5v-1c0-1.333 2.667-2 4-2z"
                  />
                </svg>
              }
            >
              <input
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                autoComplete="off"
                className="w-full bg-white/2 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-800 focus:border-pink-500/50 outline-none transition-all text-sm"
                placeholder="Nama sesuai identitas"
              />
            </FieldWrapper>

            <div className="grid grid-cols-1 gap-5">
              <FieldWrapper
                label="Alamat Email"
                icon={
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              >
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full bg-white/2 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-800 focus:border-pink-500/50 outline-none transition-all text-sm"
                  placeholder="email@kamu.com"
                />
              </FieldWrapper>

              <FieldWrapper
                label="Nomor WhatsApp"
                icon={
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                }
              >
                <div className="space-y-1">
                  <input
                    name="whatsapp"
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    maxLength={13}
                    autoComplete="off"
                    className="w-full bg-white/2 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-800 focus:border-pink-500/50 outline-none transition-all text-sm"
                    placeholder="0812xxxxxxxx"
                  />
                  <p className="text-[9px] text-gray-600 italic px-1">Gunakan format angka saja (contoh: 081234567890)</p>
                </div>
              </FieldWrapper>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                disabled={loading || idStatus.available === false}
                className="group relative w-full overflow-hidden rounded-2xl bg-white p-px font-bold transition-all active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <div className="relative h-14 w-full rounded-2xl bg-[#0a0a0a] transition-all group-hover:bg-transparent flex items-center justify-center">
                  <span className={`relative transition-colors duration-200 ${loading ? "text-gray-600" : "text-white group-hover:text-black"} tracking-[0.2em] text-[10px]`}>{loading ? "MEMPROSES..." : "AMBIL TIKET UNDIAN"}</span>
                </div>
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-pink-500 via-rose-400 to-pink-600"></div>
              </button>
            </div>

            {/* STATUS MESSAGE */}
            {message && (
              <div
                className={`flex items-center justify-center p-4 rounded-2xl border ${
                  message.includes("Gagal") || message.includes("kesalahan") || message.includes("digit") ? "bg-red-500/5 border-red-500/20 text-red-400" : "bg-pink-500/5 border-pink-500/20 text-pink-400"
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase text-center">{message}</span>
              </div>
            )}
          </form>

          <p className="mt-10 text-center text-[9px] text-gray-700 tracking-[0.3em] uppercase">Sistem Undian Otomatis &bull; Kawaragi 2026</p>
        </div>
      </div>
    </div>
  );
}
