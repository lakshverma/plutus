import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../common/appLayout/AppLayout';
import HomeContent from './HomeContent';

const HomePage = () => {
  const navigate = useNavigate();

  const headerButtons = [
    { class: 'las la-plus-circle', action: () => navigate('/contacts/new') },
  ];

  return (
    <AppLayout
      bodyContentElement={<HomeContent />}
      headerText=""
      headerButtons={headerButtons}
    />
  );
};

export default HomePage;
