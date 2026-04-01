import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';

import userService from '../auth/userService';

// Components
import FormDropdown from '../../common/form/FormDropdown';
import DateInput from '../../common/form/DateInput';
import Button from '../../common/form/Button';
import { getLifeEvents, reset } from './reportsSlice';

const rangeOptions = [
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
];

const monthOptions = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

const eventTypeOptions = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
];

const ResultRow = ({ data }) => {
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    const firstInitial = names[0] ? names[0][0] : '';
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const displayType = data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : '';

  return (
    <div className="flex items-center justify-between col-span-12 p-4 mb-2 bg-white border rounded-md shadow-sm border-outline-grey-plutus">
      <div className="flex items-center w-1/4">
        <div className="flex items-center justify-center w-10 h-10 mr-3 text-sm font-bold text-white rounded-full bg-primary-blue-plutus">
          {getInitials(data.contactName)}
        </div>
        <Link to={`/contacts/${data.contactId}`} className="font-bold text-primary-dark-plutus hover:underline hover:text-primary-blue-plutus">
          {data.contactName}
        </Link>
      </div>
      <div className="w-1/4 text-sm font-medium text-primary-dark-plutus">{data.contactEmail}</div>
      <div className="w-1/4 text-sm font-medium text-primary-dark-plutus">{data.phoneNumber || '-'}</div>
      <div className="w-1/6 text-sm font-medium text-primary-dark-plutus">{formatDate(data.date)}</div>
      <div className="w-1/12 text-sm text-center">
        <span className={`px-2 py-1 rounded text-xs ${data.type === 'birthday' ? 'bg-secondary-green-plutus bg-opacity-20 text-green-700' : 'bg-secondary-yellow-plutus bg-opacity-20 text-yellow-700'}`}>
          {displayType}
        </span>
      </div>
    </div>
  );
};

ResultRow.propTypes = {
  data: PropTypes.shape({
    contactId: PropTypes.string,
    contactName: PropTypes.string,
    contactEmail: PropTypes.string,
    phoneNumber: PropTypes.string,
    date: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

const BirthdayAnniversaryReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    lifeEvents, isLoading, isSuccess, isError, message,
  } = useSelector((state) => state.reports);

  const [activeFilterTypes, setActiveFilterTypes] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Reset state on load
  useEffect(() => {
    dispatch(reset());
    setHasSearched(false);
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
        toast.error('Your session has expired. Please login again.');
        navigate('/');
      } else {
        toast.error(message);
      }
      dispatch(reset()); // Clear error so it doesn't persist
    }
  }, [isError, message, navigate, dispatch]);

  const filteredLifeEvents = lifeEvents.filter((item) => {
    if (activeFilterTypes.length === 0) return true;
    const itemType = item.type ? item.type.toLowerCase().trim() : '';
    return itemType && activeFilterTypes.includes(itemType);
  });

  const validationSchema = Yup.object().shape({
    range: Yup.string().required('Required'),
    eventTypes: Yup.array().min(1, 'Select at least one event type').required('Required'),
    specificDate: Yup.date().nullable().when('range', {
      is: 'day',
      then: (schema) => schema.required('Date is required for Day range'),
    }),
    month: Yup.string().nullable().when('range', {
      is: 'month',
      then: (schema) => schema.required('Month is required'),
    }),
  });

  const handleSubmit = (values) => {
    const user = userService.getUser();
    if (!user) {
      toast.error('Your session has expired. Please login again.');
      navigate('/');
      return;
    }

    setHasSearched(true);
    dispatch(reset());

    const {
      range, specificDate, month, eventTypes,
    } = values;

    const types = (eventTypes || [])
      .map((t) => {
        if (typeof t === 'string') return t.toLowerCase();
        if (t && t.value) return t.value.toLowerCase();
        return null;
      })
      .filter(Boolean);

    setActiveFilterTypes(types);

    const apiParams = {};

    if (types.includes('birthday') && types.includes('anniversary')) {
      apiParams.type = 'both';
    } else if (types.length === 1) {
      [apiParams.type] = types;
    }

    if (range === 'day' && specificDate) {
      apiParams.month = specificDate.getMonth() + 1;
      apiParams.day = specificDate.getDate();
    } else if (range === 'month' && month !== '') {
      apiParams.month = parseInt(month, 10) + 1;
    }

    dispatch(getLifeEvents(apiParams));
  };

  return (
    <div className="flex-1 h-full px-8 pt-2 pb-8 overflow-y-auto bg-background-lightgrey-plutus">
      <div className="p-8 bg-white rounded-lg shadow-sm">
        <h2 className="mb-6 text-lg font-bold text-primary-dark-plutus">Generate Birthday/Anniversary List</h2>

        <Formik
          initialValues={{
            range: 'day',
            specificDate: null,
            month: '',
            eventTypes: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting: formLoading }) => (
            <Form>
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <Field
                    component={FormDropdown}
                    name="range"
                    label="Select the Range of data"
                    placeholder="Select range"
                    options={rangeOptions}
                    isMulti={false}
                  />
                </div>
                <div>
                  {values.range === 'day' && (
                    <Field
                      component={DateInput}
                      name="specificDate"
                      label="Select a date"
                      width="lg"
                      placeholder="dd/mm/yyyy"
                      iconClass="las la-calendar"
                    />
                  )}
                  {values.range === 'month' && (
                    <Field
                      component={FormDropdown}
                      name="month"
                      label="Select a month"
                      placeholder="Select month"
                      options={monthOptions}
                      isMulti={false}
                    />
                  )}
                </div>
              </div>

              <div className="w-1/2 pr-4 mb-8">
                <Field
                  component={FormDropdown}
                  name="eventTypes"
                  label="Select the Event types"
                  placeholder="Select types"
                  options={eventTypeOptions}
                  isMulti
                />
              </div>

              <div className="mb-2">
                <Button
                  buttonText={isLoading ? 'Generating...' : 'Generate Report'}
                  type="submit"
                  colorVariant="primary"
                  disabled={isLoading || formLoading}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Results Section */}
      {isSuccess && filteredLifeEvents.length > 0 && !isLoading && (
        <div className="mt-8">
          <div className="flex justify-end mb-4" title="Export to PDF feature coming soon">
            <Button
              buttonText="EXPORT TO PDF"
              type="button"
              colorVariant="primary"
              className="!bg-skyblue-plutus !text-primary-blue-plutus hover:!bg-blue-100 border-none shadow-none cursor-not-allowed"

            />
          </div>
          <div className="flex flex-col">
            {filteredLifeEvents.map((item) => (
              <ResultRow key={item.contactId} data={item} />
            ))}
          </div>
        </div>
      )}

      {/* Empty Search State */}
      {hasSearched && !isLoading && isSuccess && filteredLifeEvents.length === 0 && (
        <div className="mt-8 text-center text-primary-grey-plutus">
          <p className="text-lg font-medium">No birthdays or anniversaries found.</p>
          <p className="text-sm">Try adjusting your selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default BirthdayAnniversaryReport;
