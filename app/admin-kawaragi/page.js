import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { Train, RefreshCw, Eye, EyeOff, Trophy, Zap, ChevronDown, ChevronUp, Music, Upload } from "lucide-react";

// Durasi total animasi dalam milidetik (10 detik)
const RAFFLE_DURATION = 10000;

const ShinkansenDraw = ({ participants, onWinnerFound, isSpinning, setIsSpinning, audioRef }) => {
  const [offset, setOffset] = useState(0);
  const [blur, setBlur] = useState(0);
  const containerRef = useRef(null);
  const [displayParticipants, setDisplayParticipants] = useState([]);
  const carWidth = 220;

  useEffect(() => {
    if (participants && participants.length > 0) {
      const repeated = [];
      // Membuat deretan gerbong yang lebih banyak untuk durasi yang lebih lama
      for (let i = 0; i < 15; i++) {
        repeated.push(...participants);
      }
      setDisplayParticipants(repeated);
    }
  }, [participants]);

  const startDraw = () => {
    if (isSpinning || !participants || participants.length === 0) return;

    // Putar suara jika ada
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.error("Gagal memutar suara:", err));
    }

    setIsSpinning(true);
    onWinnerFound(null);

    // Pilih pemenang secara acak
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];

    const totalCars = displayParticipants.length;
    // Berhenti di set repetisi terakhir agar perjalanan terasa jauh dan lama
    const stopIndex = totalCars - participants.length * 2 + winnerIndex;

    const containerMid = containerRef.current?.offsetWidth / 2 || 0;
    const targetOffset = -(stopIndex * carWidth) + containerMid - carWidth / 2;

    setOffset(0);
    setBlur(0);

    setTimeout(() => {
      setOffset(targetOffset);
      // Efek blur dinamis: muncul saat akselerasi, menghilang perlahan saat pengereman panjang
      setTimeout(() => setBlur(15), 1000);
      setTimeout(() => setBlur(0), RAFFLE_DURATION * 0.7);
    }, 100);

    setTimeout(() => {
      setIsSpinning(false);
      onWinnerFound(winner);
    }, RAFFLE_DURATION + 200);
  };

  return (
    <div className="relative w-full overflow-hidden py-20 bg-black/20 rounded-4xl">
      {/* Rel Kereta */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />

      {/* Station Indicator */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between items-center py-6">
        <div className="flex flex-col items-center">
          <ChevronDown className="text-pink-500 animate-bounce mb-1" size={32} strokeWidth={3} />
          <div className="h-4 w-1 bg-linear-to-b from-pink-500 to-transparent rounded-full shadow-[0_0_15px_pink]" />
        </div>
        <div className="flex flex-col items-center">
          <div className="h-4 w-1 bg-linear-to-t from-pink-500 to-transparent rounded-full shadow-[0_0_15px_pink]" />
          <ChevronUp className="text-pink-500 animate-bounce mt-1" size={32} strokeWidth={3} />
        </div>
      </div>

      {/* Train Container */}
      <div
        ref={containerRef}
        className="relative flex items-center shinkansen-curve"
        style={{
          transform: `translateX(${offset}px)`,
          filter: `blur(${blur}px)`,
          transitionDuration: `${RAFFLE_DURATION}ms`,
        }}
      >
        {displayParticipants.map((p, idx) => (
          <div key={`${p.id}-${idx}`} className="shrink-0 px-3" style={{ width: `${carWidth}px` }}>
            <div
              className={`
              h-36 rounded-2xl border-2 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-700
              ${isSpinning ? "bg-white/5 border-white/10" : "bg-white/10 border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.1)]"}
            `}
            >
              <div className="absolute top-3 left-0 w-full flex justify-center gap-4 px-4 opacity-40">
                <div className="w-8 h-4 bg-blue-300/20 rounded-sm" />
                <div className="w-8 h-4 bg-blue-300/20 rounded-sm" />
                <div className="w-8 h-4 bg-blue-300/20 rounded-sm" />
              </div>

              <div className="z-10 text-center w-full px-2">
                <span className="block text-pink-500 font-black text-xl tracking-tighter leading-none mb-1 truncate">{p.kawaragi_id}</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest truncate block">{p.full_name}</span>
              </div>

              <div className="absolute bottom-6 left-0 w-full h-px bg-pink-500/20" />
              <div className="absolute -bottom-1 left-8 w-6 h-3 bg-zinc-800 rounded-full border border-white/5" />
              <div className="absolute -bottom-1 right-8 w-6 h-3 bg-zinc-800 rounded-full border border-white/5" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <button
          onClick={startDraw}
          disabled={isSpinning || participants.length === 0}
          className={`
            group relative px-14 py-5 rounded-2xl font-black text-xl tracking-[0.2em] transition-all
            ${isSpinning ? "bg-zinc-900 text-zinc-700 cursor-not-allowed" : "bg-white text-black hover:bg-pink-500 hover:text-white hover:scale-105 active:scale-95 shadow-2xl"}
          `}
        >
          {isSpinning ? "MELUNCUR..." : "MULAI UNDIAN"}
          {!isSpinning && <Zap className="absolute -top-3 -right-3 text-pink-500 fill-pink-500 animate-pulse" size={28} />}
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .shinkansen-curve {
          /* Kurva khusus untuk durasi panjang agar tetap terasa natural */
          transition-timing-function: cubic-bezier(0.5, 0, 0.1, 1);
        }
      `,
        }}
      />
    </div>
  );
};

export default function AdminDashboard() {
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  // State Suara
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });

      if (!error) setParticipants(data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleSoundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-pink-500">
      <div className="max-w-6xl mx-auto">
        {/* Elemen Audio Tersembunyi */}
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}

        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
              Kawaragi <span className="text-pink-500">Live Raffle</span>
              <span className="bg-pink-500/10 text-pink-500 text-xs px-3 py-1 rounded-lg border border-pink-500/20">V2.4</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium tracking-wide">Valentine 2026 • Shinkansen Engine Pro</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Suara Loader */}
            <div className="relative group">
              <input type="file" ref={fileInputRef} onChange={handleSoundUpload} className="hidden" accept="audio/*" />
              <button
                onClick={() => fileInputRef.current.click()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all border ${audioUrl ? "bg-pink-500/10 border-pink-500/50 text-pink-500" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}
              >
                {audioUrl ? <Music size={16} /> : <Upload size={16} />}
                {audioUrl ? "SOUND LOADED" : "LOAD RAFFLE SOUND"}
              </button>
            </div>

            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all border ${
                isLiveMode ? "bg-green-600/10 border-green-600/50 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "bg-zinc-800 border-zinc-700 text-zinc-400"
              }`}
            >
              {isLiveMode ? <Eye size={16} /> : <EyeOff size={16} />}
              {isLiveMode ? "LIVE STREAM ON" : "ADMIN PRIVACY OFF"}
            </button>

            <button onClick={fetchParticipants} disabled={isSpinning} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2 transition-all disabled:opacity-30">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              REFRESH ({participants.length})
            </button>
          </div>
        </header>

        <section className="relative bg-zinc-900/40 border border-white/5 rounded-4xl p-8 md:p-16 text-center mb-12 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-12 opacity-50">
              <div className="h-px w-16 bg-linear-to-r from-transparent to-pink-500" />
              <h2 className="text-gray-400 text-[10px] uppercase tracking-[0.6em] font-black">Shinkansen High-Speed Picker</h2>
              <div className="h-px w-16 bg-linear-to-l from-transparent to-pink-500" />
            </div>

            <ShinkansenDraw participants={participants} onWinnerFound={setWinner} isSpinning={isSpinning} setIsSpinning={setIsSpinning} audioRef={audioRef} />

            {winner && !isSpinning && (
              <div className="mt-16 animate-in fade-in zoom-in duration-1000">
                <div className="relative inline-block group">
                  <div className="absolute inset-0 bg-pink-600 blur-[80px] opacity-30 animate-pulse transition-opacity" />
                  <div className="relative p-10 bg-black/60 border-2 border-pink-500/30 rounded-[3rem] backdrop-blur-xl">
                    <p className="text-pink-500 font-black text-xs tracking-[0.4em] mb-6 uppercase flex items-center justify-center gap-3">
                      <Trophy size={18} /> Pemenang Telah Tiba!
                    </p>
                    <h3 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] tracking-tighter mb-4">{winner.kawaragi_id}</h3>

                    {!isLiveMode && (
                      <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-2 items-center">
                        <p className="text-xl font-bold text-white tracking-tight">{winner.full_name}</p>
                        <p className="text-sm text-pink-500 font-mono bg-pink-500/10 px-4 py-1 rounded-full">{winner.whatsapp}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {!isLiveMode ? (
          <div className="bg-zinc-900/30 border border-white/5 rounded-4xl overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-sm font-black tracking-[0.2em] uppercase text-gray-400">Daftar Penumpang</h3>
              <span className="text-[10px] font-bold bg-white/5 px-3 py-1 rounded-full text-zinc-500">{participants.length} Terdaftar</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-500 text-[10px] tracking-widest uppercase">
                  <tr>
                    <th className="px-10 py-5">ID / Username</th>
                    <th className="px-10 py-5">Nama Lengkap</th>
                    <th className="px-10 py-5">WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-pink-500/5 transition-colors group">
                      <td className="px-10 py-5 font-black text-pink-500 group-hover:text-pink-400">{p.kawaragi_id}</td>
                      <td className="px-10 py-5 text-zinc-300 font-medium">{p.full_name}</td>
                      <td className="px-10 py-5 text-zinc-500 font-mono text-xs">{p.whatsapp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center p-16 border-2 border-dashed border-white/5 rounded-4xl bg-white/5 flex flex-col items-center">
            <Train className="mb-6 text-zinc-800" size={40} />
            <p className="text-zinc-600 text-sm italic max-w-sm mx-auto font-medium leading-relaxed">Data pribadi penumpang disandikan secara aman selama siaran langsung.</p>
          </div>
        )}
      </div>
    </main>
  );
}
