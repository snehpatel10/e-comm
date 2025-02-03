import React from "react";
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
    return <h1 className="text-center text-red-500 font-semibold">ERROR</h1>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-6 p-4">
      {/* Product List */}
      <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </div>

      {/* Carousel */}
      <div className="w-full lg:w-1/2">
        <ProductCarousel />
      </div>
    </div>
  );
}

export default Header;
