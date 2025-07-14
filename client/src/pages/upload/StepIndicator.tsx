import { Check } from "lucide-react";
import { uploadSteps } from "../../utils/constants";


interface StepIndicatorProps {
    currentStep: number;
}

const steps = uploadSteps;

export default function StepIndicator({ currentStep }: StepIndicatorProps) {

    return (
        <div className="relative">
            <div className="flex justify-between items-center">

                {steps.map((step) => (

                    <div
                        key={step.id}
                        className="flex flex-col items-center justify-center">

                        <div
                            className={`z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all shadow ${currentStep === step.id
                                ? "bg-muted text-primary border-2 border-primary"
                                : currentStep > step.id
                                    ? "bg-slate-700 text-primary-foreground"
                                    : "bg-muted text-foreground"
                                }`}
                        >
                            {currentStep > step.id ? (
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

        </div>
    )


}