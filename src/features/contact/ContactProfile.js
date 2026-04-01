import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import TextInput from '../../common/form/TextInput';
import FormDropdown from '../../common/form/FormDropdown';
import Button from '../../common/form/Button';
import AppLayout from '../../common/appLayout/AppLayout';
import contactService from './ContactService';
import ContactHistory from './ContactHistory';
import userService from '../auth/userService';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import DateInput from '../../common/form/DateInput';
import TimePicker from '../../common/form/TimePicker';

const CollapsibleSection = ({
  title, children, onToggle, isCollapsed, extraHeaderContent,
}) => (
  <div className="mb-6">
    <div
      className="flex items-center justify-between mb-3 cursor-pointer select-none"
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onToggle();
      }}
      role="button"
      tabIndex={0}
      aria-expanded={!isCollapsed}
    >
      <h2 className="text-base font-bold text-primary-dark-plutus">{title}</h2>
      <div className="flex items-center">
        {extraHeaderContent}
        <i className={`las la-angle-${isCollapsed ? 'down' : 'up'} text-xl text-primary-grey-plutus ml-2`} />
      </div>
    </div>
    {!isCollapsed && <div className="pl-1 pr-1">{children}</div>}
  </div>
);

CollapsibleSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onToggle: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  extraHeaderContent: PropTypes.node,
};

CollapsibleSection.defaultProps = {
  extraHeaderContent: null,
};

const fieldToApiIdentifier = {
  correspondence_email: 'correspondenceEmail',
  personal_mobile: 'personalMobile',
  personal_address: 'personalAddress',
  contact_owner_name: 'contactOwner',
  contact_status: 'contactStatus',
  contact_type_name: 'contactType',
};

const dropdownFieldToOptionsType = {
  contact_owner_name: 'contactOwners',
  contact_status: 'contactStatuses',
  contact_type_name: 'contactTypes',
};

const normalizeOptions = (options = []) => {
  if (!Array.isArray(options)) {
    return [];
  }

  const labelKeys = ['label', 'name', 'full_name', 'title', 'status', 'value'];
  const valueKeys = ['value', 'id', 'uuid', 'code', 'key', 'name', 'label'];

  return options
    .map((option) => {
      if (!option) return null;

      if (typeof option === 'string') {
        const trimmed = option.trim();
        return trimmed ? { label: trimmed, value: trimmed } : null;
      }

      const labelKey = labelKeys.find((key) => option[key] !== undefined && option[key] !== null);
      const valueKey = valueKeys.find((key) => option[key] !== undefined && option[key] !== null);

      let labelValue = null;
      if (labelKey) {
        labelValue = option[labelKey];
      } else if (valueKey) {
        labelValue = option[valueKey];
      }

      if (labelValue === null || labelValue === undefined) return null;

      const value = valueKey ? option[valueKey] : labelValue;

      return {
        ...option,
        label: String(labelValue),
        value,
      };
    })
    .filter(Boolean);
};

