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
    <div className="mb-4">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="mx-auto max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
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
                quantity,
                countInStock,
              }) => (
                <div key={_id} className="p-4 rounded-md shadow-md">
                  <img
                    src={image}
                    alt={name}
                    className="w-full rounded-lg object-cover h-[20rem]"
                  />
                  <div className="mt-4 flex flex-col gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{name}</h2>
                      <p className="text-pink-600 font-medium">${price}</p>
                      <p className="mt-2 text-sm text-gray-600">
                        {description.substring(0, 170)}...
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="flex items-center text-sm">
                          <FaStore className="mr-2 text-gray-500" /> Brand: {brand}
                        </p>
                        <p className="flex items-center text-sm">
                          <FaClock className="mr-2 text-gray-500" /> Added:{" "}
                          {moment(createdAt).fromNow()}
                        </p>
                        <p className="flex items-center text-sm">
                          <FaStar className="mr-2 text-gray-500" /> Reviews:{" "}
                          {numReviews}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center text-sm">
                          <FaStar className="mr-2 text-gray-500" /> Ratings:{" "}
                          {Math.round(rating)}
                        </p>
                        <p className="flex items-center text-sm">
                          <FaShoppingCart className="mr-2 text-gray-500" /> Quantity:{" "}
                          {quantity}
                        </p>
                        <p className="flex items-center text-sm">
                          <FaBox className="mr-2 text-gray-500" /> In Stock:{" "}
                          {countInStock}
                        </p>
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
