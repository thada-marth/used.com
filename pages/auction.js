import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import Navbar from "@/component/Navbar";
import Countdown from "react-countdown";
import { FiClock } from "react-icons/fi";
import Swal from 'sweetalert2'
import { firestore } from '../firebase/firebase';
import moment from 'moment'
import { onLogin } from '../firebase/user'
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { BiLogOut } from "react-icons/bi";
import { auth } from '../firebase/firebase';


const product = {
    name: "Bang & Olufsen Beoplay M5 Wireless Multiroom Speaker with 360-Degree Sound, Natural",
    price: 405.00,
    forceBuyPrice: 1099.00,
    href: "#",
    breadcrumbs: [
        { id: 1, name: "Men", href: "#" },
        { id: 2, name: "Clothing", href: "#" },
    ],
    images: [
        {
            src: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png",
            alt: "Two each of gray, white, and black shirts laying flat.",
        },
        {
            src: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png",
            alt: "Model wearing plain black basic tee.",
        },
        {
            src: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png",
            alt: "Model wearing plain gray basic tee.",
        },
        {
            src: "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/4/product-1.png",
            alt: "Model wearing plain white basic tee.",
        },
    ],
    colors: [
        { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
        { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
        { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
    ],
    sizes: [
        { name: "XXS", inStock: false },
        { name: "XS", inStock: true },
        { name: "S", inStock: true },
        { name: "M", inStock: true },
        { name: "L", inStock: true },
        { name: "XL", inStock: true },
        { name: "2XL", inStock: true },
        { name: "3XL", inStock: true },
    ],
    description:
        'They are slightly different audio players. The Bluesound Pulse mini is more of an all-in-one stereo system and it sounds really good. The M5 is more of that single speaker system that emits sound in multiple directions to fill a room. If you want good general stereo sound, then the Bluesound is the way to go. If you want something that looks cooler, with designer style and fills a room for more general listening, then the M5 is the way to go.',
    highlights: [
        "True360 Bang & Olufsen Signature Sound Crafted aluminum top with smooth tactile interaction",
        "Wireless, multi-room enabled speaker fills your home with music",
        "Personalize your listening experience through the Beoplay App",
        "Connect with Beoplay’s A6 or A9 wireless speakers for seamless sound throughout your home, using Chromecast Built-in, Beolink Multiroom technologies or connect via Bluetooth, Apple AirPlay, and DLNA.",
    ],
    details:
        'Products with electrical plugs are designed for use in the US. Outlets and voltage differ internationally and this product may require an adapter or converter for use in your destination. Please check compatibility before purchasing.',
};



export default function Auction() {
    const [currentBid, setCurrentBid] = useState()
    const [bidPrice, setBidPrice] = useState()
    const [showInputBid, setShowInputBid] = useState(false)
    const [noOwnerButton, setNoOwnerButton] = useState(false)
    const [bidder, setBidder] = useState()
    const [currentTime, setCurrentTime] = useState(moment(new Date()).format("DD/MM/YYYY HH:mm:ss"))
    const [pin, setPin] = useState(null);
    const [userLogin, setUserLogin] = useState(null);
    const [productData, setProductData] = useState({
        productname: "",
        description: "",
        startprice: "",
        hour: "",
        minute: "",
        image: "",
    });
    const [countDown, setCountDown] = useState(0)
    const [showCountDown, setShowCountDown] = useState(false);

    //SessionOver
    const [SessionOver, setSessionOver] = useState(false);

    const [data] = useDocumentData(firestore.doc('products/' + pin));


    const getProductFromPin = async (pin) => {
        const productData = await firestore.collection('products').doc(pin).get()
        setProductData(productData.data())
        return productData.data()
    }

    const getBidderData = async (bidderUID) => {
        const bidderData = await firestore.collection('users').doc(bidderUID).get()
        return bidderData.data()
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
        const userPromise = new Promise((rev, rej) => {
            onLogin((users) => {
                if (users) {
                    setUserLogin(users);
                } else {
                    window.location.href = "/";
                }
                rev(users)
            })
        });

        const productPromise = new Promise((rev, rej) => {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            setPin(urlParams.get('pin'));
            getProductFromPin(urlParams.get('pin')).then((productData) => { rev(productData) })
        });

        Promise.all([userPromise, productPromise]).then((values) => {
            const targetEndTime = async () => {
                const endTime = new Date(Number(values[1].end));
                const timeRemaining = endTime.getTime() - Date.now();
                setCountDown(values[1].end)
                setShowCountDown(true)
                const timer = setTimeout(() => {
                    setSessionOver(true);
                }, timeRemaining);

                return () => {
                    clearTimeout(timer);
                };
            };
            targetEndTime();
            if (values[0].uid == values[1].Owner.uid) {
                setNoOwnerButton(true)
            }

            if (data) {
                setCurrentBid(data.currentBid);
                setCurrentTime(new Date(values[1].bidTime))
                const bidderData = getBidderData(values[1].bidderUid).then((e) => { setBidder(e.displayName) })
            }
        });
    }, [data])


    const handleAddBid = async (bidPrice) => {
        const bidData = await firestore.collection('products').doc(pin)
        bidData.update({
            currentBid: bidPrice,
            bidTime: new Date().valueOf(),
            bidderUid: userLogin.uid,
        })
    }

    const biddingFunction = () => {
        if (Number(bidPrice) > Number(currentBid)) {
            setCurrentBid(bidPrice)
            setCurrentTime(new Date())
            setBidder(userLogin.displayName)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Your bid is accepted!',
            })
            handleAddBid(bidPrice)
            setShowInputBid(false)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Your bid is too low!',
            })
        }
    }

    const forceBuy = () => {
        Swal.fire({
            title: 'Are you sure to buy this item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, force buy it!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/checkout"
            }
        })
    }

    const renderer = ({ days, hours, minutes, seconds }) => {
        return (
            <div className="flex gap-1">
                <span>{days}d</span>
                <span>{hours}h</span>
                <span>{minutes}m</span>
                <span>{seconds}s</span>
            </div>
        );
    };

    return (
        <div>
            {SessionOver ? (
                <div className='bg-[#0c1324] h-screen flex items-center justify-center px-10 '>
                    <div className='bg-white p-10 rounded-lg shadow-lg '>
                        <div className='text-center font-semibold text-3xl text-gray-900 mb-4'>Auction Ended</div>
                        <div className='text-center font-semibold text-2xl text-gray-900 mb-4'>Winner: K.{bidder}</div>
                        <div className='text-center font-semibold text-2xl text-gray-900 mb-4'>Product: {productData.productName}</div>
                        <div className='text-center font-semibold text-2xl text-gray-900 mb-4'>Final Price: ฿{productData.currentBid}</div>
                        <div className='text-center font-semibold text-lg text-gray-700 mb-4'>Please contact the owner to arrange payment.</div>
                        <div className='text-center font-semibold text-lg text-gray-700 mb-4'>Thank you for participating in this auction.</div>
                        <div className="text-center pt-5">
                            <button className="bg-[#0c1324] mt-5 text-white rounded-lg px-4 py-2 font-semibold hover:bg-gray-600" onClick={() => { window.location.href = "/option" }}>Back to Home</button>
                        </div>
                    </div>
                </div>) : (
                <>
                    <div className="bg-[#0c1324] min-h-screen">
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
                        <div className="text-xl absolute sm:top-[40px] top-[100px]  left-1/2 transform -translate-x-1/2 font-semibold bg-white p-3 rounded-xl ">
                            <div className='flex'>
                                PIN : {pin}
                            </div>
                        </div>
                        <div className="pt-6 lg:flex lg:h-screen">
                            {/* Image gallery */}
                            <div className="flex flex-col items-center align-middle mx-auto lg:flex-row">
                                <div className="flex-1">
                                    <div className="flex flex-col lg:flex-row">
                                        <div className="flex-1">
                                            <div className="flex items-center mt-[150px] lg:mt-10 justify-center w-full lg:h-100 h-50 rounded-xl px-5">
                                                <img className="w-full h-full object-contain" src={product.images[3].src} alt="product" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product info */}
                            <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 items-center align-middle flex ">
                                {/* Options */}
                                <div className="mt-4 lg:row-span-3 lg:mt-0">
                                    <div className="">
                                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                            {productData.productName}
                                        </h1>
                                    </div>
                                    {/* CountDown */}
                                    <div className="mt-6">
                                        <p className="mb-2 font-semibold text-gray-400">Time Left</p>
                                        <div className="flex items-center">
                                            <div className="flex gap-3 items-center text-xl font-semibold text-white">
                                                <div>
                                                    {showCountDown ? (<div><Countdown date={countDown} renderer={renderer}></Countdown><p>Until : {new Date().toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</p></div>) : (<p>loading...</p>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex text-lg mt-5 font-semibold justify-between tracking-tight gap-10 text-gray-900 bg-gray-100 px-5  p-3 rounded-lg">
                                        <div className="font-semibold">
                                            <div>Current Bid by {bidder}</div>
                                            <div className="text-gray-400 text-sm"> {moment(currentTime.toString()).format('MMMM Do YYYY, h:mm:ss a')} </div>
                                        </div>
                                        <div className="text-2xl align-middle flex items-center  ">{currentBid} Baht</div>

                                    </div>
                                    {noOwnerButton ?
                                        (<div className="bg-red-600 text-white text-center font-semibold p-3 mt-5 rounded-lg cursor-not-allowed">
                                            Bidding is not permitted by the owner.
                                        </div>) :
                                        (<div className="bg-indigo-600 text-white text-center font-semibold p-3 mt-5 rounded-lg cursor-pointer hover:bg-indigo-700"
                                            onClick={() => setShowInputBid(!showInputBid)}>
                                            Place a Bid
                                        </div>)}

                                    {showInputBid && (
                                        <div className="mt-4">
                                            <div className="flex items-center border-b border-indigo-500 py-2">
                                                <input
                                                    className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none font-semibold"
                                                    type="number"
                                                    name="bid"
                                                    placeholder="Place a Bid"
                                                    aria-label="Full name"
                                                    value={bidPrice}
                                                    onChange={(e) => { setBidPrice(e.target.value) }}
                                                />
                                                {bidPrice !== "" && bidPrice !== undefined ?
                                                    <button
                                                        className="font-semibold flex-shrink-0 border-green-700 bg-green-700 text-white hover:bg-white hover:border-white-100 text-sm border-4 hover:text-green-700 py-1 px-2 rounded"
                                                        type="button" onClick={() => biddingFunction()}
                                                    >
                                                        Confirm
                                                    </button>
                                                    :
                                                    <button
                                                        className="font-semibold flex-shrink-0 border-red-700 bg-red-700 text-white hover:bg-white hover:border-white-100 text-sm border-4 hover:text-red-700 py-1 px-2 rounded"
                                                        type="button" onClick={() => setShowInputBid(!showInputBid)}
                                                    >
                                                        Cancel
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    )}
                                    <div className="py-10 text-white">
                                        {/* Description and details */}
                                        <div>
                                            <h3 className="">Description</h3>

                                            <div className="space-y-6">
                                                <p className="text-base mt-3 text-white">
                                                    {productData.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="bg-yellow-600 text-white text-center font-semibold p-3 mt-4 rounded-lg cursor-pointer hover:bg-yellow-700"
                                        onClick={() => forceBuy()}
                                    >
                                        Force Buy $ {product.forceBuyPrice}
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
