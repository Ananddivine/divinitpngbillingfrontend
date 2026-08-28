import React from "react";

export const BarChartSkeleton = () => {
  return (
    <div className="h-[300px] w-full flex items-end space-x-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-gray-300 w-1/6 h-[50px] rounded-lg"
          style={{
            height: `${Math.random() * 150 + 50}px`, // Random bar heights
            animation: `pulse-animation 1.5s infinite ease-in-out alternate ${idx * 0.1}s`
          }}
        ></div>
      ))}
    </div>
  );
};

export const PieChartSkeleton = () => {
  return (
    <div className="h-[300px] w-[300px] rounded-full bg-gradient-to-r from-gray-300 to-gray-200 animate-spin border-8 border-gray-200 border-t-gray-400"></div>
  );
};
