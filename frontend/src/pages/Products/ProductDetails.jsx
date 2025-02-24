import React, { useState } from "react";
import DOMPurify from 'dompurify'
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/carSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  console.log(product)

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-white font-semibold hover:underline ml-[10rem]"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="flex flex-wrap relative items-start mt-[2rem] ml-[10rem]">
          <div className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem] mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-full rounded"
            />
            <HeartIcon product={product} />
          </div>

          <div className="w-full xl:w-[35rem] lg:w-[35rem] md:w-[30rem] sm:w-[20rem] flex flex-col justify-between">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            {/* Use dangerouslySetInnerHTML to render the HTML description */}
            <p
              className="my-4 text-[#B0B0B0] w-full h-full"  // Add w-full and h-full to take up full width and height
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
            ></p>
            <p className="text-5xl my-4 font-extrabold">$ {product.price}</p>

            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h1 className="flex items-center mb-6">
                  <FaStore className="mr-2 text-white" /> Brand:{" "}
                  {product.brand}
                </h1>
                <h1 className="flex items-center mb-6">
                  <FaClock className="mr-2 text-white" /> Added:{" "}
                  {moment(product.createdAt).fromNow()}
                </h1>
                <h1 className="flex items-center mb-6">
                  <FaStar className="mr-2 text-white" /> Reviews:{" "}
                  {product.numReviews}
                </h1>
              </div>

              <div>
                <h1 className="flex items-center mb-6">
                  <FaStar className="mr-2 text-white" /> Ratings: {product.rating}
                </h1>
                <h1 className="flex items-center mb-6 w-[10rem]">
                  <FaBox className="mr-2 text-white" />
                  {product.countInStock === 0 ? 'Out of stock' : 'In stock'}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between">
              <Ratings
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />

              {product.countInStock > 0 && (
                <div>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="select select-primary select-bordered w-[6rem] text-white"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                </div>
              )}
            </div>

            <div className="btn-container mt-4">
              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className={`btn ${product.countInStock === 0 ? 'bg-disabled-bg  ' : 'btn-primary'} text-white py-2 px-4 rounded-lg mt-4 sm:mt-2`}
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to cart'}
              </button>

            </div>
            <div className="text-red-500 mt-4 font-bold">{product.quantity < 4 ? 'Hurry up! Only a few products left' : null}</div>

          </div>

          <div className="mt-[5rem] container flex flex-wrap items-start justify-between">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </div>

      )}
    </>
  );
};

export default ProductDetails;
