import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners'; // Import BeatLoader
import AppLayout from '../../common/appLayout/AppLayout';
import contactService from './ContactService';
import ContactListContent from './ContactListContent';
import EmptyContactContent from './EmptyContactContent';

const ContactList = () => {
  const navigate = useNavigate();
  const [initialContacts, setInitialContacts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialContacts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const responseData = await contactService.getContacts({
          page: 1,
          sortParams: [{ column: 'first_name', order: 'asc' }],
        });

        // Ensure pagination.page is a number before setting state
        if (responseData && responseData.pagination && typeof responseData.pagination.page === 'string') {
          responseData.pagination.page = parseInt(responseData.pagination.page, 10);
        }

        setInitialContacts(responseData);
      } catch (err) {
        setError(err.error || err.message || 'Failed to load contacts.');
        setInitialContacts(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialContacts();
  }, []);

  const headerButtons = [{ class: 'las la-plus-circle', action: () => navigate('/contacts/new') }];

  let bodyContent;

  if (isLoading) {
    // Use BeatLoader for the loading state, centered
    bodyContent = (
      <div className="flex flex-col w-full h-full px-6 pt-2 pb-6 bg-background-lightgrey-plutus">
        <div className="flex items-center justify-center flex-grow bg-white rounded-lg shadow">
          <BeatLoader size={15} color="#5E81F4" loading={isLoading} />
        </div>
      </div>
    );
  } else if (!error && initialContacts && initialContacts.data.length === 0) {
    bodyContent = <EmptyContactContent />;
  } else {
    // Pass initial data and error state down to ContactListContent
    bodyContent = <ContactListContent initialData={initialContacts} initialError={error} />;
  }

  return (
    <AppLayout
      bodyContentElement={bodyContent}
      headerText="Contacts"
      headerButtons={headerButtons}
    />
  );
};

export default ContactList;
