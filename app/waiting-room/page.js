"use client";
import React, { useState, useEffect, useMemo } from "react";
// Catatan: Jika di project Next.js asli, gunakan import Link from "next/link"
import { Bell, ArrowLeft, Share2, Ticket } from "lucide-react";

export default function WaitingRoom() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Target waktu undian: 20 Februari 2026 19:00:00
  const targetDate = useMemo(() => new Date("February 20, 2026 19:00:00").getTime(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleReminder = () => {
    const event = {
      title: "Pengundian Tiket Emas Kawaragi",
      description: "Terima kasih sudah mendaftar! Kursi bioskop sedang menunggu pemiliknya. Cek sekarang!",
      start: new Date(targetDate).toISOString().replace(/-|:|\.\d+/g, ""),
      end: new Date(targetDate + 3600000).toISOString().replace(/-|:|\.\d+/g, ""),
    };

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDESCRIPTION:${event.description}\nDTSTART:${event.start}\nDTEND:${event.end}\nBEGIN:VALARM\nTRIGGER:-PT15M\nACTION:DISPLAY\nDESCRIPTION:Reminder\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pengingat-kawaragi.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-between py-10 md:py-16 px-6 relative overflow-hidden font-sans select-none">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] bg-pink-600/10 rounded-full blur-[140px] animate-pulse pointer-events-none opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-full h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse pointer-events-none opacity-40" style={{ animationDelay: "3s" }}></div>

      {/* Improved Train Layer */}
      <div className="absolute top-[46%] left-0 w-full h-20 pointer-events-none z-0 overflow-hidden">
        <div className="absolute bottom-4 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="animate-train-ios-ultra flex items-end absolute bottom-5 h-12">
          {/* Locomotive */}
          <div className="relative w-36 h-11 bg-linear-to-br from-pink-500 to-pink-700 rounded-t-2xl shadow-[0_0_60px_rgba(236,72,153,0.3)] flex items-center px-5 overflow-hidden border-t border-white/20">
            <div className="flex gap-2.5">
              <div className="w-5 h-3 bg-white/50 rounded-sm animate-pulse"></div>
              <div className="w-10 h-3 bg-white/20 rounded-sm"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30"></div>
          </div>
          {/* Wagons */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="ml-1.5 w-24 h-9 bg-white/5 backdrop-blur-xl rounded-t-xl border-t border-x border-white/10 flex items-center justify-center gap-2 px-4 shadow-lg">
              <div className="w-full h-2.5 bg-white/10 rounded-full"></div>
              <div className="w-full h-2.5 bg-white/10 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-20 w-full flex flex-col items-center gap-8">
        <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl flex items-center gap-3 shadow-xl transition-transform hover:scale-105">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_12px_rgba(236,72,153,1)]"></div>
          <span className="text-[10px] font-black tracking-[0.4em] text-white/90 uppercase">Registration Confirmed</span>
        </div>

        <div className="text-center space-y-1.5">
          <h2 className="text-white/25 text-[10px] tracking-[0.7em] font-black uppercase">Kawaragi Exclusive</h2>
          <h1 className="text-5xl md:text-6xl font-[1000] tracking-[-0.06em] text-transparent bg-clip-text bg-linear-to-b from-white to-white/50">GOLDEN TICKET</h1>
        </div>
      </header>

      {/* Main Content: iOS 26 Digits */}
      <main className="relative z-10 w-full flex flex-col items-center justify-center -mt-4">
        <div className="flex flex-col items-center -space-y-5 md:-space-y-8.75">
          <div className="flex items-center justify-center gap-6 md:gap-12">
            <Ios26Digit value={timeLeft.days} />
            <div className="w-2 h-2 rounded-full bg-white/10 self-center mt-12 animate-pulse"></div>
            <Ios26Digit value={timeLeft.hours} />
          </div>
          <div className="flex items-center justify-center gap-6 md:gap-12">
            <Ios26Digit value={timeLeft.minutes} />
            <div className="w-2 h-2 rounded-full bg-white/10 self-center mt-12 animate-pulse"></div>
            <Ios26Digit value={timeLeft.seconds} />
          </div>
        </div>

        {/* Original Quote */}
        <div className="mt-16 max-w-[320px] md:max-w-md text-center px-4 space-y-6">
          <div className="h-px w-12 bg-linear-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
          <p className="text-white/35 text-sm md:text-base italic font-medium leading-relaxed tracking-wide">
            "Terima kasih sudah mendaftar! Kursi bioskop sedang menunggu pemiliknya. Pastikan namamu yang muncul di layar keberuntungan nanti."
          </p>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="relative z-20 w-full flex flex-col items-center gap-12">
        <button
          onClick={handleReminder}
          className="group relative w-full max-w-85 py-5.5 bg-white text-black font-black rounded-3xl transition-all active:scale-95 shadow-[0_25px_60px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 active:bg-gray-200"
        >
          <Bell size={22} fill="black" className="group-hover:animate-bounce" />
          <span className="text-lg tracking-tight font-black uppercase">Ingatkan Saya</span>
        </button>

        <div className="w-full flex flex-col items-center gap-10">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black text-center">*Hasil undian bersifat mutlak</p>

          <div className="flex items-center gap-14">
            {/* Menggunakan <a> untuk preview, ganti kembali ke <Link href="/"> di project asli */}
            <a href="/" className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-13 h-13 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all active:scale-90 shadow-lg">
                <ArrowLeft size={22} className="text-white/40 group-hover:text-white" />
              </div>
              <span className="text-[9px] font-black text-white/20 tracking-widest uppercase">Beranda</span>
            </a>
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
              <div className="w-13 h-13 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all active:scale-90 shadow-lg">
                <Share2 size={22} className="text-white/40 group-hover:text-white" />
              </div>
              <span className="text-[9px] font-black text-white/20 tracking-widest uppercase">Bagikan</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Visual background dekoratif */}
      <div className="absolute -bottom-24 -right-24 text-white/2 -rotate-12 pointer-events-none select-none">
        <Ticket size={450} strokeWidth={1} />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes trainMoveUltra {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(600%); }
        }
        .animate-train-ios-ultra {
          animation: trainMoveUltra 18s linear infinite;
        }
        .ios-26-liquid {
          color: white;
          text-shadow: 
            0 4px 8px rgba(0,0,0,0.6),
            0 20px 40px rgba(0,0,0,0.4);
          position: relative;
        }
        .ios-26-liquid::before {
          content: attr(data-value);
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 48%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          z-index: 2;
        }
        .ios-26-liquid::after {
          content: attr(data-value);
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 40%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          z-index: 1;
          opacity: 0.4;
        }
      `,
        }}
      />
    </div>
  );
}

function Ios26Digit({ value }) {
  const formattedValue = String(value).padStart(2, "0");
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-white/5 blur-[50px] rounded-full opacity-30 pointer-events-none group-hover:bg-pink-500/10 transition-colors duration-1000"></div>
      <span data-value={formattedValue} className="ios-26-liquid text-[125px] md:text-[230px] font-[1000] tabular-nums block leading-[0.9] tracking-[-0.08em]">
        {formattedValue}
      </span>
    </div>
  );
}
