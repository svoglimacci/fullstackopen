import React from "react";
import Person from "./Person";

const PersonList = ({ persons, newFilter, handleDelete }) => {
  const filterItems = !newFilter
    ? persons
    : persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      );

  return (
    <ul>
      {filterItems.map((person) => (
        <Person key={person.name} person={person} handleDelete={handleDelete} />
      ))}
    </ul>
  );
};

export default PersonList;
