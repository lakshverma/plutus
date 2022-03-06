import React from "react";
import PropTypes from "prop-types";

const ErrorText = (props) => (
  <div className="text-sm text-secondary-pink-plutus font-lato">
    {console.log(props)}
    {props.children}
  </div>
);

ErrorText.propTypes = {
  children: PropTypes.string.isRequired,
};

export default ErrorText;
