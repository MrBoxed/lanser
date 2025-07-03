import { Upload, UploadIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  showBtn: boolean,
  btnFunction: React.Dispatch<React.SetStateAction<boolean>>
}

function UploadNavButton({ showBtn, btnFunction }: Props) {

  const [show, setShow] = useState<boolean>(showBtn);
  const navigate = useNavigate();

  const handleClick = () => {
    btnFunction(!show);
    setShow(false)
    navigate("/upload");

  }

  return (
    show && (
      <button
        onClick={handleClick}
        type="button"
        className="font-semibold group flex flex-row rounded-full items-center gap-2 py-2 px-4 bg-black hover:bg-violet-950 transition duration-300 ease-in-out transform"
      >
        <div>Upload</div>
        <UploadIcon />
      </button>
    )
  );

}


export default UploadNavButton;
