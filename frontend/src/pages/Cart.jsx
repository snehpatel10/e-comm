import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/carSlice";
import { motion, AnimatePresence } from "framer-motion"; // Import necessary Framer Motion components

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const changeQuantity = (item, action) => {
    const newQty =
      action === "increment"
        ? item.qty + 1
        : action === "decrement" && item.qty > 1
        ? item.qty - 1
        : item.qty;

    if (newQty !== item.qty) {
      addToCartHandler(item, newQty);
    }
  };

  return (
    <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
      {cartItems.length === 0 ? (
        <div>
          Your cart is empty <Link to="/shop">Go To Shop</Link>
        </div>
      ) : (
        <div className="flex flex-col w-[80%]">
          <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

          {/* Wrap cart items with AnimatePresence for removal animations */}
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                className="flex items-center mb-[1rem] pb-2"
                initial={{ opacity: 1 }}  // Start with full opacity
                animate={{ opacity: 1 }}   // Keep opacity at 1 when the item is visible
                exit={{
                  opacity: 0,             // Fade out when exiting
                  x: 100,                 // Slide to the right when removed
                  transition: { duration: 0.3 },  // Transition time for the exit
                }}
              >
                <div className="w-[5rem] h-[5rem]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 ml-4">
                  <Link to={`/product/${item._id}`} className="text-pink-500">
                    {item.name}
                  </Link>

                  <div className="mt-2 text-white">{item.brand}</div>
                  <div className="mt-2 text-white font-bold">
                    $ {item.price}
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => changeQuantity(item, "decrement")}
                    disabled={item.qty === 1}
                    className={`p-2 text-2xl font-bold rounded-full ${
                      item.qty === 1 ? "text-gray-500 cursor-not-allowed" : "text-white"
                    } transition duration-200 ease-in-out transform hover:scale-105`}
                  >
                    -
                  </button>

                  <div className="text-xl text-white">{item.qty}</div>

                  <button
                    onClick={() => changeQuantity(item, "increment")}
                    disabled={item.qty === item.countInStock}
                    className={`p-2 text-2xl font-bold rounded-full ${
                      item.qty === item.countInStock
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-white"
                    } transition duration-200 ease-in-out transform hover:scale-105`}
                  >
                    +
                  </button>
                </div>

                <div>
                  <button
                    className="text-red-500 ml-4"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash className="ml-[1rem] mt-[.5rem]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="mt-8 w-[40rem]">
            <div className="p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                Items (
                {cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </h2>

              <div className="text-2xl font-bold">
                ${" "}
                {cartItems
                  .reduce(
                    (acc, item) => acc + Number(item.qty) * Number(item.price),
                    0
                  )
                  .toFixed(2)}
              </div>

              <button
                className="btn btn-primary text-white mt-4 py-2 px-4 rounded-full text-lg w-full"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
