import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/carSlice";
import CartAnimation from "../CartAnimation";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state
  const [cartItems, setCartItems] = useState([]); // Store cart items for animation

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      setIsPlacingOrder(true);
      setCartItems(cart.cartItems); // Set cart items for animation
      setIsAnimating(true); // Trigger the animation

      // Simulate a delay for the animation
      setTimeout(async () => {
        const res = await createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }).unwrap();

        // Clear cart and navigate after placing the order
        dispatch(clearCartItems());
        setIsPlacingOrder(false);
        setIsAnimating(false); // End the animation
        navigate(`/order/${res._id}`, { replace: true });
      }, 2000); // Animation delay (2 seconds)
    } catch (error) {
      toast.error(error);
      setIsPlacingOrder(false);
      setIsAnimating(false);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="max-w-5xl mx-auto mt-8 px-4">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table border border-gray-700 bg-gray-900 rounded-lg text-white">
                <thead>
                  <tr className="bg-gray-800 text-left uppercase">
                    <th className="px-4 py-3"></th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {cart.cartItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="px-4 py-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <Link
                          to={`/product/${item.product}`}
                          className="hover:underline text-blue-400"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{item.qty}</td>
                      <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold">
                        $ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 bg-gray-900 p-6 rounded-xl shadow-lg text-white">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <ul className="text-lg space-y-2">
                <li className="flex justify-between border-b pb-2">
                  <span>Items:</span> <span>${cart.itemsPrice}</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Shipping:</span> <span>${cart.shippingPrice}</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Tax:</span> <span>${cart.taxPrice}</span>
                </li>
                <li className="flex justify-between text-xl font-bold">
                  <span>Total:</span> <span>${cart.totalPrice}</span>
                </li>
              </ul>

              {error && <Message variant="danger">{error.data.message}</Message>}

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Shipping</h2>
                <p className="text-gray-300">
                  <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                <strong>{cart.paymentMethod}</strong>
              </div>

              <button
                type="button"
                className="w-full btn bg-gradient-to-r from-pink-500 to-pink-700 text-white py-3 mt-6 rounded-lg text-lg hover:cursor-pointer font-semibold shadow-md hover:from-pink-600 hover:to-pink-800 transition-all"
                disabled={cart.cartItems.length === 0 || isPlacingOrder}
                onClick={placeOrderHandler}
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>

              {isLoading && <Loader />}
            </div>

            {/* Show the Cart Animation if placing order */}
            {isAnimating && <CartAnimation items={cart.cartItems} />}
          </>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
