import { apiCall } from "./apiCall";

export const diaryService = {
  getDiaries: () => {
    return apiCall('/api/diary', 'GET', null, {
      fields: JSON.stringify([
        "uid", "entity_uid", "name", "treating_doctor_uid",
        "service_center_uid", "booking_type_uid", "uuid", "disabled"
      ])
    });
  }
};
