import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  console.log(orders);

  const calculateDeliveryDate = (paidDate) => {
    const date = new Date(paidDate);
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
  };

  return (
    <div className="flex min-h-screen bg-[#121212] ml-[4rem]">
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-semibold text-white mb-8">My Orders</h2>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.error || error.error}</Message>
        ) : orders?.length === 0 ? (
          <Message variant="info">You haven't ordered anything yet!</Message>
        ) : (
          <div className="space-y-8">
            {orders?.map((order) => (
              <div
                key={order._id}
                className="card bg-[#2a2a2a] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-xl"
              >
                <div className="card-body p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Order ID: {order._id}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Ordered on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white">
                        <strong>Status:</strong>{" "}
                        {order.isPaid ? (
                          <span className="text-green-400 hover:text-green-500 transition-colors duration-200">
                            Paid
                          </span>
                        ) : (
                          <span className="text-red-400 hover:text-red-500 transition-colors duration-200">
                            Pending
                          </span>
                        )}
                      </p>
                      <p className="text-white">
                        <strong>Delivery:</strong>{" "}
                        {order.isDelivered ? (
                          <span className="text-green-400 hover:text-green-500 transition-colors duration-200">
                            Delivered
                          </span>
                        ) : (
                          <span className="text-yellow-400 hover:text-yellow-500 transition-colors duration-200">
                            Processing
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 space-y-4">
                    {order.orderItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-4 hover:bg-[#3b3b3b] p-2 rounded-md transition-all duration-200"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="text-white font-semibold">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.qty} | Price: $ {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-600 pt-4">

                    {order.paymentMethod === 'POD' && !order.isDelivered &&(<p className="text-white">
                        <strong>Expected delivery date:</strong> {calculateDeliveryDate(order.createdAt)}
                      </p>)}
                    {order.paymentMethod === 'PayPal' &&order.isPaid && !order.isDelivered && (
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
                      <strong>Total:</strong> $ {order.totalPrice}
                    </p>
                  </div>
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
