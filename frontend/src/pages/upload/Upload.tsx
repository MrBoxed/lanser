import { useEffect, useState } from "react";
import StepIndicator from "./components/StepIndicator.js";
import UploadFileForm from "./components/UploadFileForm.js";
import { instance } from "../../config/ApiService.js";
import FileUploadCard from "./components/FileUploadCard.js";
import DragNDrop from "./components/DragNDrop.js";

import AnimatedContent from "../../components/common/AnimatedContent.js";
import Success from "./components/Success.js";
import type { MovieFormType } from "./components/forms/MovieForm";
import { CategoryType } from "@/utils/enum.types.js";
import type { MusicFormType } from "./components/forms/MusicForm.js";
import type { BookFormType } from "./components/forms/BookForm.js";


/// ::::::::::::::::::::::::::::::::;
///  ::: FORM UPLOAD TYPE ::::
/// ::::::::::::::::::::::::::::::::;
export type FormDataType = {
  category: CategoryType;
  filesize: number;
  movieData?: MovieFormType | null;
  musicData?: MusicFormType | null;
  bookData?: BookFormType | null;
};


function UploadPage() {

  // :: For Upload ::
  const [filename, setFilename] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [formData, setFormData] = useState<FormDataType>({
    category: CategoryType.NONE,
    filesize: 0,
    movieData: null,
    musicData: null,
    bookData: null,
  });

  // :: For file drag and drop or select file input
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [shouldUpload, setShouldUpload] = useState<boolean>(false);

  const [formStepIndicator, setFormStepIndicator] = useState<number>(1);


  // :: Cancelling token for aborting uplaod ::
  const controller = new AbortController();

  // :::::::::::::::::::::::::::::::::::::::::
  //  ::: USE EFFECTS FOR HANDLING CHANGE ::: 
  // :::::::::::::::::::::::::::::::::::::::::
  useEffect(() => {

    if (selectedFile != null) {

      setFilename(selectedFile.name);

      setFileType(selectedFile.type.split('/')[0]);

      setFormStepIndicator(formStepIndicator + 1);
    }

  }, [selectedFile])


  // ::: Use Effect when upload complete :::
  useEffect(() => {
    if (!uploadComplete || formStepIndicator !== 2) return;

    setFormStepIndicator(3);



  }, [uploadComplete, formStepIndicator]);


  // ::: Function to RESET all states :::
  function ResetAllData() {

    setFilename("");
    setFileType("");
    setFormData({
      category: CategoryType.NONE,
      filesize: 0,
      movieData: null,
      musicData: null,
      bookData: null,
    });

    setSelectedFile(null);

    setUploadProgress(0);
    setUploadComplete(false);
    setShouldUpload(false);

    setFormStepIndicator(1);
  }

  // :: Function to Cancel Selected file :::
  function CancelUploadingFile() {
    controller.abort();
    CancelSelectedFile();
  }

  // :: Function to Cancel Selected file :::
  function CancelSelectedFile() {
    ResetAllData()
  }

  // :: Function to do Reupload :::
  function ReuploadFiles() {
    ResetAllData();
  }

  // :: Function to handle upload process :: 
  function HandleUploadPages() {

    if (selectedFile == null && formStepIndicator == 1) {
      return (<>
        <div className="w-full min-h-[300px]">
          <AnimatedContent
            distance={100}
            direction="horizontal"
            reverse={false}
            duration={0.3}
            ease="power.out"
            initialOpacity={0.2}
            animateOpacity
            scale={1}
            threshold={0.2}
            delay={0.1}
          >

            < DragNDrop
              setSelectedFile={setSelectedFile} />
          </AnimatedContent>
        </div >
      </>
      )
    }

    else if (formStepIndicator == 2) {

      if (!selectedFile) {
        console.log("File error");
        return <></>
      }

      return (
        <AnimatedContent
          distance={100}
          direction="horizontal"
          reverse={false}
          duration={0.3}
          ease="power.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1}
          threshold={0.2}
          delay={0.1}
        >

          <div
            className="w-full h-full flex flex-col lg:flex-row gap-2 bg-white/10 rounded-2xl p-2">
            {/* UPLOADING FILE */}
            <div className="w-full h-fit lg:w-1/2 lg:h-full  rounded-2xl bg-slate-800/10">
              <FileUploadCard
                fileType={fileType}
                filename={filename}
                uploadComplete={uploadComplete}
                uploadProgress={uploadProgress}
                startUploading={shouldUpload}
                cancelUploadingFile={CancelUploadingFile}
                cancelSelectedFile={CancelSelectedFile} />
            </div>

            {/* FORM */}
            <div className="w-full h-full lg:w-2/3">
              <UploadFileForm
                file={selectedFile}
                filename={filename}
                startUpload={shouldUpload}
                formData={formData}
                setFormData={setFormData}
                SubmitFunction={HandleSubmit}
              />
            </div>
          </div>
        </AnimatedContent>
      )
    }

    else if (formStepIndicator == 3) {

      return (
        <AnimatedContent
          distance={100}
          direction="horizontal"
          reverse={false}
          duration={0.3}
          ease="power.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1}
          threshold={0.2}
          delay={0.1}
        >
          <div className="w-full h-[300px]">
            <Success reuploadFunc={ReuploadFiles} />
          </div>

        </AnimatedContent >
      )
    }
  }

  // :: Sending Uploaded file and data to server :::
  const HandleSubmit = async () => {

    if (!selectedFile) {
      return console.log("file not found");
    }

    setShouldUpload(true);

    const uploadData: FormData = new FormData();
    uploadData.append("file", selectedFile);

    if (formData.category === CategoryType.MOVIE && formData.movieData?.thumbnail) {
      uploadData.append("thumbnail", formData.movieData.thumbnail);
    }

    else if (formData.category === CategoryType.MUSIC && formData.musicData?.thumbnail) {
      uploadData.append("thumbnail", formData.musicData.thumbnail);
    }

    else if (formData.category === CategoryType.BOOKS && formData.bookData?.thumbnail) {
      uploadData.append("thumbnail", formData.bookData.thumbnail);
    }

    uploadData.append("data", JSON.stringify(formData));

    console.log("uplodingData:" + JSON.stringify(formData));

    // ::: Configuring the axios request ::: 
    const config = {
      headers: {
        'Content-Type': "multipart/form-data"
      },
      signal: controller.signal,
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total) {
          const progressPercentage = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progressPercentage); // Update the progress state
        }
      }
    };


    // Beginning the request :)
    try {
      if (formData.category == CategoryType.NONE) {
        throw new Error("File category null");
      }
      const response = await instance.post("/upload", uploadData, config);

      if (response.status != 500) {
        setUploadComplete(true);
      }

    } catch (error) {
      console.error("Error Uploading file:" + error);
    }

  }

  return (
    // Whole page
    <div className="h-dvh w-full flex text-white items-center justify-center">

      {/* Card container */}
      <div className="h-fit w-[90%] md:w-2/3 lg:w-1/2 rounded-xl p-4 bg-violet-700/50 flex flex-col">

        {/* Card Heading */}
        <h2 className="text-2xl font-bold font-sans px-4 py-2">
          <StepIndicator currentStep={formStepIndicator} />
        </h2>

        <hr className="mx-2" />

        {/* MAIN */}
        <div className="w-full h-full flex flex-row flex-wrap md:flex-nowrap p-2 ">
          {HandleUploadPages()}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
