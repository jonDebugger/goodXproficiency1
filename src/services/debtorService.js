import { apiCall } from "./apiCall";

export const debtorService = {
  getDebtors: (entityUid) => {
    return apiCall('/api/debtor', 'GET', null, {
      fields: JSON.stringify([
        "uid", "entity_uid", "name", "surname", "initials",
        "title", "id_type", "id_no", "mobile_no", "email",
        "file_no", "gender", "acc_identifier", "patients",
        "medical_aid_option_uid", "medical_aid_no", "medical_aid_scheme_code"
      ]),
      filter: JSON.stringify(["=", ["I", "entity_uid"], ["L", parseInt(entityUid)]]),
      limit: 100
    });
  },

  getDebtor: (debtorUid) => {
    return apiCall(`/api/debtor/${debtorUid}`, 'GET');
  }
};
