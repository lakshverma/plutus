import React from 'react';
import SideNavHeader from './SideNavHeader';
import SideNavMenu from './SideNavMenu';
import SideNavFooter from './SideNavFooter';

const SideNav = () => (
  <div className="flex flex-col border-r-2 border-outline-grey-plutus">
    <SideNavHeader />
    <SideNavMenu />
    <SideNavFooter />
  </div>
);
export default SideNav;
