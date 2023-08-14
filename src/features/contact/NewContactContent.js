import React from 'react';

import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import ErrorText from '../../common/form/ErrorText';
import FormDropdown from '../../common/form/FormDropdown';
import TextInput from '../../common/form/TextInput';
import DateInput from '../../common/form/DateInput';
import Button from '../../common/form/Button';

const testOptions = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'blueberry', label: 'Blueberry' },
];

const NewContactContent = () => (
  <div className="flex justify-center w-full h-full pb-4">
    <div className="w-[96%] bg-white rounded-lg">
      <Formik
        initialValues={{
          referredBy: '',
          contactType: '',
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
          personalAddress: '',
          personalCity: '',
          personalPincode: '',
          personalPhone: '',
          personalMobile: '',
          workEmail: '',
          workAddress: '',
          workCity: '',
          workPincode: '',
          workPhone: '',
          workMobile: '',
          politicalExposure: false,
          birthPlaceCity: '',
          residenceStatus: '',
          nonResTaxId: '',
          profession: '',
          loanDetails: '',
          riskProfile: '',
          contactOwner: '',
          contactStatus: '',
        }}
        validationSchema={Yup.object({
          referredBy: Yup.string(),
          contactType: Yup.string()
            .required('Contact Type is requried'),
          groupHead: Yup.boolean()
            .required('Mark true if contact is a group head, else false'),
          groupHeadRelation: Yup.string()
            .when('groupHead', {
              is: true,
              then: Yup.string().oneOf(['self'], 'Relation is self if contact is group head'),
              otherwise: Yup.string().notOneOf(['self'], 'Relation cannot be self since contact is not group head'),
            }),
          firstName: Yup.string()
            .required('First name is required'),
          middleName: Yup.string(),
          lastName: Yup.string()
            .required('Last name is required'),
          dob: Yup.date()
            .nullable()
            .transform((curr, orig) => (orig === '' ? null : curr))
            .required('Date cannot be blank.')
            .max(new Date(), 'Please enter a valid date'),
          maritalStatus: Yup.string()
            .required('Marital status is required'),
          anniversaryDate: Yup.date()
            .nullable()
            .transform((curr, orig) => (orig === '' ? null : curr))
            .required('Date cannot be blank')
            .max(new Date(), 'Please enter a valid date'),
          grossAnnualIncome: Yup.number()
            .positive('Gross Annual Income must be greater than 0')
            .required('Gross Annual Income is required'),
          personalEmail: Yup.string()
            .trim()
            .email('Please enter a correct email address')
            .required('Personal email is required'),
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
          workEmail: Yup.string()
            .trim()
            .email('Please enter a correct email address'),
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
            .when('residenceStatus', {
              is: (value) => value === 'Resident',
              then: Yup.string().required('Please enter the Tax ID'),
              otherwise: Yup.string(),
            }),
          profession: Yup.string()
            .required('Please choose an appropriate option'),
          loanDetails: Yup.string(),
          riskProfile: Yup.string()
            .required('Please select appropriate risk profile'),
          contactOwner: Yup.string()
            .required('Contact Owner is required'),
          contactStatus: Yup.string()
            .required('Contact status is required'),
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
            <div className="mt-6 ml-6">
              <h1 className="mb-4 text-base font-bold font-lato text-primary-dark-plutus">Personal Info</h1>
              <div className="flex flex-wrap gap-10">
                <div>
                  <Field
                    name="referredBy"
                    component={FormDropdown}
                    label="Referred By"
                    options={testOptions}
                    isMulti={false}
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
                    options={testOptions}
                    isMulti={false}
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
                    options={testOptions}
                    isMulti={false}
                    errors={errors.groupHead}
                    touched={touched.groupHead}
                  />
                  <ErrorMessage component={ErrorText} name="groupHead" />
                </div>
                <div>
                  <Field
                    name="groupHeadRelation"
                    component={FormDropdown}
                    label="Relation to group head"
                    options={testOptions}
                    isMulti={false}
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
                  />
                  <ErrorMessage component={ErrorText} name="dob" />
                </div>
                <div>
                  <Field
                    name="maritalStatus"
                    component={FormDropdown}
                    label="Marital Status"
                    options={testOptions}
                    isMulti={false}
                    errors={errors.maritalStatus}
                    touched={touched.maritalStatus}
                  />
                  <ErrorMessage component={ErrorText} name="maritalStatus" />
                </div>
                <div>
                  <Field
                    name="anniversaryDate"
                    component={DateInput}
                    label="Anniversary Date"
                    errors={errors.anniversaryDate}
                    touched={touched.anniversaryDate}
                    width="lg"
                    placeholder="DD/MM/YYYY"
                    iconClass="las la-calendar"
                  />
                  <ErrorMessage component={ErrorText} name="anniversaryDate" />
                </div>
                <div>
                  <Field
                    name="politicalExposure"
                    component={FormDropdown}
                    label="Political Exposure"
                    options={testOptions}
                    isMulti={false}
                    errors={errors.politicalExposure}
                    touched={touched.politicalExposure}
                  />
                  <ErrorMessage component={ErrorText} name="politicalExposure" />
                </div>
                <div>
                  <Field
                    name="birthPlaceCity"
                    component={FormDropdown}
                    label="Birth Place City"
                    options={testOptions}
                    isMulti={false}
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
                    options={testOptions}
                    isMulti={false}
                    errors={errors.profession}
                    touched={touched.profession}
                  />
                  <ErrorMessage component={ErrorText} name="profession" />
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
                    label="City (Home Address)"
                    options={testOptions}
                    isMulti={false}
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
                    pattern="/^[0-9 +]+$/"
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
                    pattern="/^[0-9 +]+$/"
                    placeholder="Example: +919810398750"
                    errors={errors.personalMobile}
                    touched={touched.personalMobile}
                  />
                  <ErrorMessage component={ErrorText} name="personalMobile" />
                </div>
                <div>
                  <Field
                    name="workEmail"
                    label="Work Email"
                    as={TextInput}
                    width="lg"
                    placeholder="Enter email"
                    errors={errors.workEmail}
                    touched={touched.workEmail}
                  />
                  <ErrorMessage component={ErrorText} name="workEmail" />
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
                    label="City (Work Address)"
                    options={testOptions}
                    isMulti={false}
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
                    pattern="/^[0-9 +]+$/"
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
                    pattern="/^[0-9 +]+$/"
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
                    options={testOptions}
                    isMulti={false}
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
                    options={testOptions}
                    isMulti={false}
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
                    options={testOptions}
                    isMulti={false}
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
                    options={testOptions}
                    isMulti={false}
                    errors={errors.contactStatus}
                    touched={touched.contactStatus}
                  />
                  <ErrorMessage component={ErrorText} name="contactStatus" />
                </div>
              </div>
            </div>
            <div className="mt-12 mb-4 ml-6">
              <Button buttonText="Create" type="submit" colorVariant="primary" />
            </div>
          </Form>
        )}

      </Formik>
    </div>
  </div>
);

NewContactContent.propTypes = {};

export default NewContactContent;
