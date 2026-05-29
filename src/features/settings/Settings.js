import React, { useState } from 'react';
import AppLayout from '../../common/appLayout/AppLayout';
import SidebarNavItem from '../../common/appLayout/SidebarNavItem';
import UsersTeams from './UsersTeams';
import { ReactComponent as AdjustSettings } from './AdjustSettings.svg';

const SettingsSidebar = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="grid h-full grid-rows-4 px-4 pt-4 pb-12">
      <div className="row-span-3 mt-6 overflow-y-auto">
        <div className="space-y-1">
          <SidebarNavItem
            label="Users & Teams"
            description="Add/Remove Users, Manage User Permissions"
            iconClass="las la-users-cog"
            isActive={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />

          <div title="Feature coming soon!">
            <SidebarNavItem
              label="General Information"
              description="Update personal information"
              iconClass="las la-user-edit"
              isActive={activeTab === 'general'}
              disabled
              onClick={() => setActiveTab('general')}
            />

            <SidebarNavItem
              label="Billing"
              description="Change payment method"
              iconClass="las la-credit-card"
              isActive={activeTab === 'billing'}
              disabled
              onClick={() => setActiveTab('billing')}
            />
          </div>
        </div>

      </div>

      <div className="flex items-end justify-center row-span-1">
        <AdjustSettings className="w-full max-h-full" />
      </div>
    </div>
  );
};

function Settings() {
  return (
    <AppLayout
      bodyContentElement={<UsersTeams />}
      bodyBgClass="bg-lightgrey-plutus"
      headerText="Users & Teams"
      headerButtons={[]}
      sideBarContentElement={<SettingsSidebar />}
    />
  );
}

export default Settings;
