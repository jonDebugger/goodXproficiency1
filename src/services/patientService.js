import { apiCall } from "./apiCall";

export const patientService = {
  getPatients: (entityUid) => {
    return apiCall('/api/patient', 'GET', null, {
      fields: JSON.stringify([
        "uid", "entity_uid", "debtor_uid", "name", "surname",
        "initials", "title", "id_type", "id_no", "date_of_birth",
        "mobile_no", "email", "file_no", "gender"
      ]),
      filter: JSON.stringify(["=", ["I", "entity_uid"], ["L", parseInt(entityUid)]]),
      limit: 100
    });
  }
};

