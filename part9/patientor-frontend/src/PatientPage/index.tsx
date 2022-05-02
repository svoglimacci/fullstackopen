import React from "react";
import axios from 'axios';
import { useStateValue } from "../state";
import { useParams } from "react-router-dom";
import { Diagnosis, Patient, Entry, EntryFormValues } from '../types';
import { apiBaseUrl } from "../constants";
import EntryDetails from "../components/EntryDetails";
import AddEntryModal from "../AddEntryModal";

const PatientPage = () => {
    const [{ patient }, dispatch] = useStateValue();
    const { id = "" } = useParams<{ id: string }>();
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry =async (values:EntryFormValues) => {
    console.log('Entries',values);
    try{
      const { data: newEntry } = await axios.post<Patient>(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${apiBaseUrl}/patients/${id}/entries`,
        values
    );

    dispatch({ type: "ADD_ENTRY", payload: newEntry });

    closeModal();
    }catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };
    React.useEffect(() => {
        void axios.get<void>(`${apiBaseUrl}/ping`);

        const fetchPatient = async () => {
        try {
          const { data: patient } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch({ type: "SET_PATIENT", payload: patient });
        } catch (e) {
          console.error(e);
        }
      };
      const fetchDiagnoses = async () => {
          try {
              const { data: diagnoses } = await axios.get<Diagnosis[]>(
                  `${apiBaseUrl}/diagnoses`
              );
              dispatch({ type : "SET_DIAGNOSES", payload: diagnoses});
          } catch (e) {
              console.error(e);
          }
      };
      void fetchDiagnoses();
      void fetchPatient();
    }, [dispatch]);

      if (!patient) {
        return (
          <div>
            <h3>error</h3>
          </div>
        );
      }

    return (
        <div>

                <h2>{patient.name} - {patient.gender}</h2>
                <p>ssn: {patient.ssn}</p>
                <p>occupation: {patient.occupation}</p>

                <h3>entries: </h3>
                <div>
                {patient?.entries?.length ? (
                    patient.entries.map((entry: Entry) => (
                    <EntryDetails entry={entry} key={entry.id} />
                ))
    ) : (
    <p>No entries</p>
    )}

</div>
<AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <button onClick={() => openModal()}>
        Add New Patient
      </button>
        </div>
    );
};

export default PatientPage;
