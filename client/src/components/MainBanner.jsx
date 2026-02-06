import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Images */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="hidden md:block w-full object-cover max-h-[520px]"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="md:hidden w-full object-cover max-h-[520px]"
      />

      {/* Content Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end md:justify-center
        items-center md:items-start px-4 sm:px-6 md:px-12 lg:px-24 pb-16 md:pb-0"
      >
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold
          text-center md:text-left max-w-xl leading-snug"
        >
          Freshness You Can Trust, Savings You Will Love!
        </h1>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 font-medium">
          <Link
            to="/products"
            className="group flex items-center gap-2 px-8 py-3
            bg-primary hover:bg-primary-dull transition rounded text-white"
          >
            Shop Now
            <img
              className="transition group-hover:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>

          <Link
            to="/products"
            className="hidden md:flex items-center gap-2 px-8 py-3
            text-gray-800 hover:text-primary transition"
          >
            Explore deals
            <img
              className="transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
