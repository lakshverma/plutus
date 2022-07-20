import React from 'react';
import HeadlineText from './HeadlineText';
import LoginMainLayout from './LoginMainLayout';
import { ReactComponent as RecoverAccountImg } from './recoverAccount.svg';

const RecoveryMailSent = () => (
  <LoginMainLayout
    headline={(
      <HeadlineText
        className="mt-80 2xl:mt-96"
        head="You've got mail."
        subhead="Thanks for sharing your details. If account exists, you will receive an email shortly with further instructions."
      />
      )}
    img={<RecoverAccountImg />}
  />
);

export default RecoveryMailSent;
