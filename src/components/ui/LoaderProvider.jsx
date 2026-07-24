import React, { createContext, useContext, useState } from 'react';
import GlobalLoader from './GlobalLoader';

const LoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {}
});

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showLoader = (customMessage = '') => {
    setMessage(customMessage);
    setLoading(true);
  };

  const hideLoader = () => {
    setLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <GlobalLoader loading={loading} message={message} />
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
