import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Message from "../components/Message";
import Product from "./Products/Product";

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
          <div className="flex justify-between items-center mt-10">
            <h1 className="ml-32 text-3xl">Special Products</h1>
            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-32"
            >
              Shop
            </Link>
          </div>

          {/* Product Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-[2.5rem] sm:ml-0">
            {data?.product?.length > 0 ? (
              data.product.map((product) => (
                <div key={product._id} className="flex justify-center">
                  <Product product={product} />
                </div>
              ))
            ) : (
              <Message variant="info">No products found.</Message>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Home;
