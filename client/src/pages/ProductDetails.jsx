import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length && product) {
      const sameCategory = products.filter(
        (item) =>
          item.category === product.category &&
          item._id !== product._id
      );
      setRelatedProducts(sameCategory.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    if (product?.image?.length) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  if (!product) return null;

  return (
    <div className="mt-8 sm:mt-12 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1">
        <Link to="/">Home</Link> /
        <Link to="/products">Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {product.category}
        </Link>
        /
        <span className="text-primary truncate max-w-[150px] sm:max-w-none">
          {product.name}
        </span>
      </p>

      {/* Product Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Images */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 order-2 sm:order-1">
            {product.image.map((image, index) => (
              <button
                key={index}
                onClick={() => setThumbnail(image)}
                className={`border rounded overflow-hidden w-16 h-16 sm:w-20 sm:h-20
                ${
                  thumbnail === image
                    ? "border-primary"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt="thumb"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="border rounded overflow-hidden w-full max-w-md mx-auto">
            <img
              src={thumbnail}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={
                    i < 4
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  className="w-4"
                  alt=""
                />
              ))}
            <p className="text-sm ml-2">(4)</p>
          </div>

          {/* Price (WITH UNIT) */}
          <div className="mt-5">
            <p className="text-gray-500 line-through">
              {currency}
              {product.price}
              <span className="ml-1">/ kg</span>
            </p>

            <p className="text-2xl font-semibold text-primary">
              {currency}
              {product.offerPrice}
              <span className="text-sm text-gray-500 ml-1">
                / kg
              </span>
            </p>

            <span className="text-sm text-gray-500">
              (inclusive of all taxes)
            </span>
          </div>

          {/* Description */}
          <p className="text-base font-medium mt-6">
            About Product
          </p>
          <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1">
            {product.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3 font-medium bg-gray-100
              hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="w-full py-3 font-medium bg-primary
              text-white hover:bg-primary-dull transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <div className="text-center">
          <p className="text-2xl font-medium">
            Related Products
          </p>
          <div className="w-20 h-0.5 bg-primary mx-auto mt-2"></div>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
          gap-3 sm:gap-4 md:gap-6 mt-6"
        >
          {relatedProducts
            .filter((item) => item.inStock)
            .map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="block mx-auto mt-10 px-10 py-2.5 border rounded
          text-primary hover:bg-primary/10 transition"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
