import { assets, footerLinks } from "../assets/assets";
import grkLogo from "../assets/grk-solutions.svg";


const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-8 bg-primary/10">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        
        {/* Logo + Description */}
        <div className="flex flex-col gap-3">
        <img
          src={grkLogo}
          alt="GRK Solutions"
          className="h-28 md:h-32 lg:h-36 object-contain"
        />
        <p className="max-w-[410px] mt-4">
            GRKSolutions is a software solutions company specializing in building
            modern, scalable digital products. We design and develop high-quality
            websites and custom software solutions for individuals, startups, and
            organizations, helping them grow and succeed in the digital world.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="hover:underline transition">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="py-4 text-center text-sm md:text-base">
        Copyright {new Date().getFullYear()} ©{" "}
        <a href="#">GRKSolutions</a> All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
