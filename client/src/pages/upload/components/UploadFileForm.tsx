import { LoaderCircle, UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormDataType } from "../Upload";


export interface UploadFileFormProps {
  file: File,
  filename: string,
  startUpload: boolean,
  formData: FormDataType,
  SubmitFunction: () => Promise<void>,
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>
}

const FileCategory: string[] = ["movie", "music", "document", "books", "video", "image"];

function UploadFileForm({ file, startUpload, SubmitFunction, formData, setFormData }: UploadFileFormProps) {

  const [tags, setTags] = useState<string>("");
  const [fileName, setFileName] = useState<string>(file.name.split('.')[0]);
  const [category, setCategory] = useState<string>("");
  const [makePublic, setMakePublic] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [userFormData, setUserFormData] = useState<FormDataType | null>(null);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: FormDataType = {
      tags: tags,
      name: fileName,
      category: category,
      filesize: file.size,
      isPublic: makePublic,
      description: description,
    }
    setFormData(data);
    setUserFormData(data);
  };

  useEffect(() => {

    if (userFormData != null)
      SubmitFunction();


  }, [userFormData]);


  return (
    !startUpload &&
    <form

      onSubmit={handleSubmit}
      className="w-full h-full justify-center flex flex-col gap-2 bg-white/10 rounded-2xl p-4" >

      {/* <h2 className="text-xl font-bold">Data</h2> */}

      <input
        type="text"
        readOnly={startUpload}
        name="fileName"
        placeholder="File Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        required
        className="w-full min-h-6 bg-black/50 rounded-md p-2 read-only:cursor-not-allowed "
      />

      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full min-h-6 bg-black/50  rounded-md p-2"
      >
        {
          FileCategory.map((category, key) => {
            return (
              <option key={key} value={category}>{category.toUpperCase()}</option>
            )
          })}
      </select>

      <textarea
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full min-h-6 bg-black/50  rounded-md p-2"
      />

      <input
        type="text"
        name="tags"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full min-h-6 bg-black/50 rounded-md p-2"

      />


      <label
        className="w-full min-h-6 text-lg flex items-center space-x-2 mt-2"
      >
        <input
          type="checkbox"
          name="isPublic"
          checked={makePublic}
          onChange={(e) => { setMakePublic(e.target.checked) }}
          className="w-5 h-5 checked:bg-blue-600 peer-checked:to-blue-600:"
        />
        <span>Make Public</span>
      </label>

      <button
        type="submit"
        disabled={startUpload}
        className="w-full flex gap-3 items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-800/70 disabled:cursor-not-allowed">

        {
          !startUpload
            ? (<>
              <UploadIcon />
              <span>Uplaod</span>
            </>)
            : (<>
              <LoaderCircle size={32} className="animate-spin" />
            </>)
        }
      </button>
    </form >
  );
};

export default UploadFileForm;
