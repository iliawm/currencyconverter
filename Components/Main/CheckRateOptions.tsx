"use client";

import { useEffect, useState, useRef } from "react";
import Ratecards from "../NavBar/Ui/Ratecards";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface CheckRateOptionsProps {
    Last: number | null;
    Open: number | null;
    calc: string | null;
    calcp: string | null;
    Recieve?: string;
    send?: string;
}

const CheckRateOptions = ({ Last, Open, calc, calcp, Recieve, send }: CheckRateOptionsProps) => {
    const [index, setIndex] = useState(0);
    const [active, setactive] = useState(3);
    const [period, setPeriod] = useState<number>(90);
    const [chartData, setChartData] = useState<{ date: string; rate: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [timestamp, setTimestamp] = useState("");

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

    const renderContent = () => {
        switch (index) {
            case 0:
                return (
                    <div className="History w-full h-fit gap-5 flex-col flex items-start justify-center">
                        <div className="stats flex justify-between items-center w-full">
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
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col h-fit">
            <div className="flex gap-5 border-b border-gray-800 w-full font-bold text-sm">
                <button
                    className={`cursor-pointer hover:opacity-90 border-b ${
                        index === 0 ? "border-[#778b2d]" : "border-gray-800"
                    } pb-4`}
                    onClick={() => setIndex(0)}
                >
                    HISTORY
                </button>
                <button
                    className={`cursor-pointer hover:opacity-90 border-b ${
                        index === 1 ? "border-[#778b2d]" : "border-gray-800"
                    } pb-4`}
                    onClick={() => setIndex(1)}
                >
                    COMPARE
                </button>
                <button
                    className={`cursor-pointer hover:opacity-90 border-b ${
                        index === 2 ? "border-[#778b2d]" : "border-gray-800"
                    } pb-4`}
                    onClick={() => setIndex(2)}
                >
                    FAVORITES
                </button>
                <button
                    className={`cursor-pointer hover:opacity-90 border-b ${
                        index === 3 ? "border-[#778b2d]" : "border-gray-800"
                    } pb-4`}
                    onClick={() => setIndex(3)}
                >
                    LOG
                </button>
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

export default CheckRateOptions;