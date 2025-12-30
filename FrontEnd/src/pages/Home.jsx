import React from "react";
import UserNavBar from "../components/UserNavBar";
import NearbySearchBar from "../components/NearbySearchBar";
import Allproducts from "../components/Allproducts";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* 🌈 SINGLE CONTINUOUS BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/30" />

      <div className="relative z-10">
        <UserNavBar />
        <NearbySearchBar />
        <Allproducts />
      </div>
    </div>
  );
};

export default Home;
