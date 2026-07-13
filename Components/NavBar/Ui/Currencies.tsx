"use client"
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const Currencies = ({ currencyData }) => {
  const width = useRef<HTMLAnchorElement>(null) 
  const [elemW,setW]= useState(0)
  useEffect(()=>{
    if (width.current){
      setW(width.current.clientWidth)
    }
    console.log(elemW)
  },[elemW])

  return (
    <>
    <Link href={"/liveMarkets"} className="flex w-fit h-full items-center justify-center px-3 bg-lime-500 text-neutral-900 gap-1 text-[12px] font-bold absolute" ref={width}>
        <div>
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3Z" fill="#0A0A0A"/>
            </svg>
        </div>
        <div>LIVE</div>
        <div>MARKETS</div>
        </Link>
        <div className="w-full h-full flex overflow-x-scroll">
           <div className={`min-w-[${elemW}px] border-x border-gray-100 px-4 h-full flex items-center gap-2 `}>
              {/* leave empty for better scroll behavior */}
          </div>
          {currencyData.map((item, index) => (
            <div key={index} className={`w-full border-x border-neutral-500 px-4 h-full flex items-center gap-2`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill={item.isPositive ? '#22c55e' : '#ef4444'} opacity="0.2"/>
                <circle cx="10" cy="10" r="5" fill={item.isPositive ? '#22c55e' : '#ef4444'}/>
              </svg>
              <span className="text-neutral-400 text-[10px] font-medium">{item.pair}</span>
              <span className="text-white text-[10px] font-bold">{item.rate}</span>
              <span className={`text-[10px] font-bold ${item.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
    </>
  )
}

export default Currencies 