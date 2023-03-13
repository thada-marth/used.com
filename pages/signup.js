import React from 'react';

export default function Signup() {
    return (
        <section class="bg-gray-200 min-h-screen flex items-center justify-center font-semibold">
            <div class="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
                <div class="md:w-1/2 px-8 md:px-16">
                    <h2 class="font-bold text-2xl text-[#002D74]">Signup</h2>

                    <form class="flex flex-col gap-3 font-medium">

                        <div className='mt-5 ml-1 font-semibold'>First Name</div>
                        <input class="p-2 mt-[-5px]  rounded-xl border" type="text" name="firstname" placeholder="Firstname" />
                        <div className=' ml-1 font-semibold'>Last Name</div>
                        <input class="p-2 mt-[-5px]  rounded-xl border" type="text" name="lastname" placeholder="Lastname" />
                        <div className=' ml-1 font-semibold'>Phone Number</div>
                        <input class="p-2 mt-[-5px]  rounded-xl border" type="text" name="number" placeholder="Number" />
                        <div className=' ml-1 font-semibold'>Email</div>
                        <input class="p-2 mt-[-5px]  rounded-xl border" type="email" name="email" placeholder="Email" />
                        <div className=' ml-1 font-semibold'>Password</div>
                        <div class="relative">
                            <input class="p-2 mt-[-5px]  rounded-xl border w-full" name="password" placeholder="Password" />
                        </div>
                        <div class="bg-[#002D74] mt-4 text-center cursor-pointer rounded-xl text-white py-2 hover:bg-blue-900 duration-300"
                            onClick={() => {
                                window.location.href = '/product'
                            }
                            }
                        >Register</div>
                    </form>


                    <div class="font-normal mt-5 text-xs flex justify-between items-center text-[#002D74]">
                        <p>have an account?</p>
                        <div class="py-2 px-5 bg-white border rounded-xl hover:bg-gray-200 duration-300 cursor-pointer text-center"
                            onClick={() => {
                                window.location.href = '/login'
                            }
                            }
                        >Login</div>
                    </div>
                </div>

                <div class="md:block hidden w-1/2">
                    <img class="rounded-2xl" src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80" />
                </div>
            </div>
        </section>
    );
}
