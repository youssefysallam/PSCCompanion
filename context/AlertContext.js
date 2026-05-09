import React, { createContext, useCallback, useContext, useState } from 'react';
import { ALERTS } from '../constants/mockData';

const AlertsContext = createContext(null);

export function AlertsProvider({ children }) {
  // Seed battery alert as active so we can demo resolving it
  const initialAlerts = ALERTS.map((a) =>
    a.id === '11' ? { ...a, status: 'active' } : a
  );

  const [alerts, setAlerts] = useState(initialAlerts);

  const updateAlertStatus = useCallback((id, newStatus) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  }, []);

  const addAlert = useCallback((newAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  // Called by proximity resolver on map screen
  const resolveByMember = useCallback((memberId) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.linkedMemberId === memberId && a.status !== 'resolved'
          ? { ...a, status: 'resolved' }
          : a
      )
    );
  }, []);

  // Called by battery resolver
  const resolveByType = useCallback((resolveKey) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.resolveKey === resolveKey && a.status !== 'resolved'
          ? { ...a, status: 'resolved' }
          : a
      )
    );
  }, []);

  return (
    <AlertsContext.Provider
      value={{ alerts, updateAlertStatus, resolveByMember, resolveByType, addAlert }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts must be used within AlertsProvider');
  return ctx;
}