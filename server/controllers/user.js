import { Course } from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import Stripe from "stripe";

//get user data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not Found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to get user data",
    });
  }
};

//user Enrolled Courses With lecture links
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();

    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to get user data",
    });
  }
};

//puchase course

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const { origin } = req.headers;
    const userId = req.auth.userId;

    const userData = await User.findById(userId);

    const courseData = await Course.findById(courseId);
    if (!userData || !courseData) {
      return res.json({
        success: false,
        message: "data not found",
      });
    }

    const discountAmount = (courseData.discount * courseData.coursePrice) / 100;

    const finalAmount = Number(
      (courseData.coursePrice - discountAmount).toFixed(2),
    );

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: finalAmount,
    };

    const newPurchase = await Purchase.create(purchaseData);

    //stripe Gate way initialise

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    //creating line item for stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}`,

      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to create payment",
    });
  }
};

//update user course progress

export const updateUserCourseProgress = async (req, res) => {
  try {
    const { userId } = req.auth();

    const { courseId, lectureId } = req.body;

    const progressData = await CourseProgress.findOne({ userId, courseId });
    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "lecture already completed",
        });
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        courseId,
        userId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({
      success: true,
      message: "progress updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to update progress",
    });
  }
};

//get user course progress

export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.auth();

    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({
      success: true,
      progressData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "error.message",
    });
  }
};

//Add User rating to course

export const addUserRating = async (req, res) => {
  try {
    const { userId } = req.auth();

    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "invalid details",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({
        success: false,
        message: "Course not found",
      });
    }

    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User not purchased this course.",
      });
    }
    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId,
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    res.json({
      success: true,
      message: "Rating added",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to add rating ",
    });
  }
};
