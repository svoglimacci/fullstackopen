import React from "react";
import Country from "./Country";

const CountryList = ({ countries, handleClick }) => {
  const countryList = countries.map((country) => {
    return (
      <div key={country.name.common}>
        {country.name.common}
        <button onClick={handleClick} id={country.name.common}>
          Show
        </button>
      </div>
    );
  });

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length > 1 && countries.length <= 10) {
    return <div>{countryList}</div>;
  }

  if (countries.length === 1) {
    return (
      <ul>
        <Country country={countries[0]} />
      </ul>
    );
  }
  return <p>No match, specify another filter</p>;
};

export default CountryList;
