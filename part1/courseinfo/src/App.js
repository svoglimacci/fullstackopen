const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Header = (props) => {
    return (
      <div>
        <h1>{props.course}</h1>
      </div>
    )
  }


  const Content = (props) => {
    const listParts = course.parts.map((d) => <p key={d.name}>{d.name} {d.exercises}</p>);
    return (
      <div>
        {listParts}
      </div>
    )
  }

  const Total =(props) => {
    const CountExercises = course.parts.map(item => item.exercises).reduce((prev, curr) => prev + curr, 0);
    return (
      <div><p>Number of exercices : {CountExercises} </p></div>
    )
  }
  
  return (
    <div>
      <Header  course={course.name}/>
      <Content />
      <Total />
     

    </div>
  )
}

export default App;
