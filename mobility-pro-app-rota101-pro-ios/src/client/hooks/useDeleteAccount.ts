import { useState } from 'react';
import { useReceipt } from '../contexts/Receipt';

export function useDeleteAccount() {
  const [loading, setLoading] = useState(false);
  const { postExcludeAccount: requestExclude } = useReceipt();

  const postExcludeAccount = async (reason: string, details: string) => {
    setLoading(true);
    await requestExclude(details, reason);
    setLoading(false);
  };

  return { postExcludeAccount, loading };
}
