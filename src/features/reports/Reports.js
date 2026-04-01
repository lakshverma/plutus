import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppLayout from '../../common/appLayout/AppLayout';
import SidebarNavItem from '../../common/appLayout/SidebarNavItem';
import BirthdayAnniversaryReport from './BirthdayAnniversaryReport';
import { ReactComponent as ReportsIllustration } from './Reports.svg';

// Simple placeholder for empty state illustration
const ReportsEmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background-lightgrey-plutus">
    <ReportsIllustration className="w-1/3 max-w-lg" />
    <div className="relative -top-32">
      <h3 className="mb-2 text-xl font-bold text-primary-dark-plutus">There is no data to display.</h3>
      <p className="max-w-md text-primary-grey-plutus">
        Select a report type from the left menu to begin
        <br />
        generating a new report
      </p>
    </div>
  </div>
);

const ReportsSidebar = ({ activeReport, onSelectReport }) => (
  <div className="flex flex-col h-full px-4 pt-4 pb-12">
    <div className="flex-1 mt-6 overflow-y-auto">

      {/* Contact Reports Section */}
      <div className="mb-6">
        <h4 className="mb-3 ml-3 text-sm font-bold tracking-wide uppercase text-primary-dark-plutus">Contact Reports</h4>
        <div className="space-y-1">
          <SidebarNavItem
            label="Birthday/Anniversary List"
            iconClass="las la-birthday-cake"
            isActive={activeReport === 'birthdayAnniversary'}
            onClick={() => onSelectReport('birthdayAnniversary')}
          />
          <div title="Coming soon!">
            <SidebarNavItem
              label="Age-wise List"
              iconClass="las la-user-clock"
              disabled
            />
            <SidebarNavItem
              label="Income range wise List"
              iconClass="las la-money-bill-wave"
              disabled
            />
            <SidebarNavItem
              label="Employer-wise List"
              iconClass="las la-building"
              disabled
            />
            <SidebarNavItem
              label="Profession-wise Report"
              iconClass="las la-briefcase"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Client Reports Section */}
      <div>
        <h4 className="mb-3 ml-3 text-sm font-bold tracking-wide uppercase text-primary-dark-plutus">Client Reports</h4>
        <div className="space-y-1" title="Coming soon!">
          <SidebarNavItem
            label="Family Investment Report"
            iconClass="las la-users"
            disabled
          />
          <SidebarNavItem
            label="Client Activity List"
            iconClass="las la-project-diagram"
            disabled
          />
        </div>
      </div>

    </div>
  </div>
);

ReportsSidebar.propTypes = {
  activeReport: PropTypes.string,
  onSelectReport: PropTypes.func.isRequired,
};

ReportsSidebar.defaultProps = {
  activeReport: null,
};

function Reports() {
  const [activeReport, setActiveReport] = useState(null);

  const renderContent = () => {
    switch (activeReport) {
      case 'birthdayAnniversary':
        return <BirthdayAnniversaryReport />;
      default:
        return <ReportsEmptyState />;
    }
  };

  return (
    <AppLayout
      bodyContentElement={renderContent()}
      bodyBgClass="bg-background-lightgrey-plutus"
      headerText="Reports"
      headerButtons={[]}
      sideBarContentElement={(
        <ReportsSidebar
          activeReport={activeReport}
          onSelectReport={setActiveReport}
        />
      )}
    />
  );
}

export default Reports;
