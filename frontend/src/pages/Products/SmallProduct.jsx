import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

function SmallProduct({ product }) {
  return (
    <div className="w-[15rem] p-2 bg-[#1a1a1a] rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[170px] object-cover rounded-lg transition duration-300 hover:opacity-90"
        />
        <HeartIcon product={product} />
        <div className="p-54">
          <Link to={`/product/${product._id}`}>
            <h2 className="flex justify-between items-center mt-2">
              <div>{product.name}</div>
              <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                ${product.price}
              </span>
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SmallProduct;
