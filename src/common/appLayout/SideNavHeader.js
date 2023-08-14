import React from 'react';
import { ReactComponent as LogoImg } from './Logo.svg';

function SideNavHeader() {
  return (
    <div className="flex justify-center py-4 m-2">
      <a href="/layout">
        <LogoImg />
      </a>
    </div>
  );
}

export default SideNavHeader;
