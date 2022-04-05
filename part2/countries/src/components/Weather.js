import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ query }) => {
  const [condition, setCondition] = useState({});
  const [hasCondition, setHasCondition] = useState(false);

  const api_key = process.env.REACT_APP_API_KEY || null;

  const params = {
    q: query,
    appid: api_key,
    units: "metric",
  };

  const updateCondition = () => {
    if (!api_key) return;

    let source = axios.CancelToken.source();

    axios
      .get("http://api.openweathermap.org/data/2.5/weather", {
        params: params,
        cancelToken: source.token,
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          throw error;
        }
      })
      .then((response) => {
        if (response.statusText === "OK") {
          setCondition(response.data);
          setHasCondition(true);
        }
      })
      .catch((error) => {
        console.log(error.config);
      });

    return () => {
      source.cancel("Weather component is unmounting");
    };
  };
  useEffect(updateCondition, []);

  return (
    <div>{hasCondition &&<div>
      <h3>Weather in {condition.name}</h3>
      <p>temperature {condition.main.temp} Celcius</p>
      <img
        alt={"Weather icon"}
        src={`http://openweathermap.org/img/wn/${condition.weather[0].icon}@2x.png`}
      />
      <p>wind {condition.wind.speed} m/s</p>
      </div>}
    </div>
  );
};

export default Weather;
