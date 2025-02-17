import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/userApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { FaDollarSign, FaUsers, FaShoppingCart } from "react-icons/fa";

import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "bar",
        fontFamily: "Quicksand, sans-serif", 
        foreColor: "#fff", 
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
      }
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
        formatter: (value) => parseFloat(value).toFixed(2),
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          color: "#fff", 
        },
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: "#fff", 
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales",
          style: {
            color: "#fff", 
          },
        },
        min: 0,
        labels: {
          formatter: (value) => parseFloat(value).toFixed(2),
          style: {
            color: "#fff", 
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: "#fff",
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="flex justify-center items-center flex-col">
        {/* Wrap the stats cards in a flex container with responsive classes */}
        <div className="w-full flex justify-center md:justify-around flex-wrap xl:ml-[4rem] md:ml-[0rem] space-y-4 md:space-y-0">
          {/* Sales Card */}
          <div className="rounded-lg bg-black p-5 w-full sm:w-[18rem] md:w-[20rem]">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-pink-500 flex items-center justify-center p-3">
              <FaDollarSign size={20} color="#fff" />
            </div>
            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              ${" "}
              {isLoading ? (
                <Loader />
              ) : sales?.totalSales ? (
                parseFloat(sales.totalSales).toFixed(2)
              ) : (
                "0.00"
              )}
            </h1>
          </div>

          {/* Customers Card */}
          <div className="rounded-lg bg-black p-5 w-full sm:w-[18rem] md:w-[20rem]">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-pink-500 flex items-center justify-center p-3">
              <FaUsers size={20} color="#fff" />
            </div>
            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {isLoading ? <Loader /> : customers?.length}
            </h1>
          </div>

          {/* Orders Card */}
          <div className="rounded-lg bg-black p-5 w-full sm:w-[18rem] md:w-[20rem]">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-pink-500 flex items-center justify-center p-3">
              <FaShoppingCart size={20} color="#fff" />
            </div>
            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {isLoading ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        {/* Sales Chart Section */}
        <div className="mt-[4rem] w-full xl:w-[75%] lg:w-[80%] md:w-[85%]">
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="100%"
          />
        </div>

        {/* Order List Section */}
        <div className="mt-[4rem] w-full flex justify-center">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
