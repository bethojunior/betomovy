export const useStorage = () => {
  const setItem = (key: string, data: any) => {
    if (!key || !data) return null;
    localStorage.setItem(key, data);
    return true;
  };
  const getItem = (key: string) => {
    if (!key) return null;
    const itemStorage = localStorage.getItem(key);
    if (!itemStorage || itemStorage === undefined) return null;

    return itemStorage;
  };

  const removeItem = (key: string) => {
    if (!key) return null;
    localStorage.removeItem(key);
    return true;
  };

  return {
    setItem,
    getItem,
    removeItem,
  };
};
