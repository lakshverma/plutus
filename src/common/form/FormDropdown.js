import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

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
  defaultOptions,
  errors,
  isMulti,
  isLoading,
  loadingMessage,
  touched,
  label,
  placeholder,
  isAsyncDropdown,
  loadOptions,
  disabled,
  width,
}) => {
  const [selectedAsyncOption, setSelectedAsyncOption] = useState(null);

  const wrapperWidth = typeof width === 'number' ? `${width}px` : width;
  const resolvedWrapperWidth = wrapperWidth || `${FormDropdown.defaultProps.width}px`;

  const getOptionSource = () => {
    if (Array.isArray(options) && options.length > 0) {
      return options;
    }
    if (Array.isArray(defaultOptions) && defaultOptions.length > 0) {
      return defaultOptions;
    }
    return [];
  };

  const getValue = () => {
    const optionSource = getOptionSource();
    if (!optionSource.length && !field.value) {
      return null;
    }

    if (isMulti && Array.isArray(field.value)) {
      const selectedValues = field.value.map((value) => String(value));
      return optionSource.filter((option) => selectedValues.includes(String(option.value)));
    }

    return optionSource.find((option) => String(option.value) === String(field.value)) || null;
  };

  useEffect(() => {
    if (!isAsyncDropdown || isMulti) {
      return;
    }

    if (field.value == null || field.value === '') {
      setSelectedAsyncOption(null);
      return;
    }

    const optionSource = Array.isArray(options) && options.length > 0
      ? options
      : defaultOptions;

    const matchedOption = optionSource.find(
      (option) => String(option.value) === String(field.value),
    );

    if (matchedOption) {
      setSelectedAsyncOption(matchedOption);
      return;
    }

    setSelectedAsyncOption((previous) => (
      previous && String(previous.value) === String(field.value) ? previous : null
    ));
  }, [
    isAsyncDropdown,
    isMulti,
    field.value,
    options,
    defaultOptions,
  ]);

  const handleSelectChange = (selectedOption) => {
    if (isMulti) {
      const valueArray = Array.isArray(selectedOption)
        ? selectedOption.map((option) => option.value)
        : [];
      form.setFieldValue(field.name, valueArray);
      return;
    }

    if (isAsyncDropdown) {
      setSelectedAsyncOption(selectedOption || null);
    }

    form.setFieldValue(field.name, selectedOption ? selectedOption.value : '');
  };

  const sharedStyles = {
    width: '100%',
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: 'none',
      color: state.isSelected ? colors.backgroundLight : colors.primaryDarkPlutus,
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
      ...sharedStyles,
      border: '0px',
      borderBottom: errors && touched
        ? `2px solid ${colors.secondaryPinkPlutus}`
        : `2px solid ${colors.outlineGreyPlutus}`,
      borderRadius: 0,
      boxShadow: 'none',
      color: colors.primaryGreyPlutus,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      opacity: state.isDisabled ? 0.5 : 1,
      transition: 'opacity 300ms',
      fontFamily: 'Lato',
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 0,
      color: colors.primaryDarkPlutus,
    }),
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
      ...provided,
      backgroundColor: 'transparent',
      color: state.isFocused ? colors.primaryDarkPlutus : 'inherit',
    }),
    indicatorSeparator: () => ({}),
    valueContainer: (provided) => ({
      ...provided,
      paddingLeft: 0,
      paddingBottom: isMulti ? 2 : 14,
    }),
    menu: (provided) => ({
      ...provided,
      width: resolvedWrapperWidth,
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
      ...sharedStyles,
    }),
  };

  const wrapperStyle = { width: resolvedWrapperWidth };

  if (isAsyncDropdown) {
    return (
      <div className="inline-block w-full" style={wrapperStyle}>
        <label className="block text-sm text-primary-grey-plutus font-lato">
          {label}
        </label>
        <AsyncSelect
          name={field.name}
          value={isMulti ? getValue() : (selectedAsyncOption || getValue())}
          placeholder={placeholder}
          onChange={handleSelectChange}
          onBlur={field.onBlur}
          defaultOptions={defaultOptions || options}
          loadOptions={loadOptions}
          styles={customStyles}
          isMulti={isMulti}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
          isDisabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className="inline-block w-full" style={wrapperStyle}>
      <label className="block text-sm text-primary-grey-plutus font-lato">
        {label}
      </label>
      <Select
        name={field.name}
        value={getValue()}
        onChange={handleSelectChange}
        onBlur={field.onBlur}
        options={options}
        placeholder={placeholder}
        styles={customStyles}
        isMulti={isMulti}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        isDisabled={disabled}
      />
    </div>
  );
};

FormDropdown.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.array,
      PropTypes.number,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  defaultOptions: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  errors: PropTypes.string,
  isMulti: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.func,
  touched: PropTypes.bool,
  label: PropTypes.string.isRequired,
  isAsyncDropdown: PropTypes.bool,
  loadOptions: PropTypes.func,
  disabled: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

FormDropdown.defaultProps = {
  options: [],
  defaultOptions: [],
  placeholder: 'Select...',
  errors: '',
  isLoading: false,
  loadingMessage: () => 'Loading options...',
  touched: false,
  isAsyncDropdown: false,
  loadOptions: () => Promise.resolve([]),
  disabled: false,
  width: 361,
};

export default FormDropdown;
