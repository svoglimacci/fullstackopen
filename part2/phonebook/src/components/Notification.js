import React from "react";

const Notification = ({ message, error }) => {
  if (message === null) {
    return null;
  }
  if (error === true) {
    return <div className="error">{message}</div>;
  } else {
    return <div className="message">{message}</div>;
  }
};

export default Notification;
