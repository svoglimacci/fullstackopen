
interface BmiValues {
    weight: number
    height: number
}

const parseBmiArguments = (args: Array<string>): BmiValues => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            weight: Number(args[2]),
            height: Number(args[3])
        };
    } else {
        throw new Error('Provided values were not numbers')
    }
};

export const calculateBmi = (a: number, b: number ): string => {
    const bmi = (a / b ** 2) * 703

    if (bmi < 18.5) {
        return 'Underweight (Unhealthy)';
    }
    if (18.5 < bmi && bmi < 24.9) {
        return 'Normal (Healthy)';
    }
    if (bmi > 24.9 && bmi < 29.9) {
        return 'Overweight (At risk)';
    }
    return 'Obese'
}

try {
    const { weight, height } = parseBmiArguments(process.argv);
    console.log(calculateBmi(weight, height));
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.'
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}
