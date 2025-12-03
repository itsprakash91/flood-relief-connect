import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHelpRequestById } from "../api/helpRequests";
import { toast } from "react-hot-toast";

export default function RequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await getHelpRequestById(id);
        setRequest(res);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load request details");
      }
    };
    fetchRequest();
  }, [id]);

  if (!request)
    return <p className="text-center mt-8 text-gray-600">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        {request.title}
      </h2>
      <p className="text-gray-600 mb-4">{request.description}</p>
      <p>
        <strong>Location:</strong> {request.location?.address || "N/A"}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`font-semibold ${
            request.status === "open" ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {request.status}
        </span>
      </p>
      <p className="mt-4">
        <strong>Contact:</strong> {request.contact || "N/A"}
      </p>
    </div>
  );
}
