import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'
import { googleProvider, auth } from '../firebase/firebase'

const inter = Inter({ subsets: ['latin'] })

export default function Index() {


  const [userData, setUserData] = useState()


  const loginWithGoogle = async () => {
    try {
      const { user } = await auth.signInWithPopup(googleProvider);

      // Save user data to Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      setUserData(userData);
      await axios.post('/api/user', userData);

      // Redirect to the product page
      window.location.href = '/option';
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
      console.log(err);
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.href = '/option';
      }
    });
  }, []);




  return (
    <div className='bg-[#0c1324] h-screen flex items-center justify-center '>
      <div>
        <div className='bg-[#21325E] p-7 xxs:p-10 rounded-lg shadow-lg'>
          <div className='mx-auto justify-center flex'>
            <img src={"/used-com.png"} alt="" className='sm:h-40 h-20 mb-8 flex sm:items-center' />
          </div>
          <div className='flex justify-center '>
            <button onClick={loginWithGoogle} className='border-2 bg-white border-gray-300 w-fit sm:w-auto font-bold  hover:bg-gray-300 py-2 px-4 flex sm:gap-5 gap-2 rounded-full'>
              <img src={'/Google__G__Logo.svg.png'} alt="" className='h-6' />
              <span className='sm:text-[16px] text-[13px] mt-1 sm:mt-0 '>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>       
    </div>
  )
}