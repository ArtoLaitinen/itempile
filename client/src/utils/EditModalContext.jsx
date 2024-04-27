import React, { createContext, useMemo, useState } from "react";

const EditModalContext = createContext();

export function EditModalContextProvider({ children }) {
  const [editModalState, setEditModalState] = useState({
    isEditModalOpen: false,
    item: {
      title: "",
      description: "",
      image: "",
      category: "",
      price: "",
    },
  });

  const updateEditModalState = (newData) => {
    setEditModalState((prevData) => {
      const newState = {
        ...prevData,
        ...newData,
      };
      return newState;
    });
  };

  const contextValues = useMemo(
    () => [editModalState, updateEditModalState],
    [editModalState],
  );

  return (
    <EditModalContext.Provider value={contextValues}>
      {children}
    </EditModalContext.Provider>
  );
}

export default EditModalContext;
