// app/components/Ui/Currencies.tsx

"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface CurrencyData {
  pair: string;
  rate: string;
  change: string;
  isPositive: boolean;
}

interface CurrenciesProps {
  currencyData: CurrencyData[];
}

const Currencies = ({ currencyData }: CurrenciesProps) => {
  const width = useRef<HTMLAnchorElement>(null);
  const [elemW, setW] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (width.current) {
      setW(width.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    const speed = 0.3;

    const autoScroll = () => {
      if (!isPaused && !isDragging) {
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += speed;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current!.offsetLeft);
    setScrollLeft(scrollRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-full flex items-center select-none">
      <Link
        href={"/liveMarkets"}
        className="flex w-fit h-full items-center justify-center px-3 bg-lime-500 text-neutral-900 gap-1 text-[12px] font-bold z-10 shrink-0 select-none"
        ref={width}
      >
        <div>
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3Z"
              fill="#0A0A0A"
            />
          </svg>
        </div>
        <div>LIVE</div>
        <div>MARKETS</div>
      </Link>
      <div
        ref={scrollRef}
        className="w-full h-full overflow-x-scroll hidescroll cursor-grab select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          handleMouseUp();
          setIsPaused(false);
        }}
      >
        <div className="flex h-full w-fit select-none">
          
          {currencyData.map((item: CurrencyData, index: number) => (
            <div
              key={index}
              className="shrink-0 border-x border-neutral-500 px-4 h-full flex items-center gap-2 select-none"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill={item.isPositive ? "#22c55e" : "#ef4444"} opacity="0.2" />
                <circle cx="10" cy="10" r="5" fill={item.isPositive ? "#22c55e" : "#ef4444"} />
              </svg>
              <span className="text-neutral-400 text-[10px] font-medium select-none">{item.pair}</span>
              <span className="text-white text-[10px] font-bold select-none">{item.rate}</span>
              <span className={`text-[10px] font-bold select-none ${item.isPositive ? "text-green-500" : "text-red-500"}`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Currencies;