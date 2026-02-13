"use client";
import { useState, useEffect } from 'react';

export default function LiveDrawSlot({ participants, onWinnerFound }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (isSpinning) {
      interval = setInterval(() => {
        setCurrentIndex(Math.floor(Math.random() * participants.length));
      }, 50); // Kecepatan putar (50ms)
    }
    return () => clearInterval(interval);
  }, [isSpinning, participants]);

  const startSpin = () => {
    if (participants.length === 0) return alert("Belum ada peserta!");
    setIsSpinning(true);
    
    // Berhenti setelah 3-5 detik secara acak
    const spinTime = Math.floor(Math.random() * 2000) + 3000;
    
    setTimeout(() => {
      setIsSpinning(false);
      const winnerIndex = Math.floor(Math.random() * participants.length);
      setCurrentIndex(winnerIndex);
      onWinnerFound(participants[winnerIndex]);
    }, spinTime);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xl h-40 bg-white/5 border-4 border-pink-600 rounded-3xl flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(219,39,119,0.3)] mb-8">
        <span className={`text-4xl md:text-6xl font-black tracking-widest uppercase transition-all ${isSpinning ? 'blur-sm scale-110 opacity-50' : 'blur-0 scale-100 opacity-100 text-white'}`}>
          {participants.length > 0 ? participants[currentIndex].kawaragi_id : "NO DATA"}
        </span>
      </div>

      <button
        onClick={startSpin}
        disabled={isSpinning || participants.length === 0}
        className="bg-pink-600 hover:bg-pink-500 text-white font-black py-4 px-12 rounded-full text-2xl shadow-lg transform active:scale-95 transition-all disabled:opacity-30"
      >
        {isSpinning ? "SPINNING..." : "ROLL UNDIAN"}
      </button>
    </div>
  );
}