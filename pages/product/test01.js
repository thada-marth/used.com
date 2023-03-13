/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    theme: {
      extend: {
        gridTemplateRows: {
          '[auto,auto,1fr]': 'auto auto 1fr',
        },
      },
    },
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import { useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import Navbar from "@/component/Navbar";
import Countdown from "react-countdown";
import { FiClock } from "react-icons/fi";
import Swal from 'sweetalert2'

const product = {
  name: "Basic Tee 6-Pack",
  price: 405.00,
  forceBuyPrice: 1099.00,
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Men", href: "#" },
    { id: 2, name: "Clothing", href: "#" },
  ],
  images: [
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
      alt: "Two each of gray, white, and black shirts laying flat.",
    },
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg",
      alt: "Model wearing plain black basic tee.",
    },
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg",
      alt: "Model wearing plain gray basic tee.",
    },
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg",
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
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    "Hand cut and sewn locally",
    "Dyed with our proprietary colors",
    "Pre-washed & pre-shrunk",
    "Ultra-soft 100% cotton",
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
};
const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);
  const [currentBid, setCurrentBid] = useState(405)
  const [bidPrice, setBidPrice] = useState()
  const [showInputBid , setShowInputBid] = useState(false)

  const biddingFunction = () => {
    if (bidPrice > currentBid) {
      setCurrentBid(bidPrice)
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your bid is accepted!',
      })
      setShowInputBid(false)
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
                  <div className="text-gray-400">10 March 2022 at 19:30 PM</div>
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
  );
}
