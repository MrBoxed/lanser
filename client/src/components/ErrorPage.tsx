import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="flex flex-row items-center justify-center gap-1">
        <h2 className="p-4"> ERORR 404 </h2>
        <h2 className="p-4 border-l-2"> PAGE NOT FOUND </h2>
      </div>
    </div >
  );
};
export default ErrorPage;
