import React from "react";
import IndexNavBar from "./IndexNavBar";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b]">
      <IndexNavBar />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl sm:text-5xl font-extrabold
            bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300
            text-transparent bg-clip-text"
          >
            Contact
          </h1>

          <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            A calm space for communication — built with care, patience,
            and quiet strength.
          </p>
        </div>

        {/* TWO CARDS (STACK ON MOBILE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT CARD */}
          <div
            className="rounded-2xl bg-[#020617]/80 backdrop-blur
            border border-violet-900/30 p-7 sm:p-9
            shadow-[0_0_40px_rgba(167,139,250,0.18)]"
          >
            <h2 className="text-2xl font-semibold text-violet-300 mb-6">
              Get in Touch
            </h2>

            <div className="space-y-5 text-slate-300 text-base">
              <div>
                <p className="text-violet-300 font-medium">📞 Mobile</p>
                <a
                  className="hover:text-violet-400 transition"
                >
                  9573696792
                </a>
              </div>

              <div>
                <p className="text-violet-300 font-medium">📧 Email</p>
                <a
                  className="hover:text-violet-400 transition"
                >
                  vikashmundakar@gmail.com
                </a>
              </div>

              <div>
                <p className="text-violet-300 font-medium">📧 Alternate</p>
                <a
                  className="hover:text-violet-400 transition"
                >
                  mvikash1630@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div
            className="rounded-2xl bg-[#020617]/80 backdrop-blur
            border border-violet-900/30 p-7 sm:p-9
            shadow-[0_0_40px_rgba(167,139,250,0.18)]"
          >
            <h2 className="text-2xl font-semibold text-violet-300 mb-6">
              Work & Projects
            </h2>

            <ul className="space-y-5 text-slate-300 text-base">
              <li>
                <span className="text-violet-300 font-medium">GitHub</span>
                <br />
                <a
                  href="https://github.com/vikash1630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet-400 transition underline-offset-4 underline"
                >
                  github.com/vikash1630
                </a>
              </li>

              <li>
                <span className="text-violet-300 font-medium">App 1</span>
                <br />
                <a
                  href="https://solo-levelling-fitness-model-app.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet-400 transition underline-offset-4 underline"
                >
                  Solo Levelling Fitness Model
                </a>
              </li>

              <li>
                <span className="text-violet-300 font-medium">App 2</span>
                <br />
                <a
                  href="https://ipl-analytics-dashboard-htof.onrender.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet-400 transition underline-offset-4 underline"
                >
                  IPL Analytics Dashboard
                </a>
              </li>

              <li>
                <span className="text-violet-300 font-medium">App 3</span>
                <br />
                <a
                  href="https://student-speaking-report.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet-400 transition underline-offset-4 underline"
                >
                  Student Speaking Report
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-14 text-center text-slate-500 text-sm">
          Built with care, calm, and quiet confidence.
        </p>
      </div>
    </div>
  );
};

export default Contact;
