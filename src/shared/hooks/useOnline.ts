import { useEffect, useState } from 'react';

export const useOnline = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleChange = () => setOnline(navigator.onLine);

    window.addEventListener('online', handleChange);
    window.addEventListener('offline', handleChange);

    return () => {
      window.removeEventListener('online', handleChange);
      window.removeEventListener('offline', handleChange);
    };
  }, [online]);

  return online;
};
