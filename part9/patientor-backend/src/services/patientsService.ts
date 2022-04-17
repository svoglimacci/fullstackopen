import patients from '../../data/patients';
import { v1 as uuidv1 } from 'uuid';
import { newPatientEntry, NonSensitivePatientEntry, PatientEntry } from '../types';

const getEntries = (): Array<PatientEntry> => {
    return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const addPatient = ( entry: newPatientEntry ): PatientEntry => {
    const newPatientEntry = {
        id: uuidv1(),
        ...entry
    };
    patients.push(newPatientEntry);
    return newPatientEntry;
};
/*
const findById = (id: string): PatientEntry | undefined => {
    const entry = patients.find(p => p.id === id);
    return entry;
};
*/
export default {
    getEntries,
    addPatient,
    getNonSensitiveEntries,
    //findById
};
