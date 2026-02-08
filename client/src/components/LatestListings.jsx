import React from "react";
import Title from "./Title";

const LatestListings = () => {
  return (
    <div className="mt-20 mb-8">
      <Title
        title={"Latest Listings"}
        description={
          "Discover the hottest social profiles available right now."
        }
      />
      <div className="flex flex-col gap-6 px-6"></div>
    </div>
  );
};

export default LatestListings;
