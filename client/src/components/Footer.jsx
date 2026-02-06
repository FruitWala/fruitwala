import { footerLinks } from "../assets/assets";
import grkLogo from "../assets/grk-solutions.svg";

const Footer = () => {
  return (
    <footer className="bg-primary/10 mt-10">
      <div className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-600">
          
          {/* Logo + Description */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4 max-w-md">
            <img
              src={grkLogo}
              alt="GRK Solutions"
              className="h-20 sm:h-24 md:h-28 object-contain"
            />

            <p className="text-sm sm:text-base leading-relaxed">
              GRKSolutions is a technology-driven software company specializing
              in the design and development of modern, scalable digital products.
              We build high-quality websites and custom software solutions for individuals,
              startups, and growing businesses, enabling them to innovate, scale, 
              and succeed in today’s digital landscape.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 md:justify-items-end">
            {footerLinks.map((section, index) => (
              <div key={index} className="text-left">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        className="hover:underline transition"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright */}
        <p className="py-4 text-center text-xs sm:text-sm md:text-base text-gray-600">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium">GRKSolutions</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
