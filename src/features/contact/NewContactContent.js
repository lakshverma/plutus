import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js/max';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setOptions } from './contactSlice';
import ErrorText from '../../common/form/ErrorText';
import FormDropdown from '../../common/form/FormDropdown';
import TextInput from '../../common/form/TextInput';
import DateInput from '../../common/form/DateInput';
import Button from '../../common/form/Button';
import contactService from './ContactService';
import ClearDependentFields from './ClearDependentFields';

// const testOptions = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
//   { value: 'blueberry', label: 'Blueberry' },
// ];

const LoadingMessage = () => <BeatLoader size={10} color="blue" />;

const NewContactContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Local loading state
  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      const options = await contactService.getDropDownOptions('all');
      dispatch(setOptions(options.data));
      setLoading(false);
    }

    fetchOptions();
  }, [dispatch]);

  const allOptions = useSelector((state) => state.contact);

  const loadContactOptions = (optionsType) => async (inputValue) => contactService
    .getFilteredOptions(optionsType, inputValue);

  return (
    <div className="flex flex-col w-full h-full px-6 pt-2 pb-6 bg-background-lightgrey-plutus">
      <div className="w-full h-full overflow-y-auto bg-white rounded-lg shadow
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:rounded-full
  hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
  [scrollbar-width:thin]
  [scrollbar-color:#d1d5db_transparent]"
      >
        {' '}
        <Formik
          initialValues={{
            referredBy: '',
            contactType: '',
            groupHeadName: '',
            groupHead: false,
            groupHeadRelation: '',
            firstName: '',
            middleName: '',
            lastName: '',
            dob: '',
            maritalStatus: '',
            anniversaryDate: '',
            grossAnnualIncome: 0,
            personalEmail: '',
            correspondenceEmail: '',
            politicalExposure: false,
            birthPlaceCity: '',
            residenceStatus: '',
            nonResTaxId: '',
            profession: '',
            loanDetails: '',
            riskProfile: '',
            contactOwner: '',
            contactStatus: '',
            orgName: '',
            industry: '',
            contactSource: '',
            personalAddress: '',
            personalCity: '',
            personalPincode: '',
            personalPhone: '',
            personalMobile: '',
            // workEmail: '',
            workAddress: '',
            workCity: '',
            workPincode: '',
            workPhone: '',
            workMobile: '',
          }}
          validationSchema={Yup.object({
            referredBy: Yup.string().nullable(),
            contactType: Yup.string()
              .required('Contact Type is requried'),
            groupHead: Yup.boolean()
              .required('Mark true if contact is a group head, else false'),
            groupHeadName: Yup.mixed()
              .nullable()
              .when('groupHead', {
                is: true,
                then: Yup.mixed()
                  .nullable()
                  .test('must-be-empty', 'Remove the group head name value — this contact is the group head', (val) => val === null || val === undefined || val === '' || String(val).trim() === ''),
                otherwise: Yup.number()
                  .typeError('Group Head Name must be a number')
                  .required('An existing group code must be selected if contact is not a group head'),
              }),
            groupHeadRelation: Yup.string()
              .when('groupHead', {
                is: true,
                then: Yup.string().oneOf(['Self'], 'Relation is self if contact is group head').required('Relation to group head must be specified'),
                otherwise: Yup.string().notOneOf(['Self'], 'Relation cannot be self since contact is not group head').required('Relation to group head must be specified'),
              }),
            firstName: Yup.string()
              .required('First name is required'),
            middleName: Yup.string().nullable(),
            lastName: Yup.string()
              .required('Last name is required'),
            dob: Yup.date()
              .transform((curr, orig) => {
                if (orig === '' || orig === undefined) return null;
                const date = new Date(orig);
                return Number.isNaN(date.getTime()) ? null : curr;
              })
              .required('Date cannot be blank.')
              .max(new Date(), 'Please enter a valid date'),
            maritalStatus: Yup.string()
              .required('Marital status is required'),
            anniversaryDate: Yup.date()
              .nullable()
              .transform((curr, orig) => (orig === '' ? null : curr))
              .when('maritalStatus', (maritalStatus, schema) => (maritalStatus === 'Married'
                ? schema.required('Anniversary date is required for married contacts').max(new Date(), 'Please enter a valid date')
                : schema.notRequired().max(new Date(), 'Please enter a valid date')))
              .when('dob', (dob, schema) => (dob ? schema.min(dob, 'Anniversary date cannot be earlier than Date of Birth') : schema)),
            grossAnnualIncome: Yup.number()
              .positive('Gross Annual Income must be greater than 0')
              .required('Gross Annual Income is required'),
            personalEmail: Yup.string()
              .trim()
              .email('Please enter a correct email address')
              .required('Personal email is required'),
            correspondenceEmail: Yup.string()
              .trim()
              .email('Please enter a correct email address')
              .required('Correspondence email is required'),
            personalAddress: Yup.string()
              .required('Personal Address is required'),
            personalCity: Yup.string()
              .required('Please select the City of residence'),
            personalPincode: Yup.string()
              .required('Please enter appropriate Pin/Zip code'),
            personalPhone: Yup.string()
              .test('phone-check', 'Please enter a valid phone number prefixed with country code', (value) => {
                try {
                  const parsedPhoneNumber = parsePhoneNumber(value, 'IN').number;

                  return (
                    value == null
                  || (value === parsedPhoneNumber && isValidPhoneNumber(parsedPhoneNumber))
                  );
                } catch (error) {
                  return false;
                }
              }),
            personalMobile: Yup.string()
              .test('phone-check', 'Please enter a valid phone number prefixed with country code', (value) => {
                try {
                  const parsedPhoneNumber = parsePhoneNumber(value, 'IN').number;
                  return (
                    value == null
                  || (value === parsedPhoneNumber && isValidPhoneNumber(parsedPhoneNumber))
                  );
                } catch (error) {
                  return false;
                }
              }),
            // workEmail: Yup.string()
            //   .trim()
            //   .email('Please enter a correct email address'),
            workAddress: Yup.string()
              .required('Personal Address is required'),
            workCity: Yup.string()
              .required('Please select the City of residence'),
            workPincode: Yup.string()
              .required('Please enter appropriate Pin/Zip code'),
            workPhone: Yup.string()
              .test('phone-check', 'Please enter a valid phone number prefixed with country code', (value) => {
                try {
                  const parsedPhoneNumber = parsePhoneNumber(value, 'IN').number;
                  return (
                    value == null
                  || (value === parsedPhoneNumber && isValidPhoneNumber(parsedPhoneNumber))
                  );
                } catch (error) {
                  return false;
                }
              }),
            workMobile: Yup.string()
              .test('phone-check', 'Please enter a valid phone number prefixed with country code', (value) => {
                try {
                  const parsedPhoneNumber = parsePhoneNumber(value, 'IN').number;
                  return (
                    value == null
                  || (value === parsedPhoneNumber && isValidPhoneNumber(parsedPhoneNumber))
                  );
                } catch (error) {
                  return false;
                }
              }),
            politicalExposure: Yup.boolean()
              .required('Please mark yes or no'),
            birthPlaceCity: Yup.string()
              .required('Please choose a birth city'),
            residenceStatus: Yup.string()
              .required('Residence status is required'),
            nonResTaxId: Yup.string()
              .nullable()
              .when('residenceStatus', {
                is: (value) => value === 'Resident',
                then: Yup.string().required('Please enter the Tax ID'),
                otherwise: Yup.string(),
              }),
            profession: Yup.string()
              .required('Please choose an appropriate option'),
            orgName: Yup.string().nullable(),
            industry: Yup.string()
              .required('Please choose an appropriate option'),
            loanDetails: Yup.string()
              .nullable()
              .min(3, 'Minimum 3 characters required'),
            riskProfile: Yup.string()
              .required('Please select appropriate risk profile'),
            contactOwner: Yup.string()
              .required('Contact Owner is required'),
            contactStatus: Yup.string()
              .required('Contact status is required'),
            contactSource: Yup.string()
              .required('Contact source is required'),
          })}
          onSubmit={async (values, { setSubmitting, setErrors, setStatus }) => {
            // setTimeout(() => {
            //   alert(JSON.stringify(values, null, 2));
            //   setSubmitting(false);
            // }, 400);

            try {
              await contactService.createContact(values);
              setSubmitting(false);
              toast.success('Contact created successfully');
              navigate('/contacts');
            } catch (error) {
              setSubmitting(false);
              // If error contains field-specific messages, map them using setErrors
              if (error.response && error.response.data && error.response.data.errors) {
                // Transform the array of errors into an object
                const formErrors = error.response.data.errors.reduce((acc, err) => {
                  acc[err.param] = err.msg;
                  return acc;
                }, {});
                setErrors(formErrors);
              } else {
                // Otherwise, set a general error message
                setStatus({ generalError: 'An unexpected error occurred. Please try again.' });
              }
            }
          }}
        >

          {({
            isSubmitting, values, errors, touched, setFieldValue,
          }) => (
            <Form>
              <ClearDependentFields />
              <div className="mt-6 ml-6">
                <h1 className="mb-4 text-base font-bold font-lato text-primary-dark-plutus">Personal Info</h1>
                <div className="flex flex-wrap gap-10">
                  <div>
                    <Field
                      name="referredBy"
                      component={FormDropdown}
                      isAsyncDropdown
                      label="Referred By"
                      placeholder="Start typing..."
                      loadOptions={loadContactOptions('contactNames')}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.referredBy}
                      touched={touched.referredBy}
                    />
                    <ErrorMessage component={ErrorText} name="referredBy" />
                  </div>
                  <div>
                    <Field
                      name="contactType"
                      component={FormDropdown}
                      label="Contact Type"
                      options={allOptions.options.contactType}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.contactType}
                      touched={touched.contactType}
                    />
                    <ErrorMessage component={ErrorText} name="contactType" />
                  </div>
                  <div>
                    <Field
                      name="groupHead"
                      component={FormDropdown}
                      label="Is a group head?"
                      options={allOptions.options.groupHead}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.groupHead}
                      touched={touched.groupHead}
                      onChange={(option) => {
                        setFieldValue('groupHead', option);
                        // If user selects that they are a group head, clear the group head name
                        if (option === true) {
                          setFieldValue('groupHeadName', '');
                        }
                      }}
                    />
                    <ErrorMessage component={ErrorText} name="groupHead" />
                  </div>
                  <div>
                    <Field
                      name="groupHeadName"
                      component={FormDropdown}
                      isAsyncDropdown
                      label="Group Head Name"
                      placeholder={values.groupHead ? 'Will be auto-assigned' : 'Start typing...'}
                      loadOptions={loadContactOptions('groupHeads')}
                      // options={allOptions.options.groupHead}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.groupHeadName}
                      touched={touched.groupHeadName}
                      disabled={values.groupHead}
                    />
                    <ErrorMessage component={ErrorText} name="groupHeadName" />
                  </div>
                  <div>
                    <Field
                      name="groupHeadRelation"
                      component={FormDropdown}
                      label="Relation to group head"
                      options={allOptions.options.relationGroupHead}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.groupHeadRelation}
                      touched={touched.groupHeadRelation}
                    />
                    <ErrorMessage component={ErrorText} name="groupHeadRelation" />
                  </div>
                  <div>
                    <Field
                      name="firstName"
                      label="First Name"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter First Name"
                      errors={errors.firstName}
                      touched={touched.firstName}
                    />
                    <ErrorMessage component={ErrorText} name="firstName" />
                  </div>
                  <div>
                    <Field
                      name="middleName"
                      label="Middle Name"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter Middle Name"
                      errors={errors.middleName}
                      touched={touched.middleName}
                    />
                    <ErrorMessage component={ErrorText} name="middleName" />
                  </div>
                  <div>
                    <Field
                      name="lastName"
                      label="Last Name"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter Last Name"
                      errors={errors.lastName}
                      touched={touched.lastName}
                    />
                    <ErrorMessage component={ErrorText} name="lastName" />
                  </div>
                  <div>
                    <Field
                      name="dob"
                      component={DateInput}
                      label="Date of Birth"
                      errors={errors.dob}
                      touched={touched.dob}
                      width="lg"
                      placeholder="DD/MM/YYYY"
                      iconClass="las la-calendar"
                      maxDate={new Date()}
                    />
                    <ErrorMessage component={ErrorText} name="dob" />
                  </div>
                  <div>
                    <Field
                      name="maritalStatus"
                      component={FormDropdown}
                      label="Marital Status"
                      options={allOptions.options.maritalStatus}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.maritalStatus}
                      touched={touched.maritalStatus}
                      onChange={(option) => {
                        // Update the maritalStatus; ClearDependentFields will clear
                        // anniversaryDate, if needed
                        setFieldValue('maritalStatus', option);
                      }}
                    />
                    <ErrorMessage component={ErrorText} name="maritalStatus" />
                  </div>
                  <div>
                    <Field
                      name="anniversaryDate"
                      component={DateInput}
                      label="Anniversary Date"
                      errors={errors.anniversaryDate}
                      width="lg"
                      placeholder="DD/MM/YYYY"
                      iconClass="las la-calendar"
                      disabled={values.maritalStatus !== 'Married'}
                      maxDate={new Date()}
                    />
                    <ErrorMessage component={ErrorText} name="anniversaryDate" />
                  </div>
                  <div>
                    <Field
                      name="politicalExposure"
                      component={FormDropdown}
                      label="Political Exposure"
                      options={allOptions.options.politicalExposure}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.politicalExposure}
                      touched={touched.politicalExposure}
                    />
                    <ErrorMessage component={ErrorText} name="politicalExposure" />
                  </div>
                  <div>
                    <Field
                      name="birthPlaceCity"
                      component={FormDropdown}
                      isAsyncDropdown
                      label="Birth Place City"
                      placeholder="Start typing..."
                      loadOptions={loadContactOptions('cities')}
                      defaultOptions={allOptions.options.birthPlaceCity}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.birthPlaceCity}
                      touched={touched.birthPlaceCity}
                    />
                    <ErrorMessage component={ErrorText} name="birthPlaceCity" />
                  </div>
                  <div>
                    <Field
                      name="profession"
                      component={FormDropdown}
                      label="Profession"
                      options={allOptions.options.profession}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.profession}
                      touched={touched.profession}
                    />
                    <ErrorMessage component={ErrorText} name="profession" />
                  </div>
                  <div>
                    <Field
                      name="orgName"
                      label="Organization Name"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter Org Name"
                      errors={errors.orgName}
                      touched={touched.orgName}
                    />
                    <ErrorMessage component={ErrorText} name="orgName" />
                  </div>
                  <div>
                    <Field
                      name="industry"
                      component={FormDropdown}
                      label="Industry"
                      options={allOptions.options.industry}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.industry}
                      touched={touched.industry}
                    />
                    <ErrorMessage component={ErrorText} name="industry" />
                  </div>
                </div>
              </div>
              <div className="mt-12 ml-6">
                <h1 className="mb-4 text-base font-bold font-lato text-primary-dark-plutus">Correspondence Info</h1>
                <div className="flex flex-wrap gap-10">
                  <div>
                    <Field
                      name="personalEmail"
                      label="Personal Email"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter email"
                      errors={errors.personalEmail}
                      touched={touched.personalEmail}
                    />
                    <ErrorMessage component={ErrorText} name="personalEmail" />
                  </div>
                  <div>
                    <Field
                      name="correspondenceEmail"
                      label="Correspondence Email"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter email"
                      errors={errors.correspondenceEmail}
                      touched={touched.correspondenceEmail}
                    />
                    <ErrorMessage component={ErrorText} name="correspondenceEmail" />
                  </div>
                  <div>
                    <Field
                      name="personalAddress"
                      label="Home Address"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter Address"
                      errors={errors.personalAddress}
                      touched={touched.personalAddress}
                    />
                    <ErrorMessage component={ErrorText} name="personalAddress" />
                  </div>
                  <div>
                    <Field
                      name="personalCity"
                      component={FormDropdown}
                      isAsyncDropdown
                      label="City (Home Address)"
                      placeholder="Start typing..."
                      loadOptions={loadContactOptions('cities')}
                      defaultOptions={allOptions.options.homeCity}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.personalCity}
                      touched={touched.personalCity}
                    />
                    <ErrorMessage component={ErrorText} name="personalCity" />
                  </div>
                  <div>
                    <Field
                      name="personalPincode"
                      label="Pincode/Zipcode (Home Address)"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter Pincode"
                      errors={errors.personalPincode}
                      touched={touched.personalPincode}
                    />
                    <ErrorMessage component={ErrorText} name="personalPincode" />
                  </div>
                  <div>
                    <Field
                      name="personalPhone"
                      label="Home Landline No."
                      as={TextInput}
                      width="lg"
                      // pattern="^[0-9 +]+$"
                      placeholder="Example: +911145524314"
                      errors={errors.personalPhone}
                      touched={touched.personalPhone}
                    />
                    <ErrorMessage component={ErrorText} name="personalPhone" />
                  </div>
                  <div>
                    <Field
                      name="personalMobile"
                      label="Personal Mobile No."
                      as={TextInput}
                      width="lg"
                      // pattern="/^[0-9 +]+$/"
                      placeholder="Example: +919810398750"
                      errors={errors.personalMobile}
                      touched={touched.personalMobile}
                    />
                    <ErrorMessage component={ErrorText} name="personalMobile" />
                  </div>
                  <div>
                    <Field
                      name="workAddress"
                      label="Work Address"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter Address"
                      errors={errors.workAddress}
                      touched={touched.workAddress}
                    />
                    <ErrorMessage component={ErrorText} name="workAddress" />
                  </div>
                  <div>
                    <Field
                      name="workCity"
                      component={FormDropdown}
                      isAsyncDropdown
                      label="City (Work Address)"
                      placeholder="Start typing..."
                      loadOptions={loadContactOptions('cities')}
                      defaultOptions={allOptions.options.workCity}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.workCity}
                      touched={touched.workCity}
                    />
                    <ErrorMessage component={ErrorText} name="workCity" />
                  </div>
                  <div>
                    <Field
                      name="workPincode"
                      label="Pincode/Zipcode (Work Address)"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter Pincode"
                      errors={errors.workPincode}
                      touched={touched.workPincode}
                    />
                    <ErrorMessage component={ErrorText} name="workPincode" />
                  </div>
                  <div>
                    <Field
                      name="workPhone"
                      label="Work Landline No."
                      as={TextInput}
                      width="lg"
                      // pattern="/^[0-9 +]+$/"
                      placeholder="Example: +911145524314"
                      errors={errors.workPhone}
                      touched={touched.workPhone}
                    />
                    <ErrorMessage component={ErrorText} name="workPhone" />
                  </div>
                  <div>
                    <Field
                      name="workMobile"
                      label="Work Mobile No."
                      as={TextInput}
                      width="lg"
                      // pattern="/^[0-9 +]+$/"
                      placeholder="Example: +919810398750"
                      errors={errors.workMobile}
                      touched={touched.workMobile}
                    />
                    <ErrorMessage component={ErrorText} name="workMobile" />
                  </div>
                </div>
              </div>
              <div className="mt-12 ml-6">
                <h1 className="mb-4 text-base font-bold font-lato text-primary-dark-plutus">Financial Info</h1>
                <div className="flex flex-wrap gap-10">
                  <div>
                    <Field
                      name="grossAnnualIncome"
                      label="Gross Annual Income (in Rs.)"
                      as={TextInput}
                      type="number"
                      width="lg"
                      placeholder="Enter Gross Annual Income"
                      errors={errors.grossAnnualIncome}
                      touched={touched.grossAnnualIncome}
                    />
                    <ErrorMessage component={ErrorText} name="grossAnnualIncome" />
                  </div>
                  <div>
                    <Field
                      name="residenceStatus"
                      component={FormDropdown}
                      label="Residence Status"
                      options={allOptions.options.residenceStatus}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.residenceStatus}
                      touched={touched.residenceStatus}
                    />
                    <ErrorMessage component={ErrorText} name="residenceStatus" />
                  </div>
                  <div>
                    <Field
                      name="nonResTaxId"
                      label="Non Resident Tax ID"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter Tax ID"
                      errors={errors.nonResTaxId}
                      touched={touched.nonResTaxId}
                    />
                    <ErrorMessage component={ErrorText} name="nonResTaxId" />
                  </div>
                  <div>
                    <Field
                      name="loanDetails"
                      label="Loan Details"
                      as={TextInput}
                      width="lg"
                      placeholder="Enter Tax ID"
                      errors={errors.loanDetails}
                      touched={touched.loanDetails}
                    />
                    <ErrorMessage component={ErrorText} name="loanDetails" />
                  </div>
                  <div>
                    <Field
                      name="riskProfile"
                      component={FormDropdown}
                      label="Risk Profile"
                      options={allOptions.options.riskProfile}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.riskProfile}
                      touched={touched.riskProfile}
                    />
                    <ErrorMessage component={ErrorText} name="riskProfile" />
                  </div>
                </div>
              </div>
              <div className="mt-12 ml-6">
                <h1 className="mb-4 text-base font-bold font-lato text-primary-dark-plutus">Other Info</h1>
                <div className="flex flex-wrap gap-10">
                  <div>
                    <Field
                      name="contactOwner"
                      component={FormDropdown}
                      label="Contact Owner"
                      options={allOptions.options.contactOwner}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.contactOwner}
                      touched={touched.contactOwner}
                    />
                    <ErrorMessage component={ErrorText} name="contactOwner" />
                  </div>
                  <div>
                    <Field
                      name="contactStatus"
                      component={FormDropdown}
                      label="Contact Status"
                      options={allOptions.options.contactStatus}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.contactStatus}
                      touched={touched.contactStatus}
                    />
                    <ErrorMessage component={ErrorText} name="contactStatus" />
                  </div>
                  <div>
                    <Field
                      name="contactSource"
                      component={FormDropdown}
                      label="Contact Source"
                      options={allOptions.options.contactSource}
                      isMulti={false}
                      isLoading={loading}
                      loadingMessage={LoadingMessage}
                      errors={errors.contactSource}
                      touched={touched.contactSource}
                    />
                    <ErrorMessage component={ErrorText} name="contactSource" />
                  </div>
                </div>
              </div>
              <div className="mt-12 mb-4 ml-6">
                <Button buttonText="Create" type="submit" disabled={isSubmitting} colorVariant="primary" />
              </div>
            </Form>
          )}

        </Formik>
      </div>
    </div>
  );
};

NewContactContent.propTypes = {};

export default NewContactContent;
