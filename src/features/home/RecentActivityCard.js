import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import homeService from './homeService';

function RecentActivityCard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await homeService.getRecentActivities();
        setActivities(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load activities');
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, []);

  const getActivityIcon = (activityType) => {
    const iconMap = {
      contact: 'las la-user',
      note: 'las la-sticky-note',
      call: 'las la-phone',
      meeting: 'las la-calendar-check',
      email: 'las la-envelope',
      task: 'las la-tasks',
      deal: 'las la-handshake',
      transaction: 'las la-exchange-alt',
    };
    return iconMap[activityType] || 'las la-clock';
  };

  const getActivityColor = (activityType, action) => {
    if (action === 'D') {
      return {
        iconBg: 'bg-secondary-pink-plutus bg-opacity-20',
        iconColor: 'text-secondary-pink-plutus',
      };
    }

    const colorMap = {
      contact: { iconBg: 'bg-secondary-green-plutus bg-opacity-20', iconColor: 'text-secondary-green-plutus' },
      note: { iconBg: 'bg-secondary-yellow-plutus bg-opacity-20', iconColor: 'text-secondary-yellow-plutus' },
      call: { iconBg: 'bg-skyblue-plutus', iconColor: 'text-primary-blue-plutus' },
      meeting: { iconBg: 'bg-skyblue-plutus', iconColor: 'text-primary-blue-plutus' },
      email: { iconBg: 'bg-skyblue-plutus', iconColor: 'text-primary-blue-plutus' },
      task: { iconBg: 'bg-secondary-yellow-plutus bg-opacity-20', iconColor: 'text-secondary-yellow-plutus' },
      deal: { iconBg: 'bg-secondary-green-plutus bg-opacity-20', iconColor: 'text-secondary-green-plutus' },
      transaction: { iconBg: 'bg-skyblue-plutus', iconColor: 'text-primary-blue-plutus' },
    };
    return colorMap[activityType] || { iconBg: 'bg-lightgrey-plutus', iconColor: 'text-primary-grey-plutus' };
  };

  const handleActivityClick = (contactId) => {
    if (contactId) {
      navigate(`/contacts/${contactId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white border rounded-lg shadow-sm border-outline-grey-plutus">
        <BeatLoader color="#5E81F4" size={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white border rounded-lg shadow-sm border-outline-grey-plutus">
        <p className="text-center text-secondary-pink-plutus font-lato">
          {error}
        </p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-6 bg-white border rounded-lg shadow-sm border-outline-grey-plutus">
        <p className="text-center text-primary-grey-plutus font-lato">
          No recent activity
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm border-outline-grey-plutus">
      <div className="divide-y divide-outline-grey-plutus">
        {activities.map((activity) => {
          const colors = getActivityColor(activity.activityType, activity.action);
          const icon = getActivityIcon(activity.activityType);

          return (
            <button
              key={activity.eventId}
              type="button"
              className="w-full p-4 text-left transition-colors hover:bg-background-lightgrey-plutus disabled:cursor-default disabled:hover:bg-transparent"
              onClick={() => handleActivityClick(activity.contactId)}
              disabled={!activity.contactId}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 p-2 mr-3 rounded-lg ${colors.iconBg}`}>
                  <i className={`${icon} text-xl ${colors.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary-dark-plutus font-lato">
                    {activity.title || 'Activity'}
                  </p>
                  {activity.contactName && (
                    <p className="text-sm truncate text-primary-grey-plutus font-lato">
                      {activity.contactName}
                    </p>
                  )}
                  {activity.timeAgo && (
                    <p className="text-xs text-primary-grey-plutus font-lato">
                      {activity.timeAgo}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivityCard;
