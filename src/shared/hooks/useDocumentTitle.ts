import { useEffect } from 'react';

export const useDocumentTitle = (title: any) => {
  useEffect(() => {
    document.title = title ?? '';
  }, [title]);

  return null;
};
