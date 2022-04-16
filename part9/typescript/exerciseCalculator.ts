type rating = 1 | 2 | 3

interface ExerciseValues {
    target: number
    dailyExerciseHours: Array<number>
}

interface AverageValues {
    periodLength: number
    trainingDays: number
    target: number
    average: number
    success: boolean
    rating: number
    ratingDescription: string
}

const parseExerciseArguments = (args: Array<string>): ExerciseValues => {
    const inputParse = args.slice(2).map(Number)
    if (!inputParse.some(isNaN)) {
        return {
            target: Number(args[2]),
            dailyExerciseHours: args.slice(3).map(Number),
        }
    } else {
        console.log(args)
        throw new Error('Provided values were not numbers!')
    }
}

export const calculateExercises = (
    target: number,
    dailyExerciseHours: Array<number>
): AverageValues => {
    const periodLength = dailyExerciseHours.length
    const trainingDays = dailyExerciseHours.filter((day) => day > 0).length
    const average =
        dailyExerciseHours.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
        ) / periodLength
    const success = average >= target ? true : false

    let rating: rating
    let ratingDescription: string

    if (average < target) {
        rating = 1
        ratingDescription = 'bad'
    } else if (average === target) {
        rating = 2
        ratingDescription = 'not too bad but could be better'
    } else {
        rating = 3
        ratingDescription = 'good'
    }
    return {
        periodLength: periodLength,
        trainingDays: trainingDays,
        success: success,
        rating: rating,
        ratingDescription: ratingDescription,
        target: target,
        average: average,
    }
}

try {
    const { target, dailyExerciseHours } = parseExerciseArguments(process.argv)
    console.log(calculateExercises(target, dailyExerciseHours))
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.'
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message
    }
    console.log(errorMessage)
}
