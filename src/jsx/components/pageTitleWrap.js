import { useEffect } from "react";
import { useStore } from "../../js/services/Context/StoreContext";

const TitlePageWrap = ({ title, children }) => {
  const [store, setStore] = useStore();

  useEffect(() => {
    document.title = title;
    setStore({ ...store, pageTitle: title });
  }, [title]);
  return children;
};

export default TitlePageWrap;
