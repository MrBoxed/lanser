import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-full w-full bg-slate-950">
      <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>

      <div className="flex flex-row items-center justify-center gap-5">
        <h2 className="p-4"> ERORR 404 </h2>
        <h2 className="p-4 border-l-2"> PAGE NOT FOUND </h2>
      </div>
    </div>
  );
};
export default ErrorPage;
