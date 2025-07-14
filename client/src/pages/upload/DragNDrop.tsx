import { CloudUpload, FileUp, FileUpIcon, Filter } from "lucide-react";
import React, { DragEvent, useState, useRef, useEffect, MouseEventHandler, SetStateAction, createElement } from "react";

import { DragNDropProps } from "./Upload";
import { GetFileType } from "../../utils/utils";


// TODO: 
//  user can upload via drag n drop or choosing
// 
// PARENT: 
//    tells the parent file type:
//    provide the file to parent
//    



function DragNDrop({ setSelectedFile }: DragNDropProps) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<Array<File>>([]);
  const [file, setFile] = useState<File | null>(null);


  useEffect(() => {

    if (file != null)
      setSelectedFile(file);

  }, [file]);

  // ::: Function to handle drag & drop ::: 
  const handleDrop = (event: DragEvent<HTMLFormElement>) => {

    event.preventDefault();

    const droppedFiles: FileList = event.dataTransfer.files;

    if (droppedFiles.length > 1) {
      // ::: Get file type for mulitple files :::
      handleMulipleUpload(droppedFiles)
    }


    else {
      setFile(droppedFiles[0]);
      console.log(droppedFiles[0].type)
      console.log(droppedFiles[0]);

    }

  };

  /// ::: Function to handle multiple file Upload ::: 
  const handleMulipleUpload = (droppedFiles: FileList) => {

    const newFiles: Array<File> = Array.from(droppedFiles);

    // Merge existing files with new ones, avoiding duplicates by name
    const allFilesMap = new Map<string, File>();

    // Add existing files
    multipleFiles.forEach(file => allFilesMap.set(file.name, file));

    // Add new files (overwriting if name already exists)
    newFiles.forEach(file => allFilesMap.set(file.name, file));

    // Convert back to array
    const mergedFiles = Array.from(allFilesMap.values());

    setMultipleFiles(mergedFiles);

    console.log(mergedFiles);
  }

  // ::: function to handle the click to upload :::
  const handleClick = () => {
    fileInputRef?.current?.click();
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const selectedFiles = event.target.files;

    if (selectedFiles) {

      setFile(selectedFiles[0]);
      console.log(Array.from(selectedFiles));
      // Get file type::

      console.log(selectedFiles[0].type);

    }
  };


  return (

    <section
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(event: DragEvent) => event.preventDefault()}
      className="h-full w-full cursor-pointer flex flex-col bg-white/20 border-dashed border-2 border-slate-400 rounded-xl p-4 items-center justify-center">

      <CloudUpload size={64} />

      <div>
        Drag and drop your file here
      </div>

      <p className="font-semibold justify-center items-center">
        Click to upload
      </p>


      <input
        type="file"
        name="inputFile"
        multiple={false}
        onChange={handleFileChange}
        hidden
        ref={fileInputRef}
      />
    </section>


  );
}

export default DragNDrop;
