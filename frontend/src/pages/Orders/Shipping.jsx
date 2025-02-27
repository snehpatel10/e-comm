import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress, savePaymentMethod } from '../../redux/features/cart/carSlice';
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Custom validation function
  const validateForm = () => {
    const errors = {};
    
    // Address validation
    if (!address.trim()) {
      errors.address = "Address is required";
    }

    // City validation
    if (!city.trim()) {
      errors.city = "City is required";
    }

    // Postal Code validation (simple validation, adjust as necessary)
    if (!postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    } else if (!/^\d+$/.test(postalCode)) {
      errors.postalCode = "Postal code must be numeric";
    }

    // Country validation
    if (!country.trim()) {
      errors.country = "Country is required";
    }

    // If there are errors, return them, else return true (form is valid)
    return Object.keys(errors).length === 0 ? true : errors;
  };

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateForm();
    if (validation === true) {
      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      dispatch(savePaymentMethod(paymentMethod));
      navigate("/placeorder");
    } else {
      setErrors(validation); // Set validation errors
    }
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto mt-[4rem]">
      <ProgressSteps step1 step2 />
      <div className="mt-[5rem] flex justify-around items-center flex-wrap">
        <form onSubmit={submitHandler} className="w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
          <div className="mb-4">
            <label className="block text-white mb-2">Address</label>
            <input
              type="text"
              className="w-full p-2 border input text-black bg-white rounded"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">City</label>
            <input
              type="text"
              className="w-full p-2 border input text-black bg-white rounded"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Postal Code</label>
            <input
              type="text"
              className="w-full p-2 border input text-black bg-white rounded"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            {errors.postalCode && <span className="text-red-500 text-sm">{errors.postalCode}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Country</label>
            <input
              type="text"
              className="w-full p-2 border input text-black bg-white rounded"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            {errors.country && <span className="text-red-500 text-sm">{errors.country}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">Select Method</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="radio radio-info text-pink-500"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">PayPal or Credit Card</span>
              </label>
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="radio radio-info text-pink-500"
                  name="paymentMethod"
                  value="POD"
                  checked={paymentMethod === "POD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">Pay on Delivery</span>
              </label>
            </div>
          </div>

          <button
            className="bg-pink-500 btn text-white hover:bg-pink-600 py-2 px-4 rounded-full text-lg w-full"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
