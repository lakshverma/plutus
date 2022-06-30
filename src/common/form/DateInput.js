/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getMonth, getYear } from 'date-fns';
import range from 'lodash/range';
import TextInput from './TextInput';

const MyContainer = ({ className, children }) => (
  <CalendarContainer className={className}>
    <div className="relative">{children}</div>
  </CalendarContainer>
);

const years = range(1990, getYear(new Date()) + 1, 1);
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DateInput = ({
  form, field, errors, touched, label, width, placeholder, iconClass,
}) => {
  // console.log(props)
  const onChange = (option) => {
    form.setFieldValue(field.name, option);
    // Third parameter is set false to skip immediate Formik validation on that call,
    //  so instead it would get the validation result from the earlier setFieldValue call (which,
    // presumably, has the correct values).
    // This is a workaround for a known bug with Formik library. More info: https://github.com/jaredpalmer/formik/issues/2457
    form.setFieldTouched(field.name, true, false);
  };

  const onBlur = () => {
    form.setFieldTouched(field.name, true);
  };

  return (
    <DatePicker
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="flex justify-center m-3 bg-background-lightgrey-plutus">
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="pr-8 text-xl font-bold font-lato text-primary-grey-plutus"
          >
            {'<'}
          </button>
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(value)}
            className="w-auto px-1 text-sm font-bold appearance-none bg-background-lightgrey-plutus text-primary-dark-plutus hover:text-primary-blue-plutus"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            className="inline w-auto px-1 text-sm font-bold appearance-none bg-background-lightgrey-plutus text-primary-dark-plutus hover:text-primary-blue-plutus"
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="pl-8 text-xl font-bold font-lato text-primary-grey-plutus"
          >
            {/* Use the ascii symbol instead of text- */}
            {'>'}
          </button>
        </div>
      )}
      selected={field.value}
      onChange={onChange}
      onBlur={onBlur}
      calendarContainer={MyContainer}
      customInput={(
        <TextInput
          label={label}
          errors={errors}
          touched={touched}
          width={width}
          placeholder={placeholder}
          iconClass={iconClass}
        />
      )}
      placeholderText={placeholder}
      dateFormat="dd/MM/yyyy"
      disabledKeyboardNavigation
    />
  );
};

DateInput.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
      .isRequired,
  }),
  form: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    setFieldTouched: PropTypes.func.isRequired,
  }),
  errors: PropTypes.string,
  touched: PropTypes.bool,
  label: PropTypes.string,
  width: PropTypes.string,
  placeholder: PropTypes.string,
  iconClass: PropTypes.string.isRequired,
};

DateInput.defaultProps = {
  field: {},
  form: {},
  errors: '',
  touched: false,
  label: '',
  width: '',
  placeholder: '',
};

MyContainer.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default DateInput;
