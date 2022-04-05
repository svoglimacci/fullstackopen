
import React from "react";

const Filter = (props) => {
  return (
    <div>
      <p>find countries </p>
      <input onChange={props.onChange} value={props.value}></input>
    </div>
  );
};

export default Filter;