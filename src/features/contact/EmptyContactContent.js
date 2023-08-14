import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../common/form/Button';
import { ReactComponent as EmptyContactImg } from './EmptyContact.svg';

const EmptyContactContent = () => (
  <div className="flex justify-center w-full h-full">
    <div className="text-center bg-background-lightgrey-plutus">
      <EmptyContactImg className="mt-24 mb-8" />
      <h1 className="text-4xl font-semibold font-lato text-primary-dark-plutus">No contacts found?</h1>
      <p className="mt-3 text-primary-grey-plutus font-lato">You can create more new contacts or upload your contacts</p>
      <p className="mb-5 text-primary-grey-plutus font-lato">list to get started</p>
      <Link to="/contacts/new">
        <Button buttonText="Create Contact" colorVariant="primary" type="button" />
      </Link>
    </div>
  </div>

);

EmptyContactContent.propTypes = {};

export default EmptyContactContent;
