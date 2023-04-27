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

    //SessionOver
    const [SessionOver, setSessionOver] = useState(false);

    const getProductFromPin = async (pin) => {
        const productData = await firestore.collection('products').doc(pin).get()
        setProductData(productData.data())
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
        getProductFromPin(urlParams.get('pin'))

        const getBidData = async () => {
            const bidData = await firestore.collection('bids').doc('0gi5R583ppFj27ly59oF').get()
            setCurrentBid(bidData.data().bidPrice)
            setCurrentTime((new Date(bidData.data().timeStamp)))
            // console.log(typeof (bidData.data().timeStamp));
        }
        getBidData()
        //SessionOver
        const targetEndTime = new Date("2023-05-20T12:10:05");

        const timer = setTimeout(() => {
            setSessionOver(true);
        }, targetEndTime.getTime() - Date.now());

        return () => {
            clearTimeout(timer);
        };
    }, [])


    const handleAddBid = async () => {
        const bidData = await firestore.collection('bids').doc('0gi5R583ppFj27ly59oF')
        bidData.set({
            bidPrice: bidPrice,
            timeStamp: new Date().valueOf()
        })
    }

    const biddingFunction = () => {
        if (bidPrice > currentBid) {
            setCurrentBid(bidPrice)
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Your bid is accepted!',
            })
            setShowInputBid(false)
            handleAddBid()
        } else {
            console.log("โง่")
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
                <div>
                    <h1>winner and product detail</h1>
                </div>) : (
                <>
                        <div className="bg-[#0c1324]">
                            <div className="text-xl absolute top-5 right-8 text-white ">PIN : {pin}</div>
                        <div className="pt-6">
                            {/* Image gallery */}
                            <div className="mx-auto mt-10 max-w-2xl ">
                                {/* <div className="aspect-w-3 aspect-h-4 hidden overflow-hidden rounded-lg lg:block">
                                    <img
                                        src={product.images[0].src}
                                        alt={product.images[0].alt}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                                <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                                    <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
                                        <img
                                            src={product.images[1].src}
                                            alt={product.images[1].alt}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
                                        <img
                                            src={product.images[2].src}
                                            alt={product.images[2].alt}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                </div> */}
                                <div className="aspect-w-1 aspect-h-1 sm:overflow-hidden sm:rounded-lg mx-5 ">
                                    <img
                                        src={product.images[3].src}
                                        alt={product.images[3].alt}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                            </div>

                            {/* Product info */}
                            <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 ">
                                <div className="">
                                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                        {productData.productName}
                                    </h1>
                                </div>
                                {/* Options */}
                                <div className="mt-4 lg:row-span-3 lg:mt-0">
                                    {/* CountDown */}
                                    <div className="mt-6">
                                        <p className="mb-2 font-semibold text-gray-400">Time Left</p>
                                        <div className="flex items-center">
                                                <div className="flex gap-3 items-center text-xl font-semibold text-white">
                                                <Countdown date={Date.now() + 1022223100} renderer={renderer}>
                                                </Countdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex text-lg mt-5 font-semibold justify-between tracking-tight gap-10 text-gray-900 bg-gray-100 px-5  p-3 rounded-lg">
                                        <div className="font-semibold">
                                            <div>Current Bid by @Thada</div>
                                            <div className="text-gray-400 text-sm"> {moment(currentTime.toString()).format('MMMM Do YYYY, h:mm:ss a')} </div>
                                        </div>
                                        <div className="text-2xl align-middle flex items-center  ">{currentBid} Baht</div>

                                    </div>
                                    <div className="bg-indigo-600 text-white text-center font-semibold p-3 mt-5 rounded-lg cursor-pointer hover:bg-indigo-700"
                                        onClick={() => setShowInputBid(!showInputBid)}
                                    >
                                        Place a Bid
                                    </div>

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

                                    {/* <div className="bg-yellow-600 text-white text-center font-semibold p-3 mt-4 rounded-lg cursor-pointer hover:bg-yellow-700"
                                        onClick={() => forceBuy()}
                                    >
                                        Force Buy $ {product.forceBuyPrice}
                                    </div> */}
                                </div>

                                <div className="py-10 text-white">
                                    {/* Description and details */}
                                    <div>
                                        <h3 className="sr-only">Description</h3>

                                        <div className="space-y-6">
                                                <p className="text-base text-white">
                                                {productData.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
