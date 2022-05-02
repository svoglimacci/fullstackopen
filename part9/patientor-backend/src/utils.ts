import { newPatientEntry, Gender, Entry, EntryWithoutId, EntryType, Discharge, SickLeave, HealthCheckRating } from './types';

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isGender = (param: any): param is Gender => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(Gender).includes(param);
};

const parseName = (name: unknown): string => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name: ' + name);
    }

    return name;
};

const parseOccupation = (occupation: unknown): string => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation: ' + occupation);
    }

    return occupation;
};

const parseSsn = (ssn: unknown): string => {
    if (!ssn || !isString(ssn)) {
        throw new Error('Incorrect or missing ssn: ' + ssn);
    }

    return ssn;
};

const parseDate = (date: unknown): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error(`Incorrect or missing date: ${date}`);
    }
    return date;
};

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isGender(gender)) {
        throw new Error(`Incorrect or missing gender: ${gender}`);
    }
    return gender;
};

export const parseEntries = (entries: any): Entry[] => {
    if(!entries) {
        throw new Error(`Incorrect or missing entry: ${entries}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return entries;
};

type Fields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown, entries:unknown };

const toNewPatientEntry = ({name, dateOfBirth, ssn, gender, occupation, entries } : Fields): newPatientEntry => {
    const newPatient: newPatientEntry = {
        name: parseName(name),
        dateOfBirth: parseDate(dateOfBirth),
        ssn: parseSsn(ssn),
        gender: parseGender(gender),
        occupation: parseOccupation(occupation),
        entries: parseEntries(entries)
    };

    return newPatient;
};
const parseField = (field:unknown): string =>{
    if (!field || !isString(field)){
      throw new Error('Incorrect or missing name');
    }
    return field;
  };



  const parseDischarge = (field:unknown):Discharge => {
    const isDischarge = (object: unknown): object is Discharge => {
      return (object as Discharge).criteria !== undefined || !isDate((object as Discharge).date) ;
    };
    if(!field || !isDischarge(field)) throw new Error('Incorrect field: ' + field);
    return field;
  };

  const parseSickleave = (field: unknown): SickLeave => {
    const leave = field as SickLeave;
    if( !isDate(leave.startDate) || !isDate(leave.endDate))
      throw new Error('Incorrect fields for SickLeave');
    return leave;
  };


  //
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseHealthCheckRating = (field: any ): HealthCheckRating => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isHRating = (object: any): object is HealthCheckRating => {
      return (object in HealthCheckRating);
    };
    if(isHRating(field))
      return field;
    else throw new Error(`${field} is not a HealthCheckRating`);
  };

export const toNewEntry = (object: any):EntryWithoutId => {
    const description = parseField(object.description);
    const date = parseField(object.date);
    const specialist = parseField(object.specialist);

    const baseEntry = {description,date,specialist};

    switch(object.type as EntryType)
    {
      case "Hospital":
        const discharge = object.discharge
        ? parseDischarge(object.discharge) : undefined;
        return {
          ...baseEntry,discharge,type:"Hospital"
        } as EntryWithoutId;

      case "HealthCheck":
        const healthCheckRating =  parseHealthCheckRating(object.healthCheckRating);
        return {
          ...baseEntry,healthCheckRating,type:"HealthCheck"
        } as EntryWithoutId;

      case "OccupationalHealthcare":
        const employerName = parseField(object.employerName);
        const sickLeave= object.sickLeave ? parseSickleave(object.sickLeave) : undefined;
        return {
          ...baseEntry,employerName,sickLeave,type:"OccupationalHealthcare"
        } as EntryWithoutId;
      default:
        throw new Error('Wrong type');
    }
};


export default toNewPatientEntry;