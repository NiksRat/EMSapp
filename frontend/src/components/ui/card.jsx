import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => (
  <div className="mb-4 border-b pb-2">
    {children}
  </div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-800">
    {children}
  </h2>
);

export const CardContent = ({ children }) => (
  <div className="text-gray-700">
    {children}
  </div>
);
