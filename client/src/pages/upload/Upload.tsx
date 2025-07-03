import React, { DragEvent, useEffect, useState } from "react";

import DragNDrop from "./DragNDrop.js";
import { FileUp } from "lucide-react";
import UploadForm from "./UploadFileForm.js";

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [privacy, setPrivacy] = useState("Everybody on project");
  const [sendCopy, setSendCopy] = useState(false);

  const handleUpload = () => { };
  const handleFileChange = () => { };
  const handleDrag = (e: DragEvent<HTMLFormElement>) => { };

  return (
    // Whole page
    <div className="h-full w-full flex items-center justify-center">

      {/* Card container */}
      <div className="h-fit w-[90%] sm:w-2/3 rounded-xl p-4 bg-violet-700/50 flex flex-col">

        {/* Card Heading */}
        <h2 className="text-2xl font-bold font-sans p-2">Upload Files</h2>
        <hr />

        {/* MAIN */}
        <div className="flex flex-row flex-wrap md:flex-nowrap p-3 gap-3">

          {/* MAIN :Drag N Drop Input */}
          <div className="w-full h-full bg-white/20 border-dashed border-2 border-slate-400 rounded-xl p-4">
            <DragNDrop />
          </div>
          {/* MAIN : Details about input file :::: TO BE INCLUDED LATER :::: */}
          {/* <div className="h-full w-full bg-white/20 rounded-xl p-4">
             <UploadForm /> 
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
