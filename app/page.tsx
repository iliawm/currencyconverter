import CheckRate from "@/Components/Main/CheckRate";
import CheckRateOptions from "@/Components/Main/CheckRateOptions";

export default async function Home() {
  let currencies = null;
  let errorMessage = null;

  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD', {
      cache: 'no-store', 
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    if (data?.rates) {
      currencies = data;
    } else {
      throw new Error('API response missing rates: ' + JSON.stringify(data));
    }
  } catch (err) {
    console.error('Fetch failed:', err);
    errorMessage = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <main className="w-full h-full flex items-start justify-center md:px-20 lg::px-30 overflow-x-hidden px-5">
      <section className="CheckRate w-full h-fit flex flex-col md:mt-15 mt-10 gap-10">
          {currencies ? (
            <CheckRate data={currencies} />
          ) : (
            <div className="text-red-400 p-4">
              <p>Failed to load exchange rates.</p>
              {errorMessage && (
                <p className="text-sm mt-2 text-red-300">Reason: {errorMessage}</p>
              )}
            </div>
          )}
        
        
      </section>
    </main>
  );
}
