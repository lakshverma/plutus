import React from 'react';
import PropTypes from 'prop-types';

const SqButton = ({ action, buttonClass }) => (
  <button type="button" onClick={action} className="p-[0.625rem] rounded-lg bg-outline-grey-plutus hover:bg-primary-blue-plutus hover:text-white my-3">
    <i className={buttonClass} />
  </button>
);

SqButton.propTypes = {
  buttonClass: PropTypes.string.isRequired,
  action: PropTypes.func,
};

SqButton.defaultProps = {
  action: null,
};

export default SqButton;
