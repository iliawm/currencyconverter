"use client"

import { useEffect, useState } from "react"
import Ratecards from "../NavBar/Ui/Ratecards"

const CheckRateOptions = () => {
    const [index , setIndex]= useState(0)
    // const [code , setCode]= useState()
    const renderContent = ()=>{
        switch (index){
        case 0 :
            return(
            <div className="History w-full h-fit gap-5 flex-col flex items-start justify-center">
                <div className="stats">
                    <Ratecards/>
                </div>
                <div className="chart">

                </div>
            </div>)}
    }
  return (
    <div className='w-full flex flex-col h-fit'>
        <div className=" flex gap-5 border-b border-gray-800 w-full ">
            <button className={`cursor-pointer hover:opacity-90 border-b ${index===0 ? "border-[#778b2d]":"border-gray-800"} pb-4`} onClick={()=>{
                setIndex(0)
            }}>HISTORY</button>
            <button className={`cursor-pointer hover:opacity-90 border-b ${index===1 ? "border-[#778b2d]":"border-gray-800"} pb-4`} onClick={()=>{
                setIndex(1)
            }}>COMPARE</button>
            <button className={`cursor-pointer hover:opacity-90 border-b ${index===2 ? "border-[#778b2d]":"border-gray-800"} pb-4`} onClick={()=>{
                setIndex(2)
            }}>FAVORITES</button>
            <button className={`cursor-pointer hover:opacity-90 border-b ${index===3 ? "border-[#778b2d]":"border-gray-800"} pb-4`} onClick={()=>{
                setIndex(3)
            }}>LOG</button>
        </div>
        <div>
                {renderContent()}
        </div>
    </div>
  )
}

export default CheckRateOptions