import { apiCall } from "./apiCall";

export const bookingService = {
  getBookings: (diaryUid, dateString) => {
    const filterData = [
      "AND",
      ["=", ["I", "diary_uid"], ["L", parseInt(diaryUid)]],
      ["=", ["::", ["I", "start_time"], ["I", "date"]], ["L", dateString]]
    ];

    return apiCall('/api/booking', 'GET', null, {
      fields: JSON.stringify([
        ["AS", ["I", "patient_uid", "name"], "patient_name"],
        ["AS", ["I", "patient_uid", "surname"], "patient_surname"],
        ["AS", ["I", "patient_uid", "debtor_uid", "name"], "debtor_name"],
        ["AS", ["I", "patient_uid", "debtor_uid", "surname"], "debtor_surname"],
        "uid", "entity_uid", "diary_uid", "booking_type_uid",
        "booking_status_uid", "patient_uid", "start_time", "duration",
        "treating_doctor_uid", "reason", "invoice_nr", "cancelled", "uuid"
      ]),
      filter: JSON.stringify(filterData)
    });
  },

  createBooking: (bookingData) => {
    return apiCall('/api/booking', 'POST', {
      model: bookingData
    });
  },

  updateBooking: (bookingUid, bookingData) => {
    return apiCall(`/api/booking/${bookingUid}`, 'PUT', {
      model: {
        uid: bookingUid,
        ...bookingData
      }
    });
  },

  deleteBooking: (bookingUid) => {
    return apiCall(`/api/booking/${bookingUid}`, 'PUT', {
      model: {
        uid: bookingUid,
        cancelled: true
      }
    });
  }
};

export const bookingTypeService = {
  getBookingTypes: (entityUid, diaryUid) => {
    const filterData = [
      "AND",
      ["=", ["I", "entity_uid"], ["L", parseInt(entityUid)]],
      ["=", ["I", "diary_uid"], ["L", parseInt(diaryUid)]],
      ["NOT", ["I", "disabled"]]
    ];

    return apiCall('/api/booking_type', 'GET', null, {
      fields: JSON.stringify([
        "uid", "entity_uid", "diary_uid", "name",
        "booking_status_uid", "disabled", "uuid"
      ]),
      filter: JSON.stringify(filterData)
    });
  }
};

export const bookingStatusService = {
  getBookingStatuses: (entityUid, diaryUid) => {
    const filterData = [
      "AND",
      ["=", ["I", "entity_uid"], ["L", parseInt(entityUid)]],
      ["=", ["I", "diary_uid"], ["L", parseInt(diaryUid)]],
      ["NOT", ["I", "disabled"]]
    ];

    return apiCall('/api/booking_status', 'GET', null, {
      fields: JSON.stringify([
        "uid", "entity_uid", "diary_uid", "name",
        "next_booking_status_uid", "is_arrived", "is_final", "disabled"
      ]),
      filter: JSON.stringify(filterData)
    });
  }
};
