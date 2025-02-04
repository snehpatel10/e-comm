import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const calculateDeliveryDate = (paidDate) => {
    const date = new Date(paidDate);
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
  };

  return (
    <div className="flex min-h-screen ml-[4rem]">
     
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-semibold text-white mb-8">My Orders</h2>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.error || error.error}</Message>
        ) : (
          <div className="space-y-8">
            {orders?.map((order) => (
              <div
                key={order._id}
                className="bg-[#4b445e] rounded-xl shadow-lg p-6 hover:bg-[#5d566e] transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Order ID: {order._id}</h3>
                    <p className="text-sm text-white">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white">
                      <strong>Status:</strong>{" "}
                      {order.isPaid ? (
                        <span className="text-green-400">Paid</span>
                      ) : (
                        <span className="text-red-400">Pending</span>
                      )}
                    </p>
                    <p className="text-white">
                      <strong>Delivery:</strong>{" "}
                      {order.isDelivered ? (
                        <span className="text-green-400">Delivered</span>
                      ) : (
                        <span className="text-yellow-400">Processing</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex items-center mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div>
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-400">
                          Qty: {item.qty} | Price: ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  {order.isPaid && !order.isDelivered && (
                    <p className="text-white">
                      <strong>Expected delivery date:</strong> {calculateDeliveryDate(order.paidAt)}
                    </p>
                  )}
                  {order.isDelivered && order.deliveredAt && (
                    <p className="text-white">
                      <strong>Delivered on:</strong> {formatDate(order.deliveredAt)}
                    </p>
                  )}
                  <p className="text-white">
                    <strong>Total:</strong> ₹{order.totalPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;