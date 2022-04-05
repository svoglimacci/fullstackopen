import React from "react";
import Weather from './Weather';

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital:{country.capital} </p>
      <p>area :{country.area} </p>
      <h3>languages</h3>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="Missing Flag" width="150" />
      <Weather query={country.capital + ''} />
    </div>
  );
};

export default Country;

