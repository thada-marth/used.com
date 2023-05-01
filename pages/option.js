import React from 'react'
import { useEffect, useState } from 'react'
import { onLogin } from '../firebase/user'
import Link from 'next/link';
import Swal from "sweetalert2";
import { firestore } from '../firebase/firebase';
import { BiLogOut } from "react-icons/bi";
import { auth } from '../firebase/firebase';

export default function Option() {
    const [userLogin, setUserLogin] = useState(null);
    const [pin, setPin] = useState(null);

    useEffect(() => {
        onLogin((users) => {
            if (users) {
                setUserLogin(users);
            } else {
                window.location.href = "/";
            }
        })
    }, [])

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin) {
            firestore.collection("products").doc(pin).get().then((doc) => {
                if (doc.exists) {
                    window.location.href = "/auction?pin=" + pin;
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Pin code is not correct",
                    });
                }
            })
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter pin code",
            });
        }
    }

    return (
        <div className='bg-[#0c1324] h-screen flex items-center justify-center '>
            <div className="text-xl absolute top-7 left-5 font-semibold bg-white p-3 rounded-xl ">
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
            <div className='mx-5 '>
                <div className='bg-white sm:p-10 p-5 rounded-lg shadow-lg'>
                    <div className=''>
                        <input type="text" placeholder='Enter your pin code ' className='p-5 rounded-lg border-2 mt-4 border-gray-300 font-semibold text-[1.4rem] w-full w-max-md'
                            onChange={(e) => setPin(e.target.value)}
                        />
                        <div className='bg-yellow-500 text-center  text-white font-bold text-[1.2rem] px-4 py-5 rounded-lg mt-5 cursor-pointer hover:bg-yellow-700'
                            onClick={handleSubmit}
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
