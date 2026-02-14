"use client";

import React from "react";
// Menggunakan tag <a> standar untuk menggantikan Link agar kompatibel dengan lingkungan preview
// Kode ini tetap valid dan akan berfungsi di proyek Next.js Anda
import { Heart, Ticket, Calendar, MapPin, ArrowRight, Film, Users, Info, ExternalLink, Coffee } from "lucide-react";

const App = () => {
  // Background Blobs Component
  const BackgroundGlows = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-pink-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse delay-700"></div>
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse delay-1000"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-pink-500 selection:text-white font-sans">
      <BackgroundGlows />

      <div className="relative z-10 text-center max-w-5xl mx-auto py-12 px-4">
        {/* Support Button - Floating/Top Corner */}
        <div className="fixed top-6 right-6 z-50">
          <a
            href="https://lynk.id/kawaragi/s/p7X1MEX"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-pink-600 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 group"
            title="Support Kawaragi"
          >
            <Coffee size={20} className="group-hover:animate-bounce" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-sm font-bold whitespace-nowrap">SUPPORT KAWARAGI</span>
          </a>
        </div>

        {/* Logo Section */}
        <header className="mb-12 animate-in fade-in slide-in-from-top duration-1000">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter  from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">KAWARAGI</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 font-light tracking-[0.3em] uppercase">COMMUNITY & FAN EXPERIENCE INDONESIA</p>
        </header>

        {/* Main Feature: KOKUHO 2025 */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-12 backdrop-blur-xl shadow-2xl mb-12 transform transition-all duration-500 hover:border-pink-500/30">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Poster Section */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://m.media-amazon.com/images/M/MV5BMzIzNzZlMGItMzg3OC00MmI0LWE4NGEtNzQwZDczOGI0NGIwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                  alt="KOKUHO 2025 Film Poster"
                  className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Starring</p>
                  <p className="text-xs font-semibold text-white">Ryo Yoshizawa • Ryusei Yokohama</p>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-pink-500/30">
                <Users size={14} /> FANS INDONESIA EVENT
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-2 bg-linear-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent italic leading-tight">KOKUHO (国宝)</h2>
              <p className="text-xs text-gray-500 mb-6 font-mono tracking-widest uppercase">Directed by Lee Sang-il</p>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">Ikuti kesempatan langka untuk merayakan rilisnya mahakarya drama Jepang di Indonesia. Kawaragi mengadakan undian tiket nonton bareng spesial Valentine's Day 2026.</p>

              <div className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10 group hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-pink-500 uppercase tracking-widest flex items-center gap-1">
                    <Info size={12} /> Film Info & Cast
                  </h4>
                  <a href="https://mydramalist.com/765751-kokuho" target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                    Detail di MyDramaList <ExternalLink size={10} />
                  </a>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Pemeran: <span className="text-white">Ryo Yoshizawa, Ryusei Yokohama, Kurokawa Soya, Koshiyama Keitatsu, Mitsuki Takahata, Ken Watanabe.</span>
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Heart className="text-pink-500 shrink-0 mt-1" size={20} fill="currentColor" />
                  <div>
                    <p className="text-white font-semibold italic">Valentine's Special</p>
                    <p className="text-gray-400 text-sm">Momen sinematik terbaik untuk fans Indonesia.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ticket className="text-indigo-400 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-white font-semibold italic uppercase tracking-tighter">Total 3 Tiket Gratis</p>
                    <p className="text-gray-400 text-sm">Slot terbatas khusus untuk Fans Kawaragi Indonesia.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/register" className="flex-1 bg-white text-black hover:bg-pink-600 hover:text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-white/5">
                  IKUT UNDIAN
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary CTA */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <a href="/check-status" className="w-full md:w-auto border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-full text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2">
            CEK STATUS UNDIAN <ArrowRight size={18} />
          </a>
        </div>

        <footer className="mt-20 flex flex-col items-center gap-6">
          <div className="h-px w-20 bg-white/20"></div>
          <p className="text-gray-500 text-xs text-center max-w-lg leading-relaxed">© 2025 KAWARAGI INDONESIA. Kami adalah komunitas independen. Event ini didukung oleh kontribusi member.</p>
          <a href="https://lynk.id/kawaragi/s/p7X1MEX" target="_blank" className="text-pink-400 hover:text-pink-300 flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-pink-400/30 pb-1">
            <Coffee size={16} /> Support Our Community
          </a>
        </footer>
      </div>

      {/* Floating Decorative Elements */}
      <div className="fixed -bottom-20 -left-20 text-pink-500/10 rotate-12 pointer-events-none hidden lg:block animate-pulse">
        <Heart size={300} fill="currentColor" />
      </div>
      <div className="fixed top-10 left-10 text-white/5 pointer-events-none hidden lg:block">
        <Film size={120} />
      </div>
    </main>
  );
};

export default App;
