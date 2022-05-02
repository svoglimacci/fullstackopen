import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import { SelectField, EntryTypeOption, HealthRatingOption } from "./FormField";
import { EntryType, HealthCheckRating, Entry, UnionOmit  } from "../types";
import { DiagnosisSelection, TextField } from "../AddPatientModal/FormField";
import { useStateValue } from "../state";

export type EntryFormValues = UnionOmit<Entry, "id">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryOptions: EntryTypeOption[] = [
  { value: EntryType.HealthCheck, label: "Health Check" },
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthcare, label: "Occupational Healthcare" },
];
const healthRatingOptions: HealthRatingOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" },
];

export const AddPatientForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses: DiagCodes }] = useStateValue();

  return (
    <Formik
      initialValues={
        {
          type: EntryType.Hospital,
          date: new Date().toISOString().split("T")[0],
          specialist: "",
          description: "",
          diagnosisCodes: [],
          discharge: {
            date: new Date().toISOString().split("T")[0],
            criteria: "",
          },
          employerName: "",
          sickLeave: {
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
          },
          healthCheckRating: HealthCheckRating.Healthy,
        } as EntryFormValues
      }
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.type) {
          errors.type = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (values.type === "Hospital" && !values.discharge.date) {
          errors.discharge = "Discharge date is required";
        }
        if (values.type === "Hospital" && !values.discharge.criteria) {
          errors.discharge = "Discharge criteria is required";
        }

        if (values.type === "OccupationalHealthcare" && !values.employerName) {
          errors.employerName = requiredError;
        }
        return errors;
      }}
    >
      {({ values, errors, setFieldValue, setFieldTouched, isValid, dirty }) => {
        const valErrors = { discharge: "", ...errors };
        return (
          <Form className="form ui">
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="Date"
              name="date"
              component={TextField}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <SelectField
              label="Entry type"
              name="type"
              options={entryOptions}
            />

            <DiagnosisSelection
              diagnoses={Object.values(DiagCodes)}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />

            {values.type === EntryType.HealthCheck && (
              <SelectField
                label="Health Rating"
                name="healthCheckRating"
                options={healthRatingOptions}
              />
            )}
            {values.type === EntryType.Hospital && (
              <div>
                <p style={{ color: "red" }}>{valErrors.discharge}</p>
                <Field
                  label="Discharge Date"
                  placeholder="Discharged On"
                  name="discharge.date"
                  component={TextField}
                />
                <Field
                  label="Discharge Criteria"
                  placeholder="Discharged Criteria"
                  name="discharge.criteria"
                  component={TextField}
                />
              </div>
            )}
            {values.type === EntryType.OccupationalHealthcare && (
              <div>
                <Field
                  label="Employer"
                  placeholder="Employer Name"
                  name="employerName"
                  component={TextField}
                />
                <div>Sick Leave</div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "30px",
                  }}
                >
                  <Field
                    label="Start"
                    placeholder="Start Date"
                    name="sickleave.startDate"
                    component={TextField}
                  />
                  <Field
                    label="End"
                    placeholder="End Date"
                    name="sickLeave.endDate"
                    component={TextField}
                  />
                </div>
              </div>
            )}
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPatientForm;