import React from 'react'
import { useEffect, useState } from 'react'
import { onLogin } from '../firebase/user'
import Swal from "sweetalert2";
import { BiLogOut } from "react-icons/bi";
import { auth } from '../firebase/firebase';

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

    const handleLogout = async () => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure you want to log out?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, log me out',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
                await auth.signOut();
                window.location.href = "/";
            }
        } catch (error) {
            console.error(error);
        }
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
        <div className='bg-[#0c1324] min-h-screen  flex items-center justify-center'>
            <div className="text-xl absolute top-7 left-5 font-semibold  bg-white p-3 rounded-xl ">
                <div className='flex'>
                    <div >
                        <img src={userLogin?.photoURL} className='md:w-10 md:h-10 h-7 w-7 rounded-full' />
                    </div>
                    <div className='ml-2 md:mt-1'>
                        {userLogin?.displayName}
                    </div>
                    <div>
                        <BiLogOut className='ml-4 md:mt-1 cursor-pointer ' size={30} onClick={handleLogout} />
                    </div>
                </div>
            </div>
            <div className='mx-5 mt-20 xs:mt-0 overflow-y-auto'>
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
