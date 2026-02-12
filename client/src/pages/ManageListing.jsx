import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

const ManageListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userListings } = useSelector((state) => state.listing);
  const [loadingListing, setLoadingListing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    platform: "",
    username: "",
    followers_count: "",
    engagement_rate: "",
    monthly_views: "",
    niche: "",
    price: "",
    description: "",
    verified: false,
    monetized: false,
    country: "",
    age_range: "",
    images: [],
  });
  const platforms = [
    "youtube",
    "instagram",
    "tiktok",
    "facebook",
    "twitter",
    "linkedin",
    "pinterest",
    "snapchat",
    "twitch",
    "discord",
  ];

  const niches = [
    "lifestyle",
    "fitness",
    "food",
    "travel",
    "tech",
    "gaming",
    "fashion",
    "beauty",
    "business",
    "education",
    "entertainment",
    "music",
    "art",
    "sports",
    "health",
    "finance",
    "other",
  ];

  const ageRanges = [
    "13-17 years",
    "18-24 years",
    "25-34 years",
    "35-44 years",
    "45-54 years",
    "55+ years",
    "Mixed ages",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    if (files.length + formData.images.length > 5) {
      return toast.error("You can only upload 5 images");
    }
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!id) return;
      setIsEditing(true);
      setLoadingListing(true);
      const listing = userListings.find((item) => item.id === id);
      if (listing) {
        setFormData(listing);
        setLoadingListing(false);
      } else {
        toast.error("Listing not found");
        navigate("/my-listings");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  if (loadingListing) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2Icon className="size-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  return <div>ManageListing</div>;
};

export default ManageListing;
