import React from 'react';
import PropTypes from 'prop-types';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextInput from './TextInput';

const MyContainer = ({ className, children }) => (
  <CalendarContainer className={className}>
    <div className="relative">{children}</div>
  </CalendarContainer>
);

// Outputs user selected time with today's date.
// For use cases that only require selecting time or selecting date and time using
// separate datepicker and timepicker input fields, the time substring
// is extracted from datetime string in the backend app.
const TimePicker = ({
  form, field, errors, touched, label, width, placeholder, iconClass,
}) => {
  const onChange = (option) => {
    form.setFieldValue(field.name, option);
    // Third parameter is set false to skip immediate Formik validation on that call,
    //  so instead it would get the validation result from the earlier setFieldValue
    // call (which, presumably, has the correct values).
    // This is a workaround for a known bug with Formik library. More info: https://github.com/jaredpalmer/formik/issues/2457
    form.setFieldTouched(field.name, true, false);
  };

  const onBlur = () => {
    form.setFieldTouched(field.name, true);
  };

  return (
    <div className="inline-block">
      <DatePicker
        selected={field.value}
        onChange={onChange}
        onBlur={onBlur}
        calendarContainer={MyContainer}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={1}
        timeCaption="Time"
        dateFormat="h:mm aa"
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
      />
    </div>
  );
};

TimePicker.propTypes = {
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

TimePicker.defaultProps = {
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

export default TimePicker;
