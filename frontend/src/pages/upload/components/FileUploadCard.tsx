import { BookText, FileAudio, FileVideo, X } from 'lucide-react'
import ProgressBar from './ProgressBar'

interface FileUploadProgressProps {
    filename: string,
    fileType: string,
    uploadProgress: number,
    startUploading: boolean,
    uploadComplete: boolean,
    cancelUploadingFile: () => void,
    cancelSelectedFile: () => void,
}

function GetImageType(type: string, size: number) {

    if (type == 'video')
        return <FileVideo size={size} />

    else if (type == 'audio')
        return <FileAudio size={size} />

    else if (type == 'application')
        return <BookText size={size} />
}

const FileUplaodProgress = ({
    filename,
    fileType,
    startUploading,
    uploadProgress,
    uploadComplete,
    cancelSelectedFile,
    cancelUploadingFile,
}: FileUploadProgressProps) => {

    // ::: Function to Cancel selection or uploading file :::
    function CancelUpload() {
        return startUploading ? cancelUploadingFile() : cancelSelectedFile();
    }

    function GetProgress() {
        return Math.max(1, Math.min(100, uploadProgress));
    }


    return (
        <div
            className='w-full h-full'>

            {/* ::: CARD ::: */}
            <div className='w-full h-fit flex flex-col gap-2 bg-white/30 rounded-xl p-4'>

                <div className='relative w-full h-full flex gap-2 items-center'>

                    {/* ::: FILE ICON ::: */}
                    <div>
                        {GetImageType(fileType, 32)}
                    </div>

                    {/* :: FILE NAME :: */}
                    <div className='w-full mr-10 overflow-hidden'>
                        {filename}
                    </div>

                    {/* Delete btn */}
                    <div
                        onClick={CancelUpload}
                        className='w-[32px] bg-black/50 hover:bg-black rounded-full p-2 absolute right-0 top-0'>
                        <X size={16} />
                    </div>
                </div>

                <div >{
                    startUploading &&
                    (!uploadComplete &&
                        <ProgressBar value={GetProgress()} />)
                }</div>

            </div>
        </div>
    )
}

export default FileUplaodProgress