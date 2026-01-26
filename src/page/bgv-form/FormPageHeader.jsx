import React from "react";

const FormPageHeader = ({heading, helperText}) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">{heading}</h2>
            <p className={`text-slate-500 mt-1 text-xs lg:text-base leading-relaxed  lg:max-w-none '}`}>
                {helperText}
            </p>
        </div>
    )
}

export default FormPageHeader;