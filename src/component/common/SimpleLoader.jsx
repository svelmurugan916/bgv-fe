import React from "react";

const SimpleLoader = ({ size = "md", className = "" }) => {
    // Size mapping
    const sizes = {
        xs: "w-4 h-4 border-2",
        sm: "w-6 h-6 border-2",
        md: "w-10 h-10 border-[3px]",
        lg: "w-16 h-16 border-4"
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`
                    ${sizes[size] || sizes.md}
                    border-slate-100 
                    border-t-[#5D4591] 
                    rounded-full 
                    animate-spin
                `}
            />
        </div>
    );
};

export default SimpleLoader;