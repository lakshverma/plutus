import React from 'react';
import PropTypes from 'prop-types';

const SqButton = ({ buttonClass, action }) => (
  <button type="button" onClick={action} className="p-[0.625rem] rounded-lg bg-outline-grey-plutus hover:bg-primary-blue-plutus hover:text-white my-3">
    <i className={buttonClass} />
  </button>
);

SqButton.propTypes = {
  buttonClass: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};

export default SqButton;
