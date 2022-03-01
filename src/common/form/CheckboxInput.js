import React from "react";

// Accepts  name, label, labelType, error as props in addition to the standard Formik props for checkboxes.
const CheckboxInput = (props) => {

  const labelType =
    props.labelType === "bold"
      ? "text-primary-dark-plutus font-bold text-base leading-6"
      : "text-primary-grey-plutus text-sm leading-6";

  const validationClass = props.errors && props.touched
    ? "text-secondary-pink-plutus border-secondary-pink-plutus"
    : "text-primary-blue-plutus border-primary-dark-plutus";

  return (
    <div className={props.className}>
      <label>
        <input
          type="checkbox"
          onChange={props.field.onChange}
          onBlur={props.field.onBlur}
          checked={props.field.checked}
          name={props.field.name}
          className={`rounded-sm form-checkbox ${validationClass}`}
        ></input>
        <span className={`${labelType} ml-3 font-lato text-sm`}>{props.label}</span>
      </label>
    </div>
  );
};

export default CheckboxInput;
