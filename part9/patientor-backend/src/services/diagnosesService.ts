import diagnoses from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getEntries = (): Array<Diagnosis> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return diagnoses;
};

const addDiagnosis = () => {
    return null;
};


export default {
    getEntries,
    addDiagnosis
};