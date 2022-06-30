import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

// Defining the theme colors here instead of relying on tailwind.config.js as we're not
// using Tailwind to style this component. By default, React-select library
// uses emotion.sh for styling.
const colors = {
  primaryBluePlutus: '#5E81F4',
  primaryDarkPlutus: '#1C1D21',
  primaryGreyPlutus: '#8181A5',
  outlineGreyPlutus: '#F0F0F3',
  secondaryPinkPlutus: '#FF808B',
  skybluePlutus: '#EEF2FE',
  lightgreyPlutus: '#F6F6F6',
  backgroundLight: '#F5F5FA',
};

const FormDropdown = ({
  field,
  form,
  options,
  errors,
  isMulti,
  touched,
  label,
}) => {
  const onChange = (option) => {
    form.setFieldValue(
      field.name,
      isMulti ? option.map((item) => item.value) : option.value,
    );
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => field.value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === field.value);
    }
    return isMulti ? [] : '';
  };
  // The customStyles object contains style keys (controlling different aspects of the dropdown).
  // The react keys accept a function with provided and state as args. Spreading the provided styles
  // into your returned object lets you extend it while State gives access to props passed to the
  // Select component body.
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: 'none',
      color: state.isSelected
        ? colors.backgroundLight
        : colors.primaryDarkPlutus,
      backgroundColor: state.isSelected ? colors.primaryBluePlutus : 'white',
      '&:hover': {
        color: colors.primaryBluePlutus,
        backgroundColor: colors.backgroundLight,
      },
      fontFamily: 'Lato',
      fontWeight: 'bold',
    }),
    control: (provided) => ({
      ...provided,
      width: 361,
      border: '0px',
      borderBottom:
        errors && touched
          ? `2px solid ${colors.secondaryPinkPlutus}`
          : `2px solid ${colors.outlineGreyPlutus}`,
      borderRadius: 0,
      boxShadow: 'none',
      color: colors.primaryGreyPlutus,
      '&:focus': {
        color: 'pink',
      },
      '&:hover': {},
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return {
        ...provided,
        opacity,
        transition,
        fontFamily: 'Lato',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 0,
        color: colors.primaryDarkPlutus,
      };
    },
    multiValue: (provided) => ({
      ...provided,
      fontFamily: 'Lato',
      fontWeight: 'bold',
      marginLeft: 0,
      backgroundColor: colors.backgroundLight,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: colors.primaryGreyPlutus,
      backgroundColor: colors.backgroundLight,
      paddingTop: 7,
      paddingBottom: 7,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: colors.primaryGreyPlutus,
      backgroundColor: colors.backgroundLight,
    }),
    dropdownIndicator: (provided, state) => ({
      backgroundColor: 'transparent',
      color: state.isFocused ? colors.primaryDarkPlutus : 'inherit',
      '&:focus': {
        color: 'pink',
      },
    }),
    indicatorSeparator: () => ({}),
    valueContainer: (provided) => ({
      ...provided,
      paddingLeft: 0,
      paddingBottom: isMulti ? 2 : 14,
    }),
    menu: (provided) => ({
      ...provided,
      width: 361,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: colors.primaryGreyPlutus,
      fontFamily: 'Lato',
      fontSize: 14,
      fontWeight: 'bold',
    }),
    container: (provided) => ({
      ...provided,
      width: 361,
    }),
  };

  return (
    <div className="inline-block">
      <label className="block text-sm text-primary-grey-plutus font-lato">
        {label}
      </label>
      <Select
        name={field.name}
        value={getValue()}
        onChange={onChange}
        onBlur={field.onBlur}
        options={options}
        styles={customStyles}
        isMulti={isMulti}
      />
    </div>
  );
};

FormDropdown.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  errors: PropTypes.string,
  isMulti: PropTypes.bool.isRequired,
  touched: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

FormDropdown.defaultProps = {
  errors: '',
  touched: false,
};

export default FormDropdown;
