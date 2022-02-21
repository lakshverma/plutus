import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarContainer } from "react-datepicker";
import { getMonth, getYear } from "date-fns";
import range from "lodash/range";
import TextInput from "./TextInput";

const MyContainer = ({ className, children }) => {
  return (
    <CalendarContainer className={className}>
      <div className="relative">{children}</div>
    </CalendarContainer>
  );
};

const years = range(1990, getYear(new Date()) + 1, 1);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DateInput = (props) => {
  console.log(props)

  const onChange = (option) => {
    console.log(option)
    props.form.setFieldValue(props.field.name, option);
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
        <div
          className="flex justify-center m-3 bg-background-lightgrey-plutus"
        >
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="pr-8 text-xl font-bold font-lato text-primary-grey-plutus">
            {"<"}
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
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
            className="inline w-auto px-1 text-sm font-bold appearance-none bg-background-lightgrey-plutus text-primary-dark-plutus hover:text-primary-blue-plutus"
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="pl-8 text-xl font-bold font-lato text-primary-grey-plutus">
            {">"}
          </button>
        </div>
      )}
      selected={props.field.value}
      onChange={onChange}
      calendarContainer={MyContainer}
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
      dateFormat="dd/MM/yyyy"
      disabledKeyboardNavigation
    />
  );
};

export default DateInput;
