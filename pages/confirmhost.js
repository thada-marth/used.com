import React from 'react'
import { useEffect, useState } from 'react'
import { onLogin } from '../firebase/user'
import Swal from "sweetalert2";

export default function Confirmhost() {

    const [userLogin, setUserLogin] = useState(null);
    const [pin, setPin] = useState(null);

    const copyPin = () => {
        navigator.clipboard.writeText(pin);
        Swal.fire({
            icon: "success",
            title: "Copied!",
            text: "Your pin has been copied to clipboard.",
            showConfirmButton: false,
            timer: 1500,
        });
    }

    useEffect(() => {
        onLogin((users) => {
            if (users) {
                setUserLogin(users);
            } else {
                window.location.href = "/";
            }
        })
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        setPin(urlParams.get('pin'));
    }, [])

    return (
        <div className='bg-[#0c1324] h-screen flex items-center justify-center '>
            <div>
                <div className='bg-white p-10 rounded-lg shadow-lg'>
                    <div className=''>
                        <div className=' text-center font-semibold text-4xl mb-4'>Auction Started!!</div>
                        <div className=' text-center font-semibold text-2xl mb-4'>Your PIN</div>
                        <div className=' text-center font-semibold text-5xl border-2 border-gray-500 p-4 rounded-lg'>{pin}</div>
                        <div className='text-center font-medium text-md mt-2'>One-time use PIN code please keep your pin before exiting this page.</div>
                        <div className='bg-green-500 text-center  text-white font-bold text-[1.2rem] px-4 py-5 rounded-lg mt-5 cursor-pointer hover:bg-green-700'
                        onClick={copyPin}
                        >Copy your PIN code</div>
                        <div className='bg-orange-500 text-center  text-white font-bold text-[1.2rem] px-4 py-5 rounded-lg mt-3 cursor-pointer hover:bg-orange-700'
                        onClick={() => window.location.href = "/auction?pin=" + pin}
                        >Go to your auction session</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
