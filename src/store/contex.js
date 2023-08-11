import React, { createContext, useContext } from "react";

const ResponseDataContext = createContext({
  data: {},
  login: (userData, mode) => {},
  message: {},
});

export const useResponseData = () => useContext(ResponseDataContext);

export default ResponseDataContext;
