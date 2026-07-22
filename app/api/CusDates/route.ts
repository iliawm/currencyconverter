import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const datesParam = searchParams.get('dates');
    const from = searchParams.get('from') || 'USD';

    if (!datesParam) {
        return NextResponse.json({ error: 'Missing dates parameter' }, { status: 400 });
    }

    const dateList = datesParam.split(',');
    const results = [];

    for (const dateStr of dateList) {
        try {
            const res = await fetch(`https://api.frankfurter.app/${dateStr}?from=${from}`);
            const data = await res.json();
            const rate = data.rates?.EUR || 0;
            results.push({ date: dateStr, rate });
        } catch {
            results.push({ date: dateStr, rate: null });
        }
    }

    return NextResponse.json(results);
}