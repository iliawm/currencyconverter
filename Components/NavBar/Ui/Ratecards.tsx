"use client";

interface RatecardsProps {
    Last: number | null;
    Open: number | null;
    calc: string | null;
    calcp: string | null;
}

const Ratecards = ({ Last, Open, calc, calcp }: RatecardsProps) => {
    const getChangeColor = (value: string | null) => {
        if (value === null) return "text-gray-400";
        const num = parseFloat(value);
        if (isNaN(num)) return "text-gray-400";
        return num < 0 ? "text-[#ff4141]" : "text-[#42eb05]";
    };

    return (
        <div className='w-fit flex gap-5 mt-5'>
            <div className="flex flex-col gap-4 rounded-xl bg-[#171719] py-4 pr-14 border border-gray-900 pl-3 items-start justify-center shrink-0 font-bold text-gray-400">
                <div className='tag text-[12px]'>OPEN</div>
                <div className="text-white">{Open !== null ? Open : "-"}</div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-[#171719] py-4 pr-14 border border-gray-900 pl-3 items-start justify-center shrink-0 font-bold text-gray-400">
                <div className='tag text-[12px]'>LAST</div>
                <div className="text-white">{Last !== null ? Last : "-"}</div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-[#171719] py-4 pr-14 border border-gray-900 pl-3 items-start justify-center shrink-0 font-bold text-gray-400">
                <div className='tag text-[12px]'>CHANGE</div>
                <div className={getChangeColor(calc)}>{calc !== null ? calc : "-"}</div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-[#171719] py-4 pr-14 border border-gray-900 pl-3 items-start justify-center shrink-0 font-bold text-gray-400">
                <div className='tag text-[12px]'>% CHANGE</div>
                <div className={getChangeColor(calcp)}>{calcp !== null ? calcp : "-"}</div>
            </div>
        </div>
    );
};

export default Ratecards;