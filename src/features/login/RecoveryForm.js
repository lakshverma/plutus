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

const RecoveryForm = ({ className }) => (
  <div className={className}>
    <Formik
      initialValues={{ email: '' }}
      validationSchema={Yup.object({
        email: Yup.string()
          .trim()
          .email('Please enter a correct email address')
          .required('Email is required'),
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
          <Button buttonText="Recover" type="submit" colorVariant="primary" />
        </Form>
      )}
    </Formik>
  </div>
);

RecoveryForm.propTypes = {
  className: PropTypes.string,
};

RecoveryForm.defaultProps = {
  className: '',
};

export default RecoveryForm;
