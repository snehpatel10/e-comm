import React, { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { LuRefreshCw } from "react-icons/lu";
import { FaEllipsisH } from "react-icons/fa";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, refetch, isLoading, error } = useGetOrdersQuery();
  const [refresh, setRefresh] = useState(false)

  const handleRefresh = () => {
    setRefresh(true)
    setTimeout(() => {
      refetch();
      setRefresh(false)
    }, 1000)

  };

  const calculateDeliveryDate = (paidDate) => {
    const date = new Date(paidDate);
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen flex flex-col mt-[4rem]">
      {!isLoading && (<div className="p-4 flex justify-end mr-[5rem]">
        <button
          onClick={handleRefresh}
          disabled={refresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 flex items-center justify-center gap-2"
        >
          <LuRefreshCw
            className={`w-3 h-3 ${refresh ? 'animate-spin-slow' : ''} transition-transform duration-300`}
          />
          <span>{refresh ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>)}


      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex-1 p-6">
          {/* Adjust the AdminMenu position */}
          <div className="relative z-10">
            <AdminMenu />
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table text-gray-300">
              <thead className="border-b border-gray-700 text-base sticky top-0 bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Items</th>
                  <th className="px-6 py-3 text-left">Total Price</th>
                  <th className="px-6 py-3 text-left">Paid Status</th>
                  <th className="px-6 py-3 text-left">Delivery Status</th>
                  <th className="px-6 py-3 text-left">Expected Delivery</th>
                  <th className="px-6 py-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-700 hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">{order._id}</td>
                    <td className="px-6 py-4">
                      {order.orderItems.length === 1 ? (
                        <div className="flex items-center">
                          <img
                            src={order.orderItems[0].image}
                            alt={order.orderItems[0].name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <span className="ml-4">{order.orderItems[0].name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <img
                            src={order.orderItems[0].image}
                            alt={order.orderItems[0].name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <span className="ml-4">
                            {order.orderItems[0].name} +{" "}
                            {order.orderItems.length - 1} more items
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">${order.totalPrice}</td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="text-green-400">Paid</span>
                      ) : (
                        <span className="text-red-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.isDelivered ? (
                        <span className="text-green-400">Delivered</span>
                      ) : (
                        <span className="text-red-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.paymentMethod === "POD" && !order.isDelivered
                        ? calculateDeliveryDate(order.createdAt)
                        : order.paymentMethod === "PayPal" && order.isPaid && !order.isDelivered
                          ? calculateDeliveryDate(order.paidAt)
                          : "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          <FaEllipsisH className="text-normal font-normal" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
