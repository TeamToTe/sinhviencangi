export const isAdminPath = (pathname?: string): boolean => {
  const path = pathname !== undefined ? pathname : (typeof window !== 'undefined' ? window.location.pathname : '');
  const normalized = path.replace(/\/+$/, '').toLowerCase();
  return (
    normalized === '/admin' ||
    normalized === '\\admin' ||
    normalized === '/%5cadmin' ||
    normalized.endsWith('/admin') ||
    normalized.endsWith('\\admin')
  );
};
