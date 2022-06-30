/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  buttonText, type, colorVariant, width,
}) => {
  const buttonClasses = colorVariant === 'primary'
    ? 'text-white bg-primary-blue-plutus'
    : colorVariant === 'secondary'
      ? 'text-primary-blue-plutus bg-skyblue-plutus'
      : colorVariant === 'inactive'
        ? 'text-primary-grey-plutus bg-lightgrey-plutus'
        : '';
  const widthClass = width === 'lg' ? 'w-[252px]' : 'w-[178px]';

  return (
    <button
      className={`font-lato font-bold text-center ${widthClass} h-[46px] rounded ${buttonClasses}`}
      // For more: https://github.com/jsx-eslint/eslint-plugin-react/issues/1555
      // eslint-disable-next-line react/button-has-type
      type={type}
    >
      {buttonText}
    </button>
  );
};

Button.propTypes = {
  buttonText: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  colorVariant: PropTypes.oneOf(['primary', 'secondary', 'inactive'])
    .isRequired,
  width: PropTypes.string,
};

Button.defaultProps = {
  width: 'md',
};

export default Button;
