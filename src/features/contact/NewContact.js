import React from 'react';
import { useNavigate } from 'react-router-dom';

import AppLayout from '../../common/appLayout/AppLayout';
import NewContactContent from './NewContactContent';
// import PropTypes from 'prop-types';

const NewContact = () => {
  const navigate = useNavigate();
  const headerButtons = [{ class: 'las la-search', action: () => alert('Search') }, { class: 'las la-plus-circle', action: () => navigate('/contacts/new') }];
  return (
    <AppLayout bodyContentElement={<NewContactContent />} headerText="Create New Contact" headerButtons={headerButtons} />
  );
};

// NewContact.propTypes = {};

export default NewContact;
