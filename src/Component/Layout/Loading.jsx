import React from "react";

const Loading = () => {
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <div className="text-2xl">
          <div
            className="animate-bounce  inline-block w-25 h-25 "
            role="status"
          >
            <img src="favicon.ico" alt="" width="500" height="500" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
