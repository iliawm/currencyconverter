
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateStr = yesterday.toISOString().split('T')[0]
    
    try {
        const { searchParams } = new URL(request.url);
        const country = searchParams.get('from') || 'USD';
        
        const res = await fetch(`https://api.frankfurter.app/${dateStr}?from=${country}`)
        if (res.ok) {
            const data = await res.json()
            return NextResponse.json(data)
        }
        return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}