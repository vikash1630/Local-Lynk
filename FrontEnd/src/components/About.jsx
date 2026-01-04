import React from "react";
import IndexNavBar from "./IndexNavBar";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b0f1a] via-[#12080f] to-[#0a0408]">
      <IndexNavBar />

      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* 🌸 HEADER */}
        <div className="text-center mb-14">
          <h1
            className="text-4xl sm:text-5xl font-extrabold
            bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200
            text-transparent bg-clip-text"
          >
            About LocalLynk
          </h1>

          <p className="mt-4 text-rose-200/70 text-lg max-w-3xl mx-auto">
            Connecting people with trusted local products through
            location-aware technology and community-driven commerce.
          </p>
        </div>

        {/* 🌙 MAIN CONTENT */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* LEFT */}
          <div
            className="rounded-2xl bg-[#14070e]/70 backdrop-blur-xl
            border border-rose-900/30 p-8
            shadow-[0_0_60px_rgba(251,113,133,0.18)]"
          >
            <h2 className="text-2xl font-semibold text-pink-300 mb-4">
              Why LocalLynk?
            </h2>

            <p className="text-rose-100/80 leading-relaxed mb-4">
              Modern marketplaces often prioritize large vendors,
              making it difficult for local sellers and nearby buyers
              to find each other efficiently.
            </p>

            <p className="text-rose-100/80 leading-relaxed">
              <span className="text-pink-300 font-medium">LocalLynk</span>{" "}
              bridges this gap by enabling users to discover products
              available in their vicinity, fostering trust, speed,
              and community-based commerce.
            </p>
          </div>

          {/* RIGHT */}
          <div
            className="rounded-2xl bg-[#14070e]/70 backdrop-blur-xl
            border border-rose-900/30 p-8
            shadow-[0_0_60px_rgba(251,113,133,0.18)]"
          >
            <h2 className="text-2xl font-semibold text-pink-300 mb-4">
              What We Offer
            </h2>

            <ul className="space-y-3 text-rose-100/80">
              <li>• Location-based product discovery</li>
              <li>• Secure authentication (Email & Google)</li>
              <li>• Community-driven buying & selling</li>
              <li>• Real-time interactions and updates</li>
              <li>• Clean, mobile-first user experience</li>
            </ul>
          </div>
        </div>

        {/* 🌸 TECHNOLOGY SECTION */}
        <div
          className="mt-14 rounded-2xl bg-[#14070e]/70 backdrop-blur-xl
          border border-rose-900/30 p-8
          shadow-[0_0_60px_rgba(251,113,133,0.18)]"
        >
          <h2 className="text-2xl font-semibold text-pink-300 mb-4">
            Built with an Engineering-First Mindset
          </h2>

          <p className="text-rose-100/80 leading-relaxed mb-4">
            LocalLynk is designed using modern full-stack practices,
            focusing on scalability, security, and performance.
          </p>

          <p className="text-rose-100/80 leading-relaxed">
            From structured APIs and authentication flows to responsive
            UI and location intelligence, every component is built
            with real-world production use in mind.
          </p>
        </div>

        {/* 🌙 FOOTER LINE */}
        <p className="mt-16 text-center text-rose-200/50 text-sm">
          LocalLynk — Empowering local commerce through technology.
        </p>
      </div>
    </div>
  );
};

export default About;