const ProfileSideBar = ({
  contactDetails,
  onViewHistoryClick,
  onUpdateContact,
  onUpdateSuccess,
}) => {
  const [isAboutCollapsed, setIsAboutCollapsed] = useState(false);
  const [isFamilyCollapsed, setIsFamilyCollapsed] = useState(false);
  const [isDealsCollapsed, setIsDealsCollapsed] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [confirmationState, setConfirmationState] = useState({ isOpen: false, isLoading: false });

  const {
    contact_id: contactId,
    first_name: firstName,
    last_name: lastName,
    profession_name: professionName,
    org_name: orgName,
    industry,
    correspondence_email: correspondenceEmail,
    personal_mobile: personalMobile,
    personal_address: personalAddress,
    personal_city_name: personalCityName,
    personal_pincode: personalPincode,
    contact_owner_name: contactOwnerName,
    contact_status: contactStatus,
    contact_type_name: contactTypeName,
    family_relationships: familyRelationships = [],
  } = contactDetails || {};

  const handleEditField = async (fieldKey, currentValue, fieldType) => {
    setEditingField(fieldKey);
    setDropdownOptions([]);
    setSelectedDropdownOption(null);

    if (fieldType === 'dropdown') {
      const initialSelection = currentValue
        ? { label: String(currentValue), value: currentValue }
        : null;
      setFieldValue(initialSelection ? initialSelection.value : '');
      setSelectedDropdownOption(initialSelection);

      const optionsType = dropdownFieldToOptionsType[fieldKey];
      if (!optionsType) {
        setDropdownOptions([]);
        return;
      }

      setIsLoadingOptions(true);
      try {
        const options = await contactService.getFilteredOptions(optionsType);
        const normalizedOptions = normalizeOptions(options);
        setDropdownOptions(normalizedOptions);

        if (initialSelection) {
          const matchedOption = normalizedOptions.find(
            (option) => option.label === initialSelection.label
              || String(option.value) === String(initialSelection.value),
          );
          if (matchedOption) {
            setSelectedDropdownOption(matchedOption);
            setFieldValue(matchedOption.value);
          }
        }
      } catch (error) {
        toast.error(`Failed to load options for ${fieldKey}.`);
      } finally {
        setIsLoadingOptions(false);
      }
    } else {
      setFieldValue(currentValue || '');
      setDropdownOptions([]);
    }
  };

  const handleSave = async (newValue, fieldType, formikActions) => {
    if (!editingField) return;

    const { setSubmitting } = formikActions;
    const originalValue = contactDetails[editingField.replace('_name', '')];
    const updatedValue = newValue ?? '';
    const isDropdown = fieldType === 'dropdown';

    if (String(updatedValue ?? '') === String(originalValue ?? '')) {
      setEditingField(null);
      setFieldValue('');
      setSelectedDropdownOption(null);
      setDropdownOptions([]);
      return;
    }

    const transformedPayload = Object.entries(contactDetails || {})
      .reduce((accumulator, [key, value]) => {
        const apiKey = fieldToApiIdentifier[key] || key;
        accumulator[apiKey] = value;
        return accumulator;
      }, {});

    const apiFieldName = fieldToApiIdentifier[editingField];
    transformedPayload[apiFieldName] = updatedValue;

    if (isDropdown) {
      const labelOption = selectedDropdownOption
        || dropdownOptions.find((option) => String(option.value) === String(updatedValue));
      transformedPayload[editingField] = labelOption?.label ?? '';
    }

    setConfirmationState({
      isOpen: true,
      isLoading: false,
      title: 'Confirm Change',
      message: 'Are you sure you want to update this field?',
      onConfirm: async () => {
        setConfirmationState((previous) => ({ ...previous, isLoading: true }));
        try {
          const response = await onUpdateContact(contactId, transformedPayload);
          toast.success(response.message || 'Contact updated successfully!');
          onUpdateSuccess(); // Tell parent to refetch

          setConfirmationState({ isOpen: false, isLoading: false });
          setEditingField(null);
          setFieldValue('');
          setSelectedDropdownOption(null);
          setDropdownOptions([]);
        } catch (error) {
          const apiErrorArray = error.response?.data?.errors || error.errors;
          let validationMessage = null;

          if (Array.isArray(apiErrorArray)) {
            const errorForField = apiErrorArray.find((err) => err.param === apiFieldName);
            if (errorForField) {
              validationMessage = errorForField.msg;
            }
          }

          const generalMessage = error.response?.data?.message;
          toast.error(validationMessage || generalMessage || 'Failed to update contact.');
          setConfirmationState({ isOpen: false, isLoading: false });
        } finally {
          setSubmitting(false);
        }
      },
      onCancel: () => {
        setConfirmationState({ isOpen: false, isLoading: false });
        setSubmitting(false);
      },
    });
  };

  const handleCancel = () => {
    setEditingField(null);
    setFieldValue('');
    setSelectedDropdownOption(null);
    setDropdownOptions([]);
  };

  const handleCancelConfirmation = () => {
    if (!confirmationState.isLoading) {
      setConfirmationState({ isOpen: false, isLoading: false });
    }
  };

  const loadDropdownOptions = (optionsType) => async (inputValue) => {
    if (!optionsType) return [];
    try {
      const options = await contactService.getFilteredOptions(optionsType, inputValue);
      const normalized = normalizeOptions(options);
      setDropdownOptions((previous) => {
        const merged = [...previous];
        normalized.forEach((option) => {
          const exists = merged.some((item) => String(item.value) === String(option.value));
          if (!exists) {
            merged.push(option);
          }
        });
        return merged;
      });
      return normalized;
    } catch (error) {
      toast.error('Failed to fetch options.');
      return [];
    }
  };

  const deals = [
    {
      id: 'd1',
      name: 'Tasty Inc. - New Cupcake Deal',
      amount: 10000,
      closeDate: '2001-10-31T00:00:00.000Z',
      stage: 'Appointment scheduled',
    },
    {
      id: 'd2',
      name: 'Holiday Season Special',
      amount: 25000,
      closeDate: '2025-12-01T00:00:00.000Z',
      stage: 'Proposal',
    },
  ];

  const getJobRoleDisplay = () => {
    if (professionName && orgName) return `${professionName} at ${orgName}`;
    if (professionName) return professionName;
    if (orgName) return `Works at ${orgName}`;
    if (industry) return `Industry: ${industry}`;
    return '';
  };

  const getFullAddress = useCallback(
    () => [personalAddress, personalCityName, personalPincode].filter(Boolean).join(', '),
    [personalAddress, personalCityName, personalPincode],
  );

  const handleViewAllProperties = () => {};

  const handleViewHistory = () => {
    onViewHistoryClick();
  };

  const handleAddDeal = (event) => {
    event.stopPropagation();
  };

  const aboutFields = useMemo(
    () => [
      {
        label: 'Correspondence Email',
        value: correspondenceEmail,
        field: 'correspondence_email',
        type: 'text',
      },
      {
        label: 'Personal Mobile',
        value: personalMobile,
        field: 'personal_mobile',
        type: 'text',
      },
      {
        label: 'Personal Address',
        value: getFullAddress(),
        field: 'personal_address',
        type: 'text',
      },
      {
        label: 'Contact Owner',
        value: contactOwnerName,
        field: 'contact_owner_name',
        type: 'dropdown',
      },
      {
        label: 'Contact Status',
        value: contactStatus,
        field: 'contact_status',
        type: 'dropdown',
      },
      {
        label: 'Contact Type',
        value: contactTypeName,
        field: 'contact_type_name',
        type: 'dropdown',
      },
    ],
    [
      correspondenceEmail,
      personalMobile,
      contactOwnerName,
      contactStatus,
      contactTypeName,
      getFullAddress,
    ],
  );

  if (!contactDetails) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <BeatLoader color="#5E81F4" size={15} />
      </div>
    );
  }

  return (
    <div className="w-full h-full px-4 pt-6 pb-4 overflow-x-hidden overflow-y-auto text-sm bg-white border-r shadow-sm border-outline-grey-plutus font-lato">
      {confirmationState.isOpen && (
        <ConfirmationDialog
          title={confirmationState.title}
          message={confirmationState.message}
          onConfirm={confirmationState.onConfirm}
          onCancel={confirmationState.onCancel || handleCancelConfirmation}
          confirmButtonClass="bg-primary-blue-plutus text-white hover:bg-blue-700"
          isLoading={confirmationState.isLoading}
        />
      )}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-primary-dark-plutus">
          {firstName}
          {' '}
          {lastName}
        </h1>
        <p className="text-xs text-primary-grey-plutus">{getJobRoleDisplay()}</p>
      </div>

      <CollapsibleSection
        title="About this contact"
        isCollapsed={isAboutCollapsed}
        onToggle={() => setIsAboutCollapsed(!isAboutCollapsed)}
      >
        <div className="space-y-3.5">
          {aboutFields.map(({
            label, value, field, type,
          }) => (
            <div key={field} className="group">
              {editingField === field ? (
                <Formik
                  initialValues={{ value: fieldValue ?? '' }}
                  enableReinitialize
                  onSubmit={(values, actions) => handleSave(values.value, type, actions)}
                >
                  {({
                    handleSubmit,
                    resetForm,
                    errors,
                    touched,
                    isSubmitting,
                  }) => (
                    <form className="flex items-start justify-between" onSubmit={handleSubmit}>
                      <div className="flex-1 pr-2">
                        {type === 'dropdown' ? (
                          <Field name="value">
                            {({ field: formikField, form, meta }) => {
                              const fieldWithResetOnBlur = {
                                ...formikField,
                                onBlur: (event) => {
                                  if (!isSubmitting && !confirmationState.isOpen) {
                                    formikField.onBlur(event);
                                    resetForm();
                                    handleCancel();
                                  }
                                },
                              };

                              const formWithSelectionTracking = {
                                ...form,
                                setFieldValue: (name, val, shouldValidate) => {
                                  if (name === formikField.name) {
                                    const matchingOption = dropdownOptions.find(
                                      (option) => String(option.value) === String(val),
                                    );
                                    setSelectedDropdownOption(matchingOption || null);
                                  }
                                  return form.setFieldValue(name, val, shouldValidate);
                                },
                              };

                              return (
                                <div className="[&_label]:text-xs [&_label]:font-normal">
                                  <FormDropdown
                                    field={fieldWithResetOnBlur}
                                    form={formWithSelectionTracking}
                                    label={label}
                                    placeholder={`Select ${label}`}
                                    isMulti={false}
                                    isAsyncDropdown
                                    loadOptions={loadDropdownOptions(
                                      dropdownFieldToOptionsType[field],
                                    )}
                                    defaultOptions={dropdownOptions}
                                    options={dropdownOptions}
                                    isLoading={isLoadingOptions}
                                    errors={meta.error || errors.value}
                                    touched={meta.touched || touched.value}
                                    width="100%"
                                  />
                                </div>
                              );
                            }}
                          </Field>
                        ) : (
                          <Field name="value">
                            {({ field: formikField }) => (
                              <div className="[&_label]:text-xs [&_label]:font-normal [&_input]:text-sm [&_input]:font-normal">
                                <TextInput
                                  name={formikField.name}
                                  value={formikField.value}
                                  onChange={formikField.onChange}
                                  label={label}
                                  errors={errors.value}
                                  touched={touched.value}
                                  onBlur={(event) => {
                                    if (!isSubmitting && !confirmationState.isOpen) {
                                      formikField.onBlur(event);
                                      resetForm();
                                      handleCancel();
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </Field>
                        )}
                      </div>
                      <div className="flex items-center">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          onPointerDown={(event) => event.preventDefault()}
                          onMouseDown={(event) => event.preventDefault()}
                          className="p-1 ml-2 -mt-1 -mr-1 text-primary-blue-plutus"
                          aria-label={`Save ${label}`}
                        >
                          <i className="text-base las la-save" />
                        </button>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => {
                            resetForm();
                            handleCancel();
                          }}
                          className="p-1 ml-1 -mt-1 -mr-1 text-primary-grey-plutus"
                          aria-label={`Cancel editing ${label}`}
                        >
                          <i className="text-base las la-times" />
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-primary-grey-plutus mb-0.5">{label}</p>
                    <p className="text-sm font-medium break-words text-primary-dark-plutus">
                      {value || <span className="italic text-primary-grey-plutus">Not available</span>}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleEditField(field, value, type)}
                      className="p-1 ml-2 -mt-1 -mr-1 transition-opacity opacity-0 text-primary-grey-plutus hover:text-primary-blue-plutus group-hover:opacity-100"
                      aria-label={`Edit ${label}`}
                    >
                      <i className="text-base las la-edit" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <div className="flex my-5 space-x-2.5">
        <Button
          type="button"
          buttonText="View all Properties"
          onClick={handleViewAllProperties}
          className="flex-1 !bg-skyblue-plutus !text-primary-blue-plutus hover:!bg-primary-blue-plutus hover:!text-white !font-semibold !py-2 !text-xs"
          colorVariant="inactive"
        />
        <Button
          type="button"
          buttonText="View History"
          onClick={handleViewHistory}
          className="flex-1 !bg-skyblue-plutus !text-primary-blue-plutus hover:!bg-primary-blue-plutus hover:!text-white !font-semibold !py-2 !text-xs"
          colorVariant="inactive"
        />
      </div>

      <CollapsibleSection
        title="Family Members"
        isCollapsed={isFamilyCollapsed}
        onToggle={() => setIsFamilyCollapsed(!isFamilyCollapsed)}
      >
        {familyRelationships && familyRelationships.length > 0 ? (
          <ul className="p-0 space-y-2.5 list-none">
            {familyRelationships.map((member) => (
              <li key={member.contact_id} className="text-sm text-primary-dark-plutus">
                <span className="font-medium">{member.full_name}</span>
                <span className="text-primary-grey-plutus">
                  {' '}
                  (
                  {member.relationship_to_contact}
                  )
                </span>
                {member.is_group_head && (
                  <span className="ml-2 text-xs font-semibold text-green-600">(Group Head)</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs italic text-primary-grey-plutus">No family members listed.</p>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Deals"
        isCollapsed={isDealsCollapsed}
        onToggle={() => setIsDealsCollapsed(!isDealsCollapsed)}
        extraHeaderContent={(
          <button
            type="button"
            onClick={handleAddDeal}
            className="mr-1 text-xs text-primary-blue-plutus hover:underline disabled:opacity-60 disabled:cursor-not-allowed disabled:no-underline"
            title="Adding new deals is coming soon!"
            disabled
          >
            + Add
          </button>
        )}
      >
        <div className="space-y-3">
          {deals && deals.length > 0 ? (
            deals.map((deal) => (
              <div
                key={deal.id}
                className="p-2.5 border border-outline-grey-plutus rounded bg-outline-grey-plutus opacity-70 cursor-not-allowed"
                title="Deal details are for display only. Full feature coming soon."
              >
                <h3 className="text-xs font-bold leading-tight text-primary-dark-plutus">{deal.name}</h3>
                <p className="mt-0.5 text-xs text-primary-grey-plutus">
                  Amount: ₹
                  {deal.amount?.toLocaleString()}
                </p>
                <p className="text-xs text-primary-grey-plutus">
                  Close date:
                  {' '}
                  {new Date(deal.closeDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-primary-grey-plutus">
                  Stage:
                  {' '}
                  <span className="underline">{deal.stage}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs italic cursor-not-allowed text-primary-grey-plutus opacity-70">
              No deals associated. Feature coming soon.
            </p>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
};

ProfileSideBar.propTypes = {
  contactDetails: PropTypes.shape({
    contact_id: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    profession_name: PropTypes.string,
    org_name: PropTypes.string,
    industry: PropTypes.string,
    correspondence_email: PropTypes.string,
    personal_mobile: PropTypes.string,
    personal_address: PropTypes.string,
    personal_city_name: PropTypes.string,
    personal_pincode: PropTypes.string,
    contact_owner_name: PropTypes.string,
    contact_status: PropTypes.string,
    contact_type_name: PropTypes.string,
    family_relationships: PropTypes.arrayOf(PropTypes.shape({
      contact_id: PropTypes.string,
      full_name: PropTypes.string,
      relationship_to_contact: PropTypes.string,
      is_group_head: PropTypes.bool,
    })),
  }),
  onViewHistoryClick: PropTypes.func.isRequired,
  onUpdateContact: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

ProfileSideBar.defaultProps = {
  contactDetails: null,
};

const ActivityTimeline = ({ tenantId, contactId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [fetchParams, setFetchParams] = useState({ type: null, cursor: null });

  const [modalState, setModalState] = useState({
    isOpen: false, type: null, activity: null, isDelete: false,
  });

  const [activityOptions, setActivityOptions] = useState({ call_outcomes: [] });

  const supportedActivityTypes = ['note', 'call'];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const options = await contactService.getActivityOptions(tenantId);
        setActivityOptions(options);
      } catch (error) {
        toast.error('Failed to fetch activity options');
      }
    };
    fetchOptions();
  }, [tenantId]);

  const activityTypes = [
    { id: 'note', label: 'Note', icon: 'las la-sticky-note' },
    { id: 'call', label: 'Call', icon: 'las la-phone' },
    { id: 'meeting', label: 'Meeting', icon: 'las la-handshake' },
    { id: 'email', label: 'Email', icon: 'las la-envelope' },
    { id: 'task', label: 'Task', icon: 'las la-tasks' },
    { id: 'transaction', label: 'Transaction', icon: 'las la-file-invoice-dollar' },
    { id: 'deal', label: 'Deal', icon: 'las la-handshake' },
  ];

  // Unified data fetching effect with cleanup to prevent race conditions
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { limit: 10 };
        if (fetchParams.cursor) params.before = fetchParams.cursor;
        if (fetchParams.type) params.type = fetchParams.type;

        const data = await contactService.getActivities(tenantId, contactId, params);

        if (!ignore) {
          if (fetchParams.cursor) {
            setActivities((prev) => [...prev, ...data.activities]);
          } else {
            setActivities(data.activities);
          }
          setNextCursor(data.pagination.next_cursor);
        }
      } catch (error) {
        if (!ignore) {
          toast.error('Failed to fetch activities');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [tenantId, contactId, fetchParams]);

  const handleFilterChange = (typeId) => {
    const newFilter = activeFilter === typeId ? null : typeId;
    setActiveFilter(newFilter);

    // Clear activities immediately to prevent mixing old and new data
    setActivities([]);
    setNextCursor(null);

    // Reset cursor and update type to trigger new fetch
    setFetchParams({ type: newFilter, cursor: null });
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      setFetchParams((prev) => ({ ...prev, cursor: nextCursor }));
    }
  };

  const handleSaveActivity = async (values, { setSubmitting }) => {
    try {
      const { type, activity } = modalState;
      let response;
      let payload = {};

      // Map form values to API payload structure
      if (type === 'note') {
        payload = {
          note_description: values.note_description,
        };
      } else if (type === 'call') {
        let dateStr = '';
        let timeStr = '';

        if (values.call_activity_date instanceof Date) {
          const [dateIso] = values.call_activity_date.toISOString().split('T');
          dateStr = dateIso;
        } else {
          dateStr = values.call_activity_date;
        }

        if (values.call_activity_time instanceof Date) {
          const [timeIso] = values.call_activity_time.toTimeString().split(' ');
          timeStr = timeIso.substring(0, 5);
        } else {
          timeStr = values.call_activity_time;
        }

        payload = {
          call_description: values.call_description,
          call_activity_date: dateStr,
          call_activity_time: timeStr,
          call_outcome: values.call_outcome,
        };
      }

      if (activity) {
        // Update
        if (type === 'note') {
          response = await contactService.updateNote(tenantId, contactId, activity.id, payload);

          const normalizedUpdate = {
            description: response.note_description,
            timestamp: response.note_create_timestamp,
            creator_name: response.note_creator_name,
          };

          setActivities((prev) => prev.map((a) => (a.id === activity.id
            ? { ...a, ...normalizedUpdate }
            : a)));
        } else if (type === 'call') {
          response = await contactService.updateCall(tenantId, contactId, activity.id, payload);

          const normalizedUpdate = {
            description: response.call_description,
            // Use existing timestamp if API doesn't return it on update
            timestamp: response.call_create_timestamp || activity.timestamp,
            creator_name: response.call_creator_name,
            details: {
              outcome: response.call_outcome,
              activity_date: response.call_activity_date,
              activity_time: response.call_activity_time,
            },
          };

          setActivities((prev) => prev.map((a) => (a.id === activity.id
            ? { ...a, ...normalizedUpdate }
            : a)));
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
      } else {
        // Create
        let normalizedActivity = {};

        if (type === 'note') {
          response = await contactService.createNote(tenantId, contactId, payload);

          normalizedActivity = {
            id: response.note_id,
            activity_type: 'note',
            description: response.note_description,
            timestamp: response.note_create_timestamp,
            creator_name: response.note_creator_name,
          };
        } else if (type === 'call') {
          response = await contactService.createCall(tenantId, contactId, payload);

          normalizedActivity = {
            id: response.call_id,
            activity_type: 'call',
            description: response.call_description,
            timestamp: response.call_create_timestamp,
            creator_name: response.call_creator_name,
            details: {
              outcome: response.call_outcome,
              activity_date: response.call_activity_date,
              activity_time: response.call_activity_time,
            },
          };
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully`);

        // Prepend new activity only if it matches the current filter or no filter is active
        if (!activeFilter || activeFilter === type) {
          setActivities((prev) => {
            const updatedActivities = [normalizedActivity, ...prev];
            // Ensure the list remains sorted by timestamp (newest first)
            return updatedActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          });
        }
      }
      setModalState({
        isOpen: false, type: null, activity: null, isDelete: false,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Activity save error:', error);
      }
      toast.error('Failed to save activity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteActivity = async () => {
    try {
      const { type, activity } = modalState;
      if (type === 'note') {
        await contactService.deleteNote(tenantId, contactId, activity.id);
      } else if (type === 'call') {
        await contactService.deleteCall(tenantId, contactId, activity.id);
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      setActivities((prev) => prev.filter((a) => a.id !== activity.id));
      setModalState({
        isOpen: false, type: null, activity: null, isDelete: false,
      });
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  const openModal = (type, activity = null, isDelete = false) => {
    setModalState({
      isOpen: true, type, activity, isDelete,
    });
  };

  const renderActivityForm = () => {
    const { type, activity } = modalState;

    let initialValues = {};
    let validationSchema = Yup.object({});

    if (type === 'note') {
      initialValues = {
        note_description: activity?.description || '',
      };
      validationSchema = Yup.object({
        note_description: Yup.string().required('Description is required'),
      });
    } else if (type === 'call') {
      // Parse existing date/time or default to now
      let dateVal = new Date();
      const timeVal = new Date();

      if (activity?.details?.activity_date) {
        dateVal = new Date(activity.details.activity_date);
      }
      if (activity?.details?.activity_time) {
        // Create a date object with the time
        const [hours, minutes] = activity.details.activity_time.split(':');
        timeVal.setHours(parseInt(hours, 10));
        timeVal.setMinutes(parseInt(minutes, 10));
      }

      initialValues = {
        call_description: activity?.description || '',
        call_activity_date: dateVal,
        call_activity_time: timeVal,
        call_outcome: activity?.details?.outcome || '',
      };
      validationSchema = Yup.object({
        call_description: Yup.string().required('Description is required'),
        call_activity_date: Yup.date().required('Date is required'),
        call_activity_time: Yup.date().required('Time is required'),
        call_outcome: Yup.string().required('Outcome is required'),
      });
    }

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSaveActivity}
      >
        {({
          errors, touched, setFieldValue, setFieldTouched, values,
        }) => (
          <Form id="activity-form" className={`space-y-4 ${type === 'call' ? 'min-h-[400px]' : ''}`}>
            {type === 'call' && (
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Field
                    name="call_activity_date"
                    component={DateInput}
                    label="Date"
                    placeholder="Select Date"
                    width="100%"
                    iconClass="las la-calendar"
                    errors={errors.call_activity_date}
                    touched={touched.call_activity_date}
                  />
                </div>
                <div className="flex-1">
                  <Field
                    name="call_activity_time"
                    component={TimePicker}
                    label="Time"
                    placeholder="Select Time"
                    width="100%"
                    iconClass="las la-clock"
                    errors={errors.call_activity_time}
                    touched={touched.call_activity_time}
                  />
                </div>
              </div>
            )}
            {type === 'call' && (
              <div>
                <Field name="call_outcome">
                  {({ field, meta }) => (
                    <FormDropdown
                      field={field}
                      form={{ setFieldValue, setFieldTouched, values }}
                      label="Outcome"
                      placeholder="Select an outcome"
                      options={activityOptions.call_outcomes}
                      errors={meta.error}
                      touched={meta.touched}
                      width="100%"
                      isMulti={false}
                    />
                  )}
                </Field>
              </div>
            )}
            <div>
              <label className="block mb-1 text-sm text-primary-grey-plutus">
                {type === 'note' ? 'Note Description' : 'Call Description'}
              </label>
              <Field
                name={type === 'note' ? 'note_description' : 'call_description'}
                as="textarea"
                className="w-full p-2 text-sm border rounded outline-none border-outline-grey-plutus focus:border-primary-blue-plutus text-primary-dark-plutus"
                rows="4"
                placeholder="Start typing..."
              />
              <div className="min-h-[20px] mt-1">
                {errors[`${type}_description`] && touched[`${type}_description`] && (
                  <div className="text-xs text-secondary-pink-plutus">{errors[`${type}_description`]}</div>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  };

  const getDialogTitle = () => {
    if (modalState.isDelete) return `Delete ${modalState.type}`;
    const action = modalState.activity ? 'Update' : 'Log New';
    const typeLabel = modalState.type === 'note' ? 'Note' : 'Call';
    return `${action} ${typeLabel}`;
  };

  const getConfirmButtonText = () => {
    if (modalState.isDelete) return 'Delete';
    if (modalState.activity) return 'Update';
    const typeLabel = modalState.type === 'note' ? 'Note' : 'Call';
    return `Log ${typeLabel}`;
  };

  return (
    <div className="px-4 pt-2 pb-4 h-full flex flex-col bg-[#F5F5FA]">
      {/* Activity Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {activityTypes.map((type) => {
            const isSupported = supportedActivityTypes.includes(type.id);
            return (
              <div key={type.id} title={!isSupported ? 'Feature coming soon' : ''}>
                <Button
                  type="button"
                  buttonText={type.label.toUpperCase()}
                  onClick={() => isSupported && openModal(type.id)}
                  className={`!w-auto !px-4 !py-2 !text-xs flex items-center gap-2 ${!isSupported ? 'opacity-50 cursor-not-allowed' : 'hover:!bg-primary-blue-plutus hover:!text-white'}`}
                  colorVariant="secondary"
                  disabled={!isSupported}
                />
              </div>
            );
          })}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center text-xs font-bold text-primary-grey-plutus hover:text-primary-blue-plutus"
          >
            <i className="mr-1 text-lg las la-filter" />
            FILTER TIMELINE
            <i className="ml-1 las la-angle-down" />
          </button>
          {showFilter && (
            <div className="absolute right-0 z-10 w-48 p-2 mt-2 bg-white border rounded shadow-lg border-outline-grey-plutus">
              {activityTypes.map((type) => (
                <div key={type.id} className="flex items-center p-2 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={activeFilter === type.id}
                    onChange={() => handleFilterChange(type.id)}
                    className="mr-2 text-primary-blue-plutus focus:ring-primary-blue-plutus"
                  />
                  <span className="text-sm text-primary-dark-plutus">{type.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 pr-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
        {activities.map((activity) => {
          const typeConfig = activityTypes.find((t) => t.id === activity.activity_type) || {};
          const isSupported = supportedActivityTypes.includes(activity.activity_type);

          const activityContent = (
            <>
              <div className="flex items-start justify-between">
                <div className="flex items-center mb-2">
                  <i className={`${typeConfig.icon} text-primary-blue-plutus mr-2 text-xl`} />
                  <span className="font-bold capitalize text-primary-dark-plutus">
                    {activity.activity_type}
                    {' '}
                    by
                    {' '}
                    {activity.creator_name}
                  </span>
                </div>
                <div className="flex items-center text-xs text-primary-grey-plutus">
                  <button
                    type="button"
                    aria-label="Delete activity"
                    disabled={!isSupported}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSupported) {
                        openModal(activity.activity_type, activity, true);
                      }
                    }}
                    className={`mr-3 ${isSupported ? 'hover:text-secondary-pink-plutus' : 'opacity-30 cursor-not-allowed'}`}
                    title={!isSupported ? 'Delete not supported for this activity type' : 'Delete activity'}
                  >
                    <i className="text-lg las la-trash-alt" />
                  </button>
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
              <p className="mb-2 text-sm text-primary-grey-plutus">{activity.description}</p>
              {/* Render specific details based on type */}
              {activity.activity_type === 'call' && activity.details && (
                <div className="inline-block p-2 text-xs rounded text-primary-grey-plutus bg-background-lightgrey-plutus">
                  <p>
                    Outcome:
                    {' '}
                    <span className="font-semibold">{activity.details.outcome}</span>
                  </p>
                </div>
              )}
            </>
          );

          if (isSupported) {
            return (
              <div
                key={activity.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openModal(activity.activity_type, activity);
                  }
                }}
                className="relative p-4 mb-4 transition-shadow bg-white border rounded-lg shadow-sm cursor-pointer border-outline-grey-plutus hover:shadow-md"
                onClick={() => openModal(activity.activity_type, activity)}
              >
                {activityContent}
              </div>
            );
          }

          return (
            <div
              key={activity.id}
              role="article"
              className="relative p-4 mb-4 transition-shadow bg-white border rounded-lg shadow-sm border-outline-grey-plutus"
            >
              {activityContent}
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-center py-4">
            <BeatLoader color="#5E81F4" size={10} />
          </div>
        )}
        {!loading && nextCursor && (
          <div className="flex justify-center py-4">
            <button
              type="button"
              onClick={handleLoadMore}
              className="p-2 text-white transition-colors rounded-md shadow-lg bg-primary-blue-plutus hover:bg-blue-600"
              aria-label="Load more activities"
            >
              <i className="las la-redo-alt" />
            </button>
          </div>
        )}
        {!loading && activities.length === 0 && (
          <div className="mt-10 text-center text-primary-grey-plutus">
            No activities found.
          </div>
        )}
      </div>

      {/* Modals */}
      {modalState.isOpen && (
        <ConfirmationDialog
          title={getDialogTitle()}
          message={modalState.isDelete ? 'Are you sure you want to delete this activity? This action cannot be undone.' : ''}
          confirmButtonText={getConfirmButtonText()}
          confirmButtonClass={modalState.isDelete ? 'bg-secondary-pink-plutus text-white hover:bg-red-600' : 'bg-primary-blue-plutus text-white hover:bg-blue-700'}
          confirmButtonType={!modalState.isDelete ? 'submit' : 'button'}
          confirmButtonFormId={!modalState.isDelete ? 'activity-form' : undefined}
          widthClass={!modalState.isDelete ? 'max-w-2xl' : undefined}
          onConfirm={() => {
            if (modalState.isDelete) {
              handleDeleteActivity();
            }
          }}
          onCancel={() => setModalState({
            isOpen: false, type: null, activity: null, isDelete: false,
          })}
        >
          {!modalState.isDelete && renderActivityForm()}
        </ConfirmationDialog>
      )}
    </div>
  );
};

ActivityTimeline.propTypes = {
  tenantId: PropTypes.string.isRequired,
  contactId: PropTypes.string.isRequired,
};

const ContactProfile = () => {
  const { id } = useParams();
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentView, setContentView] = useState('main');

  const user = userService.getUser();
  const tenantId = user?.tenant;

  const fetchContact = useCallback(async () => {
    if (!id) {
      setError('No Contact ID provided in URL.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getContactById(id);
      setContactData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contact details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  const handleUpdateContact = useCallback((contactId, updatedData) => (
    contactService.updateContact(contactId, updatedData)
  ), []);

  const renderBodyContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <BeatLoader color="#5E81F4" />
        </div>
      );
    }
    if (error) {
      return <div className="p-6 text-center text-secondary-pink-plutus">{error}</div>;
    }
    if (contactData) {
      switch (contentView) {
        case 'history':
          return (
            <ContactHistory
              tenantId={tenantId}
              contactId={contactData.contact_id}
              contactName={`${contactData.first_name} ${contactData.last_name}`}
              onBack={() => setContentView('main')}
            />
          );
        case 'properties':
          return <div className="p-6">All properties content will go here.</div>;
        default:
          return <ActivityTimeline tenantId={tenantId} contactId={contactData.contact_id} />;
      }
    }
    return null;
  };

  const getHeaderText = () => {
    if (loading) return 'Loading Contact...';
    if (error) return 'Error';
    if (contactData) {
      const headerBase = `${contactData.first_name} ${contactData.last_name}`;
      if (contentView === 'history') {
        return `Contact History – ${headerBase}`;
      }
      return '';
    }
    return 'Contact Profile';
  };

  return (
    <AppLayout
      bodyContentElement={renderBodyContent()}
      headerText={getHeaderText()}
      headerButtons={[
        ...(contentView === 'history'
          ? [{ class: 'las la-arrow-left', action: () => setContentView('main') }]
          : []),
        { class: 'las la-edit', action: () => {} },
      ]}
      sideBarContentElement={(
        <ProfileSideBar
          contactDetails={contactData}
          onViewHistoryClick={() => setContentView('history')}
          onUpdateContact={handleUpdateContact}
          onUpdateSuccess={fetchContact}
        />
      )}
    />
  );
};

export default ContactProfile;
