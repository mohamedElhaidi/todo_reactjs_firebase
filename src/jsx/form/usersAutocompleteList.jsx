import { Autocomplete, TextField } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { firestoreInstance } from "../../js/services/firebase/firestore";
import { getUsersPublic } from "../../js/services/users";

const UsersAutocompleteList = ({
  multiple,
  disabled,
  onFetchSucceeded,
  onFetchFailed,
  handleSelectionChange,
  value,
  ...props
}) => {
  const [users, setUsers] = React.useState([]);

  // grab all users public info
  React.useEffect(() => {
    const users = collection(firestoreInstance, "/users");
    console.log(users);
    getDocs(users)
      .then((snap) => {
        snap.docs.forEach((doc) =>
          setUsers((prev) => [...prev, { id: doc.id, ...doc.data() }])
        );
        if (onFetchSucceeded)
          onFetchSucceeded(
            snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
      })
      .catch((err) => {
        if (onFetchFailed) onFetchFailed(err.message);
      });
  }, []);

  return (
    <Autocomplete
      id="users-el"
      multiple={multiple}
      disabled={disabled}
      value={value}
      options={users}
      onChange={(e, value) => handleSelectionChange(value)}
      getOptionLabel={(option) => (option ? option.name : null)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Users"
          placeholder="users..."
        />
      )}
      {...props}
    />
  );
};

export default UsersAutocompleteList;
