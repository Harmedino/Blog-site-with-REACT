import React from "react";

const Message = (props) => {
  return (
    <div className="message">
      <h3>{props.message}</h3>
    </div>
  );
};

export default Message;
