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
  const [selectedVariant, setSelectedVariant] = useState(null);

  const product = products.find((item) => item._id === id);

  /* ================= RELATED PRODUCTS ================= */

  useEffect(() => {

    if (!product || !products.length) return;

    const sameCategory = products.filter(
      (item) =>
        item.category === product.category &&
        item._id !== product._id
    );

    setRelatedProducts(sameCategory.slice(0, 5));

  }, [products, product]);

  /* ================= DEFAULT VARIANT ================= */

  useEffect(() => {

    if (!product) return;

    if (product.variants?.length) {
      setSelectedVariant(product.variants[0]);
    } else {

      /* fallback variant for old products */

      setSelectedVariant({
        label: "Default",
        price: product.price,
        offerPrice: product.offerPrice
      });

    }

  }, [product]);

  /* ================= THUMBNAIL ================= */

  useEffect(() => {

    if (product?.image?.length) {
      setThumbnail(product.image[0]);
    }

  }, [product]);

  if (!product) return null;

  const price = selectedVariant?.offerPrice || product.offerPrice;
  const originalPrice = selectedVariant?.price || product.price;

  /* ================= IMAGE OPTIMIZER ================= */

  const optimizeImage = (url, width, height = null) => {

    if (!url || !url.includes("/upload/")) return url;

    const [base, path] = url.split("/upload/");

    if (!height) {
      return `${base}/upload/f_auto,q_auto,w_${width}/${path}`;
    }

    return `${base}/upload/f_auto,q_auto:eco,c_fill,w_${width},h_${height}/${path}`;

  };

  /* ================= ADD TO CART ================= */

  const handleAddToCart = () => {

    if (!selectedVariant) return;

    addToCart(product._id, selectedVariant);

  };

  const handleBuyNow = () => {

    if (!selectedVariant) return;

    addToCart(product._id, selectedVariant);
    navigate("/cart");

  };

  return (

    <div className="mt-8 sm:mt-12 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">

      {/* BREADCRUMB */}

      <p className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1">

        <Link to="/">Home</Link> /

        <Link to="/products">Products</Link> /

        <Link to={`/products/${product.category.toLowerCase()}`}>
          {product.category}
        </Link> /

        <span className="text-primary truncate max-w-[150px] sm:max-w-none">
          {product.name}
        </span>

      </p>

      {/* PRODUCT SECTION */}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

        {/* IMAGES */}

        <div className="flex flex-col sm:flex-row gap-4">

          {/* THUMBNAILS */}

          <div className="flex sm:flex-col gap-3 order-2 sm:order-1">

            {product.image.map((image, index) => (

              <button
                key={index}
                onClick={() => setThumbnail(image)}
                className={`border rounded overflow-hidden w-16 h-16 sm:w-20 sm:h-20
                ${thumbnail === image ? "border-primary" : "border-gray-300"}`}
              >

                <img
                  src={optimizeImage(image, 150, 150)}
                  alt="thumb"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

              </button>

            ))}

          </div>

          {/* MAIN IMAGE */}

          <div className="border rounded overflow-hidden w-full max-w-md mx-auto">

            <img
              src={thumbnail ? optimizeImage(thumbnail, 800) : ""}
              alt={product.name}
              className="w-full h-full object-contain"
            />

          </div>

        </div>

        {/* PRODUCT INFO */}

        <div className="w-full lg:w-1/2">

          <h1 className="text-2xl sm:text-3xl font-semibold">
            {product.name}
          </h1>

          {/* RATING */}

          <div className="flex items-center gap-1 mt-2">

            {Array(5).fill("").map((_, i) => (

              <img
                key={i}
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                className="w-4"
                alt=""
              />

            ))}

            <p className="text-sm ml-2">(4)</p>

          </div>

          {/* PRICE */}

          <div className="mt-5">

            <p className="text-gray-500 line-through">
              {currency}{originalPrice}
            </p>

            <p className="text-2xl font-semibold text-primary">

              {currency}{price}

              <span className="text-sm text-gray-500 ml-2">
                ({selectedVariant?.label})
              </span>

            </p>

            <span className="text-sm text-gray-500">
              (inclusive of all taxes)
            </span>

          </div>

          {/* VARIANTS */}

          {product.variants?.length > 0 && (

            <div className="mt-6">

              <p className="text-sm font-medium mb-2">
                Select Option
              </p>

              <div className="flex gap-3 flex-wrap">

                {product.variants.map((variant, index) => (

                  <button
                    key={index}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-1.5 border rounded text-sm transition
                    ${
                      selectedVariant?.label === variant.label
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >

                    {variant.label}

                  </button>

                ))}

              </div>

            </div>

          )}

          {/* DESCRIPTION */}

          <p className="text-base font-medium mt-6">
            About Product
          </p>

          <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1">

            {product.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}

          </ul>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <button
              onClick={handleAddToCart}
              className="w-full py-3 font-medium bg-gray-100 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-3 font-medium bg-primary text-white hover:bg-primary-dull transition"
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

      {/* RELATED PRODUCTS */}

      <div className="mt-16">

        <div className="text-center">

          <p className="text-2xl font-medium">
            Related Products
          </p>

          <div className="w-20 h-0.5 bg-primary mx-auto mt-2"></div>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mt-6">

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
          className="block mx-auto mt-10 px-10 py-2.5 border rounded text-primary hover:bg-primary/10"
        >
          See More
        </button>

      </div>

    </div>

  );

};

export default ProductDetails;
