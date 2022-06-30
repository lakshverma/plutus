/* eslint-disable no-alert */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import TextInput from '../../common/form/TextInput';
import ErrorText from '../../common/form/ErrorText';
import Button from '../../common/form/Button';

const ResetPasswordForm = ({ className }) => (
  <div className={className}>
    <Formik
      initialValues={{ password: '', confirmPassword: '' }}
      validationSchema={Yup.object({
        password: Yup.string()
          .required('Password cannot be empty')
          .min(8, 'Password is too short - 8 characters minimum'),
        confirmPassword: Yup.string().oneOf(
          [Yup.ref('password'), null],
          'Passwords must match',
        ),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {/* Can also accept 'touched' as an argument if needed */}
      {({ errors }) => (
        <Form>
          <div className="mb-10">
            <Field
              type="password"
              name="password"
              label="Password"
              as={TextInput}
              width="lg"
              placeholder="Enter password"
              iconClass="las la-lock"
              errors={errors.password}
            />
            <ErrorMessage component={ErrorText} name="password" />
          </div>
          <div className="mb-10">
            <Field
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              as={TextInput}
              width="lg"
              placeholder="Enter password"
              iconClass="las la-lock"
              errors={errors.confirmPassword}
            />
            <ErrorMessage component={ErrorText} name="confirmPassword" />
          </div>
          <Button
            buttonText="Reset Password"
            type="submit"
            colorVariant="primary"
          />
        </Form>
      )}
    </Formik>
  </div>
);

ResetPasswordForm.propTypes = {
  className: PropTypes.string,
};

ResetPasswordForm.defaultProps = {
  className: '',
};

export default ResetPasswordForm;
