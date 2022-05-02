import { Entry, assertNever  } from '../types';
import { useStateValue } from "../state";

const EntryDetails = ( { entry } : { entry: Entry }) => {
    const [{ diagnoses }] = useStateValue();
    switch (entry.type) {
        case "Hospital":
            return (
                <div>
                    <span>[{entry.date}]</span>
                    <p>{entry.description}</p>
                    <p>Specialist: {entry.specialist}</p>
                    {entry.diagnosisCodes && (
                        <div>
                            <span>Diagnoses</span>
                            <ul>
                                {entry.diagnosisCodes.map((code) => (
                                    <li key={code}>
                                        {code} {diagnoses[code]?.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {entry.discharge && (
                        <div>
                            <span>Discharge</span>
                            <span>{entry.discharge.criteria} [{entry.discharge.date}]</span>
                        </div>
                    )}
                </div>
            );
        case "OccupationalHealthcare":
            return (
                <div>
                <span>[{entry.date}]</span>
                <p>{entry.description}</p>
                <p>Specialist: {entry.specialist}</p>
                {entry.diagnosisCodes && (
                    <div>
                        <span>Diagnoses</span>
                        <ul>
                            {entry.diagnosisCodes.map((code) => (
                                <li key={code}>
                                    {code} {diagnoses[code]?.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {entry.sickLeave && (
                    <div>
                        <span>Sicke leave</span>
                        <span>{entry.sickLeave.startDate} [{entry.sickLeave.endDate}]</span>
                    </div>
                )}
            </div>
            );
        case "HealthCheck":
            return (
                <div>
                    <span>[{entry.date}]</span>
                    <p>{entry.description}</p>
                    <p>Specialist: {entry.specialist}</p>
                    {entry.diagnosisCodes && (
                        <div>
                            <span>Diagnoses</span>
                            <ul>
                                {entry.diagnosisCodes.map((code) => (
                                    <li key={code}>
                                        {code} {diagnoses[code]?.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div>
                        <span>healthCheck Rating : {entry.healthCheckRating}</span>
                    </div>
                </div>
            );
        default:
        return assertNever(entry);
    }
};

export default EntryDetails;