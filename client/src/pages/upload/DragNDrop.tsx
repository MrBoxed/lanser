import { CloudUpload, FileUp, FileUpIcon, Filter } from "lucide-react";
import React, { DragEvent, useState, useRef, useEffect, MouseEventHandler } from "react";

function DragNDrop() {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<Array<File>>([]);
  const [files, setFile] = useState<File>();


  // ::: Function to handle drag & drop ::: 
  const handleDrop = (event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();

    const droppedFiles: FileList = event.dataTransfer.files;

    if (droppedFiles.length > 1) {
      handleMulipleUpload(droppedFiles)
    }

    else {
      setFile(droppedFiles[0]);
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
      console.log(Array.from(selectedFiles));
    }
  };

  return (

    <section
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(event: DragEvent) => event.preventDefault()}
      className="h-full w-full cursor-pointer flex flex-col gap-2 items-center justify-center">

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
        title=""
        value=""
      />
    </section>


  );
}

export default DragNDrop;
