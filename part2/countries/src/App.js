import React, { useState, useEffect } from "react";
import axios from "axios";
import CountryList from "./components/CountryList";
import Filter from "./components/Filter";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [filtered, setFiltered] = useState(false);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);
  console.log("render", countries.length, "countries");

  const handleChange = (event) => {
    setFilter(event.target.value);

    if (event.target.value === "") setFiltered(false);
    else setFiltered(true);
  };

  const handleClick = (event) => {
    setFilter(event.target.id);
  };

  const filteredCountries = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(filter.toLowerCase());
  });

  const countryMatch = filteredCountries.some((country) => {
    return country.name.common.toLowerCase() === filter.toLowerCase();
  });

  let exactMatch;
  if (countryMatch) {
    exactMatch = filteredCountries.filter((country) => {
      return country.name.common.toLowerCase() === filter.toLowerCase();
    });
  }

  return (
    <div>
      <Filter onChange={(event) => handleChange(event)} value={filter} />
      {filtered && exactMatch && <CountryList countries={filteredCountries} />}
      {filtered && !exactMatch && (
        <CountryList
          countries={filteredCountries}
          handleClick={(event) => handleClick(event)}
        />
      )}
    </div>
  );
};

export default App;
