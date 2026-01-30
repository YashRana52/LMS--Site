import React, { useEffect, useState } from "react";

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rohit Kumar",
      role: "B.Tech Student, Delhi",
      rating: 5,
      date: "15 Jan 2026",
      text: "This LMS helped me understand complex programming concepts easily. The structured courses and recorded lectures are extremely helpful.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Anjali Verma",
      role: "Frontend Developer, TCS",
      rating: 5,
      date: "02 Feb 2026",
      text: "The course quality is excellent and very practical. I built real-world projects and improved my confidence as a developer.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Mohit Sharma",
      role: "Final Year Student, IET Lucknow",
      rating: 4,
      date: "18 Feb 2026",
      text: "The LMS dashboard is simple and easy to use. Quizzes and assignments helped me track my learning progress properly.",
      img: "https://randomuser.me/api/portraits/men/65.jpg",
    },
    {
      id: 4,
      name: "Sneha Iyer",
      role: "UI/UX Designer, Freelancer",
      rating: 5,
      date: "05 Mar 2026",
      text: "The design and learning experience are top-notch. Everything feels modern, clean, and easy to navigate.",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 5,
      name: "Aman Gupta",
      role: "Full Stack Developer",
      rating: 5,
      date: "20 Mar 2026",
      text: "This platform saved me a lot of time. Learning, practice, and revision — everything in one place.",
      img: "https://randomuser.me/api/portraits/men/76.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 3 >= testimonials.length ? 0 : prev + 3));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev - 3 < 0 ? Math.max(testimonials.length - 3, 0) : prev - 3,
    );
  };

  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 >= testimonials.length ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl font-semibold text-gray-900">
          Trusted by Learners Across India 🇮🇳
        </h2>
        <p className="text-gray-600 mt-3 max-w-md mx-auto">
          Real feedback from students and professionals learning on our LMS.
        </p>

        {/* Desktop Controls */}
        <div className="hidden md:flex justify-end gap-2 mt-4">
          <button
            onClick={handlePrev}
            className="h-10 w-10 rounded-lg border bg-white hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="h-10 w-10 rounded-lg border bg-white hover:bg-gray-100"
          >
            →
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {testimonials
            .slice(currentIndex, isMobile ? currentIndex + 1 : currentIndex + 3)
            .map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {Array(item.rating)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                  </div>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>

                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  {item.text}
                </p>

                <div className="flex items-center gap-4 mt-6">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Mobile dots */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                index === currentIndex ? "bg-gray-800" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
