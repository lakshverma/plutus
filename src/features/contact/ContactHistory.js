import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import contactService from './ContactService';
import userService from '../auth/userService';

// Utility: Title-case / humanize
const formatPropertyName = (name) => (name || '')
  .split('_')
  .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
  .join(' ');

const formatDateTimeLong = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Basic normalization for showing updated values
const formatValue = (val) => {
  if (val == null || val === '') return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'string') {
    // Avoid title-casing values that might be proper nouns or emails
    return val;
  }
  return String(val);
};

// Icon mapping based on property / activity characteristics
const getEventIconAndDetails = (event) => {
  const {
    event_type: eventType, diff_data: diffData, action, table_name: tableName,
  } = event;

  if (eventType === 'property_change') {
    const propertyKey = Object.keys(diffData || {})[0];
    switch (propertyKey) {
      case 'contact_status':
        return { icon: 'las la-exchange-alt', name: 'Status Update' };
      case 'contact_owner_name':
      case 'contact_owner':
        return { icon: 'las la-user-cog', name: 'Owner Change' };
      case 'contact_type':
      case 'contact_type_name':
        return { icon: 'las la-id-badge', name: 'Type Change' };
      case 'personal_mobile':
      case 'work_mobile':
        return { icon: 'las la-phone', name: 'Phone Update' };
      case 'correspondence_email':
      case 'personal_email':
        return { icon: 'las la-envelope', name: 'Email Update' };
      case 'personal_address':
      case 'work_address':
        return { icon: 'las la-map-marker', name: 'Address Update' };
      default:
        return { icon: 'las la-pen', name: action === 'I' ? 'Created' : 'Property Update' };
    }
  }

  if (eventType === 'activity_change') {
    const activityType = (tableName || '').toLowerCase();
    if (activityType.includes('meeting')) return { icon: 'las la-calendar', name: 'Meeting' };
    if (activityType.includes('email')) return { icon: 'las la-envelope', name: 'Email' };
    if (activityType.includes('call')) return { icon: 'las la-phone', name: 'Call' };
    if (activityType.includes('task')) return { icon: 'las la-check-square', name: 'Task' };
    if (activityType.includes('note')) return { icon: 'las la-sticky-note', name: 'Note' };
    if (activityType.includes('deal')) return { icon: 'las la-handshake', name: 'Deal' };
    return { icon: 'las la-bolt', name: 'Activity' };
  }

  return { icon: 'las la-info-circle', name: 'Event' };
};

const getUserName = (event) => event.user_name || 'Unknown User';

const EventDescription = ({ event }) => {
  const {
    action, event_type: eventType, diff_data: diffData,
    original_data: originalData, new_data: newData,
  } = event;

  if (eventType === 'property_change' && action === 'U' && diffData) {
    const changedProperties = Object.keys(diffData);

    // Helper to find the corresponding key in original_data
    const findOriginalKey = (propKey) => {
      if (!originalData) return propKey;
      // Case 1: Exact match (e.g., last_name -> last_name)
      if (originalData[propKey] !== undefined) return propKey;
      // Case 2: Enriched key match (e.g., birth_place_city -> birth_place_city_id)
      const originalKeyMatch = Object.keys(originalData).find(
        (k) => propKey.startsWith(k) || k.startsWith(propKey.split('_')[0]),
      );
      return originalKeyMatch || propKey;
    };

    // Handle multiple property changes
    if (changedProperties.length > 1) {
      return (
        <span>
          <span className="font-semibold">{getUserName(event)}</span>
          {' updated multiple properties:'}
          <div className="mt-1 space-y-1">
            {changedProperties.map((propertyKey) => {
              const originalKey = findOriginalKey(propertyKey);
              const oldValue = originalData?.[originalKey];
              const newValue = diffData[propertyKey];

              return (
                <div key={propertyKey} className="text-xs">
                  <span className="font-medium">{formatPropertyName(propertyKey)}</span>
                  {' from '}
                  <span className="font-medium text-secondary-pink-plutus">{formatValue(oldValue)}</span>
                  {' to '}
                  <span className="font-medium text-green-600">{formatValue(newValue)}</span>
                </div>
              );
            })}
          </div>
        </span>
      );
    }

    // Handle single property change
    const propertyKey = changedProperties[0];
    const newValue = diffData[propertyKey];
    const originalKey = findOriginalKey(propertyKey);
    const oldValue = originalData?.[originalKey];

    if (oldValue == null || oldValue === '') {
      return (
        <span>
          <span className="font-semibold">{getUserName(event)}</span>
          {' set '}
          <span className="font-semibold">{formatPropertyName(propertyKey)}</span>
          {' to '}
          <span className="font-medium text-green-600">{formatValue(newValue)}</span>
        </span>
      );
    }

    return (
      <span>
        <span className="font-semibold">{getUserName(event)}</span>
        {' updated '}
        <span className="font-semibold">{formatPropertyName(propertyKey)}</span>
        {' from '}
        <span className="font-medium text-secondary-pink-plutus">{formatValue(oldValue)}</span>
        {' to '}
        <span className="font-medium text-green-600">{formatValue(newValue)}</span>
      </span>
    );
  }

  if (eventType === 'property_change' && action === 'I') {
    return (
      <span>
        Contact created by
        {' '}
        <span className="font-semibold">{getUserName(event)}</span>
      </span>
    );
  }

  // Handle activity updates
  if (eventType === 'activity_change' && action === 'U' && diffData) {
    const propertyKey = Object.keys(diffData)[0];
    const newValue = diffData[propertyKey];
    return (
      <span>
        <span className="font-semibold">{getUserName(event)}</span>
        {' updated '}
        <span className="font-semibold">{formatPropertyName(propertyKey)}</span>
        {' to '}
        <span className="font-medium text-green-600">{formatValue(newValue)}</span>
      </span>
    );
  }

  // Handle activity creations
  if (eventType === 'activity_change' && action === 'I') {
    const { name } = getEventIconAndDetails(event);
    const activityTitle = newData?.title || newData?.task_name || newData?.meeting_description
      || newData?.call_description || newData?.deal_type || name;
    return (
      <span>
        <span className="font-semibold">{getUserName(event)}</span>
        {' created a new '}
        <span className="font-semibold">{activityTitle}</span>
      </span>
    );
  }

  // Handle activity deletions
  if (eventType === 'activity_change' && action === 'D') {
    const { name } = getEventIconAndDetails(event);
    const activityTitle = originalData?.title
      || originalData?.task_name
      || originalData?.meeting_description
      || originalData?.call_description
      || originalData?.deal_type
      || name;
    return (
      <span>
        <span className="font-semibold">{getUserName(event)}</span>
        {' deleted '}
        <span className="font-semibold">{activityTitle}</span>
      </span>
    );
  }

  return <span>An update occurred.</span>;
};

