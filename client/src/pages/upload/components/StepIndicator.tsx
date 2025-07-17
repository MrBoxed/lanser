import { Check } from "lucide-react";
import { uploadSteps } from "../../../utils/constants";


interface StepIndicatorProps {
    currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {

    return (
        <div className="relative rounded-2xl">
            <div className="flex justify-between items-center">

                {uploadSteps.map((step) => (
                    <div
                        key={step.id}
                        className="flex flex-col items-center justify-center">

                        <div
                            className={`z-1 flex items-center justify-center w-10 h-10 rounded-full transition-all shadow 
                                ${currentStep === step.id
                                    ? "bg-black/50 text-primary border-2 border-primary"
                                    : currentStep > step.id
                                        ? "bg-white/50 text-primary-foreground"
                                        : "bg-black/50 text-foreground"
                                }`}
                        >
                            {((currentStep > step.id) || currentStep == 3) ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <span>{step.id}</span>
                            )}
                        </div>
                        <span
                            className={`mt-2 text-xs font-medium transition-colors ${currentStep === step.id ? "text-primary" : "text-foreground"
                                }`}
                        >
                            {step.name}
                        </span>
                    </div>
                ))}

            </div>
            {/* <div className="absolute top-5 left-5 right-0 h-[2px] bg-black/30 -z-0" />
            <div
                className="absolute top-5 left-5 h-[1px] bg-white -z-0 transition-all"
                style={{
                    width: `${((currentStep - 1) / (uploadSteps.length - 1)) * 100}%`,
                }}
            /> */}


        </div >
    )


}