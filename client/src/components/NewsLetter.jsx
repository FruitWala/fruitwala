const NewsLetter = () => {
  return (
    <section className="mt-12 sm:mt-16 pb-10 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Never Miss a Deal!
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl">
          Subscribe to get the latest offers, new arrivals, and exclusive discounts
        </p>

        {/* Form */}
        <form
          className="
            flex flex-col sm:flex-row
            items-stretch sm:items-center
            w-full max-w-2xl
            mt-4
          "
        >
          <input
            className="
              border border-gray-300
              px-4 py-3
              text-sm sm:text-base
              outline-none
              text-gray-700
              rounded-md sm:rounded-r-none
              w-full
            "
            type="email"
            placeholder="Enter your email id"
            required
          />

          <button
            type="submit"
            className="
              mt-3 sm:mt-0
              sm:ml-0
              px-6 sm:px-10
              py-3
              bg-primary
              hover:bg-primary-dull
              transition
              text-white
              text-sm sm:text-base
              rounded-md sm:rounded-l-none
              whitespace-nowrap
            "
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsLetter;
