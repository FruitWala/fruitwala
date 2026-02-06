import React from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <div className="mt-6 sm:mt-10">
      
      {/* Banner stays full-width */}
      <MainBanner />

      {/* Content sections wrapper */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 space-y-16">
        <Categories />
        <BestSeller />
      </div>

      {/* Bottom banner full-width */}
      <BottomBanner />

      {/* Newsletter section */}
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
        <NewsLetter />
      </div>
    </div>
  );
};

export default Home;
