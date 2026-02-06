import React from "react";
import { assets, features } from "../assets/assets";

const BottomBanner = () => {
  return (
    <section className="relative mt-16 sm:mt-24">
      {/* Background Images */}
      <img
        src={assets.bottom_banner_image}
        alt="banner"
        className="w-full hidden md:block"
      />
      <img
        src={assets.bottom_banner_image_sm}
        alt="banner"
        className="w-full md:hidden"
      />

      {/* Content Overlay */}
      <div
        className="
          absolute inset-0
          flex flex-col
          items-center md:items-end
          justify-start md:justify-center
          px-4 sm:px-6 md:pr-24
          pt-10 sm:pt-14 md:pt-0
        "
      >
        <div className="max-w-md md:max-w-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-4 sm:mb-6 text-center md:text-left">
            Why We are the Best?
          </h2>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 sm:gap-4"
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex-shrink-0"
                />

                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomBanner;
