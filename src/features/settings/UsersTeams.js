import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import {
  fetchUsers, createUser, updateUserRole, reset,
} from './settingsSlice';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import TextInput from '../../common/form/TextInput';
import Button from '../../common/form/Button';
import FormDropdown from '../../common/form/FormDropdown';
import ErrorText from '../../common/form/ErrorText';

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Standard', value: 'standard' },
  { label: 'Limited', value: 'limited' },
];

// Mapping for API numeric roles to string labels
const getRoleLabel = (roleId) => {
  switch (roleId) {
    case 2: return 'Admin';
    case 3: return 'Standard';
    case 4: return 'Limited';
    default: return 'Unknown';
  }
};

const AddUserForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.settings);

  const validationSchema = Yup.object({
    firstName: Yup.string().min(3, 'At least 3 characters').required('Required'),
    lastName: Yup.string().min(3, 'At least 3 characters').required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string().min(5, 'At least 5 characters').required('Required'),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Must contain 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char',
      )
      .required('Required'),
    jobTitle: Yup.string().min(3).required('Required'),
    role: Yup.string().required('Required'),
  });

  return (
    <Formik
      initialValues={{
        firstName: '', lastName: '', email: '', username: '', password: '', jobTitle: '', role: 'standard',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(createUser(values)).then((res) => {
          if (!res.error) {
            dispatch(fetchUsers());
            onClose();
            toast.success('User added successfully', {
              className: '!bg-primary-blue-plutus text-white font-lato',
              progressClassName: '!bg-white',
              icon: <i className="text-white las la-check-circle" />,
            });
          } else {
            const errorMessage = res.payload?.message || res.error?.message || message || 'Failed to add user';
            toast.error(errorMessage, {
              className: '!bg-red-600 text-white font-lato',
              progressClassName: '!bg-white',
              icon: <i className="text-white las la-exclamation-circle" />,
            });
          }
          setSubmitting(false);
        });
      }}
    >
      {({
        errors, touched, setFieldValue, values,
      }) => (
        <ConfirmationDialog
          title="Add New User"
          widthClass="max-w-3xl"
          confirmButtonText="Add User"
          confirmButtonType="submit"
          confirmButtonFormId="add-user-form"
          onConfirm={() => {}} // Handled by form submit
          onCancel={onClose}
          isLoading={isLoading}
        >
          {isError && <div className="mb-4 text-sm text-red-500">{message}</div>}
          <Form id="add-user-form" className="grid grid-cols-2 gap-6">
            <div>
              <Field name="firstName" label="First Name" as={TextInput} width="full" errors={errors.firstName} touched={touched.firstName} />
              <ErrorMessage component={ErrorText} name="firstName" />
            </div>
            <div>
              <Field name="lastName" label="Last Name" as={TextInput} width="full" errors={errors.lastName} touched={touched.lastName} />
              <ErrorMessage component={ErrorText} name="lastName" />
            </div>
            <div className="col-span-2">
              <Field name="email" label="Email" as={TextInput} width="lg" errors={errors.email} touched={touched.email} />
              <ErrorMessage component={ErrorText} name="email" />
            </div>
            <div>
              <Field name="username" label="Username" as={TextInput} width="full" errors={errors.username} touched={touched.username} />
              <ErrorMessage component={ErrorText} name="username" />
            </div>
            <div>
              <Field name="password" label="Password" type="password" as={TextInput} width="full" errors={errors.password} touched={touched.password} />
              <ErrorMessage component={ErrorText} name="password" />
            </div>
            <div>
              <Field name="jobTitle" label="Job Title" as={TextInput} width="full" errors={errors.jobTitle} touched={touched.jobTitle} />
              <ErrorMessage component={ErrorText} name="jobTitle" />
            </div>
            <div>
              <Field
                name="role"
                component={FormDropdown}
                label="Role"
                options={roleOptions}
                isMulti={false}
                width="100%"
                field={{ name: 'role', value: values.role, onBlur: () => {} }}
                form={{ setFieldValue, setFieldTouched: () => {} }}
              />
            </div>
          </Form>
        </ConfirmationDialog>
      )}
    </Formik>
  );
};

const UsersTeams = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.settings);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  const handleRoleChange = (userId, newRoleOption) => {
    if (newRoleOption) {
      dispatch(updateUserRole({ userId, role: newRoleOption.value }))
        .unwrap()
        .then(() => {
          toast.success(`User role updated to ${newRoleOption.label}`, {
            className: '!bg-secondary-green-plutus !text-green-700 !font-lato !font-semibold',
            progressClassName: '!bg-white',
            icon: <i className="text-green-700 las la-check-circle" />,
          });
        })
        .catch((error) => {
          toast.error(`Failed to update role: ${error}`, {
            className: '!bg-secondary-pink-plutus text-white font-lato',
            progressClassName: '!bg-white',
            icon: <i className="text-white las la-exclamation-circle" />,
          });
        });
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const role = getRoleLabel(user.role_id).toLowerCase();
    return fullName.includes(term) || role.includes(term);
  });

  return (
    <div className="h-full px-8 pt-2 pb-8">
      <div className="flex flex-col h-full bg-white rounded-xl">
        <div className="flex items-center justify-between p-6 border-b">
          {/* Search Bar replacing the Heading */}
          <div className="flex items-center px-4 py-2 border rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-primary-blue-plutus focus-within:bg-white w-96">
            <i className="mr-3 text-xl text-gray-400 las la-search" />
            <input
              type="text"
              placeholder="Filter by name or role..."
              className="w-full text-sm placeholder-gray-400 bg-transparent outline-none text-primary-dark-plutus"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            buttonText="Add User"
            type="button"
            colorVariant="primary"
            width="sm"
            onClick={() => setShowAddUser(true)}
          />
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {isLoading && users.length === 0 ? (
            <div className="flex justify-center mt-10"><BeatLoader color="#5E81F4" /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm border-b text-primary-grey-plutus">
                  <th className="pb-4 font-semibold">User</th>
                  <th className="pb-4 font-semibold">Job Title</th>
                  <th className="pb-4 font-semibold">Role</th>
                  <th className="pb-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-primary-dark-plutus">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.user_id} className=" hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 mr-3 font-bold text-white rounded-full bg-primary-blue-plutus">
                            {user.first_name?.[0]}
                            {user.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-bold">
                              {user.first_name}
                              {' '}
                              {user.last_name}
                            </p>
                            <p className="text-xs text-primary-grey-plutus">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{user.job_title}</td>
                      <td className="py-4 w-44">
                        <FormDropdown
                          label=""
                          isMulti={false}
                          options={roleOptions}
                          width="100%"
                          placeholder="Select Role"
                          field={{
                            name: `role-${user.user_id}`,
                            value: roleOptions.find(
                              (opt) => opt.label === getRoleLabel(user.role_id),
                            )?.value,
                            onBlur: () => {},
                            onChange: () => {},
                          }}
                          form={{
                            setFieldValue: (_, val) => {
                              const selectedOption = roleOptions.find((opt) => opt.value === val);
                              return handleRoleChange(user.user_id, selectedOption);
                            },
                            setFieldTouched: () => {},
                          }}
                        />
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          user.status === 'verified'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                        >
                          {user.status === 'verified' ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-primary-grey-plutus">
                      No users found matching &quot;
                      {searchTerm}
                      &quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showAddUser && <AddUserForm onClose={() => setShowAddUser(false)} />}
    </div>
  );
};

AddUserForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default UsersTeams;
