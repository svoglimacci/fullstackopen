import { useState } from "react";

const StatisticLine = (props) => (
  <tr>
    <td>{props.text}</td><td>{props.value}</td>
  </tr>
);

const Statistics = (props) => {
  if (props.all === 0) {
    return <p>No feedback given</p>;
  }
  return (
    <table>
      <tbody>
      <StatisticLine value={props.good} text="good" />
      <StatisticLine value={props.neutral} text="neutral" />
      <StatisticLine value={props.bad} text="bad" />
      <StatisticLine value={props.all} text="all" />
      <StatisticLine value={props.average} text="average" />
      <StatisticLine value={props.positive + ' %'} text="positive" />
      </tbody>
    </table>
  );
};

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + neutral + bad;
  const average = (good - bad) / all;
  const positive = (good * 100) / all;

  const setToGood = (newValue) => {
    console.log("value now", newValue);
    setGood(newValue);
  };
  const setToNeutral = (newValue) => {
    console.log("value now", newValue);
    setNeutral(newValue);
  };
  const setToBad = (newValue) => {
    console.log("value now", newValue);
    setBad(newValue);
  };

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setToBad(bad + 1)} text="bad" />
      <h2>statistics</h2>
      <Statistics
        all={all}
        good={good}
        neutral={neutral}
        bad={bad}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
