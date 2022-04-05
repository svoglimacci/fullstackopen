import React from "react";

const PersonForm = (props) => {
  return (
    <div>
      <div>
        filter shown with
        <input
          value={props.newFilter}
          onChange={props.handleFilterChange}
        />{" "}
      </div>
      <form onSubmit={props.addPerson}>
        <div>
          name:{" "}
          <input value={props.newName} onChange={props.handlePersonChange} />
        </div>
        <div>
          number:{" "}
          <input value={props.newNumber} onChange={props.handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
