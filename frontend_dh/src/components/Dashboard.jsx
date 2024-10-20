import React from "react";


import Graph from "./GraphComponent";
import SWOT from "./swot";

const Dashboard = () => {
  return (
    <div className="">
      <div className="flex w-full justify-center">
       
        <div className="w-1/2 mt-10">
        <SWOT/>
          <Graph/>
        </div>
 </div>
 </div>

  );
};

export default Dashboard;
