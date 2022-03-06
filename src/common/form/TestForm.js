import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import ErrorText from "./ErrorText";
import Button from "./Button";
import CheckboxInput from "./CheckboxInput";
import FormDropdown from "./FormDropdown";
import DateInput from "./DateInput";
import TimePicker from "./TimePicker";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  {value: "blueberry", label: "Blueberry"}
];

// This is just a placeholder form to test out various form components.
const TestForm = () => (
  <div className="inline-block">
    <Formik
      initialValues={{
        firstName: "Lakshay",
        toggle: false,
        example: [],
        date: "",
        time: "",
      }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        toggle: Yup.boolean().oneOf([true], "You must tick the checkbox."),
        // example: Yup.string().required("Flavour is required!"),
        example: Yup.array().min(1, "At least one flavour option is required!"),
        date: Yup.date()
          .nullable()
          .transform((curr, orig) => (orig === "" ? null : curr))
          .required("Date can't be blank.")
          .max(new Date("January 1, 2150 00:00:00"), "Please enter a valid date."),
        time: Yup.date()
        .nullable()
        .transform((curr, orig) => (orig === "" ? null : curr))
        .required("Time cant be blank."),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {/* This is to pass errors to the input component upon validation so that it can be styled accordingly */}
      {({ errors, touched }) => (
        <Form className="block">
          <Field
            name="firstName"
            label="First Name"
            as={TextInput}
            width="lg"
            placeholder="Enter your name"
            iconClass="las la-envelope-open"
            errors={errors.firstName}
          />
          <ErrorMessage component={ErrorText} name="firstName" />

          <div className="">
            <Field
              type="checkbox"
              name="toggle"
              component={CheckboxInput}
              errors={errors.toggle}
              touched={touched.toggle}
              label={"this is a label"}
              labelType="bold"
            />
            <ErrorMessage component={ErrorText} name="toggle" />
          </div>

          <Field
            name="example"
            component={FormDropdown}
            label="What's your favourite flavour?"
            options={options}
            errors={errors.example}
            isMulti={true}
            touched={touched.example}
          />
          <ErrorMessage component={ErrorText} name="example" />

          <Field
            name="date"
            component={DateInput}
            label="Date of Birth"
            errors={errors.date}
            touched={touched.date}
            width="lg"
            placeholder="DD/MM/YYYY"
            iconClass="las la-calendar"
          />
          <ErrorMessage component={ErrorText} name="date" />

          <Field
            name="time"
            component={TimePicker}
            label="Pick a time"
            errors={errors.time}
            touched={touched.time}
            width="lg"
            placeholder="hh:mm"
            iconClass="las la-clock"
          />
          <ErrorMessage component={ErrorText} name="time" />

          <div className="block mt-2 login-buttons">
            <Button buttonText="Inactive" colorVariant="inactive" type=""/>
            <span className="mr-2"></span>
            <Button buttonText="Click" type="submit" colorVariant="primary" />
          </div>
        </Form>
      )}
    </Formik>
  </div>
);

export default TestForm;
