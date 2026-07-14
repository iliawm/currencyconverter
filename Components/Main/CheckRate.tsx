"use client"

import { useEffect, useState } from "react"

interface CurrencyData {
    base: string
    rates: Record<string, number>
}

interface CheckRateProps {
    data: CurrencyData
}

const CheckRate = ({ data }: CheckRateProps) => {
    const currencies = data.rates
    const [Send, setSend] = useState<string>(data.base)
    const [RECEIVE, setRECEIVE] = useState<string>(Object.keys(data.rates)[0] || "")
    const [prices, setPrices] = useState<Record<string, number> | null>(null)
    const [valOne, setValOne] = useState<string>("")
    const [valTwo, setValTwo] = useState<string>("")
    
    const handleFetch = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/rates?from=${Send}`)
            const data = await response.json()
            setPrices(data.rates)
        } catch (error) {
            console.error('Error fetching rates:', error)
        }
    }
    
    // Auto-calculate whenever inputs change
    useEffect(() => {
        if (prices && RECEIVE && valOne && !isNaN(Number(valOne))) {
            const rate = prices[RECEIVE]
            if (rate) {
                const result = parseFloat(valOne) * rate
                setValTwo(result.toFixed(2))
            }
        } else if (valOne === "") {
            setValTwo("")
        }
    }, [valOne, RECEIVE, prices])
    
    useEffect(() => {
        handleFetch()
    }, [Send])
    
    return (
        <div className='flex-col w-full flex h-fit'>
            <div className='topcomp flex items-center justify-between gap-5 md:gap-8 border-b border-dotted border-gray-600 pb-5'>
                {/* SEND Section */}
                <div className='w-full h-fit bg-[#202022] flex flex-col p-4 rounded-2xl gap-8 py-4 border border-white/5'>
                    <h1 className="text-neutral-100/50 text-xs font-semibold">SEND</h1>
                    <div className="w-full flex justify-between h-fit items-center">
                        <input 
                            type="text" 
                            className="text-4xl font-bold border-none outline-none bg-transparent text-white w-40 placeholder:text-white" 
                            placeholder="1000"
                            value={valOne}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value
                                if (value === "") {
                                    setValOne("")
                                    setValTwo("")
                                } else if (!isNaN(Number(value)) && value !== ".") {
                                    setValOne(value)
                                }
                            }}
                        />
                        <select 
                            className="border rounded-sm border-white/5 px-5 py-1 bg-[#2e2e2e] gap-2 flex cursor-pointer" 
                            value={Send} 
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setSend(e.target.value)
                                setValOne("")
                                setValTwo("")
                            }}
                        >
                            <option value={data.base}>{data.base}</option>
                            {Object.keys(currencies).map((currency: string, index: number) => (
                                <option value={currency} key={index}>{currency}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Swap Button */}
                <button 
                    className="bg-[#202022] p-4 rounded-xl border border-white/5 hover:bg-[#2e2e2e] transition-colors"
                    onClick={() => {
                        
                        const temp = Send
                        setSend(RECEIVE)
                        setRECEIVE(temp)
                        setValOne("")
                        setValTwo("")
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L2 5L6 1M2 5H18M14 11L18 15L14 19M18 15H2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {/* RECEIVE Section */}
                <div className='w-full h-fit bg-[#202022] flex flex-col p-4 rounded-2xl gap-8 py-4 border border-white/5'>
                    <h1 className="text-neutral-100/50 text-xs font-semibold">RECEIVE</h1>
                    <div className="w-full flex justify-between h-fit items-center">
                        <div className="text-4xl font-bold text-[#cef739] w-40 truncate">
                            {valTwo || "0.00"}
                        </div>
                        <select 
                            className="border rounded-sm border-white/5 px-5 py-1 bg-[#2e2e2e] gap-2 flex cursor-pointer" 
                            value={RECEIVE} 
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRECEIVE(e.target.value)}
                        >
                            {Object.keys(currencies).map((currency: string, index: number) => (
                                <option value={currency} key={index}>{currency}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Bottom Info Bar */}
            <div className="w-full h-fit py-2 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    {prices && RECEIVE && (
                        <>1 {Send} = {prices[RECEIVE]} {RECEIVE}</>
                    )}
                </div>
                <div className="flex gap-2 w-fit h-fit items-center font-semibold mt-3">
                    <button className="px-4 py-1 border border-[#cef739] rounded-xl text-sm bg-[#cef739] text-black flex gap-1 items-center hover:opacity-85 cursor-pointer transition-opacity">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.33199 2.41081C7.61324 1.84831 8.41012 1.87175 8.66793 2.41081L10.2148 5.528L13.6367 6.02019C14.2461 6.11394 14.4804 6.86394 14.0351 7.30925L11.5742 9.72331L12.1601 13.1218C12.2539 13.7311 11.5976 14.1999 11.0586 13.9186L8.01168 12.3014L4.94137 13.9186C4.4023 14.1999 3.74605 13.7311 3.8398 13.1218L4.42574 9.72331L1.9648 7.30925C1.51949 6.86394 1.75387 6.11394 2.36324 6.02019L5.80855 5.528L7.33199 2.41081Z" fill="#0A0A0A"/>
                        </svg>
                        FAVORITED
                    </button>
                    <button className="px-4 py-1 border border-[#cef739] rounded-xl text-sm hover:opacity-85 cursor-pointer transition-opacity">
                        LOG CONVERSION
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CheckRate