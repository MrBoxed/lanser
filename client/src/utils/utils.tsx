import { UploadTypes } from "./utilTypes";

/// ::: Funcition to get file type name
export function GetFileType(uploadedFile: File): string | null {

    try {

        // this will get  "video/mp4" ->  "video"
        const category: string = uploadedFile.type.split('/')[0];
        if (category.toUpperCase() == UploadTypes.VIDEO) {
            return UploadTypes.VIDEO;
        }
        else if (category.toUpperCase() == UploadTypes.AUDIO) {
            return UploadTypes.AUDIO;
        }
        else if (category.toUpperCase() == UploadTypes.APPLICATION) {
            return UploadTypes.APPLICATION;
        }

    } catch (error) {
        console.log("Error determining the file type !");
    }

    return null;
}