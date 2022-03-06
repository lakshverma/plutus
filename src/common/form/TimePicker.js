import React from "react";
import PropTypes from "prop-types";
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextInput from "./TextInput";

const MyContainer = ({ className, children }) => {
  return (
    <CalendarContainer className={className}>
      <div className="relative">{children}</div>
    </CalendarContainer>
  );
};

// Outputs user selected time with today's date.
// For use cases that only require selecting time or selecting date and time using separate datepicker and timepicker input fields,
// the time substring is extracted from datetime string in the backend app.
const TimePicker = (props) => {
  const onChange = (option) => {
    props.form.setFieldValue(props.field.name, option);
    // Third parameter is set false to skip immediate Formik validation on that call,
    //  so instead it would get the validation result from the earlier setFieldValue call (which, presumably, has the correct values).
    // This is a workaround for a known bug with Formik library. More info: https://github.com/jaredpalmer/formik/issues/2457
    props.form.setFieldTouched(props.field.name, true, false);
  };

  const onBlur = () => {
    props.form.setFieldTouched(props.field.name, true);
  };

  return (
    <div className="inline-block">
      <DatePicker
        selected={props.field.value}
        onChange={onChange}
        onBlur={onBlur}
        calendarContainer={MyContainer}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={1}
        timeCaption="Time"
        dateFormat="h:mm aa"
        customInput={
          <TextInput
            label={props.label}
            errors={props.errors}
            touched={props.touched}
            width={props.width}
            placeholder={props.placeholder}
            iconClass={props.iconClass}
          />
        }
        placeholderText={props.placeholder}
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

export default TimePicker;
