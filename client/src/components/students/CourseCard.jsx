import React, { useContext, useMemo } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

function CourseCard({ course }) {
  const { currency, calculateRating, navigate } = useContext(AppContext);

  const rating = useMemo(
    () => calculateRating(course),
    [course, calculateRating],
  );

  const finalPrice = useMemo(() => {
    return Math.round(
      course.coursePrice - (course.discount * course.coursePrice) / 100,
    );
  }, [course]);

  return (
    <div
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        navigate(`/course/${course._id}`);
      }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md 
                 hover:shadow-xl hover:-translate-y-1 transition-all 
                 duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          className="w-full h-44 object-cover"
        />

        {course.discount > 0 && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            {course.discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition">
          {course.courseTitle}
        </h3>

        {/* Educator */}
        <p className="text-sm text-gray-500">
          {course.educator?.name || "Yash Rana"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium text-gray-700">{rating}</span>

          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.round(rating) ? assets.star : assets.star_blank}
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>

          <span className="text-gray-400">
            ({course.courseRatings?.length || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-lg font-bold text-indigo-600">
            {currency} {finalPrice}
          </p>

          {course.discount > 0 && (
            <p className="text-sm text-gray-400 line-through">
              {currency} {course.coursePrice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
