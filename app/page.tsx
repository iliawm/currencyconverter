import CheckRate from "@/Components/Main/CheckRate";
import CheckRateOptions from "@/Components/Main/CheckRateOptions";

export default async function Home() {
      let currencies = null
       try {
        const response = await fetch('https://api.frankfurter.app/latest?from=USD')
        const data = await response.json()
        if(data){
          currencies = data
          
        }
     }catch(err){

     }
  return (
   <main className="w-full h-full flex items-start justify-center px-30">
    <section className="CheckRate w-full h-fit flex flex-col md:mt-15 mt-10 gap-10">
      <h1 className=" text-lg md:text-lg md:font-bold">CHECK THE RATE</h1>
      <div className="bg-[#171719] w-full h-fit  px-4 py-5 rounded-2xl">
        <CheckRate data={currencies}/>
      </div>
      <div className="w-full h-fit ">
        <CheckRateOptions/>
      </div>
    </section>
   </main>
  );
}
