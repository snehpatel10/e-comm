import React from "react";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-8">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="ml-0 max-w-lg xl:max-w-3xl">
          <Slider {...settings} className="rounded-lg">
            {products.map(
              ({
                image,
                _id,
                name,
                price,
                description,
                brand,
                createdAt,
                numReviews,
                rating,
                countInStock,
              }) => (
                <div key={_id} className="p-4 rounded-lg shadow-lg transition transform hover:scale-105">
                  <img
                    src={image}
                    alt={name}
                    className="w-full rounded-lg object-cover h-[350px] mb-4"
                  />
                  <div className="mt-4">
                    <h2 className="text-2xl font-semibold text-gray-200">{name}</h2>
                    <p className="text-pink-500 font-medium text-xl">${price}</p>
                    <p className="mt-2 text-gray-400 text-sm">{description.substring(0, 170)}...</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-sm text-gray-400">
                        <p className="flex items-center"><FaStore className="mr-2" />Brand: {brand}</p>
                        <p className="flex items-center"><FaClock className="mr-2" />Added: {moment(createdAt).fromNow()}</p>
                        <p className="flex items-center"><FaStar className="mr-2" />Reviews: {numReviews}</p>
                      </div>
                      <div className="text-sm text-gray-400">
                        <p className="flex items-center"><FaStar className="mr-2" />Ratings: {Math.round(rating)}</p>
                        <p className="flex items-center"><FaBox className="mr-2" />{countInStock > 0 ? 'In stock' : 'Out of stock'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </Slider>
        </div>
      )}
    </div>
  );
};


export default ProductCarousel;
