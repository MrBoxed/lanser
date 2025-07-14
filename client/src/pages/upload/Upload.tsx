import React, { DragEvent, SetStateAction, useEffect, useState } from "react";

import DragNDrop from "./DragNDrop.js";
import { FileUp, ShieldAlert, CheckCircle } from "lucide-react";
import UploadForm from "./UploadFileForm.js";
import StepIndicator from "./StepIndicator.js";
import { div } from "framer-motion/client";
import UploadFileForm from "./UploadFileForm.js";
import { instance } from "../../config/ApiService.js";


// Defining in parent 
export interface DragNDropProps {

  // setFileSelected: React.Dispatch<SetStateAction<boolean>>,
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>,

}



// ::::::::::::::::::::::::
// ::: MAIN UPLOAD PAGE :::

function UploadFile() {

  const [filename, setFilename] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [privacy, setPrivacy] = useState("Everybody on project");

  const [sendCopy, setSendCopy] = useState<boolean>(false);


  // :: For file drag and drop or select file input
  const [selectedFile, setSelectedFile] = useState<File | null>(null);



  /// ::: HANDLER FUNCTIONS :::
  const handleUpload = () => { };
  const handleFileChange = () => { };
  const handleDrag = (e: DragEvent<HTMLFormElement>) => { };

  const handleFileUpload = () => { }

  function HandleUploadForm() {
    // Drag N Drop 
    if (selectedFile) {
      HandleSubmit();
    }

    return <DragNDrop setSelectedFile={setSelectedFile} />
  }

  // TODO::

  async function HandleSubmit() {

    const uploadData: FormData = new FormData();
    selectedFile && uploadData.append("file", selectedFile);


    const response = await instance.post("/upload", uploadData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (response) {
      console.log(response);
    }

  }


  return (
    // Whole page
    <div className="h-screen  w-screen flex items-center justify-center">

      {/* Card container */}
      <div className="h-[70%] w-[90%] sm:w-2/3 lg:w-1/2 rounded-xl p-4 bg-violet-700/50 flex flex-col">

        {/* Card Heading */}
        <h2 className="text-2xl font-bold font-sans p-2">

          <StepIndicator currentStep={2} />
        </h2>
        <hr />

        {/* MAIN */}
        <div className="w-full h-full flex flex-row flex-wrap md:flex-nowrap p-3 gap-3">

          {/* ::: SECTION FOR ALL DATAT ::: */}
          <div className="w-full h-full">
            {HandleUploadForm()}
          </div>

        </div>
      </div>
    </div>
  );
}

export default UploadFile;
