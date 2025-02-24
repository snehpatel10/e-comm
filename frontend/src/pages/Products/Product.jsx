import React from "react";
import { motion } from "framer-motion";  // Importing motion
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/features/cart/carSlice";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate("/cart");
  };

  return (
    <motion.div
      className="w-full sm:w-[22rem] lg:w-[25rem] p-4 bg-gradient-to-br from-gray-800 to-[#1c1c1c] rounded-lg shadow-lg ml-[2.5rem]"
      initial={{ opacity: 0, y: 100 }}  
      animate={{ opacity: 1, y: 0 }}  
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 25,
        delay: 0.2, 
      }}
    >
      {/* Product Image */}
      <div className="relative group">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-60 object-cover rounded-lg group-hover:scale-105 transition-scale duration-200"
          whileHover={{ scale: 1.05 }}  
          transition={{ duration: 0.3 }}
        />
        {/* Heart Icon */}
        <HeartIcon product={product} />
      </div>

      {/* Product Info */}
      <div className="mt-4 p-2">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-2xl text-white font-semibold hover:text-pink-600 transition-all duration-200">{product.name}</h2>
        </Link>

        <div className="mt-2 flex justify-between items-center">
          {/* Rating */}
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-5 h-5 ${index < product.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9.049 2.927a1 1 0 0 1 1.902 0l1.08 3.282a1 1 0 0 0 .95.69h3.415a1 1 0 0 1 .623 1.71l-2.606 2.008a1 1 0 0 0-.363 1.118l1.09 3.327a1 1 0 0 1-1.517 1.084L10 13.226l-2.983 2.217a1 1 0 0 1-1.517-1.084l1.09-3.327a1 1 0 0 0-.363-1.118L2.934 8.609a1 1 0 0 1 .623-1.71h3.415a1 1 0 0 0 .95-.69l1.08-3.282z"
                />
              </svg>
            ))}
          </div>

          {/* Price */}
          <span className="text-xl text-pink-500 font-bold">${product.price}</span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-4">
        <motion.button
          className="w-full py-2 px-6 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all duration-300"
          onClick={addToCartHandler}
          whileTap={{ scale: 0.95 }}  
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Product;
