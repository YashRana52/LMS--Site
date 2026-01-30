import React, { useContext, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/students/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/students/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/students/Footer";

function CoursesList() {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();

  const filteredCourses = useMemo(() => {
    if (!allCourses || allCourses.length === 0) return [];

    if (!input) return allCourses;

    return allCourses.filter((course) =>
      course.courseTitle.toLowerCase().includes(input.toLowerCase()),
    );
  }, [allCourses, input]);

  return (
    <>
      <section className="relative md:px-36 px-6 pt-20 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Explore Courses
            </h1>
            <p className="text-gray-500 mt-1">
              <span
                onClick={() => navigate("/")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Home
              </span>{" "}
              / Course List
            </p>
          </div>

          <SearchBar data={input} />
        </div>

        {/* Active Filter Badge */}
        {input && (
          <div className="inline-flex items-center gap-3 px-4 py-2 mt-8 border rounded-full bg-gray-50 text-gray-700">
            <span className="text-sm font-medium">{input}</span>
            <img
              src={assets.cross_icon}
              alt="Clear"
              onClick={() => navigate("/course-list")}
              className="w-4 h-4 cursor-pointer hover:scale-110 transition"
            />
          </div>
        )}

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-16">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center my-24 text-center">
            <img
              src={assets.empty_icon || assets.search_icon}
              alt="No courses"
              className="w-28 mb-6 opacity-80"
            />
            <h2 className="text-xl font-semibold text-gray-700">
              No Courses Found
            </h2>
            <p className="text-gray-500 mt-2">
              Try searching with a different keyword
            </p>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default CoursesList;
