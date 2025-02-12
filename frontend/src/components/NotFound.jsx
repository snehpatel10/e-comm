import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const errorDetails = {
    error: {
      code: 404,
      message: "Page Not Found",
      description: "Sorry, the page you are looking for doesn't exist."
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white">

      <div className="flex items-center space-x-8 p-8 max-w-5xl">
        <div className="w-1/3 flex justify-center">
          <img
            src="https://github.com/snehpatel10/image-resources/blob/main/hand-drawn-404-error.png?raw=true"
            alt="Sad PC"
            className="w-100 h-100 object-contain" 
          />
        </div>

        <div className="w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Oops! Something went wrong.</h2>
          <pre className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg text-sm font-mono w-full overflow-x-auto">
            <code>
              {JSON.stringify(errorDetails, null, 2)}
            </code>
          </pre>
          
          <div className="mt-6">
            <Link to="/" className="text-[#FF1493] hover:underline text-lg">
              Go Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
