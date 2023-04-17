import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {


  return (
    <div className='bg-[#0c1324] h-screen flex items-center justify-center '>
      <div>
        <div className='bg-[#21325E] p-10 rounded-lg shadow-lg'>
          <div className='mx-auto'>
            <img src={"/used-com.png"} alt="" className='h-40 mb-8 flex items-center ' />
          </div>
          <div className='flex justify-center'>
            <button className='border-2 bg-white border-gray-300 w font-bold  hover:bg-gray-300 py-2 px-4 flex gap-5 rounded-full'>
              <img src={'/Google__G__Logo.svg.png'} alt="" className='h-6' />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
      {/* <div>
        <div className='bg-white p-10 rounded-lg shadow-lg'>
          <div className=''>
            <input type="text" placeholder='Enter your pin code ' className='p-5 rounded-lg border-2 mt-4 border-gray-300 font-semibold text-[1.4rem]' />
            <div className='bg-yellow-500 text-center  text-white font-bold text-[1.2rem] px-4 py-5 rounded-lg mt-5 cursor-pointer hover:bg-yellow-700'

            >Search</div>
          </div>
          <div>
            <div className='bg-green-700 text-center  text-white font-bold text-[1.2rem] px-4 py-5 rounded-lg mt-5 cursor-pointer hover:bg-green-800'>Create</div>
          </div>
        </div>
      </div> */}
    </div>
  )
}
