import { createContext, useContext, useState } from "react";

const MarketplaceFormContext = createContext();

export function useMarketplaceForm() {
  return useContext(MarketplaceFormContext);
}

export function MarketplaceFormProvider({ children }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({});

  const openForm = (prefillData = {}) => {
    setFormData(prefillData);
    setIsFormVisible(true);
  };

  const closeForm = () => setIsFormVisible(false);

  return (
    <MarketplaceFormContext.Provider value={{
      isFormVisible,
      formData,
      openForm,
      closeForm,
      setFormData,
    }}>
      {children}
    </MarketplaceFormContext.Provider>
  );
}