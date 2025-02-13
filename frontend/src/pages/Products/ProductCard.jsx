import React from "react";
import DOMPurify from 'dompurify'
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/carSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
<div className="flex flex-col h-full max-w-sm relative bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
  <section className="relative">
    <Link to={`/product/${p._id}`}>
      <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
        {p?.brand}
      </span>
      <img className="cursor-pointer w-full" src={p.image} alt={p.name} style={{ height: "170px", objectFit: "cover" }} />
    </Link>
    <HeartIcon product={p} />
  </section>

  <div className="p-5 flex flex-col flex-grow">
    <div className="flex justify-between">
      <h5 className="mb-2 text-xl text-white">{p?.name}</h5>
      <p className="font-semibold text-pink-500">
        {p?.price?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </p>
    </div>

    <p className="mb-3 font-normal text-[#CFCFCF] flex-grow" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p?.description?.substring(0, 60)) + '...' }} />

    <section className="flex items-center justify-between gap-x-2 mt-auto">
      <Link to={`/product/${p._id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-pink-700 rounded-lg hover:bg-pink-800">
        Read More
        <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg>
      </Link>

      <button className="p-2 rounded-full btn btn-secondary text-white" onClick={() => addToCartHandler(p, 1)}>
        <AiOutlineShoppingCart size={25} />
      </button>
    </section>
  </div>
</div>

  );
};

export default ProductCard;
