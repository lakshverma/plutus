/* eslint-disable no-alert */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../common/form/TextInput';
import ErrorText from '../../common/form/ErrorText';
import Button from '../../common/form/Button';
import authService from './authService';

const RecoveryForm = ({ className }) => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email } = values;
    const recoverRequest = await authService.recoverRequest({ email });
    if (recoverRequest) {
      navigate('/recoversent', { replace: true });
    }
  };

  return (
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
          handleSubmit(values);
          setSubmitting(false);
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 400);
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
};

RecoveryForm.propTypes = {
  className: PropTypes.string,
};

RecoveryForm.defaultProps = {
  className: '',
};

export default RecoveryForm;
