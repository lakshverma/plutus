import React from "react";
import PropTypes from "prop-types";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextInput from "../../common/form/TextInput";
import ErrorText from "../../common/form/ErrorText";
import CheckboxInput from "../../common/form/CheckboxInput";
import Button from "../../common/form/Button";

const LoginForm = ({ className }) => {
  return (
    <div className={className}>
      <Formik
        initialValues={{
          email: "",
          password: "",
          remember: false,
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .trim()
            .email("Please enter a correct email address")
            .required("Email is required"),
          password: Yup.string()
            .required("Password cannot be empty")
            .min(8, "Password is too short - 8 characters minimum"),
          remember: Yup.boolean(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
      {({ errors, touched }) => (
        <Form>
          <div className="mb-[11px]">
            <Field
                name="email"
                label="Email"
                as={TextInput}
                width="lg"
                placeholder="Enter email"
                iconClass="las la-envelope-open"
                errors={errors.email}
            />
            <ErrorMessage component={ErrorText} name="email" />
          </div>
          

          <Field
            name="password"
            label="Password"
            as={TextInput}
            type="password"
            width="lg"
            placeholder="Enter password"
            iconClass="las la-lock"
            errors={errors.password}
          />
          <ErrorMessage component={ErrorText} name="password" />
          <div className="flex items-center justify-between">
            <Field
                type="checkbox"
                name="remember"
                component={CheckboxInput}
                errors={errors.toggle}
                touched={touched.toggle}
                label={"Remember me"}
                labelType="bold"
                className="mt-8 mb-8"
            />
            <span className="text-sm font-bold text-primary-blue-plutus font-lato">
                Recover password
            </span>
          </div>
          <ErrorMessage component={ErrorText} name="remember" />
          <Button buttonText="Sign In" type="submit" colorVariant="primary" />
        </Form>
      )}
      </Formik>
    </div>
  );
};

LoginForm.propTypes = {
  className: PropTypes.string,
}

export default LoginForm;
