import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);
  const location = useLocation();  // Fixing location hook usage

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [location]);  // Depend on location to trigger scroll on navigation

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row">
<section className="mr-[5rem]">
  <div role="tablist" className="tabs tabs-bordered">
    <input
      type="radio"
      name="my_tabs_1"
      role="tab"
      className="tab"
      aria-label="Write Review "
      checked={activeTab === 1}
      onChange={() => handleTabClick(1)}
    />
    <div
      role="tabpanel"
      className={`tab-content p-10 ${activeTab === 1 ? 'block' : 'hidden'}`}
    >
      {/* Content for Tab 1 */}
      {activeTab === 1 && (
        <div className="mt-4">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <div className="my-2">
                <label htmlFor="rating" className="block text-xl mb-2">
                  Rating
                </label>
                <select
                  id="rating"
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="p-2 border rounded-lg xl:w-[40rem] select select-primary select-bordered w-[6rem] text-white"
                >
                  <option value="">Select</option>
                  <option value="1">Inferior</option>
                  <option value="2">Decent</option>
                  <option value="3">Great</option>
                  <option value="4">Excellent</option>
                  <option value="5">Exceptional</option>
                </select>
              </div>

              <div className="my-2">
                <label htmlFor="comment" className="block text-xl mb-2">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows="3"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="p-2 textarea textarea-primary border rounded-lg xl:w-[40rem] text-white"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loadingProductReview}
                className="btn btn-primary text-white py-2 px-4 rounded-lg"
              >
                Submit
              </button>
            </form>
          ) : (
            <p>
              Please <Link to="/login">sign in</Link> to write a review
            </p>
          )}
        </div>
      )}
    </div>

    <input
      type="radio"
      name="my_tabs_1"
      role="tab"
      className="tab"
      aria-label="All Reviews"
      checked={activeTab === 2}
      onChange={() => handleTabClick(2)}
    />
    <div
      role="tabpanel"
      className={`tab-content p-10 ${activeTab === 2 ? 'block' : 'hidden'}`}
    >
      {/* Content for Tab 2 */}
      {activeTab === 2 && (
        <div>
          {product.reviews.length === 0 && <p>No Reviews</p>}

          <div>
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#1A1A1A] p-4 rounded-lg xl:ml-[2rem] sm:ml-[0rem] xl:w-[50rem] sm:w-[24rem] mb-5"
              >
                <div className="flex justify-between">
                  <strong className="text-[#B0B0B0]">{review.name}</strong>
                  <p className="text-[#B0B0B0]">
                    {review.createdAt.substring(0, 10)}
                  </p>
                </div>

                <p className="my-4">{review.comment}</p>
                <Ratings value={review.rating} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <input
      type="radio"
      name="my_tabs_1"
      role="tab"
      className="tab"
      aria-label="Related Products"
      checked={activeTab === 3}
      onChange={() => handleTabClick(3)}
    />
    <div
      role="tabpanel"
      className={`tab-content p-10 ${activeTab === 3 ? 'block' : 'hidden'}`}
    >
      {/* Content for Tab 3 */}
      {activeTab === 3 && (
        <section className="ml-[4rem] flex flex-wrap">
          {!data ? (
            <Loader />
          ) : (
            data.map((product) => (
              <div
                key={product._id}
                className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] mb-4"
              >
                <Link to={`/product/${product._id}`}>
                  <SmallProduct product={product} />
                </Link>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  </div>
</section>

    </div>
  );
};

export default ProductTabs;
