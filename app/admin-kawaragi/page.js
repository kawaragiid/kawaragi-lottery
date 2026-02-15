"use client";

import React, { useState, useEffect, useRef } from "react";
// Nota: Import supabase dimatikan untuk mengelakkan ralat build dalam pratonton.
// Sila aktifkan semula baris ini dalam projek tempatan anda:
import { supabase } from "../../lib/supabase";
import { Train, RefreshCw, Eye, EyeOff, Trophy, Zap, ChevronDown, ChevronUp, Music, Upload, X, Trash2, CheckCircle, MessageCircle } from "lucide-react";

// Durasi total animasi (40 saat)
const RAFFLE_DURATION = 40000;

const MOCK_DATA = [
  { id: 1, kawaragi_id: "Kawaragi_Sensei", full_name: "Andi Pratama", whatsapp: "6281234567890" },
  { id: 2, kawaragi_id: "User_Kece_99", full_name: "Budi Santoso", whatsapp: "6281234567891" },
  { id: 3, kawaragi_id: "Shinkansen_Lover_Long_ID", full_name: "Citra Lestari", whatsapp: "6281234567892" },
  { id: 4, kawaragi_id: "Agent_007_Spectre", full_name: "Dedi Kurniawan", whatsapp: "6281234567893" },
  { id: 5, kawaragi_id: "Pinky_Pie_Valentine", full_name: "Eka Putri", whatsapp: "6281234567894" },
  ...Array.from({ length: 45 }, (_, i) => ({
    id: i + 6,
    kawaragi_id: `USER_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    full_name: `Penumpang Ke-${i + 6}`,
    whatsapp: `62812${Math.floor(Math.random() * 10000000)}`,
  })),
];

// Fungsi untuk mengacak array (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const ShinkansenDraw = ({ participants, onWinnerFound, isSpinning, setIsSpinning, audioRef, isLiveMode }) => {
  const [offset, setOffset] = useState(0);
  const [blur, setBlur] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const containerRef = useRef(null);
  const [displayParticipants, setDisplayParticipants] = useState([]);
  const carWidth = 300;

  // Inisialisasi awal kereta
  useEffect(() => {
    if (participants && participants.length > 0) {
      const repeated = [];
      for (let i = 0; i < 75; i++) {
        repeated.push(...participants);
      }
      setDisplayParticipants(repeated);
    }
  }, [participants]);

  const startDraw = () => {
    if (isSpinning || !participants || participants.length === 0) return;

    // Putar suara
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.error("Ralat audio:", err));
    }

    onWinnerFound(null);

    // 1. RESET ANIMASI KE AWAL SECARA INSTAN
    setTransitionEnabled(false);
    setOffset(0);
    setBlur(0);

    // 2. ACAK ULANG URUTAN PENUMPANG UNTUK VISUAL KERETA (Agar setiap roll berbeda urutannya)
    const randomizedParticipants = shuffleArray(participants);
    const newDisplayList = [];
    for (let i = 0; i < 75; i++) {
      newDisplayList.push(...randomizedParticipants);
    }
    setDisplayParticipants(newDisplayList);

    // Gunakan timeout untuk memastikan reset posisi dan urutan baru sudah diterapkan oleh browser
    setTimeout(() => {
      setTransitionEnabled(true);
      setIsSpinning(true);

      // 3. TENTUKAN PEMENANG SECARA ACAK DARI DATA ASLI
      const winnerIndexInRandomized = Math.floor(Math.random() * randomizedParticipants.length);
      const winner = randomizedParticipants[winnerIndexInRandomized];

      const totalCars = newDisplayList.length;
      // Hitung posisi berhenti di blok repetisi akhir
      const stopIndex = totalCars - randomizedParticipants.length * 4 + winnerIndexInRandomized;

      const containerMid = containerRef.current?.offsetWidth / 2 || 0;
      const targetOffset = -(stopIndex * carWidth) + containerMid - carWidth / 2;

      // 4. MULAI ANIMASI MELUNCUR DENGAN URUTAN BARU
      setTimeout(() => {
        setOffset(targetOffset);
        setTimeout(() => setBlur(10), 1000);
        setTimeout(() => setBlur(0), RAFFLE_DURATION * 0.8);
      }, 50);

      // Selesai animasi
      setTimeout(() => {
        setIsSpinning(false);
        onWinnerFound(winner);
      }, RAFFLE_DURATION + 500);
    }, 100);
  };

  return (
    <div className="relative w-full overflow-hidden py-20 bg-[#080808] rounded-3xl border border-white/5 shadow-2xl">
      {/* Trek Rel */}
      <div className="absolute top-1/2 left-0 w-full bg-zinc-900 -translate-y-1/2 flex flex-col justify-between py-0.5 opacity-30">
        <div className=" bg-zinc-600 w-full" />
        <div className=" bg-zinc-600 w-full" />
      </div>

      {/* Penanda Stesen */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between items-center py-6">
        <div className="flex flex-col items-center">
          <ChevronDown className="text-pink-500 animate-bounce mb-1" size={36} strokeWidth={3} />
          <div className="h-10 w-1 bg-pink-500 rounded-full shadow-[0_0_20px_#ec4899]" />
        </div>
        <div className="flex flex-col items-center">
          <div className="h-10 w-1 bg-pink-500 rounded-full shadow-[0_0_20px_#ec4899]" />
          <ChevronUp className="text-pink-500 animate-bounce mt-1" size={36} strokeWidth={3} />
        </div>
      </div>

      {/* Kontena Kereta */}
      <div
        ref={containerRef}
        className="relative flex items-center"
        style={{
          transform: `translateX(${offset}px)`,
          filter: `blur(${blur}px)`,
          transition: transitionEnabled ? `transform ${RAFFLE_DURATION}ms cubic-bezier(0.45, 0.05, 0.1, 1), filter 2000ms ease` : "none",
        }}
      >
        {displayParticipants.map((p, idx) => {
          const isNoseCar = idx === 0;

          return (
            <div key={`${p.id}-${idx}`} className="shrink-0 flex items-center" style={{ width: `${carWidth}px` }}>
              <div
                className={`
                h-36 relative flex items-center justify-center transition-all duration-700
                ${isNoseCar ? "rounded-l-[10rem] bg-zinc-100 pl-10" : "bg-white"}
                w-full shadow-lg border-y border-zinc-200
              `}
              >
                {/* Jalur Ikonik Shinkansen */}
                <div className="absolute bottom-6 left-0 w-full h-3 bg-[#003399]" />
                <div className="absolute bottom-11 left-0 w-full h-1 bg-[#003399]/20" />

                {/* Hidung Aerodinamik Sleek */}
                {isNoseCar && (
                  <div className="absolute top-8 left-16 w-32 h-12 bg-zinc-950 rounded-tr-[4rem] border-b-2 border-blue-500/30 overflow-hidden shadow-inner">
                    <div className="absolute top-2 left-6 w-12 h-3 bg-blue-400/10 blur-lg rounded-full rotate-12" />
                  </div>
                )}

                {/* Tingkap */}
                <div className="absolute top-6 right-6 left-48 flex justify-around gap-2.5 opacity-80">
                  {!isNoseCar && [1, 2, 3, 4].map((w) => <div key={w} className="w-8 h-6 bg-zinc-900 rounded-sm shadow-inner" />)}
                  {isNoseCar && [1].map((w) => <div key={w} className="w-8 h-6 bg-zinc-900 rounded-sm shadow-inner" />)}
                </div>

                {/* Username */}
                <div className={`z-10 text-center w-full px-6 ${isNoseCar ? "ml-24 mt-4" : "mt-8"}`}>
                  <h4 className="text-zinc-950 font-black text-xl lg:text-2xl tracking-tighter leading-none mb-1 truncate uppercase">{p.kawaragi_id}</h4>
                  {!isLiveMode && <p className="text-[9px] text-blue-700 font-bold uppercase tracking-widest opacity-60">{p.full_name}</p>}
                </div>

                {/* Bogie (Roda) */}
                <div className="absolute -bottom-2.5 left-12 flex gap-1.5">
                  <div className="w-7 h-7 bg-zinc-900 rounded-full border-2 border-zinc-800" />
                  <div className="w-7 h-7 bg-zinc-900 rounded-full border-2 border-zinc-800" />
                </div>
                {!isNoseCar && (
                  <div className="absolute -bottom-2.5 right-12 flex gap-1.5">
                    <div className="w-7 h-7 bg-zinc-900 rounded-full border-2 border-zinc-800" />
                    <div className="w-7 h-7 bg-zinc-900 rounded-full border-2 border-zinc-800" />
                  </div>
                )}
              </div>

              {!isNoseCar && idx < displayParticipants.length - 1 && <div className="w-3 h-28 bg-zinc-600 border-x border-zinc-700 z-0" />}
            </div>
          );
        })}
      </div>

      <div className="mt-16 flex justify-center">
        <button
          onClick={startDraw}
          disabled={isSpinning || participants.length === 0}
          className={`
            group relative px-12 py-5 rounded-2xl font-black text-xl tracking-widest transition-all
            ${isSpinning ? "bg-zinc-900 text-zinc-800 cursor-not-allowed scale-95" : "bg-white text-zinc-950 hover:bg-pink-500 hover:text-white hover:scale-105 active:scale-90 shadow-xl"}
          `}
        >
          {isSpinning ? "SPINNING..." : "START DRAW"}
          {!isSpinning && <Zap className="absolute -top-4 -right-4 text-pink-500 fill-pink-500 animate-pulse" size={32} />}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [winnersHistory, setWinnersHistory] = useState([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  const [audioUrl, setAudioUrl] = useState("/train.mp3");
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      if (typeof supabase !== "undefined") {
        const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
        if (!error) setParticipants(data || []);
      } else {
        setParticipants(MOCK_DATA);
      }
    } catch (err) {
      console.error("Ralat data:", err);
      setParticipants(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleWinnerFound = (winnerData) => {
    if (winnerData) {
      setWinner(winnerData);
      setWinnersHistory((prev) => [winnerData, ...prev]);
      setShowWinnerModal(true);
    } else {
      setWinner(null);
    }
  };

  const handleSoundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleSendMessage = (phone) => {
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white p-6 lg:p-12 font-sans selection:bg-pink-500 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}

        {/* Modal Pop-up Pemenang */}
        {showWinnerModal && winner && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80 animate-in fade-in duration-500">
            <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in duration-700">
              <button onClick={() => setShowWinnerModal(false)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                <X size={28} />
              </button>

              <div className="flex justify-center mb-6">
                <div className="bg-pink-500 p-4 rounded-2xl">
                  <Trophy size={40} className="text-yellow-300" />
                </div>
              </div>

              <h2 className="text-pink-500 font-black text-xs tracking-widest uppercase mb-4">THE WINNER IS#{4 - winnersHistory.length}</h2>
              <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 drop-shadow-sm leading-none">{winner.kawaragi_id}</h3>

              {!isLiveMode && (
                <div className="space-y-4 mb-8 animate-in fade-in duration-700">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-left">
                    <p className="text-xl font-black text-white mb-1">{winner.full_name}</p>
                    <p className="text-zinc-500 font-mono text-base mb-6">{winner.whatsapp}</p>
                    <button onClick={() => handleSendMessage(winner.whatsapp)} className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-500 text-white font-black text-base py-4 rounded-xl transition-all">
                      <MessageCircle size={20} /> HUBUNGI PEMENANG
                    </button>
                  </div>
                </div>
              )}

              <button onClick={() => setShowWinnerModal(false)} className="w-full bg-white text-zinc-950 font-black py-5 rounded-xl text-lg hover:bg-pink-500 hover:text-white transition-all">
                NEXT DRAW
              </button>
            </div>
          </div>
        )}

        {/* Header - Balanced PC Layout */}
        <header className="flex flex-col xl:flex-row justify-between items-center xl:items-end mb-16 gap-8">
          <div className="text-center xl:text-left flex-1">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-4 bg-clip-text from-white to-zinc-600 leading-none">
              Kawaragi <span className="text-pink-500">Live</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-4 justify-center xl:justify-start">
              <span className="bg-pink-500/20 text-pink-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-pink-500/30 tracking-widest uppercase">PRO EDITION</span>
              <p className="text-zinc-500 text-sm font-black tracking-widest uppercase opacity-60">VALENTINE 2026 • 3 TIKET</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center xl:justify-end gap-3 shrink-0">
            <div className="relative">
              <input type="file" ref={fileInputRef} onChange={handleSoundUpload} className="hidden" accept="audio/*" />
              <button
                onClick={() => fileInputRef.current.click()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all border ${audioUrl ? "bg-pink-500/20 border-pink-500/50 text-pink-500" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}
              >
                {audioUrl ? <Music size={16} /> : <Upload size={16} />}
                {audioUrl ? "AUDIO" : "MUAT NAIK AUDIO"}
              </button>
            </div>

            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all border ${isLiveMode ? "bg-green-600 border-green-500 text-white animate-pulse" : "bg-red-600 border-red-500 text-white"}`}
            >
              {isLiveMode ? <Eye size={16} /> : <EyeOff size={16} />}
              {isLiveMode ? "LIVE: AKTIF" : "ADMIN: PRIVASI MATI"}
            </button>

            <button onClick={fetchParticipants} disabled={isSpinning} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-xs font-black border border-white/10 flex items-center gap-2 transition-all">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              REFRESH ({participants.length})
            </button>
          </div>
        </header>

        {/* Mesin Cabutan */}
        <section className="mb-16">
          <ShinkansenDraw participants={participants} onWinnerFound={handleWinnerFound} isSpinning={isSpinning} setIsSpinning={setIsSpinning} audioRef={audioRef} isLiveMode={isLiveMode} />
        </section>

        {/* Sejarah & Manifest */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-20">
          <div className="xl:col-span-2">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 backdrop-blur-3xl shadow-xl h-full">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-4 text-pink-500">
                  <CheckCircle size={28} /> WINNERS HISTORY <Trophy size={28} className="text-yellow-500" />
                </h2>
                <button onClick={() => setWinnersHistory([])} className="text-zinc-700 hover:text-red-500 transition-all p-2.5 hover:bg-red-500/10 rounded-full">
                  <Trash2 size={20} />
                </button>
              </div>

              {winnersHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-2xl">
                  <Trophy size={64} className="text-zinc-900 mb-6 opacity-20" />
                  <p className="text-zinc-600 font-black text-base tracking-widest uppercase opacity-40 italic">Tiada Pemenang Terpilih Lagi</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {winnersHistory.map((w, idx) => (
                    <div
                      key={`${w.id}-${idx}`}
                      className="flex flex-col md:flex-row md:items-center justify-between p-6  border border-white/5 rounded-2xl transition-all animate-in slide-in-from-left-6"
                    >
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-pink-500 text-white flex items-center justify-center rounded-xl font-black text-xl shadow-lg">{winnersHistory.length - idx}</div>
                        <div>
                          <p className="text-pink-500 font-black text-2xl tracking-tighter leading-none mb-1">{w.kawaragi_id}</p>
                          {!isLiveMode && <p className="text-base font-extrabold text-white/80">{w.full_name}</p>}
                        </div>
                      </div>

                      {!isLiveMode && (
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden md:block">
                            <p className="text-zinc-600 font-black text-[9px] mb-1 uppercase tracking-widest">WHATSAPP ID</p>
                            <p className="font-black text-lg text-white">{w.whatsapp}</p>
                          </div>
                          <button onClick={() => handleSendMessage(w.whatsapp)} className="bg-green-600 hover:bg-green-500 p-4 rounded-xl text-white transition-all shadow-lg hover:scale-110 active:scale-95">
                            <MessageCircle size={24} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8  flex flex-col shadow-xl">
              <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-xs font-black tracking-widest uppercase text-zinc-600">MANIFEST</h3>
                <span className="text-[10px] font-black bg-white/5 px-3 py-1 rounded-full text-zinc-500">{participants.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {participants.map((p) => (
                  <div key={p.id} className="p-4  rounded-xl border border-white/5 flex items-center justify-between group hover:border-pink-500/30  transition-all cursor-default">
                    <div className="flex flex-col max-w-[85%]">
                      <span className="text-zinc-400 font-black text-base group-hover:text-pink-500 transition-colors tracking-tighter truncate leading-none">{p.kawaragi_id}</span>
                      {!isLiveMode && <span className="text-[8px] font-black text-zinc-700 uppercase mt-1 tracking-widest truncate">{p.full_name}</span>}
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 group-hover:bg-pink-500 transition-all border border-white/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
