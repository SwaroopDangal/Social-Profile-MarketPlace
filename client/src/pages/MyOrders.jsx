/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { dummyOrders } from "../assets/assets";
import toast from "react-hot-toast";

const MyOrders = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    setOrders(dummyOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const mask = (val, type) => {
    if (!val && val !== 0) return "-";
    return type.toLowerCase() === "password" ? "*".repeat(8) : String(val);
  };
  const copy = async (txt) => {
    if (!txt) return toast.error("Nothing to copy");
    try {
      await navigator.clipboard.writeText(txt);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Copy failed");
    }
  };
  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2Icon className="size-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="px-4 md:px-24 lg:px-24 xl:px-32">
        <div className="max-w-2xl mx-auto mt-14 bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-semibold">No orders yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            You haven't purchased any listings yet.
          </p>
        </div>
      </div>
    );
  }

  return <div>MyOrders</div>;
};

export default MyOrders;
