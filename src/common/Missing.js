import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from './appLayout/AppLayout';
import Button from './form/Button';
import userService from '../features/auth/userService';
import { ReactComponent as VoidSvg } from './404_void.svg';

const MissingContent = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-background-lightgrey-plutus">
      <VoidSvg className="w-full h-auto max-w-md mb-8 lg:max-w-lg" />
      <h1 className="mb-4 text-3xl font-bold md:text-4xl font-lato text-primary-dark-plutus">
        Page not found
      </h1>
      <p className="max-w-md mb-8 text-base md:text-lg text-primary-grey-plutus font-lato">
        Error 404. The link you followed may be broken or the page may have been moved.
      </p>
      <div className="w-full sm:w-48">
        <Button
          buttonText="Go to home page"
          type="button"
          colorVariant="primary"
          onClick={() => navigate('/home')}
        />
      </div>
    </div>
  );
};

const Missing = () => {
  const loginState = useSelector((state) => state.auth) || userService.getUser();

  // Authenticated users see the 404 inside the app shell; unauthenticated
  // users (e.g. a bad URL while logged out) get a standalone page.
  if (loginState?.token) {
    return (
      <AppLayout
        bodyContentElement={<MissingContent />}
        headerText=""
        headerButtons={[]}
      />
    );
  }

  return (
    <div className="h-screen">
      <MissingContent />
    </div>
  );
};

export default Missing;
