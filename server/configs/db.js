import mongoose from "mongoose";

const connectDB = async (req, res) => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("mongodb Database Connected"),
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/LMS-website`);
  } catch (error) {
    console.log(error.message);
  }
};
export default connectDB;
