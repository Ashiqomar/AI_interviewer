import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isListening: boolean;
  barCount?: number;
}

export default function WaveformVisualizer({ isListening, barCount = 16 }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const gap = 4;
      const totalGaps = (barCount - 1) * gap;
      const barWidth = Math.max(3, (width - totalGaps) / barCount);

      phase += 0.15;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 6;

        if (isListening) {
          // Sine wave modulation for realistic dynamic audio levels
          const amplitude = (Math.sin(phase + i * 0.4) + 1) / 2;
          const noise = Math.random() * 0.3;
          barHeight = Math.max(6, (amplitude + noise) * (height - 8));
        }

        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        // Gradient color for bars
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isListening) {
          gradient.addColorStop(0, '#818cf8'); // Indigo-400
          gradient.addColorStop(1, '#c084fc'); // Purple-400
        } else {
          gradient.addColorStop(0, '#334155'); // Slate-700
          gradient.addColorStop(1, '#1e293b'); // Slate-800
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, barCount]);

  return (
    <div className="flex items-center justify-center p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
      <canvas
        ref={canvasRef}
        width={240}
        height={36}
        className="w-full max-w-[240px] h-9"
      />
    </div>
  );
}
