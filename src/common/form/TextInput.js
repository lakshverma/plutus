import React, { forwardRef } from "react";
import PropTypes from "prop-types"

// Accepts  name, label, width, placeholder, iconClass and error as props in addition to the standard Formik props for text inputs.
// React Datepicker library needs the forward ref to use this component as a customInput.
const TextInput = forwardRef((props, ref) => {
  const validationClass =
    props.errors && props.touched
      ? {
          div: "focus-within:text-secondary-pink-plutus border-secondary-pink-plutus",
          input: "text-secondary-pink-plutus",
          icon: "text-secondary-pink-plutus",
        }
      : {
          div: "focus-within:text-primary-dark-plutus border-outline-grey-plutus focus-within:border-primary-blue-plutus",
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
          onClick={props.onClick}
          name={props.name}
          value={props.value}
          className={`mt-1 pb-[14px] text-sm font-bold outline-none font-lato ${width.input} placeholder:text-primary-grey-plutus peer ${validationClass.input}`}
          type={props.type}
          placeholder={props.placeholder}
          ref={ref}
        />
        <i
          className={`${props.iconClass} ${validationClass.icon} peer-placeholder-shown:text-primary-grey-plutus`}
          onClick={props.onClick}
        ></i>
      </div>
    </>
  );
});

TextInput.propTypes = {
  errors: PropTypes.string,
  touched: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  width: PropTypes.string,
  placeholder: PropTypes.string,
  iconClass: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
}

export default TextInput;
