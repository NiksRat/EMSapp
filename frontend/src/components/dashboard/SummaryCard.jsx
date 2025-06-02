import React from 'react';

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-gray-100 p-1">
      <div className="flex bg-white rounded-lg">
        <div className={`text-3xl flex justify-center items-center ${color} text-white px-4 py-4`}>
          {icon}
        </div>
        <div className="pl-4 py-2">
          <p className="text-lg font-semibold text-gray-700">{text}</p>
          <p className="text-xl font-bold text-gray-900">{number}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
