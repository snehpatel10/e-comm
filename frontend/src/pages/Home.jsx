import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Message from "../components/Message";
import Product from "./Products/Product";
import { motion } from "framer-motion"; // Import motion from framer-motion

function Home() {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          {/* Main Heading with Framer Motion */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mt-10"
          >
            <h1 className="ml-[3rem] text-3xl">Special Products</h1>
            <Link
              to="/shop"
              className="bg-pink-600 btn hover:bg-pink-700 font-bold rounded-full py-2 px-10 mr-32"
            >
              Shop
            </Link>
          </motion.div>

          {/* Product Grid with staggered fade-in animation */}
          <motion.div
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3, // Stagger child animations (for the product cards)
                },
              },
            }}
          >
            {data?.product?.length > 0 ? (
              data.product.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 25 }}
                  className="flex justify-center"
                >
                  <Product product={product} />
                </motion.div>
              ))
            ) : (
              <Message variant="info">No products found.</Message>
            )}
          </motion.div>
        </>
      )}
    </>
  );
}

export default Home;
