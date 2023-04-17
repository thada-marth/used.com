import React from 'react'
import { useEffect, useState } from 'react'
import { onLogin } from '../firebase/user'
import Link from 'next/link';

export default function option() {
    const [userLogin, setUserLogin] = useState(null);

    useEffect(() => {
        onLogin((users) => {
            if (users) {
                setUserLogin(users);
            } else {
                window.location.href = "/";
            }
        })
    }, [])

    return (
        <div className='bg-[#0c1324] h-screen flex items-center justify-center '>
            <div>
                <div className='bg-white p-10 rounded-lg shadow-lg'>
                    <div className=''>
                        <input type="text" placeholder='Enter your pin code ' className='p-5 rounded-lg border-2 mt-4 border-gray-300 font-semibold text-[1.4rem]' />
                        <div className='bg-yellow-500 text-center  text-white font-bold text-[1.2rem] px-4 py-5 rounded-lg mt-5 cursor-pointer hover:bg-yellow-700'
                        >Search</div>
                    </div>
                    <div className='mt-4 font-bold text-xl text-center'>
                        OR
                    </div>
                    <div>
                        <Link href='/createhost'>
                        <div className='bg-green-700 text-center  text-white font-bold text-[1.2rem] px-4 py-5 rounded-lg mt-5 cursor-pointer hover:bg-green-800'>Create Auction Room</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
