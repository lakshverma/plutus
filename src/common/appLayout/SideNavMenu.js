import React from 'react';
import NavItem from './NavItem';

function SideNavMenu() {
  return (
    <nav className="space-y-4">
      <NavItem link="/contacts" iconClass="las la-user-lock" />
      <NavItem link="/reports" iconClass="las la-tachometer-alt" />
      <NavItem link="/settings" iconClass="las la-cog" />
    </nav>
  );
}

export default SideNavMenu;
