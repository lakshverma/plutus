import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../common/appLayout/AppLayout';
import EmptyContactContent from './EmptyContactContent';

const EmptyContact = () => {
  const navigate = useNavigate();
  // To add more buttons to the header, add an object with icon class and action, as an array
  // element. The search button appears by default. Other buttons appear in the order of their
  // position inside the array.
  const headerButtons = [{ class: 'las la-plus-circle', action: () => navigate('/contacts/new') }];
  return (
    <AppLayout bodyContentElement={<EmptyContactContent />} headerText="Contacts" headerButtons={headerButtons} />
  );
};

EmptyContact.propTypes = {

};

export default EmptyContact;
