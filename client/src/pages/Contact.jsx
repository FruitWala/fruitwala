import fruitwala from "../assets/fruitwala.svg";
import grklogo from "../assets/grk-solutions.svg";

const Contact = () => {
  return (
    <div className="mt-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 pb-16">

      {/* HEADING */}

      <div className="flex flex-col items-end w-max mb-12">
        <p className="text-2xl font-semibold uppercase tracking-wide">
          Contact Us
        </p>
        <div className="w-20 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* CONTACT CARDS */}

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl">

        {/* ================= SELLER ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition overflow-hidden">

          {/* DETAILS */}

          <div className="p-6 space-y-3 text-sm">

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Seller Details
            </h2>

            <p>
              <span className="text-gray-500">Seller Name:</span>{" "}
              <span className="font-medium text-gray-800">
                Sumit Singh
              </span>
            </p>

            <p>
              <span className="text-gray-500">Shop Name:</span>{" "}
              <span className="font-medium text-gray-800">
                FruitWala.in
              </span>
            </p>

            <p className="leading-relaxed">
              <span className="text-gray-500">Shop Address:</span>{" "}
              Opposite Uninav Height Rajnagar Extension Ghaziabad (201003)
            </p>

            <p>
              <span className="text-gray-500">Email:</span>{" "}
              <a
                href="mailto:sumit981807@gmail.com"
                className="text-primary hover:underline"
              >
                sumit981807@gmail.com
              </a>
            </p>

            <p>
              <span className="text-gray-500">Contact:</span>{" "}
              +91-9818076461, +91-9625756096
            </p>

          </div>

          {/* LOGO */}

          <div className="flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">

            <img
              src={fruitwala}
              alt="FruitWala"
              className="h-20 sm:h-24 object-contain"
            />

          </div>

        </div>

        {/* ================= DEVELOPER ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition overflow-hidden">

          {/* DETAILS */}

          <div className="p-6 space-y-3 text-sm">

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Developer Details
            </h2>

            <p>
              <span className="text-gray-500">Company:</span>{" "}
              <span className="font-medium text-gray-800">
                GRKSolutions
              </span>
            </p>

            <p>
              <span className="text-gray-500">Developer:</span>{" "}
              <span className="font-medium text-gray-800">
                Gaurav Kori
              </span>
            </p>

            <p>
              <span className="text-gray-500">Address:</span>{" "}
              <span className="font-medium text-gray-800">
                Nandgram Ghaziabad (201003)
              </span>
            </p>

            <p>
              <span className="text-gray-500">Email:</span>{" "}
              <a
                href="mailto:gourav.813060.gv@gmail.com"
                className="text-primary hover:underline"
              >
                gourav.813060.gv@gmail.com
              </a>
            </p>

            <p>
              <span className="text-gray-500">Contact:</span>{" "}
              +91-8130604065
            </p>

            <p>
              <span className="text-gray-500">LinkedIn:</span>{" "}
              <a
                href="https://www.linkedin.com/in/gaurav-kori/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                linkedin.com/in/gaurav-kori
              </a>
            </p>

          </div>

          {/* LOGO */}

          <div className="flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">

            <img
              src={grklogo}
              alt="GRKSolutions"
              className="h-20 sm:h-24 object-contain"
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;
