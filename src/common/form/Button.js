import React from "react";

const Button = ({ buttonText, type, width }) => {
  const buttonClasses =
    type === "primary"
      ? "text-white bg-primary-blue-plutus"
      : type === "secondary"
      ? "text-primary-blue-plutus bg-skyblue-plutus"
      : type === "inactive"
      ? "text-primary-grey-plutus bg-lightgrey-plutus"
      : "";
  const widthClass =
    width === "lg"
      ? "w-[252px]"
      : "w-[178px]";
  return (
    <button
      className={`font-lato font-bold text-center ${widthClass} h-[46px] rounded ${buttonClasses}`}
    >
      {buttonText}
    </button>
  );
};

export default Button;
