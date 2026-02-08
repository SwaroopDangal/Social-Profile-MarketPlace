import React from "react";

const Title = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      <p className="max-w-125 text-slate-600">{description}</p>
    </div>
  );
};

export default Title;
