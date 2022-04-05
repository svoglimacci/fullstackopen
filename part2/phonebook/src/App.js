import React, { useState, useEffect } from "react";
import axios from "axios";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [newMessage, setNewMessage] = useState(null);
  const [newError, setNewError] = useState(false);

  useEffect(() => {
    axios.get("/api/persons").then((res) => {
      setPersons(res.data);
    });
  }, []);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  console.log("render", persons.length, "persons");

  const handlePersonChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const removePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((i) => i.id !== person.id));
          setNewError(false);
          setNewMessage(`Deleted '${person.name}'`);
          setTimeout(() => {
            setNewError(true);
            setNewMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setNewError(true);
          setNewMessage(`'${person.name}' was already removed from server`);
          setPersons(persons.filter((i) => i.id !== person.id));
          setTimeout(() => {
            setNewError(true);
            setNewMessage(null);
          }, 5000);
        });
    }
  };

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      id: newName,
      number: newNumber,
    };

    const test = persons.find((person) => person.name === newName);

    if (test) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService.update(test.id, personObject).then((test) => {
          setPersons(persons.map((i) => (i.id === test.id ? test : i)));
        })
        .catch(error => {
          setNewMessage(`${error.response.data.error}`);
          console.log(error.response.data);
        })
        setNewMessage(`replaced '${personObject.name}'`);
        setTimeout(() => {
          setNewError(true);
          setNewMessage(null);
        }, 5000);
      }
    } else {
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          setNewFilter("");
        })
        .catch((error) => {
          setNewMessage(`${error.response.data.error}`);
          console.log(error.response.data);
        });
      setTimeout(() => {
        setNewMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={newMessage} error={newError} />
      <PersonForm
        persons={persons}
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handlePersonChange={handlePersonChange}
        handleFilterChange={handleFilterChange}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <PersonList
        persons={persons}
        newFilter={newFilter}
        handleDelete={(person) => removePerson(person)}
      />
    </div>
  );
};

export default App;
