import React from "react";
import { motion } from "framer-motion";  // Importing motion
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductsCarousel";

function Header() {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1 className="mt-7 text-center text-red-500 font-semibold">ERROR</h1>;
  }

  return (
    <motion.div
      className="flex flex-col lg:flex-row justify-between items-start gap-6 p-8 mt-7"
      initial={{ opacity: 0 }}  
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}  
    >
      {/* Product List */}
      <motion.div
        className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
        initial={{ opacity: 0, x: -100 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.6, ease: "easeInOut" }} 
      >
        {data.map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </motion.div>

      {/* Carousel */}
      <motion.div
        className="lg:w-1/2"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <ProductCarousel />
      </motion.div>
    </motion.div>
  );
}

export default Header;
