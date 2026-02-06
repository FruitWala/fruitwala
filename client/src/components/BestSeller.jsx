import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();

  return (
    <section className="mt-14 sm:mt-16">
      {/* Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
        Best Sellers
      </h2>

      {/* Product Grid */}
      <div
        className="
        mt-5 sm:mt-6
        grid grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-3 sm:gap-4 md:gap-6
      "
      >
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </section>
  );
};

export default BestSeller;
