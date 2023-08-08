import React, { useState } from "react";

const Message = ({ message }) => {
  return (
    <div className={`message ${message ? "slideIn" : "slideOut"}`}>
      <h3>{message}</h3>
    </div>
  );
};

export default Message;
