import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import ErrorText from "./ErrorText";
import Button from "./Button";

// This is just a placeholder form to test out various form components. 
const TestForm = () => (
  <div>
    <Formik
      initialValues={{ firstName: "" }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {/* This is to pass errors to the input component upon validation so that it can be styled accordingly */}
      {({ errors }) => (
        <Form>
          <Field
            name="firstName"
            label="First Name"
            as={TextInput}
            width="lg"
            placeholder="Enter your name"
            iconClass="las la-envelope-open"
            error={errors.firstName}
          />
          <ErrorMessage component={ErrorText} name="firstName" />
          <div className="mt-2 login-buttons">
            <Button buttonText="Inactive" type="inactive" />
            <span className="mr-2"></span>
            <Button buttonText="Click" type="primary" />
          </div>
        </Form>
      )}
    </Formik>
  </div>
);

export default TestForm;
