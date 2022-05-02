import { CoursePart } from '../types'

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    )
}

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
    switch (coursePart.type) {
        case 'normal':
            return (
                <div>
                    <h3>
                        {coursePart.name}: {coursePart.exerciseCount}
                    </h3>
                    <p>{coursePart.description}</p>
                </div>
            )
        case 'groupProject':
            return (
                <div>
                    <h3>
                        {coursePart.name}: {coursePart.exerciseCount}
                    </h3>
                    <p>project exercises: {coursePart.groupProjectCount}</p>
                </div>
            )
        case 'submission':
            return (
                <div>
                    <h3>
                        {coursePart.name}: {coursePart.exerciseCount}
                    </h3>
                    <p>{coursePart.description}</p>
                    <p>submit to {coursePart.exerciseSubmissionLink}</p>
                </div>
            )
        case 'special':
            return (
                <div>
                    <h3>
                        {coursePart.name}: {coursePart.exerciseCount}
                    </h3>
                    <p>{coursePart.description}</p>
                    <p>required skills: {coursePart.requirements.join(', ')}</p>
                </div>
            )
        default:
            return assertNever(coursePart)
    }
}
const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
    return (
        <div className='parts'>
            {courseParts.map((part) => (
                <Part key={part.name} coursePart={part} />
            ))}
        </div>
    )
}

export default Content
