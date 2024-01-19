import React, { createContext, useState, useContext } from "react";

const BookingContext = createContext({
  bookingData: {
    checkInDate: null,
    checkOutDate: null,
    adults: 1,
    children: 0,
  },
  setBookingData: () => {},
});

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    adults: 1,
    children: 0,
  });

  const providerValue = { bookingData, setBookingData };

  return (
    <BookingContext.Provider value={providerValue}>
      {children}
    </BookingContext.Provider>
  );
};
