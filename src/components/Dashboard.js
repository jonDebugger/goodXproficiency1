import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bookings = [
    {
      id: 1,
      patient: "John Doe",
      debtor: "Jane Smith",
      startTime: "10:00",
      duration: "30min",
      reason: "Routine Checkup"
    },
    {
      id: 2,
      patient: "Luna Lovegood",
      debtor: "Harry Potter",
      startTime: "11:00",
      duration: "45min",
      reason: "Follow-up"
    }
  ];

  const selectedDiary = null;
  const selectedDate = null;
  const selectedBooking = null;
  const handleBookingCreated = null;




  return (
    <div className="font-mono min-h-screen items-center justify-center px-6 py-12 ">
      <div className='pb-5 min-w-full min-h-[700px] justify-center p-0 border rounded-md shadow-md'
        style={{
          backgroundColor: '#1e1e2e',
          borderColor: '#585b70', // subtle border
        }}
      >
        <div
          className="min-w-full min-h-[5px] p-0 mb-6 flex justify-between items-center rounded-t min-w-full "
          style={{
            backgroundColor: '#363654'
          }}
        >
          {/* Left Side: Username with triangle */}
          <div className='items-center rounded-tl justify-center flex '>
            <div className="font-mono text-[#1f1f28] items-center max-h-full justify-center h-full bg-[#a6e3a1] ">
              <b>Username</b>
            </div>
            <span
              style={{
                content: '""',
                top: 0,
                right: 0,
                width: 0,
                height: 0,
                borderTop: '1rem solid transparent',
                borderBottom: '0.7rem solid transparent',
                borderLeft: '0.6rem solid #a6e3a1', // dark color
              }} />

          </div>

          {/* Right Side: Logout */}
          <button className="text-[#f38ba8] hover:underline text-sm">[logout]</button>
        </div>
        <div
          className="min-w-auto min-h-[5px] p-0 flex justify-between items-center min-w-full "
          style={{
            backgroundColor: '#151520'
          }}
        >a
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[#cdd6f4] hover:underline "
          >
            [create new booking]
          </button>
        </div>

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
          {bookings.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-7 gap-2 border-b border-[#313244] py-1 items-center"
            >
              <div className="col-span-1 text-[#89dceb]">{b.patient}</div>
              <div className="col-span-1 text-[#f38ba8]">{b.debtor}</div>
              <div className="col-span-1 text-[#94e2d5]">{b.startTime}</div>
              <div className="col-span-1 text-[#fab387]">{b.duration}</div>
              <div className="col-span-2 text-[#a6e3a1]">{b.reason}</div>
              <div className="col-span-1 flex gap-2">
                <button className="text-[#89b4fa] hover:underline">[edit]</button>
                <button className="text-[#f38ba8] hover:underline">[X]</button>
              </div>
            </div>
          ))}
        </div>
      </div>



      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        diary={selectedDiary}
        date={selectedDate}
        booking={selectedBooking} // Pass null for new bookings or booking object for edits
        onSubmit={handleBookingCreated}
      />
    </div>
  );
};


export default Dashboard;

