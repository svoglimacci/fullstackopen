import express from 'express'
import { calculateBmi } from './bmiCalculator'
import { calculateExercises } from './exerciseCalculator'
const app = express()

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!')
})

app.get('/bmi', (req, res) => {
    const weight = Number(req.query.weight)
    const height = Number(req.query.height)

    if (isNaN(weight) || isNaN(height)) {
        return res.send({ error: 'malformatted parameters'}).status(400);
    }

    const result = { weight, height, bmi: calculateBmi(height, weight) }
    return res.send({ result })
})

app.post('/exercises', (req, res) => {
    const { target, dailyExerciseHours } = req.body;

    if (dailyExerciseHours === undefined || target === undefined) {
        return res.send({ error: 'malformatted parameters'}).status(400);
    }

    if (!Array.isArray(dailyExerciseHours)) { return res.send({ error: 'malformatted parameters'}).status(400); }

    if (isNaN(Number(target)) || target === null) {
        return res.send({ error: 'malformatted parameters'}).status(400);
    }
    const result = calculateExercises(target, dailyExerciseHours)
    return res.send({ result })
})
const PORT = 3003

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
