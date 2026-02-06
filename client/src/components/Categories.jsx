import React from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="text-2xl sm:text-3xl font-medium mb-6">
        Categories
      </h2>

      <div
        className="
          grid grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          xl:grid-cols-7
          gap-4 sm:gap-6
        "
      >
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
            style={{ backgroundColor: category.bgColor }}
            className="
              group cursor-pointer
              flex flex-col items-center justify-center
              rounded-xl
              px-3 py-4 sm:py-5
              transition
              hover:shadow-md
            "
          >
            <img
              src={category.image}
              alt={category.text}
              className="
                w-16 h-16
                sm:w-20 sm:h-20
                md:w-22 md:h-22
                object-contain
                transition
                group-hover:scale-110
              "
            />

            <p className="mt-2 text-sm sm:text-base font-medium text-center">
              {category.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
