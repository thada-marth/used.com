import React from 'react'
import { useEffect, useState } from 'react'
import { onLogin } from '../firebase/user'
import Swal from "sweetalert2";
import { firestore } from '../firebase/firebase';
import { server } from '../config/tricker';
import { BiLogOut } from "react-icons/bi";
import { auth } from '../firebase/firebase';

export default function Createhost() {

    const [userLogin, setUserLogin] = useState(null);

    const [hostData, setHostData] = useState({
        productname: "",
        description: "",
        startprice: "",
        hour: "",
        minute: "",
        image: "",
    })

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

    const onChangeField = (field, value) => {
        setHostData({ ...hostData, [field]: value });
    };

    const generatePin = () => {
        const pin = Math.floor(100000 + Math.random() * 900000);
        const paddingPin = pin.toString().padStart(6, "0");
        return paddingPin;
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const { productname, description, startprice, hour, minute, image } = hostData;
        if (productname && description && startprice && (hour || minute)) {
            const data = {
                productName: productname,
                description: description,
                currentBid: startprice,
                hour: hour,
                minute: minute,
                Owner: userLogin,
                end: new Date().valueOf() + hour * 60 * 60 * 1000 + minute * 60 * 1000,
                created: new Date().valueOf(),
                pin: generatePin(),
                bidderUid: userLogin.uid,
                bidTime: new Date().valueOf(),
            };

            firestore
                .collection("products")
                .get()
                .then((querySnapshot) => {
                    const allPins = querySnapshot.docs.map((doc) => doc.data().pin);
                    return allPins;
                })
                .then((allPins) => {
                    let uniquePin = data.pin;
                    while (allPins.includes(uniquePin)) {
                        uniquePin = generatePin();
                    }
                    data.pin = uniquePin;
                    return firestore.collection("products").doc(data.pin).set(data);
                })
                .then(() => {
                    // //Initialize Tricker
                    // let trickerPayload = {
                    //     PIN: data.pin,
                    //     endTime: data.end
                    // };
                    // // Send a POST request to the second API endpoint with the data
                    // const payloadResponse = fetch(`${server}/api/tricker`, {
                    //     method: "POST",
                    //     headers: {
                    //         Accept: "application/json, text/plain, */*",
                    //         "Content-Type": "application/json",
                    //     },
                    //     body: JSON.stringify(trickerPayload),
                    // }).then((res) => {
                    //     console.log('created Tricker')
                    // })
                })
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Create host success",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        window.location.href = "/confirmhost?pin=" + data.pin;
                    });
                })
                .catch((error) => {
                    console.log(error);
                });

            //API
            onLogin((users) => {
                //OWNER
                let payload = {
                    name: users.displayName,
                    email: users.email,
                    message: `Your <h1>${data.productName}</h1><br><h2>${data.description}</h2><br>auction has been started on <br><b>${new Date(data.created)}</b><br> and will end at <br><b>${new Date(data.end)}</b><br> <h3>PIN : ${data.pin}</h3><br>url : ${server}/auction?pin=${data.pin}`,
                    subject: `[Used] Your ${data.productName} Auction has been started (PIN : ${data.pin})`,
                };
                // Send a POST request to the second API endpoint with the data
                const response = fetch(`${server}/api/email`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }).then((res) => {
                    console.log('Request Email')
                })
            });

        } else {
            Swal.fire({
                icon: "error",
                title: "Please fill all field",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };


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
            <div className="text-xl absolute top-5 left-8 font-semibold bg-white p-3 rounded-xl ">
                <div className='flex'>
                    <div >
                        <img src={userLogin?.photoURL} className='w-10 h-10 rounded-full' />
                    </div>
                    <div className='ml-2 mt-1'>
                        {userLogin?.displayName}
                    </div>
                    <div>
                        <BiLogOut className='ml-4 mt-1 cursor-pointer ' size={30} onClick={handleLogout} />
                    </div>
                </div>
            </div>
            <div className='mt-10'>
                <div className='bg-white p-10 rounded-lg shadow-lg'>
                    <div>
                        <form class="w-full max-w-lg font-semibold text-[1.2rem]">
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full px-3">
                                    <label class="block  text-gray-700 font-semibold text-[1.2rem] mb-2" for="grid-password">
                                        Product name
                                    </label>
                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="productname" type="text" placeholder="Iphone 15"
                                        onChange={(e) =>
                                            onChangeField("productname", e.target.value)
                                        } />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full px-3">
                                    <label class="block  text-gray-700 font-semibold text-[1.2rem] mb-2" for="grid-password">
                                        Description
                                    </label>
                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="description" type="text" placeholder="test"
                                        onChange={(e) =>
                                            onChangeField("description", e.target.value)
                                        } />
                                </div>
                            </div>
                            <div class="flex flex-wrap -mx-3 mb-6">
                                <div class="w-full px-3">
                                    <label class="block  text-gray-700 font-semibold text-[1.2rem] mb-2" for="grid-password">
                                        Start price (THB)
                                    </label>
                                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="startprice" type="number" placeholder="2000"
                                        onChange={(e) =>
                                            onChangeField("startprice", e.target.value)
                                        } />
                                </div>
                            </div>
                            <label className="block font-semibold">
                                Time
                            </label>
                            <div className="mt-3 flex gap-3 ">
                                <div className="flex">
                                    <input
                                        type="number"
                                        name="hours"
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" placeholder="1"
                                        onChange={(e) =>
                                            onChangeField("hour", e.target.value)
                                        }
                                    />
                                    <span className="ml-3 mt-2">Hour</span>
                                </div>
                                <div className="flex">
                                    <input
                                        type="number"
                                        name="minutes"
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" placeholder="30"
                                        onChange={(e) =>
                                            onChangeField("minute", e.target.value)
                                        }
                                    />
                                    <span className="ml-3 mt-2">
                                        Minutes
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div
                                    className="px-6 font-semibold py-3 mt-8 text-white bg-blue-600 text-center rounded-[10px] hover:bg-blue-700 w-100 cursor-pointer"
                                    onClick={handleSubmit}
                                >
                                    Create
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
