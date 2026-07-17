

const Ratecards = () => {
  return (
    <div className='w-fit flex gap-5 mt-5'>
        <div className="flex flex-col gap-4 rounded-xl bg-[#171719] py-4 pr-14 border border-gray-900 pl-3 items-start justify-center shrink-0 font-bold text-gray-400">
            <div className='tag text-[12px]'>
              OPEN
            </div>
            <div>

            </div>
        </div>
        <div className="flex flex-col gap-4 rounded-xl bg-[#171719] py-4 pr-14 border border-gray-900 pl-3 items-start justify-center  shrink- font-bold text-gray-400" >
          <div className='tag text-[12px]'>
            LAST
            </div>  
            <div>

             </div>         
              </div>
                   
              <div className="flex flex-col gap-4 rounded-xl bg-[#171719] py-4 pr-14 border border-gray-900 pl-3 items-start justify-center shrink-0 font-bold text-gray-400">
            <div className='tag text-[12px]'>
              CHANGE
            </div>

             <div>

            </div>
        </div>
        <div className="flex flex-col gap-4 rounded-xl bg-[#171719] py-4 pr-14 border border-gray-900 pl-3 items-start justify-center shrink-0 font-bold text-gray-400">
            <div className='tag text-[12px]'>
              % CHANGE
            </div>
            <div>

            </div>
        </div>
    </div>
  )
}

export default Ratecards