import React from "react";
import { motion } from "framer-motion"; 
import { useInView } from "react-intersection-observer"; 
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/carSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p, hasScrolled }) => {
  const dispatch = useDispatch();

  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.1,
  });

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <motion.div
      ref={ref} 
      className="flex flex-col bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 max-w-xs h-full"
      initial={{ opacity: 0, y: 100 }} 
      animate={{
        opacity: inView ? 1 : 0, 
        y: inView ? 0 : 100, 
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 25,
      }}
    >
      {/* Product Image */}
      <section className="relative flex-shrink-0">
        <Link to={`/product/${p._id}`}>
          <span className="absolute top-3 left-3 bg-black bg-opacity-40 text-white text-sm font-bold py-1 px-3 rounded-full shadow-lg backdrop-blur-md z-10">
            {p?.brand}
          </span>

          <div className="overflow-hidden rounded-t-lg">
            <img
              className="cursor-pointer w-full rounded-t-lg object-cover hover:scale-105 transform transition-all duration-150 hover:rounded-lg"
              src={p.image}
              alt={p.name}
              style={{ height: "200px", width: "320px", objectFit: "cover" }}
            />
          </div>
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="flex justify-between">
          <h5 className="mb-2 text-xl text-white">{p?.name}</h5>
          <p className="font-semibold text-pink-500">
            {p?.price?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </p>
        </div>

        {/* Description */}
        <p
          className="mb-3 font-normal text-[#CFCFCF] overflow-hidden text-ellipsis whitespace-nowrap"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(p?.description?.substring(0, 60)) + "...",
          }}
        />

        <section className="flex items-center justify-between gap-x-2 mt-auto">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-700 rounded-lg"
          >
            View Details
          </Link>

          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 rounded-lg"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </section>
      </div>
    </motion.div>
  );
};

export default ProductCard;
