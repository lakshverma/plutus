import React from "react";

const Button = ({ buttonText, type, colorVariant, width }) => {
  const buttonClasses =
    colorVariant === "primary"
      ? "text-white bg-primary-blue-plutus"
      : colorVariant === "secondary"
      ? "text-primary-blue-plutus bg-skyblue-plutus"
      : colorVariant === "inactive"
      ? "text-primary-grey-plutus bg-lightgrey-plutus"
      : "";
  const widthClass =
    width === "lg"
      ? "w-[252px]"
      : "w-[178px]";

  return (
    <button
      className={`font-lato font-bold text-center ${widthClass} h-[46px] rounded ${buttonClasses}`}
      type={type}
    >
      {buttonText}
    </button>
  );
};

export default Button;
