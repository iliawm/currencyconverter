"use client";

import { useEffect, useState } from "react";
import Ratecards from "../NavBar/Ui/Ratecards";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Image from "next/image";

interface CheckRateOptionsProps {
    Last: number | null;
    Open: number | null;
    calc: string | null;
    calcp: string | null;
    Recieve?: string;
    send?: string;
}

const CheckRateOptions = ({ Last, Open, calc, calcp, Recieve, send,valone,valtwo,currencies,prices }: CheckRateOptionsProps) => {
    const [index, setIndex] = useState(0);
    const [active, setactive] = useState(3);
    const [period, setPeriod] = useState<number>(90);
    const [chartData, setChartData] = useState<{ date: string; rate: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [timestamp, setTimestamp] = useState("");
    const [width, setWidth] = useState<number | null>(null);

    useEffect(() => {
        setTimestamp(
            new Date().toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    }, []);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const generateLabels = (days: number): string[] => {
        const today = new Date();
        const labels: string[] = [];
        const count = (() => {
            switch (days) {
                case 1: return 1;
                case 7: return 7;
                case 30: return 5;
                case 90: return 3;
                case 365: return 12;
                case 1825: return 5;
                default: return 5;
            }
        })();

        const step = (() => {
            switch (days) {
                case 1: return 1;
                case 7: return 1;
                case 30: return 7;
                case 90: return 30;
                case 365: return 30;
                case 1825: return 365;
                default: return 7;
            }
        })();

        for (let i = count - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i * step);
            labels.push(d.toISOString().split("T")[0]);
        }
        return labels;
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const fetchRates = async (dateList: string[]) => {
        if (!send || !Recieve) return;
        setLoading(true);
        setError(false);
        setChartData([]);
        try {
            const url = `/api/CusDates?dates=${dateList.join(",")}&from=${send}&to=${Recieve}`;
            const res = await fetch(url);
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0 && data.every((item: any) => item.rate !== null)) {
                setChartData(data);
                setError(false);
            } else {
                setError(true);
                setChartData([]);
            }
        } catch {
            setError(true);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!send || !Recieve) {
            setChartData([]);
            setError(false);
            return;
        }
        const dateList = generateLabels(period);
        fetchRates(dateList);
    }, [period, send, Recieve]);

    useEffect(() => {
        if (!send || !Recieve) return;
        const interval = setInterval(() => {
            const dateList = generateLabels(period);
            fetchRates(dateList);
        }, 600000);
        return () => clearInterval(interval);
    }, [period, send, Recieve]);

    const retryFetch = () => {
        if (!send || !Recieve) return;
        const dateList = generateLabels(period);
        fetchRates(dateList);
    };
    useEffect(()=>{
        if(prices){
            // console.log(prices)
        }
    })
    const renderContent = () => {
        switch (index) {
            case 0:
                return (
                    <div className="History w-full h-fit gap-5 flex-col flex items-start justify-center">
                        <div className="stats flex justify-between md:items-center w-full flex-col md:flex-row items-start">
                            <Ratecards Last={Last} Open={Open} calc={calc} calcp={calcp} />
                            <div className="flex items-center bg-[#171719] px-2 rounded-lg py-2 text-xs mt-5 font-bold">
                                <button
                                    aria-disabled="true"
                                    className="cursor-not-allowed text-gray-400 w-full rounded-md px-3 py-2 bg-red-400 disabled:text-black pointer-events-none"
                                    title="the option is disabled because the api will not return data each hour"
                                >
                                    1D
                                </button>
                                <button
                                    className={`cursor-pointer hover:opacity-85 text-gray-400 w-full rounded-md px-3 py-2 hover:bg-[#2e2e2e] ${
                                        active === 1 ? "bg-[#2e2e2e] text-white" : "bg-transparent"
                                    }`}
                                    onClick={() => {
                                        setactive(1);
                                        setPeriod(7);
                                    }}
                                >
                                    1W
                                </button>
                                <button
                                    className={`cursor-pointer hover:opacity-85 text-gray-400 w-full rounded-md px-3 py-2 hover:bg-[#2e2e2e] ${
                                        active === 2 ? "bg-[#2e2e2e] text-white" : "bg-transparent"
                                    }`}
                                    onClick={() => {
                                        setactive(2);
                                        setPeriod(30);
                                    }}
                                >
                                    1M
                                </button>
                                <button
                                    className={`cursor-pointer hover:opacity-85 text-gray-400 w-full rounded-md px-3 py-2 hover:bg-[#2e2e2e] ${
                                        active === 3 ? "bg-[#2e2e2e] text-white" : "bg-transparent"
                                    }`}
                                    onClick={() => {
                                        setactive(3);
                                        setPeriod(90);
                                    }}
                                >
                                    3M
                                </button>
                                <button
                                    className={`cursor-pointer hover:opacity-85 text-gray-400 w-full rounded-md px-3 py-2 hover:bg-[#2e2e2e] ${
                                        active === 4 ? "bg-[#2e2e2e] text-white" : "bg-transparent"
                                    }`}
                                    onClick={() => {
                                        setactive(4);
                                        setPeriod(365);
                                    }}
                                >
                                    1Y
                                </button>
                                <button
                                    className={`cursor-pointer hover:opacity-85 text-gray-400 w-full rounded-md px-3 py-2 hover:bg-[#2e2e2e] ${
                                        active === 5 ? "bg-[#2e2e2e] text-white" : "bg-transparent"
                                    }`}
                                    onClick={() => {
                                        setactive(5);
                                        setPeriod(1825);
                                    }}
                                >
                                    5Y
                                </button>
                            </div>
                        </div>
                        <div className="chart w-full h-fit bg-[#171719] flex flex-col p-10 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="font-bold text-lg text-white">
                                    {send}/{Recieve}
                                </h1>
                                {chartData.length > 0 && !error && (
                                    <div className="text-gray-400 text-sm" suppressHydrationWarning>
                                        <span className="text-white font-bold">
                                            {chartData[chartData.length - 1]?.rate?.toFixed(4) || "-"}
                                        </span>
                                        {" · "}
                                        {timestamp}
                                    </div>
                                )}
                            </div>
                            <div style={{ width: "100%", height: 300 }}>
                                {loading ? (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Loading...
                                    </div>
                                ) : error ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-red-500 gap-4">
                                        <span>Failed to load data</span>
                                        <button
                                            onClick={retryFetch}
                                            className="px-4 py-2 bg-[#778b2d] text-white rounded-lg hover:opacity-80 transition"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} key={`${send}-${Recieve}-${period}`}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#333"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="date"
                                                tickFormatter={formatDate}
                                                stroke="#666"
                                                tick={{ fill: "#888", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickMargin={15}
                                            />
                                            <YAxis
                                                stroke="#666"
                                                tick={{ fill: "#888", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                domain={["auto", "auto"]}
                                                tickFormatter={(value: any) => value?.toFixed(4) || ""}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#171719",
                                                    border: "1px solid #333",
                                                    borderRadius: "8px",
                                                    color: "white",
                                                }}
                                                formatter={(value: any) => {
                                                    if (typeof value === "number")
                                                        return [value.toFixed(4), "Rate"];
                                                    return [String(value ?? "-"), "Rate"];
                                                }}
                                                labelFormatter={(label: any) =>
                                                    `Date: ${formatDate(String(label ?? ""))}`
                                                }
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="rate"
                                                stroke="#778b2d"
                                                strokeWidth={2}
                                                dot={{ fill: "#778b2d", r: 4 }}
                                                activeDot={{ r: 6, fill: "#8ba33d" }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
                case 1:
                return (
                    <div className="px-10 py-5">
                <div className="bg-[#171719] h-fit w-full flex flex-col md:p-10 rounded-xl">
                    <div className="flex justify-between mb-5">
                        <div className="flex gap-4 ">
                            <div className="text-sm font-bold opacity-60">MULTI-CURRENCY</div>
                            <div>{valone?<div className="font-semibold  flex gap-3"> 
                            <span>{valone}</span>
                            <span>FROM</span>
                            <span>{send}</span>
                            </div>
                            :<div className="text-red-400 md:text-sm text-[12px]">Enter value FOR {send}</div>
                            }
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div>
                                    a
                            </div>
                            <div>
                                PAIRS
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        {Object.keys(currencies).map((e,index)=>{
                            return(
                                <div className="w-full h-fit py-3 flex justify-between bg-[#202022] rounded-xl border border-gray-700 px-4 hover:border-amber-200 cursor-pointer">
                                    <div className="flex gap-3">
                                <div className="flags "><Image src={`/Untitled.png`} alt="image" width={300} height={300} loading="lazy" className="w-10 "/></div>

                                    <div className="flex flex-col">
                                        <div>{e}</div>
                                        <div className="text-xs text-red-400">Countries missing from free api</div>
                                        </div>

                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex flex-col">
                                        <div>{}</div>
                                        <div>price</div>
                                    </div>
                                    <button className="w-10 h-10 flex items-center justify-center p-3 border rounded-xl">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                    </button>

                                </div>
                                
                                </div>
                            )
                        })}
                        
                    </div>
                </div>
                </div>)
            default:
                return null;
        }
    };

    const tabs = ["HISTORY", "COMPARE", "FAVORITES", "LOG"];

    if (width === null) {
        return <div className="w-full h-20 animate-pulse bg-gray-800/20 rounded"></div>;
    }

    const isMobile = width < 768;

    return (
        <div className="w-full flex flex-col h-fit">
            {isMobile ? (
                <select
                    className="w-full pl-5 md:pl-0 md:bg-transparent border rounded-xl bg-[#171719] md:border-b border-gray-800 text-white font-bold text-sm py-4 outline-none"
                    value={index}
                    onChange={(e) => setIndex(Number(e.target.value))}
                >
                    {tabs.map((tab, i) => (
                        <option key={i} value={i} className="bg-[#171719] text-white ">
                            {tab}
                        </option>
                    ))}
                </select>
            ) : (
                <div className="flex gap-5 border-b border-gray-800 w-full font-bold text-sm">
                    {tabs.map((tab, i) => (
                        <button
                            key={i}
                            className={`cursor-pointer hover:opacity-90 border-b ${
                                index === i ? "border-[#778b2d]" : "border-gray-800"
                            } pb-4`}
                            onClick={() => setIndex(i)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}
            <div>{renderContent()}</div>
        </div>
    );
};

export default CheckRateOptions;