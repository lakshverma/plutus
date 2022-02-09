import React from "react";

// Accepts  name, label, width, placeholder, iconClass and error as props in addition to the standard Formik props for text inputs.
const TextInput = (props) => {
//   console.log(props)
  const validationClass = props.error
    ? {
        div: "focus-within:text-secondary-pink-plutus border-secondary-pink-plutus",
        input: "text-secondary-pink-plutus",
        icon: "text-secondary-pink-plutus",
      }
    : {
        div: "focus-within:text-primary-dark-plutus border-outline-grey-plutus",
        input: "primary-dark-plutus",
        icon: "primary-dark-plutus",
      };

  const width =
    props.width === "lg"
      ? {
          div: "w-[361px]",
          input: "w-[343px]",
        }
      : {
          div: "w-[269px]",
          input: "w-[251px]",
        };
  return (
    <>
      <label className="block text-sm text-primary-grey-plutus font-lato">
        {props.label}
      </label>
      <div
        className={`inline-block ${width.div} border-b-2 ${validationClass.div}`}
      >
        <input
          onChange={props.onChange}
          onBlur={props.onBlur}
          name={props.name}
          value={props.value}
          className={`mt-1 pb-[14px] text-sm font-bold outline-none font-lato ${width.input} placeholder:text-primary-grey-plutus peer ${validationClass.input}`}
          type="text"
          placeholder={props.placeholder}
        />
        <i
          className={`${props.iconClass} ${validationClass.icon} peer-placeholder-shown:text-primary-grey-plutus`}
        ></i>
      </div>
    </>
  );
};

export default TextInput;
