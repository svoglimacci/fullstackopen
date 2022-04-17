import express from 'express';

const diagnosesRouter = express.Router();

diagnosesRouter.get('/', (_req, res) => {
    res.send('Fetching all diagnoses');
});

diagnosesRouter.post('/', (_req, res) => {
    res.send('Saving a diagnosis');
});

export default diagnosesRouter;