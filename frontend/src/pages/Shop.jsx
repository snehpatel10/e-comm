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
      <div className="flex flex-col md:flex-row bg-[#0f0f10] min-h-screen ml-[1.5rem]">
        {/* Filter Section */}
        <div className="bg-[#151515] p-5 rounded-lg shadow-lg w-full md:w-1/4 mb-6 md:mb-0">
          <h2 className="text-center text-white py-2 mb-4 bg-black rounded-full">Filter by Categories</h2>
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

          <h2 className="text-center text-white py-2 mt-6 mb-4 bg-black rounded-full">Filter by Brands</h2>
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
                <label
                  htmlFor={brand}
                  className="ml-2 text-white text-sm"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-center text-white py-2 mt-6 mb-4 bg-black rounded-full">Filter by Price</h2>
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
        </div>

        {/* Product Section */}
        <div className="flex-1 p-5">
          <h2 className="text-left text-white text-xl font-extralight mb-6">
            {products?.length} Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <div key={p._id} className="flex justify-center">
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
