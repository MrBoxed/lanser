import { Check, Home } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface SuccessProps {
    reuploadFunc: () => void,
}

const Success = ({ reuploadFunc }: SuccessProps) => {

    const navigate = useNavigate();

    const handleGoToHome = () => {
        navigate('/home')
    }

    const handleUploadMore = () => {
        reuploadFunc()
    }

    return (
        <div className='w-full h-full flex flex-col gap-5 items-center justify-center bg-white/20 rounded-2xl'>


            <Check
                size={32}
                className='w-fit h-fit bg-white/20 rounded-full p-4'
            />

            <p
                className='text-xl font-semibold'
            >
                File uploaded successfully
            </p>

            <div className='w-full flex justify-evenly'>
                <button
                    onClick={handleGoToHome}
                    className='w-[120px] px-4 py-2 font-semibold bg-transparent border-1 hover:bg-white/30  rounded-full'
                >
                    Home
                </button>
                <button
                    onClick={handleUploadMore}
                    className='w-fit px-4 py-2 font-semibold bg-transparent border-1 hover:bg-white/30  rounded-full'
                >
                    Uplaod More
                </button>
            </div>
        </div >
    )
}

export default Success