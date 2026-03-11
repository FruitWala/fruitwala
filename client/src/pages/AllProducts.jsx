import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {

  const { products = [], searchQuery = "" } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {

    const query = searchQuery.trim().toLowerCase();

    const result = products.filter((product) => {

      if (!product?.inStock) return false;

      if (!query) return true;

      return product?.name?.toLowerCase().includes(query);

    });

    setFilteredProducts(result);

  }, [products, searchQuery]);

  return (
    <div className="mt-8 sm:mt-12 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">

      {/* Heading */}
      <div className="flex flex-col items-start w-full">
        <p className="text-xl sm:text-2xl font-medium uppercase">
          All Products
        </p>

        <div className="w-16 h-0.5 bg-primary rounded-full mt-1"></div>
      </div>

      {/* Products Grid */}
      <div
        className="
        grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
        gap-3 sm:gap-4 md:gap-6 mt-6
        "
      >

        {filteredProducts.map((product) => (

          <ProductCard
            key={product._id}
            product={product}
          />

        ))}

      </div>

    </div>
  );
};

export default AllProducts;
