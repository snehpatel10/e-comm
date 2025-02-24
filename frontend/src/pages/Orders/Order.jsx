import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useMarkOrderPaidMutation, // Assuming this mutation exists
} from "../../redux/api/orderApiSlice";
import Message from "../../components/Message";

const Order = () => {
  const { id: orderId } = useParams();


  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const [markOrderPaid, { isLoading: loadingMarkPaid }] = useMarkOrderPaidMutation(); // Add mutation to mark order as paid
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const paymentMethod = order?.paymentMethod;

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid && paymentMethod === "PayPal") {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch, paymentMethod]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
    toast.success('Order has been marked as delivered')
  };

  const markPaidHandler = async () => {
    try {
      const paymentDetails = {
        id: userInfo._id,
        status: "COMPLETED",
        update_time: Date.now(),
        payer: {
          email_address: userInfo.email,
        },
      };
      const response = await markOrderPaid({
        orderId: orderId.toString(),  // Make sure it's a string
        paymentDetails
      });
      refetch();
      toast.success("Order marked as paid");
    } catch (error) {
      console.log('Error while marking as paid:', error); // Log error if any
      toast.error(error?.data?.message || error.message);
    }
  };


  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container ml-[5rem] max-w-screen-lg mx-auto overflow-x-hidden flex flex-col md:flex-row px-4 py-5">
      <div className="w-full md:w-2/3 pr-4">
        <div className="mt-5 pb-4 mb-10">
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-2 border-[#E85D92] text-sm shadow-lg  rounded-lg overflow-hidden text-white">
                <thead className="bg-[#2A1824] text-[#E85D92] uppercase text-xs tracking-wide border-b border-[#E85D92]">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-center">Unit Price</th>
                    <th className="p-3 text-center">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => {
                    const unitPrice = parseFloat(item.price);
                    const quantity = parseInt(item.qty, 10);
                    const totalPrice = unitPrice * quantity;

                    return (
                      <tr key={index} className="bg-[#261421]">
                        <td className="p-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md shadow-md border border-[#E85D92]"
                          />
                        </td>
                        <td className="p-3">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-[#F5A9C5] font-medium hover:underline"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="p-3 text-center font-semibold">{quantity}</td>
                        <td className="p-3 text-center">$ {item.price}</td>
                        <td className="p-3 text-center font-semibold">
                          $ {totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong> {order.user.username}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong> {order.paymentMethod}
          </p>
          {order.isPaid ? (
            <Message variant="success">
              Paid on {new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: order.timeZone || 'Asia/Kolkata', 
              }).format(new Date(order.paidAt))}
            </Message>
          ) : (
            <Message variant="danger">Not paid</Message>
          )}

          {userInfo && userInfo.isAdmin && !order.isPaid && paymentMethod === "POD" && (
            <div>
              <button
                type="button"
                className=" btn btn-primary text-white w-full py-2 my-4"
                onClick={markPaidHandler}
                disabled={loadingMarkPaid}
              >
                {loadingMarkPaid ? "Marking as Paid..." : "Mark as Paid"}
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>$ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$ {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>$ {order.totalPrice}</span>
        </div>

        {!order.isPaid && paymentMethod === "PayPal" && (
          <div>
            {loadingPay && <Loader />}
            {isPending ? (
              <Loader />
            ) : (
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            )}
          </div>
        )}



        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="btn btn-primary text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
