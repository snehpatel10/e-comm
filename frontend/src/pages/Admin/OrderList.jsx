import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  // Function to calculate expected delivery date (3 days after paid date)
  const calculateDeliveryDate = (paidDate) => {
    const date = new Date(paidDate);
    date.setDate(date.getDate() + 3); // Add 3 days to the paid date
    return date.toISOString().split("T")[0]; // Return in 'YYYY-MM-DD' format
  };

  return (
    <div className=" min-h-screen flex flex-col">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex-1 p-6 lg:ml-12"> {/* Add lg:ml-16 for left margin on large screens */}
          <AdminMenu />
          <div className="overflow-x-auto ">
            <table className="min-w-full text-gray-300">
              <thead className="border-b border-gray-700">
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
                  <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-800">
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
                            {order.orderItems[0].name} + {order.orderItems.length - 1} more items
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
                      {order.isPaid && !order.isDelivered ? (
                        calculateDeliveryDate(order.paidAt)
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <Link
                          to={`/order/${order._id}`}
                          className="text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          View Details
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
