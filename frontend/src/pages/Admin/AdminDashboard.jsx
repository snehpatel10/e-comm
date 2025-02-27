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
import { SketchPicker } from "react-color"; // Color picker component
import { motion } from "framer-motion"; // Import framer-motion

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
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
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
        width: 2, // Added stroke width option
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
        show: true, // Option to show/hide grid lines
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
    chartType: "bar",
    chartColor: "#00E396",
    gridVisible: true,
    strokeWidth: 2,
    colorPickerVisible: false, // Track visibility of color picker
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

  const handleChartTypeChange = (e) => {
    const newType = e.target.value;
    setState((prevState) => ({
      ...prevState,
      chartType: newType,
      options: {
        ...prevState.options,
        chart: {
          ...prevState.options.chart,
          type: newType,
        },
      },
    }));
  };

  const handleColorChange = (color) => {
    setState((prevState) => ({
      ...prevState,
      chartColor: color.hex,
      options: {
        ...prevState.options,
        colors: [color.hex],
      },
    }));
  };

  const handleGridVisibilityChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      gridVisible: e.target.checked,
      options: {
        ...prevState.options,
        grid: {
          ...prevState.options.grid,
          show: e.target.checked,
        },
      },
    }));
  };

  const handleStrokeWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10);
    setState((prevState) => ({
      ...prevState,
      strokeWidth: newWidth,
      options: {
        ...prevState.options,
        stroke: {
          ...prevState.options.stroke,
          width: newWidth,
        },
      },
    }));
  };

  const toggleColorPicker = () => {
    setState((prevState) => ({
      ...prevState,
      colorPickerVisible: !prevState.colorPickerVisible,
    }));
  };

  return (
    <>
      <AdminMenu />

      <section className="flex justify-center items-center flex-col">
        <div className="w-full flex justify-center md:justify-around flex-wrap xl:ml-[1rem] md:ml-[0rem] space-y-4 md:space-y-0 mt-[4rem]">
          {/* Sales Card with animation */}
          <motion.div
            className="rounded-lg bg-black p-5 w-full sm:w-[18rem] md:w-[20rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-pink-500 flex items-center justify-center p-3">
              <FaDollarSign size={20} color="#fff" />
            </div>
            <p className="mt-5">Sales</p>
            <motion.h1
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              ${" "}
              {isLoading ? (
                <Loader />
              ) : (
                <motion.span
                  key={sales?.totalSales}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, type: "spring", stiffness: 100 }}
                >
                  {sales?.totalSales
                    ? parseFloat(sales.totalSales).toFixed(2)
                    : "0.00"}
                </motion.span>
              )}
            </motion.h1>
          </motion.div>

          {/* Customers Card with animation */}
          <motion.div
            className="rounded-lg bg-black p-5 w-full sm:w-[18rem] md:w-[20rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-pink-500 flex items-center justify-center p-3">
              <FaUsers size={20} color="#fff" />
            </div>
            <p className="mt-5">Customers</p>
            <motion.h1
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {isLoading ? (
                <Loader />
              ) : (
                <motion.span
                  key={customers?.length}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, type: "spring", stiffness: 100 }}
                >
                  {customers?.length}
                </motion.span>
              )}
            </motion.h1>
          </motion.div>

          {/* Orders Card with animation */}
          <motion.div
            className="rounded-lg bg-black p-5 w-full sm:w-[18rem] md:w-[20rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-pink-500 flex items-center justify-center p-3">
              <FaShoppingCart size={20} color="#fff" />
            </div>
            <p className="mt-5">All Orders</p>
            <motion.h1
              className="text-xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {isLoading ? (
                <Loader />
              ) : (
                <motion.span
                  key={orders?.totalOrders}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, type: "spring", stiffness: 100 }}
                >
                  {orders?.totalOrders}
                </motion.span>
              )}
            </motion.h1>
          </motion.div>
        </div>

        {/* Chart Type and Color Picker Controls */}
        <div className="mt-4 flex justify-center space-x-8">
          <div className="flex flex-col items-center">
            <label className="text-white">Chart Type</label>
            <select
              value={state.chartType}
              onChange={handleChartTypeChange}
              className="bg-black text-white p-2 rounded-md"
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="area">Area</option>
            </select>
          </div>

          <div className="flex flex-col items-center">
            <label className="text-white">Chart Color</label>
            <button
              onClick={toggleColorPicker}
              className="bg-black text-white p-2 rounded-md"
            >
              Select Color
            </button>
            {state.colorPickerVisible && (
              <SketchPicker
                color={state.chartColor}
                onChange={handleColorChange}
                disableAlpha={true}
              />
            )}
          </div>

          <div className="flex flex-col items-center">
            <label className="text-white">Grid Visibility</label>
            <input
              type="checkbox"
              checked={state.gridVisible}
              onChange={handleGridVisibilityChange}
              className="p-2"
            />
          </div>

          <div className="flex flex-col items-center">
            <label className="text-white">Stroke Width</label>
            <input
              type="range"
              min="1"
              max="5"
              value={state.strokeWidth}
              onChange={handleStrokeWidthChange}
              className="p-2"
            />
          </div>
        </div>

        {/* Chart with Animation */}
        <motion.div
          className="mt-[4rem] w-full xl:w-[75%] lg:w-[80%] md:w-[85%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Chart
            options={state.options}
            series={state.series}
            type={state.chartType}
            width="100%"
          />
        </motion.div>

        {/* Order List Section */}
        <div className="w-[100%] flex justify-center">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
