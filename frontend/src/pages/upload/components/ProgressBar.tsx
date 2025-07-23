const ProgressBar = ({ value }: { value: number }) => {

    return (
        <div className="w-full h-[10px] border-dashed bg-black/20 rounded-full relative">
            {/* Progress Bar fill */}
            <div
                style={{ width: `${value}%` }}
                className="h-full rounded-full bg-blue-600"
            />
        </div>
    );
};

export default ProgressBar;
