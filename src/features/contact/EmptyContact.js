import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../common/appLayout/AppLayout';
import EmptyContactContent from './EmptyContactContent';

const EmptyContact = () => {
  const navigate = useNavigate();
  const headerButtons = [{ class: 'las la-search', action: () => alert('Search') }, { class: 'las la-plus-circle', action: () => navigate('/contacts/new') }];
  return (
    <AppLayout bodyContentElement={<EmptyContactContent />} headerText="Contacts" headerButtons={headerButtons} />
  );
};

EmptyContact.propTypes = {

};

export default EmptyContact;
