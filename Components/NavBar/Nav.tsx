import Link from "next/link"
import Currencies from "./Ui/Currencies"

const Nav = async () => {
    let Amount: number | null = null
    let currencyData: Array<{ pair: string; rate: string; change: string; isPositive: boolean }> = []
    let fetchError = false
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    try {
        const res = await fetch(`${baseUrl}/api/rates?from=USD`)
        const data = await res.json()
        
        const currencies = Object.keys(data.rates)
        Amount = currencies.length
        
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const dateStr = yesterday.toISOString().split('T')[0]
        
        const pairs = [
            { from: 'USD', to: 'JPY' },
            { from: 'GBP', to: 'USD' },
            { from: 'USD', to: 'CHF' },
            { from: 'EUR', to: 'GBP' },
            { from: 'AUD', to: 'USD' },
            { from: 'USD', to: 'CAD' }
        ]
        
        const currentPromises = pairs.map((pair) =>
            fetch(`https://api.frankfurter.app/latest?from=${pair.from}&to=${pair.to}`)  // ✅ Fixed: removed stray `,{cache:'no-store'}` inside URL
                .then(res => res.json())
                .then(res => ({ pair, currentRate: res.rates[pair.to] }))
        )
        
        const currentData = await Promise.all(currentPromises)
        
        const oldPromises = pairs.map((pair) =>
            fetch(`https://api.frankfurter.app/${dateStr}?from=${pair.from}&to=${pair.to}`)
                .then(res => res.json())
                .then(res => ({ pair, oldRate: res.rates[pair.to] }))
        )
        
        const oldData = await Promise.all(oldPromises)
        
        currencyData = currentData.map((current, index) => {
            const old = oldData[index]
            const changePercent = ((current.currentRate - old.oldRate) / old.oldRate) * 100
            return {
                pair: `${current.pair.from}/${current.pair.to}`,
                rate: current.currentRate.toFixed(4),
                change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
                isPositive: changePercent >= 0
            }
        })
        
    } catch (err) {
        fetchError = true
        console.error('Error fetching data:', err)  // Check your terminal for this
    }
    
    return (
        <div className="flex w-full h-32 flex-col">
            <div className='w-full h-20 bg-[#0a0a0a] flex p-1 gap-4 shrink-0'>
                <div className="w-full flex items-center h-full pl-2 gap-2 text-md">
                    <div>
                        <svg width="25" height="25" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M1.49797 1.65034C2.47941 0.597411 3.88277 0 5.56017 0H14.4388C16.1204 0 17.5243 0.597189 18.5052 1.65054C19.482 2.69965 20 4.15844 20 5.81724V14.1827C20 15.8416 19.482 17.3003 18.5051 18.3495C17.524 19.4028 16.1199 20 14.4378 20H5.56017C3.87849 20 2.47485 19.4028 1.49427 18.3494C0.517663 17.3003 0 15.8415 0 14.1827V5.81724C0 4.15786 0.520358 2.69917 1.49797 1.65034ZM13.3181 6.93794C13.5819 6.59075 13.5143 6.09548 13.1672 5.83172C12.8199 5.56795 12.3246 5.63558 12.0608 5.98276L6.68188 13.0629C6.41813 13.4101 6.48575 13.9054 6.83293 14.1692C7.18012 14.4329 7.67539 14.3653 7.93916 14.0181L13.3181 6.93794Z" fill="#CEF739"/>
                        </svg>
                    </div>
                    <Link href={"/"} className="text-neutral-50">
                        FX_CHECKER
                    </Link>
                </div>
                <div className="w-full flex items-center h-full justify-around md:justify-end md:pr-5 text-neutral-200 text-[10px] md:gap-4 text-pretty pl-2 md:font-medium md:text-[0.9rem]">
                    <h3>{Amount ?? '...'} CURRENCIES</h3>
                    <div>.</div>
                    <h3>EOD</h3>
                    <div>.</div>
                    <h3>ECB DATA</h3>
                </div>
            </div>
            <div className="w-full h-full bg-neutral-700 relative overflow-x-scroll overflow-y-hidden items-center justify-start">
                {fetchError ? (
                    <div className="flex items-center justify-center w-full h-full text-white text-sm">
                        Failed to load currency data. Please try again later.
                    </div>
                ) : (
                    <Currencies currencyData={currencyData} />
                )}
            </div>
        </div>
    )
}

export default Nav