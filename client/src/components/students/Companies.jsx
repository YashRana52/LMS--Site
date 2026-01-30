import React from "react";

function Companies() {
  const companyLogos = [
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
  ];

  return (
    <div className="py-10 bg-white">
      <p className="text-center text-gray-500 text-sm mb-6 uppercase tracking-wide">
        Trusted by learners from
      </p>

      {/* Animation CSS */}
      <style>{`
        .marquee {
          display: flex;
          width: max-content;
          animation: marqueeScroll 15s linear infinite;
        }

        .marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="relative overflow-hidden max-w-6xl mx-auto select-none">
        {/* Left fade */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />

        {/* Marquee content */}
        <div className="marquee">
          {[...companyLogos, ...companyLogos].map((company, index) => (
            <img
              key={index}
              src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
              alt={`${company} logo`}
              className="h-10 md:h-12 mx-8 opacity-70 hover:opacity-100 transition-opacity duration-300"
              draggable={false}
            />
          ))}
        </div>

        {/* Right fade */}
        <div className="absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export default Companies;
