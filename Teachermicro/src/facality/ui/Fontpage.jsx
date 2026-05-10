import React from "react";
import { NavLink } from "react-router-dom";

const Fontpage = () => {
  return (
    <div className="bg-red-800 h-[100dvh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center justify-center">
        <NavLink
          to={"/faclity"}
          className={
            "border border-white p-7 flex flex-col items-center justify-center"
          }>
          <img src="/vite.svg" alt="" className="h-15 " />
          <h1 className="text-white p-3">faclity</h1>
        </NavLink>
      </div>
      <div className="flex items-center justify-center ">
        <NavLink
          to={"/Student"}
          className={
            "border border-white p-7 flex flex-col items-center justify-center"
          }>
          <img src="/vite.svg" alt="" className="h-15 " />
          <h1 className="text-white p-3">Student </h1>
        </NavLink>
      </div>
      <div className="flex items-center justify-center">
        <NavLink
          to={"/Admin"}
          className={
            "border border-white p-7 flex flex-col items-center justify-center"
          }>
          <img src="/vite.svg" alt="" className="h-15 " />
          <h1 className="text-white p-3">Admin </h1>
        </NavLink>
      </div>
    </div>
  );
};

export default Fontpage;
