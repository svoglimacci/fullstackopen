import React from 'react'

const Total = ({parts}) => {
    const sum = parts.reduce((prev, curr) => prev + curr.exercises, 0);
    return (
        <p>
            <b>Total of {sum} exercises</b>
        </p>
    )
};

export default Total