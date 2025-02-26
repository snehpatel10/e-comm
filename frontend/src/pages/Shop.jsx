import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import AOS from "aos";
import "aos/dist/aos.css";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    setTimeout(() => {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
      });
    }, 300);
  }, []);

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };


  return (
    <div className="container mx-auto px-4 md:px-12">
      <div className="flex flex-col md:flex-row min-h-screen ml-[1.5rem]">
        {/* Filter Section */}
        <motion.div
          className="bg-[#151515] p-5 rounded-lg shadow-lg w-full md:w-1/4 mb-6 md:mb-0"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-white py-2 mb-4 bg-black rounded-full">
            Filter by Categories
          </h2>
          <div className="space-y-4">
            {categories?.map((c) => (
              <div key={c._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${c._id}`}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="checkbox checkbox-primary text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                />
                <label
                  htmlFor={`category-${c._id}`}
                  className="ml-2 text-white text-sm label cursor-pointer"
                >
                  {c.name}
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-center text-white py-2 mt-6 mb-4 bg-black rounded-full">
            Filter by Brands
          </h2>
          <div className="space-y-4">
            {uniqueBrands?.map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  type="radio"
                  id={brand}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="radio radio-primary text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500"
                />
                <label htmlFor={brand} className="ml-2 text-white text-sm">
                  {brand}
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-center text-white py-2 mt-6 mb-4 bg-black rounded-full">
            Filter by Price
          </h2>
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full input input-bordered input-primary px-4 py-2 text-white  rounded-lg "
          />

          <button
            className="w-full mt-6 py-2 btn btn-error text-white rounded-lg"
            onClick={() => window.location.reload()}
          >
            Reset Filters
          </button>
        </motion.div>

        {/* Product Section */}
        <div className="flex-1 p-5">
          <h2 className="text-left text-white text-xl font-extralight mb-6">
            {products?.length} Products
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {products.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <motion.div
                  key={p._id}
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 25,
                    delay: 0.2,
                  }}
                >
                  <ProductCard p={p} />
                </motion.div>
              ))
            )}
          </motion.div>

          {products.length != 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className=" text-white p-5 rounded-lg mt-10 text-center"
            >
              <h2 className="text-2xl font-normal">Looks like you've reached the end!</h2>
              <p>Check back later for new items!</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
