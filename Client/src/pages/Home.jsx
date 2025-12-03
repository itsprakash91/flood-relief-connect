import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="text-center py-16 px-4 bg-linear-to-b from-blue-50 to-white">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        FloodRelief Connect
      </h1>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        A platform to connect flood victims, volunteers, and donors.  
        Help. Support. Rebuild lives — together.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/map"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          View Map
        </Link>
        <Link
          to="/donate"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
        >
          Donate Now
        </Link>
      </div>
    </section>
  );
}
