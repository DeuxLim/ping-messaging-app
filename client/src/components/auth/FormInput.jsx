import React from "react";

export default function FormInput({
    id,
    label,
    type = "text",
    name,
    placeholder = "",
    value,
    onChange,
    error,
    additionalContainerClasses = ""
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${additionalContainerClasses}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 ml-0.5"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-4 border rounded-lg text-gray-900 text-sm placeholder:text-gray-400 transition-all duration-200 outline-none
                ${error ? "border-red-500 focus:ring-red-100" : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-100"}`}
            />
            {error && (
                <p className="text-xs text-red-500 ml-0.5">{error}</p>
            )}
        </div>
    );
}