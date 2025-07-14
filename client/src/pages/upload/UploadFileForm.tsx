import React from "react";


export interface UploadFileFormProps {
  filename: string,

}

// TODO:
//    Filename for uploadedfile

// IF :: VIDEO ::
//  Category  ::
//  Thumbnail for the file if its video

// LATER:::


function UploadFileForm({ handleSubmit }) {

  return (
    <div className="h-full w-full cursor-pointer flex flex-col bg-white/20 rounded-xl p-4 items-center justify-center">
      <div className="w-full h-full flex items-center flex-col justify-center">
        {/* INPUT FIELD FOR TITLE */}
        <div className="relative">
          <input
            id="title"
            name="title"
            type="text"
            placeholder=""
            className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-white transition-colors focus:outline-none peer bg-inherit"
          />
          <label
            htmlFor="username"
            className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-white peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
          >
            Filename / Title
          </label>
        </div>

        <button className="w-1/2 h-fit rounded-full m-4"
          onClick={() => handleSubmit()}>Upload File</button>
      </div>
    </div>
  );
}

export default UploadFileForm;
