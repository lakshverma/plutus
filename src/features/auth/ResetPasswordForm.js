/* eslint-disable no-alert */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from '../../common/form/TextInput';
import ErrorText from '../../common/form/ErrorText';
import Button from '../../common/form/Button';
import authService from './authService';

const ResetPasswordForm = ({ className }) => {
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async (values) => {
    const { password, confirmPassword } = values;
    await authService.resetRequest({ password, confirmPassword }, params.token);
    navigate('/', { replace: true });
  };

  return (
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
          handleSubmit(values);
          setSubmitting(false);
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
};

ResetPasswordForm.propTypes = {
  className: PropTypes.string,
};

ResetPasswordForm.defaultProps = {
  className: '',
};

export default ResetPasswordForm;
