import React from "react";
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
    console.log(option.toLocaleTimeString());
    props.form.setFieldValue(props.field.name, option);
  };

  console.log(props.errors);
  return (
    <div className="inline-block">
      <DatePicker
        selected={props.field.value}
        onChange={onChange}
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

export default TimePicker;
