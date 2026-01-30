import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

function CoursesSection() {
  const { allCourses } = useContext(AppContext);

  return (
    <section className="py-16 px-6 md:px-40 bg-gray-50">
      {/* Heading */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
          Learn from the best
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-3">
          Discover our top-rated courses across various categories. From coding
          and design to business and wellness, our courses are crafted to
          deliver real-world results.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Link
          to="/course-list"
          onClick={() => window.scrollTo(0, 0)}
          className="border border-gray-400 text-gray-600 px-10 py-3 rounded-full 
                     hover:bg-gray-800 hover:text-white transition"
        >
          Show all courses
        </Link>
      </div>
    </section>
  );
}

export default CoursesSection;
