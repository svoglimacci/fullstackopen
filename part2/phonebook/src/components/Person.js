import React from "react";

const Person = ({ person, handleDelete }) => {
  return (
    <li>
      {person.name} {person.number}
      <button
        key={person.id}
        name={person.name}
        onClick={() => handleDelete(person)}
      >
        delete
      </button>
    </li>
  );
};

export default Person;
