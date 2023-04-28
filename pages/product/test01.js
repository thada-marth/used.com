import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import Navbar from "@/component/Navbar";
import Countdown from "react-countdown";
import { FiClock } from "react-icons/fi";
import Swal from 'sweetalert2'
import { firestore } from '../../firebase/firebase';
import moment from 'moment'


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

export default function Example() {
  const [currentBid, setCurrentBid] = useState()
  const [bidPrice, setBidPrice] = useState()
  const [showInputBid, setShowInputBid] = useState(false)
  const [currentTime, setCurrentTime] = useState(moment(new Date()).format("DD/MM/YYYY HH:mm:ss"))

  //SessionOver
  const [SessionOver, setSessionOver] = useState(false);

  useEffect(() => {
    const getBidData = async () => {
      const bidData = await firestore.collection('bids').doc('0gi5R583ppFj27ly59oF').get()
      setCurrentBid(bidData.data().bidPrice)
      setCurrentTime((new Date(bidData.data().timeStamp)))
      console.log(typeof(bidData.data().timeStamp));
    }
    getBidData()
    //SessionOver
    const targetEndTime = new Date("2023-04-20T12:10:05");

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
      </div> ) : (
        <>
        <Navbar />
        <div className="bg-white">
          <div className="pt-6">
            {/* Image gallery */}
            <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
              <div className="aspect-w-3 aspect-h-4 hidden overflow-hidden rounded-lg lg:block">
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
              </div>
              <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg lg:aspect-w-3 lg:aspect-h-4">
                <img
                  src={product.images[3].src}
                  alt={product.images[3].alt}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
  
            {/* Product info */}
            <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {product.name}
                </h1>
              </div>
  
              {/* Options */}
              <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Product information</h2>
  
  
                {/* Reviews */}
                {/* <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{reviews.average} out of 5 stars</p>
                  <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    {reviews.totalCount} reviews
                  </a>
                </div>
              </div> */}
  
                {/* CountDown */}
                <div className="mt-6">
                  <h3 className="sr-only">Reviews</h3>
                  <p className="mb-2 font-semibold text-gray-400">Time Left</p>
                  <div className="flex items-center">
                    <div className="flex gap-3 items-center text-xl font-semibold">
                      <Countdown date={Date.now() + 1022223100} renderer={renderer}>
                      </Countdown>
                    </div>
                  </div>
                </div>
                <div className=" flex text-lg mt-5 font-semibold tracking-tight gap-10 text-gray-900 bg-gray-100 px-5  p-3 rounded-lg">
                  <div className="font-semibold">
                    <div>Current Bid by @Thada</div>
                    <div className="text-gray-400 text-sm"> {moment(currentTime.toString()).format('MMMM Do YYYY, h:mm:ss a')} </div>
                  </div>
                  <div className="text-2xl align-middle flex items-center  ">$ {currentBid}</div>
  
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
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none font-semibold"
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
  
                <div className="bg-yellow-600 text-white text-center font-semibold p-3 mt-4 rounded-lg cursor-pointer hover:bg-yellow-700"
                  onClick={() => forceBuy()}
                >
                  Force Buy $ {product.forceBuyPrice}
                </div>
  
  
                {/* <form className="w-full max-w-sm">
                  <div className="mt-4 flex items-center border-b border-indigo-500 py-2">
                    <input
                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none font-semibold"
                      type="number"
                      name="bid"
                      placeholder="Place your bid!"
                      aria-label="Full name"
                      value={bidPrice}
                      onChange={(e) => { setBidPrice(e.target.value) }}
                    />
                    {bidPrice !== "" && bidPrice !== undefined ?
                      <button
                        className="font-semibold flex-shrink-0 border-indigo-700 bg-indigo-700 text-white hover:bg-white hover:border-white-100 text-sm border-4 hover:text-indigo-700 py-1 px-2 rounded"
                        type="button" onClick={() => biddingFunction()}
                      >
                        Confirm
                      </button>
                      : ""}
                  </div>
                </form> */}
  
              </div>
  
              <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
                {/* Description and details */}
                <div>
                  <h3 className="sr-only">Description</h3>
  
                  <div className="space-y-6">
                    <p className="text-base text-gray-900">
                      {product.description}
                    </p>
                  </div>
                </div>
  
                <div className="mt-10">
                  <h3 className="text-sm font-medium text-gray-900">
                    Highlights
                  </h3>
  
                  <div className="mt-4">
                    <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                      {product.highlights.map((highlight) => (
                        <li key={highlight} className="text-gray-400">
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
  
                <div className="mt-10">
                  <h2 className="text-sm font-medium text-gray-900">Details</h2>
  
                  <div className="mt-4 space-y-6">
                    <p className="text-sm text-gray-600">{product.details}</p>
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