EventDescription.propTypes = {
  event: PropTypes.object.isRequired,
};

const TimelineItem = ({ event }) => {
  const { icon } = getEventIconAndDetails(event);
  return (
    <div className="relative flex pb-8 pl-10">
      <div className="absolute top-0 left-0 w-0.5 h-full bg-outline-grey-plutus" />
      <div className="absolute top-0 left-[-10px] flex items-center justify-center w-6 h-6 bg-white border rounded-full border-outline-grey-plutus">
        <i className={`${icon} text-sm text-primary-blue-plutus`} />
      </div>
      <div>
        <p className="text-sm leading-snug text-primary-dark-plutus">
          <EventDescription event={event} />
        </p>
        <p className="mt-1 text-xs text-primary-grey-plutus">
          {formatDateTimeLong(event.action_tstamp)}
        </p>
      </div>
    </div>
  );
};

TimelineItem.propTypes = {
  event: PropTypes.object.isRequired,
};

function ContactHistory({
  tenantId, contactId, contactName,
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactOwner, setContactOwner] = useState('Unknown');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Check authentication and fetch data
  const fetchData = useCallback(async () => {
    const user = userService.getUser();
    if (!user) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [historyData, contactData] = await Promise.all([
        contactService.getContactHistory(tenantId, contactId),
        contactService.getContactById(contactId),
      ]);

      // Filter out events that are updates but have no actual changes
      const filteredHistoryData = historyData.filter((event) => {
        // If the action is an update ('U'), it must have a non-empty diff_data object
        if (event.action === 'U') {
          return event.diff_data && Object.keys(event.diff_data).length > 0;
        }
        // Keep all other events (e.g., creation 'I', deletion 'D')
        return true;
      });

      setHistory(filteredHistoryData);
      setContactOwner(contactData.contact_owner_name || 'Unknown');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        userService.clearUser();
        navigate('/');
        return;
      }
      setError(err?.message || 'Failed to fetch contact history.');
    } finally {
      setLoading(false);
    }
  }, [tenantId, contactId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Improved search functionality
  const filteredHistory = useMemo(() => {
    if (!search.trim()) return history;
    const searchTerm = search.toLowerCase();

    return history.filter((event) => {
      const {
        diff_data: diffData,
        original_data: originalData,
      } = event;

      // Search in user name
      if (getUserName(event).toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search within the actual changed data
      if (diffData) {
        return Object.keys(diffData).some((key) => {
          const propertyName = formatPropertyName(key).toLowerCase();
          const newValue = String(diffData[key] || '').toLowerCase();
          const originalKey = Object.keys(originalData || {}).find(
            (k) => key.startsWith(k) || k.startsWith(key.split('_')[0]),
          ) || key;
          const oldValue = String(originalData?.[originalKey] || '').toLowerCase();

          return propertyName.includes(searchTerm)
            || oldValue.includes(searchTerm)
            || newValue.includes(searchTerm);
        });
      }

      // Search within created activity data
      if (event.new_data && event.action === 'I' && event.event_type === 'activity_change') {
        const { name } = getEventIconAndDetails(event);
        const activityTitle = event.new_data?.title
          || event.new_data?.task_name
          || event.new_data?.meeting_description
          || event.new_data?.call_description
          || event.new_data?.deal_type
          || name;
        return String(activityTitle).toLowerCase().includes(searchTerm);
      }

      // Search within deleted activity data
      if (event.original_data && event.action === 'D' && event.event_type === 'activity_change') {
        const { name } = getEventIconAndDetails(event);
        const activityTitle = event.original_data?.title
          || event.original_data?.task_name
          || event.original_data?.meeting_description
          || event.original_data?.call_description
          || event.original_data?.deal_type
          || name;
        return String(activityTitle).toLowerCase().includes(searchTerm);
      }

      return false;
    });
  }, [history, search]);

  const groupedHistory = useMemo(() => filteredHistory.reduce((acc, event) => {
    const monthYear = new Date(event.action_tstamp).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(event);
    return acc;
  }, {}), [filteredHistory]);

  const lastUpdatedEvent = history?.[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <BeatLoader color="#5E81F4" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-center text-secondary-pink-plutus">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-background-lightgrey-plutus font-lato">
      {/* Custom scrollbar styles */}
      <style>
        {`
          .timeline-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .timeline-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .timeline-scroll::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 4px;
          }
          .timeline-scroll::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          .timeline-scroll {
            scrollbar-width: thin;
            scrollbar-color: #d1d5db transparent;
          }
        `}
      </style>

      <div className="mx-6 mb-6 bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {/* Controls Section - Not sticky, lower z-index */}
          <div className="relative z-10 flex items-center mb-1">
            <div className="relative w-full max-w-sm">
              <i className="absolute text-lg -translate-y-1/2 left-3 top-1/2 las la-search text-primary-grey-plutus" />
              <input
                type="text"
                value={search}
                placeholder="Search in history..."
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-sm bg-white border rounded-md border-outline-grey-plutus focus:ring-2 focus:ring-primary-blue-plutus focus:outline-none"
              />
            </div>
          </div>

          {/* Last Updated Info */}
          {lastUpdatedEvent && (
            <div className="pl-1 mt-2 mb-6 rounded-lg">
              <p className="text-xs text-primary-grey-plutus">
                Last updated:&nbsp;
                <span className="font-medium text-primary-dark-plutus">
                  {new Date(lastUpdatedEvent.action_tstamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {' by '}
                <span className="font-medium text-primary-dark-plutus">{contactOwner}</span>
              </p>
            </div>
          )}

          {/* Content Section with custom scrollbar */}
          <div className="timeline-scroll overflow-y-auto max-h-[calc(100vh-360px)]">
            {history.length === 0 && (
              <div className="p-8 text-center rounded-lg bg-outline-grey-plutus">
                <i className="mb-3 text-4xl las la-history text-primary-grey-plutus" />
                <p className="text-sm text-primary-grey-plutus">No history found for this contact.</p>
              </div>
            )}

            {history.length > 0
              && Object.entries(groupedHistory).map(([monthYear, events]) => (
                <div key={monthYear} className="mb-8">
                  <div className="p-2 mb-4 rounded-md bg-outline-grey-plutus">
                    <h2 className="text-sm font-semibold tracking-wide uppercase text-primary-grey-plutus">
                      {monthYear}
                    </h2>
                  </div>
                  <div className="pl-2">
                    {events.map((event) => (
                      <TimelineItem key={event.unique_id} event={event} />
                    ))}
                  </div>
                </div>
              ))}

            {filteredHistory.length === 0 && history.length > 0 && (
              <div className="p-6 text-center rounded-lg bg-outline-grey-plutus">
                <i className="mb-3 text-3xl las la-search text-primary-grey-plutus" />
                <p className="text-sm text-primary-grey-plutus">
                  No results match &ldquo;
                  <span className="font-medium text-primary-dark-plutus">{search}</span>
                  &rdquo;.
                </p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="pt-4 mt-6 border-t border-outline-grey-plutus">
            <div className="p-3 rounded-lg bg-outline-grey-plutus">
              <p className="text-[10px] text-primary-grey-plutus">
                Showing
                {' '}
                <span className="font-semibold text-primary-dark-plutus">{filteredHistory.length}</span>
                {' '}
                of
                {' '}
                <span className="font-semibold text-primary-dark-plutus">{history.length}</span>
                {' '}
                changes for
                {' '}
                <span className="font-semibold text-primary-blue-plutus">{contactName}</span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ContactHistory.propTypes = {
  tenantId: PropTypes.string.isRequired,
  contactId: PropTypes.string.isRequired,
  contactName: PropTypes.string,
};

ContactHistory.defaultProps = {
  contactName: '',
};

export default ContactHistory;
