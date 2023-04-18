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
        <>
            <div class="min-h-screen flex flex-col">
                <img src={"/used-com.png"} class='h-16 ml-10 absolute top-10 left-0' />
                <div class='bg-[#0c1324] flex items-center justify-center text-center flex-1'>
                    <div class='w-full max-w-md  bg-white p-8 rounded-lg'>
                            <input type="text" placeholder='PIN CODE' class=' p-5 rounded-lg border-2 mt-4 border-gray-300 font-semibold text-2xl w-full '/>
                        <div class=' bg-yellow-500 text-center text-white font-bold text-lg px-4 py-5 rounded-lg mt-5 cursor-pointer hover:bg-yellow-700 '>JOIN</div>
                        <div class='mt-4 font-bold text-xl text-center'>
                            OR
                        </div>
                        <div>
                            <Link href='/createhost'>
                                <div class='bg-green-700 text-center text-white font-bold text-lg px-4 py-5 rounded-lg mt-5 cursor-pointer hover:bg-green-800'>Host the Auction</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
