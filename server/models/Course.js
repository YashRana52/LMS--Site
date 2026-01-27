import mongoose from "mongoose";

/*  Lecture Schema*/

const lectureSchema = new mongoose.Schema(
  {
    lectureId: {
      type: String,
      required: true,
    },
    lectureTitle: {
      type: String,
      required: true,
    },
    lectureDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    lectureUrl: {
      type: String,
      required: true,
    },
    isPreviewFree: {
      type: Boolean,
      default: true,
    },
    lectureOrder: {
      type: Number,
      required: true,
      index: true,
    },
  },
  { _id: false },
);

/*
   Chapter Schema
 */
const chapterSchema = new mongoose.Schema(
  {
    chapterId: {
      type: String,
      required: true,
    },
    chapterTitle: {
      type: String,
      required: true,
    },
    chapterOrder: {
      type: Number,
      required: true,
      index: true,
    },
    chapterContent: {
      type: [lectureSchema],
      default: [],
    },
  },
  { _id: false },
);

//    Course Schema

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
    },

    courseDescription: {
      type: String,
      required: true,
    },

    courseThumbnail: {
      type: String,
    },

    coursePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    courseContent: {
      type: [chapterSchema],
      default: [],
    },

    courseRatings: [
      {
        userId: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],

    educator: {
      type: String,
      ref: "User",
      required: true,
    },

    enrolledStudents: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  },
);

export const Course = mongoose.model("Course", courseSchema);
