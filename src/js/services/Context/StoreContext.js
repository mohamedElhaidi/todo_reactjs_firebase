import React, { useState, useContext, useEffect } from "react";

export const Context = React.createContext({});
const UpadeStoreContext = React.createContext(() => {});

export function useStore() {
  const store = useContext(Context);
  const fn = useContext(UpadeStoreContext);
  return [store, fn];
}

const StoreContext = ({ value = {}, children }) => {
  const [store, setStore] = useState({});
  const setStoreMiddlewire = (data) => {
    console.log(`%c "Store Context"`, "background: #222; color: #bada55", data);
    setStore(data);
  };
  return (
    <Context.Provider value={store}>
      <UpadeStoreContext.Provider value={setStoreMiddlewire}>
        {children}
      </UpadeStoreContext.Provider>
    </Context.Provider>
  );
};

export default StoreContext;
