import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { diaryService } from '../services/diaryService';
import { bookingService } from '../services/bookingService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [diaries, setDiaries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasUuid = cookies.some(cookie => cookie.trim().startsWith('uuid='));
      if (!hasUuid) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch diaries on component mount
  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const response = await diaryService.getDiaries();

        if (response.error) {
          setError('Failed to fetch diaries');
          return;
        }

        const diariesData = response.data.data || [];
        setDiaries(diariesData);

        if (diariesData.length > 0) {
          setSelectedDiary(diariesData[0]);
        }
      } catch (err) {
        setError('An error occurred while fetching diaries');
        console.error('Error fetching diaries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  // Fetch bookings when diary or date changes
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDiary) return;

      try {
        setLoading(true);
        const dateString = selectedDate.toISOString().split('T')[0];
        const response = await bookingService.getBookings(selectedDiary.uid, dateString);

        if (response.error) {
          setError('Failed to fetch bookings');
          return;
        }

        // Filter out cancelled bookings
        const activeBookings = (response.data.data || []).filter(booking => !booking.cancelled);
        setBookings(activeBookings);
      } catch (err) {
        setError('An error occurred while fetching bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedDiary, selectedDate]);

  const handleDiaryChange = (e) => {
    const diaryUid = parseInt(e.target.value);
    const diary = diaries.find(d => d.uid === diaryUid);
    setSelectedDiary(diary);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setIsModalOpen(true);
  };

  const handleEditBooking = (booking) => {
    // Create a clean copy of the booking to edit
    const bookingToEdit = {
      uid: booking.uid,
      entity_uid: booking.entity_uid,
      diary_uid: booking.diary_uid,
      booking_type_uid: booking.booking_type_uid,
      booking_status_uid: booking.booking_status_uid,
      patient_uid: booking.patient_uid,
      start_time: booking.start_time,
      duration: booking.duration,
      reason: booking.reason,
      cancelled: booking.cancelled
    };

    setSelectedBooking(bookingToEdit);
    setIsModalOpen(true);
  };

  const handleDeleteBooking = (booking) => {
    setConfirmDelete(booking);
  };

  const confirmDeleteBooking = async () => {
    if (!confirmDelete) return;

    try {
      setLoading(true);
      console.log('Deleting booking with ID:', confirmDelete.uid);

      const response = await bookingService.deleteBooking(confirmDelete.uid);

      if (response.error) {
        console.error('Delete booking error:', response.error);
        setError(`Failed to delete booking: ${response.error.message || 'Unknown error'}`);
      } else {
        // Refresh bookings
        const dateString = selectedDate.toISOString().split('T')[0];
        const bookingsResponse = await bookingService.getBookings(selectedDiary.uid, dateString);

        if (!bookingsResponse.error) {
          const activeBookings = (bookingsResponse.data.data || []).filter(booking => !booking.cancelled);
          setBookings(activeBookings);
          setError(null); // Clear any previous errors
        }
      }
    } catch (err) {
      setError(`An error occurred while deleting booking: ${err.message || 'Unknown error'}`);
      console.error('Error deleting booking:', err);
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  const handleBookingCreated = async () => {
    try {
      setLoading(true);
      const dateString = selectedDate.toISOString().split('T')[0];
      const response = await bookingService.getBookings(selectedDiary.uid, dateString);

      if (response.error) {
        setError('Failed to refresh bookings');
        return;
      }

      const activeBookings = (response.data.data || []).filter(booking => !booking.cancelled);
      setBookings(activeBookings);

      // Clear any previous errors
      setError(null);
    } catch (err) {
      setError('An error occurred while refreshing bookings');
      console.error('Error refreshing bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear the cookie
    document.cookie = 'uuid=; max-age=0; path=/';
    navigate('/login');
  };

  // Format time from ISO string
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="font-mono min-h-screen items-center justify-center px-6 py-12">
      <div
        className="pb-5 min-w-full min-h-[700px] justify-center p-0 border rounded-md shadow-md"
        style={{
          backgroundColor: '#1e1e2e',
          borderColor: '#585b70',
        }}
      >
        {/* Header with username and logout */}
        <div
          className="min-w-full min-h-[5px] p-0 mb-6 flex justify-between items-center rounded-t min-w-full"
          style={{
            backgroundColor: '#363654'
          }}
        >
          <div className="items-center rounded-tl justify-center flex">
            <div className="font-mono text-[#1f1f28] text-sm items-center max-h-full justify-center h-full bg-[#a6e3a1]  py-1">
              <b>GoodX Booking System</b>
            </div>
            <span
              style={{
                content: '""',
                top: 0,
                right: 0,
                width: 0,
                height: 0,
                borderTop: '1rem solid transparent',
                borderBottom: '0.8rem solid transparent',
                borderLeft: '0.6rem solid #a6e3a1',
              }}
            />
          </div>
          <button
            className="text-[#f38ba8] hover:underline text-sm mr-4"
            onClick={handleLogout}
          >
            [logout]
          </button>
        </div>

        {/* Control panel */}
        <div className="px-4 py-2 flex flex-wrap items-center gap-4 border-b border-[#313244]">
          {/* Diary selector */}
          <div className="flex items-center gap-2">
            <label className="text-[#89dceb] text-sm">$ Select Diary:</label>
            <select
              className="bg-[#313244] text-[#cdd6f4] border border-[#585b70] p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#89b4fa] font-mono text-xs"
              value={selectedDiary?.uid || ''}
              onChange={handleDiaryChange}
              disabled={loading || diaries.length === 0}
            >
              {diaries.map(diary => (
                <option key={diary.uid} value={diary.uid}>
                  {diary.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date picker */}
          <div className="flex items-center gap-2">
            <label className="text-[#89dceb] text-sm">$ Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="bg-[#313244] text-[#cdd6f4] border border-[#585b70] p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#89b4fa] font-mono text-xs"
              disabled={loading}
            />
          </div>

          {/* Add new booking button */}
          <button
            onClick={handleAddBooking}
            className="text-[#cba6f7]  text-sm px-2 py-1 rounded hover:bg-[#cba6f7] hover:bg-opacity-20  hover:underline"
            disabled={loading || !selectedDiary}
          >
            [create new booking]
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="m-4 p-2 border border-[#f38ba8] rounded text-[#f38ba8] text-sm">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="text-center py-8 text-[#cdd6f4]">
            Loading...
          </div>
        )}

        {/* No diary selected message */}
        {!loading && !selectedDiary && (
          <div className="text-center py-8 text-[#cdd6f4]">
            Please select a diary to view bookings.
          </div>
        )}

        {/* No bookings message */}
        {!loading && selectedDiary && bookings.length === 0 && (
          <div className="text-center py-8 text-[#cdd6f4]">
            No bookings found for this date.
          </div>
        )}

        {/* Bookings table */}
        {!loading && selectedDiary && bookings.length > 0 && (
          <div className="font-mono text-sm text-[#cdd6f4] bg-[#1e1e2e] p-4 rounded space-y-2">
            {/* Header row */}
            <div className="grid grid-cols-7 gap-2 border-b border-[#585b70] pb-1 uppercase text-[#cdd6f4]">
              <div className="col-span-1">Patient</div>
              <div className="col-span-1">Debtor</div>
              <div className="col-span-1">Start Time</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-2">Reason</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Data rows */}
            {bookings.map((booking) => (
              <div
                key={booking.uid}
                className="grid grid-cols-7 gap-2 border-b border-[#313244] py-1 items-center"
              >
                <div className="col-span-1 text-[#89dceb]">
                  {booking.patient_name} {booking.patient_surname}
                </div>
                <div className="col-span-1 text-[#f38ba8]">
                  {booking.debtor_name} {booking.debtor_surname}
                </div>
                <div className="col-span-1 text-[#94e2d5]">
                  {formatTime(booking.start_time)}
                </div>
                <div className="col-span-1 text-[#fab387]">
                  {booking.duration} min
                </div>
                <div className="col-span-2 text-[#a6e3a1]">
                  {booking.reason || 'No reason provided'}
                </div>
                <div className="col-span-1 flex gap-2">
                  <button
                    className="text-[#89b4fa] hover:underline"
                    onClick={() => handleEditBooking(booking)}
                  >
                    [edit]
                  </button>
                  <button
                    className="text-[#f38ba8] hover:underline"
                    onClick={() => handleDeleteBooking(booking)}
                  >
                    [X]
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-mono">
          <div
            className="shadow-lg p-6 max-w-md w-full relative border items-center justify-center"
            style={{ backgroundColor: '#1e1e2e', borderColor: '#585b70' }}
          >
            <h2 className="text-xl font-bold font-mono mb-4 text-[#f38ba8]">
              Confirm Delete
            </h2>
            <p className="text-[#cdd6f4] mb-6">
              Are you sure you want to delete this booking?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="border p-2"
                onClick={() => setConfirmDelete(null)}
                style={{ color: '#cdd6f4', borderColor: '#585b70' }}
              >
                Cancel
              </button>
              <button
                className="border p-2"
                onClick={confirmDeleteBooking}
                style={{ color: '#f38ba8', borderColor: '#f38ba8' }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        diary={selectedDiary}
        date={selectedDate}
        booking={selectedBooking}
        onSubmit={handleBookingCreated}
      />
    </div>
  );
};

export default Dashboard;
