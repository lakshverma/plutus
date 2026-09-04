/* eslint-disable no-alert */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { login } from './authSlice';
import TextInput from '../../common/form/TextInput';
import ErrorText from '../../common/form/ErrorText';
import CheckboxInput from '../../common/form/CheckboxInput';
import Button from '../../common/form/Button';
import authService from './authService';
import userService from './userService';

/*
 * Set in the deployed environment only, so the public demo signs in with one click
 * while local development keeps an empty form. These are inlined into the bundle at
 * build time, which is fine: they are the published credentials of a shared demo
 * account holding seeded data, not a secret.
 */
const demoEmail = process.env.REACT_APP_DEMO_EMAIL || '';
const demoPassword = process.env.REACT_APP_DEMO_PASSWORD || '';
const isDemo = Boolean(demoEmail && demoPassword);

const LoginForm = ({ className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (values) => {
    try {
      setLoginError('');
      const { email, password, remember } = values;
      const loggedPlutusAppUser = await authService.login({
        email,
        password,
        remember,
      });

      userService.setUser(loggedPlutusAppUser);

      dispatch(login(loggedPlutusAppUser));
      navigate(from, { replace: true });
    } catch (exception) {
      const errorMessage = exception.response?.data?.error
        || exception.message
        || 'Invalid email or password. Please try again.';
      setLoginError(errorMessage);
    }
  };

  return (
    <div className={className}>
      <Formik
        initialValues={{
          email: demoEmail,
          password: demoPassword,
          remember: false,
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .trim()
            .email('Please enter a correct email address')
            .required('Email is required'),
          password: Yup.string()
            .required('Password cannot be empty')
            .min(8, 'Password is too short - 8 characters minimum'),
          remember: Yup.boolean(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 400);
          handleLogin(values);
          setSubmitting(false);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            {isDemo && (
              <div className="p-3 mb-4 text-sm border rounded font-lato text-primary-dark-plutus bg-skyblue-plutus border-primary-blue-plutus">
                <span className="font-bold">Demo account.</span>
                {' '}
                Credentials are filled in already, so just select Sign In. The data is
                seeded and resets nightly.
              </div>
            )}

            <div className="mb-4">
              {loginError && (
                <div className="p-3 border rounded text-secondary-pink-plutus bg-red-50 border-secondary-pink-plutus">
                  {loginError}
                </div>
              )}
            </div>

            <div className="mb-[11px]">
              <Field
                name="email"
                label="Email"
                as={TextInput}
                width="lg"
                placeholder="Enter email"
                iconClass="las la-envelope-open"
                autoComplete="email"
                errors={errors.email}
                touched={touched.email}
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
              autoComplete="current-password"
              errors={errors.password}
              touched={touched.password}
            />
            <ErrorMessage component={ErrorText} name="password" />
            <div className="flex items-center justify-between">
              <Field
                type="checkbox"
                name="remember"
                component={CheckboxInput}
                errors={errors.remember}
                touched={touched.remember}
                label="Remember me"
                labelType="bold"
                className="mt-8 mb-8"
              />
              <Link to="/recover">
                <span className="text-sm font-bold text-primary-blue-plutus font-lato">
                  Recover password
                </span>
              </Link>
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
};

LoginForm.defaultProps = {
  className: '',
};

export default LoginForm;
