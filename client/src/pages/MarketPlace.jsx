import React, { useState } from "react";
import { ArrowLeftIcon, FilterIcon, Verified } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import FilterSidebar from "../components/FilterSidebar";

const MarketPlace = () => {
  const [showFilterPhone, setShowFilterPhone] = useState(false);
  const [filters, setFilters] = useState({
    platform: null,
    maxPrice: 100000,
    minFollowers: 0,
    niche: null,
    verified: false,
    monetized: false,
  });
  const { listings } = useSelector((state) => state.listing);
  const filterListings = listings.filter((listing) => {
    return true;
  });
  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex items-center justify-between text-slate-500">
        <button
          onClick={() => {
            navigate("/");
            scrollTo(0, 0);
          }}
          className="flex items-center gap-2 py-5"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Home
        </button>
        <button
          onClick={() => setShowFilterPhone(true)}
          className="flex sm:hidden items-center gap-2 py-5"
        >
          <FilterIcon className="size-4" />
          Filters
        </button>
      </div>
      <div className="relative flex items-start justify-between gap-8 pb-8">
        <FilterSidebar
          showFilterPhone={showFilterPhone}
          setShowFilterPhone={setShowFilterPhone}
          filters={filters}
          setFilters={setFilters}
        />
        <div className="flex-1 grid xl:grid-cols-2 gap-4">
          {filterListings
            .sort((a, b) => (a.featured ? -1 : b.featured ? 1 : 0))
            .map((listing) => (
              <ListingCard listing={listing} key={listing.id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
