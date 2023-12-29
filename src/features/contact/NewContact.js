import React from 'react';
import { useNavigate } from 'react-router-dom';

import AppLayout from '../../common/appLayout/AppLayout';
import NewContactContent from './NewContactContent';

const NewContact = () => {
  const navigate = useNavigate();
  // Todo: Replace alerts with actual actions in future commits once the feature has been completed
  const headerButtons = [{ class: 'las la-plus-circle', action: () => navigate('/contacts/new') }];

  return (
    <AppLayout bodyContentElement={<NewContactContent />} headerText="Create New Contact" headerButtons={headerButtons} />
  );
};

export default NewContact;
