import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyListings = () => {
  const { userListings, balance } = useSelector((state) => state.listing);
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();

  const totalValue = userListings.reduce((sum, listing) => {
    return sum + (listing.price || 0);
  }, 0);

  const activeListings = userListings.filter(
    (listing) => listing.status === "active",
  ).length;
  const soldListings = userListings.filter(
    (listing) => listing.status === "sold",
  ).length;

  return <div>MyListings</div>;
};

export default MyListings;
