import express from 'express';
import patientsService from '../services/patientsService';
import toNewPatientEntry, { toNewEntry } from '../utils';


const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
    res.send(patientsService.getNonSensitiveEntries());
});

patientsRouter.get('/:id', (req, res) => {
    res.send(patientsService.findById(String(req.params.id)));
});


patientsRouter.post('/', (req, res) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const newPatientEntry = toNewPatientEntry(req.body);

        const addedPatient = patientsService.addPatient(newPatientEntry);
        res.json(addedPatient);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

patientsRouter.post("/:id/entries", (req, res) => {

    const newPatientEntry = toNewEntry(req.body);
    const added = patientsService.addEntry(req.params.id, newPatientEntry);
    if (!patientsService.findById(req.params.id)) {
        res.status(400).json({ error: "Not Found" });
        return;
    }
    res.json(added);
});

export default patientsRouter;