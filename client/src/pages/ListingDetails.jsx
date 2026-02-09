import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileLink } from "../assets/assets";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2Icon } from "lucide-react";

const ListingDetails = () => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const profilelink =
    listing && getProfileLink(listing.platform, listing.username);

  const { listingId } = useParams();
  const { listings } = useSelector((state) => state.listing);

  const listing = useMemo(() => {
    return listings.find((listing) => listing.id === listingId);
  }, [listingId, listings]);

  return listing ? (
    <div></div>
  ) : (
    <div className="h-screen flex justify-center items-center">
      <Loader2Icon className="size-7 animate-spin text-indigo-600" />
    </div>
  );
};

export default ListingDetails;
