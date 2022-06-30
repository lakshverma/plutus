import React from 'react';
import PropTypes from 'prop-types';

// Accepts  name, label, labelType, error as props in addition to the standard Formik props
// for checkboxes.
const CheckboxInput = ({
  labelType, errors, touched, className, field, label,
}) => {
  const labelTypeClass = labelType === 'bold'
    ? 'text-primary-dark-plutus font-bold text-base leading-6'
    : 'text-primary-grey-plutus text-sm leading-6';

  const validationClass = errors && touched
    ? 'text-secondary-pink-plutus border-secondary-pink-plutus'
    : 'text-primary-blue-plutus border-primary-dark-plutus';

  return (
    <div className={className}>
      <label>
        <input
          type="checkbox"
          onChange={field.onChange}
          onBlur={field.onBlur}
          checked={field.checked}
          name={field.name}
          className={`rounded-sm form-checkbox ${validationClass}`}
        />
        <span className={`${labelTypeClass} ml-3 font-lato text-sm`}>
          {label}
        </span>
      </label>
    </div>
  );
};

CheckboxInput.propTypes = {
  labelType: PropTypes.string,
  errors: PropTypes.string,
  touched: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
  field: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
  }).isRequired,
};

CheckboxInput.defaultProps = {
  labelType: 'normal',
  errors: '',
  touched: false,
  label: '',
  className: '',
};

export default CheckboxInput;
