import React, { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import animation from '../assets/email-marketing.json'

function About() {
    const animationContainer = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      animationData: animation,
      renderer: 'svg',
      loop: true,
      autoplay: true,
    });
    return () => {
      anim.destroy();
    };
  }, []);
  return (
    <div className="mt-[4rem] px-4 py-8 ">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl text-white mb-4">About <span className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-normal'>TechShop</span></h1>
          <p className="text-lg text-gray-600 mb-6">Your trusted partner in electronic gadgets and accessories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="flex justify-center lg:justify-start">
          <div className="flex justify-center lg:justify-start" ref={animationContainer}></div>
          </div>

          {/*  Text  */}
          <div className="text-white">
            <h2 className="text-2xl font-semibold  mb-4">Who We Are</h2>
            <p className="mb-4 text-gray-400">
              At TechShop, we are passionate about providing high-quality electronic products that enhance
              your everyday life. Whether you're looking for the latest smartphone, cutting-edge gadgets, or
              reliable accessories, we have it all. We believe in offering top-notch products at affordable prices
              with a focus on customer satisfaction.
            </p>
            <p className="mb-4 text-gray-400">
              Founded in 2025, TechShop was created with a vision to make technology accessible to everyone.
              With a wide range of products from trusted brands, we aim to provide a seamless shopping experience
              for our customers, with fast shipping, easy returns, and customer support at your service.
            </p>
            <p className="mb-6 text-gray-400">
              We are committed to bringing you the best deals on the most sought-after gadgets. Shop with us,
              and you will never have to compromise on quality or service.
            </p>

            <div className="border-t pt-4 mt-6">
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-400">
                Our mission is to make shopping for electronics fun, easy, and affordable. With fast shipping,
                amazing deals, and outstanding customer service, TechShop is your one-stop shop for all things tech.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-semibold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-400 mb-6">Hear from customers who have made TechShop their go-to for electronic products.</p>

          {/* Testimonial Cards */}
          <div className="flex justify-center space-x-8">
            <div className="bg-white shadow-md rounded-lg p-6 w-72">
              <p className="text-gray-600 mb-4">"TechShop is amazing! I always find what I'm looking for, and the customer service is top-notch."</p>
              <p className="font-semibold text-gray-800">John Doe</p>
              <p className="text-gray-500">Frequent Shopper</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 w-72">
              <p className="text-gray-600 mb-4">"Great deals on electronics! My go-to store for buying gadgets."</p>
              <p className="font-semibold text-gray-800">Jane Smith</p>
              <p className="text-gray-500">Tech Enthusiast</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
