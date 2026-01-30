import React from "react";
import { assets } from "../../assets/assets";

function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 bg-white pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={assets.logo} alt="LMS Logo" className="w-40" />
            <p className="text-sm/7 mt-6">
              Our LMS platform helps learners gain real-world skills through
              expert-led courses, hands-on projects, and career-focused learning
              paths. Learn anytime, anywhere at your own pace.
            </p>
          </div>

          {/* Company Links */}
          <div className="flex flex-col lg:items-center lg:justify-center">
            <div className="flex flex-col text-sm space-y-2.5">
              <h2 className="font-semibold mb-5 text-gray-800">Platform</h2>
              <a className="hover:text-slate-700 transition" href="#">
                About Us
              </a>
              <a className="hover:text-slate-700 transition" href="#">
                Courses
              </a>
              <a className="hover:text-slate-700 transition" href="#">
                Become an Instructor
              </a>
              <a className="hover:text-slate-700 transition" href="#">
                Help & Support
              </a>
              <a className="hover:text-slate-700 transition" href="#">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-5">Stay Updated</h2>
            <div className="text-sm space-y-6 max-w-sm">
              <p>
                Get updates on new courses, learning resources, and special
                offers straight to your inbox.
              </p>
              <div className="flex items-center gap-2 p-2 rounded-md bg-indigo-50">
                <input
                  className="focus:ring-2 bg-white ring-indigo-600 outline-none w-full max-w-64 py-2 rounded px-3"
                  type="email"
                  placeholder="Enter your email"
                />
                <button className="bg-indigo-600 px-4 py-2 text-white rounded hover:bg-indigo-700 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <p className="py-4 text-center border-t mt-8 border-slate-200">
          © 2025 <span className="font-medium text-slate-700">Yashrana</span>.
          All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Footer;
