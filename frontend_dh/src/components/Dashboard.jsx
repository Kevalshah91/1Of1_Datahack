import React from "react";
import SWOT from "./swot";
import Graph from "./graph";
import BasicTable from "./Table";

const Dashboard = () => {
  return (
    <div className="">
      <div className="flex w-full justify-center">
        <div className="w-1/2 mt-10">
          <SWOT />
        </div>
        <div className="w-1/2 mt-10">
          <Graph />
        </div>
      </div>
      <BasicTable />
    </div>
  );
};

export default Dashboard;
