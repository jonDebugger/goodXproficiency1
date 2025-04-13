import React, { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import { bookingService, bookingStatusService, bookingTypeService } from '../services/bookingService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Modal = ({ isOpen, onClose, diary, date, booking, onSubmit }) => {
  const [patients, setPatients] = useState([]);
  const [bookingTypes, setBookingTypes] = useState([]);
  const [bookingStatuses, setBookingStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [patientUid, setPatientUid] = useState('');
  const [bookingTypeUid, setBookingTypeUid] = useState('');
  const [startTime, setStartTime] = useState(date ? new Date(date) : new Date());
  const [duration, setDuration] = useState(15);
  const [reason, setReason] = useState('');

  const inputClass =
    "bg-[#1e1e2e] text-[#cdd6f4] border border-[#585b70] p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#89b4fa] font-mono text-xs w-72";

  // Default Hours
  useEffect(() => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(9, 0, 0);
      setStartTime(newDate);
    }
  }, [date]);

  // Load data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !diary) return;

      setLoading(true);
      setError(null);

      try {
        // Get patients for the entity
        const patientsResult = await patientService.getPatients(diary.entity_uid);

        if (patientsResult.error) {
          setError('Failed to fetch patients');
          setLoading(false);
          return;
        }

        const patientsData = patientsResult.data.data || [];
        setPatients(patientsData);

        if (patientsData.length > 0 && !booking) {
          setPatientUid(patientsData[0].uid.toString());
        }

        // Get booking types for the diary
        const bookingTypesResult = await bookingTypeService.getBookingTypes(
          diary.entity_uid,
          diary.uid
        );

        if (bookingTypesResult.error) {
          setError('Failed to fetch booking types');
          setLoading(false);
          return;
        }

        const bookingTypesData = bookingTypesResult.data.data || [];
        setBookingTypes(bookingTypesData);

        if (bookingTypesData.length > 0 && !booking) {
          setBookingTypeUid(bookingTypesData[0].uid.toString());
        }

        // Get booking statuses for the diary
        const bookingStatusesResult = await bookingStatusService.getBookingStatuses(
          diary.entity_uid,
          diary.uid
        );

        if (bookingStatusesResult.error) {
          setError('Failed to fetch booking statuses');
          setLoading(false);
          return;
        }

        const bookingStatusesData = bookingStatusesResult.data.data || [];
        setBookingStatuses(bookingStatusesData);
      } catch (err) {
        setError('An error occurred while loading form data');
        console.error('Error loading form data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [diary, isOpen, booking]);

  // Populate form if editing existing booking
  useEffect(() => {
    if (booking) {
      setPatientUid(booking.patient_uid ? booking.patient_uid.toString() : '');
      setBookingTypeUid(booking.booking_type_uid ? booking.booking_type_uid.toString() : '');

      // Handle the booking start time
      if (booking.start_time) {
        setStartTime(new Date(booking.start_time));
      } else if (date) {
        const newDate = new Date(date);
        newDate.setHours(9, 0, 0);
        setStartTime(newDate);
      }

      setDuration(booking.duration || 15);
      setReason(booking.reason || '');
    } else {
      // Reset form for new booking
      if (patients.length > 0) {
        setPatientUid(patients[0].uid.toString());
      }
      if (bookingTypes.length > 0) {
        setBookingTypeUid(bookingTypes[0].uid.toString());
      }
      // Set default time to 9 AM on the selected date
      if (date) {
        const newDate = new Date(date);
        newDate.setHours(9, 0, 0);
        setStartTime(newDate);
      } else {
        setStartTime(new Date());
      }
      setDuration(15);
      setReason('');
    }
  }, [booking, date, patients, bookingTypes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!diary) {
      setError('No diary selected');
      return;
    }

    // Format time for API
    const dateString = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const hours = startTime.getHours().toString().padStart(2, '0');
    const minutes = startTime.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${dateString}T${hours}:${minutes}:00`;

    // Find a valid booking status - first try to get the one from the booking type
    // If that's null, use the first booking status in the list
    const selectedBookingType = bookingTypes.find(
      bt => bt.uid === parseInt(bookingTypeUid)
    );

    let bookingStatusUid;
    if (selectedBookingType?.booking_status_uid) {
      bookingStatusUid = selectedBookingType.booking_status_uid;
    } else if (bookingStatuses.length > 0) {
      bookingStatusUid = bookingStatuses[0].uid;
    } else {
      setError('No valid booking status found');
      return;
    }

    // Prepare the booking data
    const bookingData = {
      entity_uid: diary.entity_uid,
      diary_uid: diary.uid,
      booking_type_uid: parseInt(bookingTypeUid),
      booking_status_uid: bookingStatusUid,
      start_time: formattedDate,
      duration: parseInt(duration),
      patient_uid: parseInt(patientUid),
      reason,
      cancelled: false
    };

    // If we're editing, include the booking ID
    if (booking) {
      bookingData.uid = booking.uid;
    }

    try {
      console.log(`${booking ? 'Updating' : 'Creating'} booking with data:`, bookingData);

      let result;
      if (booking) {
        // Update existing booking
        result = await bookingService.updateBooking(booking.uid, bookingData);
      } else {
        // Create new booking
        result = await bookingService.createBooking(bookingData);
      }

      if (result.error) {
        console.error(`Failed to ${booking ? 'update' : 'create'} booking:`, result.error);
        setError(`Failed to ${booking ? 'update' : 'create'} booking: ${result.error.message || JSON.stringify(result.error)}`);
      } else {
        console.log(`Booking ${booking ? 'updated' : 'created'} successfully:`, result);
        if (onSubmit) onSubmit();
        onClose();
      }
    } catch (err) {
      console.error(`Error ${booking ? 'updating' : 'creating'} booking:`, err);
      setError(`Error ${booking ? 'updating' : 'creating'} booking: ${err.message || 'Unknown error'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-mono">
      <div className="shadow-lg p-6 max-w-2xl w-full relative border items-center justify-center"
        style={{ backgroundColor: '#1e1e2e', borderColor: '#585b70' }}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#f38ba8] hover:underline"
        >
          [X]
        </button>
        <h2 className="text-xl font-bold font-mono mb-4">
          {booking ? 'Edit Booking' : 'Add Booking'}
        </h2>

        {error && (
          <div className="text-[#f38ba8] mb-4 p-2 border border-[#f38ba8] rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4 text-[#cdd6f4]">Loading form data...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 items-center">
              {/* Patient Dropdown */}
              <label htmlFor="patient" className="text-[#89dceb] text-sm">
                $ Select Patient:
              </label>
              <select
                id="patient"
                className={inputClass}
                value={patientUid}
                onChange={(e) => setPatientUid(e.target.value)}
                required
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(patient => (
                  <option key={patient.uid} value={patient.uid}>
                    {patient.name} {patient.surname}
                  </option>
                ))}
              </select>

              {/* Booking Type Dropdown */}
              <label htmlFor="bookingType" className="text-[#89dceb] text-sm">
                $ Booking Type:
              </label>
              <select
                id="bookingType"
                className={inputClass}
                value={bookingTypeUid}
                onChange={(e) => setBookingTypeUid(e.target.value)}
                required
              >
                <option value="">-- Choose Type --</option>
                {bookingTypes.map(type => (
                  <option key={type.uid} value={type.uid}>
                    {type.name}
                  </option>
                ))}
              </select>

              {/* Time Select */}
              <label htmlFor="time" className="text-[#89dceb] text-sm">
                $ Time:
              </label>
              <DatePicker
                selected={startTime}
                onChange={setStartTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                dateFormat="h:mm aa"
                timeCaption="Time"
                className={inputClass}
              />

              {/* Duration Number Input */}
              <label htmlFor="duration" className="text-[#89dceb] text-sm">
                $ Duration (minutes):
              </label>
              <input
                id="duration"
                type="number"
                className={inputClass}
                min="5"
                max="240"
                step="5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />

              {/* Reason Text Area */}
              <label htmlFor="reason" className="text-[#89dceb] text-sm">
                $ Reason:
              </label>
              <textarea
                id="reason"
                className={inputClass}
                rows="3"
                placeholder="Enter reason here..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>

            <div className="flex mt-4 space-x-4">
              <button
                className="border p-2"
                type="submit"
                style={{ color: '#cba6f7', borderColor: '#cba6f7' }}
              >
                {booking ? 'Update Booking' : 'Create Booking'}
              </button>
              <button
                className="border p-2"
                type="button"
                onClick={onClose}
                style={{ color: '#f38ba8', borderColor: '#f38ba8' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Modal;
