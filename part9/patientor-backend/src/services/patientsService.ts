import patients from '../../data/patients';
import { v1 as uuidv1, v1 } from 'uuid';
import { EntryWithoutId , newPatientEntry, NonSensitivePatientEntry, Patient } from '../types';

const getEntries = (): Array<Patient> => {
    return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
        entries
    }));
};

const addPatient = ( entry: newPatientEntry ): Patient => {
    const newPatientEntry = {
        id: uuidv1(),
        ...entry
    };
    patients.push(newPatientEntry);
    return newPatientEntry;
};

const addEntry = (pId:string,entry:EntryWithoutId):Patient =>{
    const patient = patients.find(p => p.id === pId );
    if(!patient){
      throw new Error('Patient cannot be found');
  }
  if(!entry.type){
      throw new Error('Missing type field');
  }
  if(entry.type!=='Hospital' && entry.type!=='OccupationalHealthcare' && entry.type!=='HealthCheck'){
      throw new Error('Wrong kind of type field');
  }
  if(entry.type==='Hospital' && !entry.discharge){
      throw new Error('Missing discharge field');
  }
  if(entry.type==='OccupationalHealthcare' && !entry.employerName){
      throw new Error('Missing employerName field');
  }
  if(entry.type==='HealthCheck' && !entry.healthCheckRating){
      throw new Error('Missing healthCheckRating field');
  }
    patient.entries.push({...entry,id:v1()});
    return patient;
  };

const findById = (id: string): Patient | undefined => {
    const entry = patients.find(p => p.id === id);
    return entry;
};

export default {
    getEntries,
    addPatient,
    getNonSensitiveEntries,
    findById,
    addEntry
};
