import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import DashboardCard from './DashboardCard';
import QuickActionCard from './QuickActionCard';
import RecentActivityCard from './RecentActivityCard';
import homeService from './homeService';

const HomeContent = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalContacts: 0,
    activeClients: 0,
    pendingTasks: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await homeService.getDashboardStats();
        setDashboardData({
          totalContacts: response.activeContacts,
          activeClients: response.customerContacts,
          pendingTasks: 0,
          monthlyRevenue: 0,
        });
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error loading dashboard data:', err);
        }
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserName = () => {
    if (user?.username) return user.username.split(/[\s._-]+/)[0];
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  //   const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', {
  //     style: 'currency',
  //     currency: 'INR',
  //     minimumFractionDigits: 0,
  //   }).format(amount);

  const quickActions = [
    {
      title: 'Add New Contact',
      description: 'Create a new contact entry',
      icon: 'las la-user-plus',
      color: 'bg-primary-blue-plutus',
      action: () => navigate('/contacts/new'),
    },
    {
      title: 'View All Contacts',
      description: 'Browse your contact list',
      icon: 'las la-users',
      color: 'bg-primary-blue-plutus',
      action: () => navigate('/contacts'),
    },
    {
      title: 'Generate Report',
      description: 'Create business insights',
      icon: 'las la-chart-line',
      color: 'bg-primary-blue-plutus',
      action: () => navigate('/reports'),
    },
    {
      title: 'Settings',
      description: 'Manage your preferences',
      icon: 'las la-cog',
      color: 'bg-primary-blue-plutus',
      action: () => navigate('/settings'),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full px-6 pt-2 pb-6 bg-lightgrey-plutus">
        <div className="flex items-center justify-center flex-grow bg-white rounded-lg shadow">
          <BeatLoader color="#5E81F4" size={12} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full h-full px-6 pt-2 pb-6 bg-lightgrey-plutus">
        <div className="flex items-center justify-center flex-grow bg-white rounded-lg shadow">
          <p className="text-base text-secondary-pink-plutus font-lato">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full px-6 pt-2 pb-6 bg-lightgrey-plutus">
      <div className="h-full p-6 overflow-y-auto bg-white rounded-lg">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-primary-dark-plutus font-lato">
            {getGreeting()}
            ,
            {' '}
            {getUserName()}
            !
          </h1>
          <p className="text-base text-primary-grey-plutus font-lato">
            Here&apos;s what&apos;s happening with your business today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Contacts"
            value={dashboardData.totalContacts}
            icon="las la-users"
            iconColor="text-primary-blue-plutus"
            bgColor="bg-skyblue-plutus"
          />
          <DashboardCard
            title="Active Clients"
            value={dashboardData.activeClients}
            icon="las la-user-check"
            iconColor="text-green-600"
            bgColor="bg-green-50"
          />
          {/* <DashboardCard
          title="Pending Tasks"
          value={dashboardData.pendingTasks}
          icon="las la-tasks"
          iconColor="text-orange-600"
          bgColor="bg-orange-50"
        />
        <DashboardCard
          title="Monthly Revenue"
          value={formatCurrency(dashboardData.monthlyRevenue)}
          icon="las la-rupee-sign"
          iconColor="text-purple-600"
          bgColor="bg-purple-50"
          isNumeric={false}
        /> */}
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-primary-dark-plutus font-lato">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.title}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  color={action.color}
                  onClick={action.action}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <h2 className="mb-4 text-xl font-bold text-primary-dark-plutus font-lato">
              Recent Activity
            </h2>
            <RecentActivityCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
