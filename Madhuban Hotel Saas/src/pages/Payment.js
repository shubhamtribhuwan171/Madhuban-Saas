import React, { useState, useEffect } from "react";
import "./Payment.css";
import BookingConfirmation from "./BookingConfirmation";
import { Tooltip, Button } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  EditIcon,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Payment({ onBackClick, selectedRoom }) {
  const history = useHistory();
  const location = useLocation();
  const { bookingDetails, customerId, bookingSummary } = location.state || {};
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [addingGuest, setAddingGuest] = useState(false);
  const [guestData, setGuestData] = useState([]);
  const [lastSavedGuest, setLastSavedGuest] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const [roomDetails, setRoomDetails] = useState(selectedRoom || {});
  const [bookingCostDetails, setBookingCostDetails] = useState(
    bookingSummary || {}
  );

  const [newGuest, setNewGuest] = useState({
    "Payment Amount": "",
    Date: today,
    "Payment Mode": "Online",
  });

  const [editGuestIndex, setEditGuestIndex] = useState(null);
  const [editedGuest, setEditedGuest] = useState({});
  const [totalPayments, setTotalPayments] = useState(0);

  const getTotalPayments = () => {
    return guestData.reduce((total, guest) => {
      return total + parseFloat(guest["Payment Amount"] || 0);
    }, 0);
  };
  useEffect(() => {
    if (location.state) {
      setRoomDetails(selectedRoom);
      setBookingCostDetails(bookingSummary || {});
    }
  }, [location.state, selectedRoom]);
  useEffect(() => {
    console.log("Received Booking ID:", customerId);
  }, [customerId]);

  useEffect(() => {
    setTotalPayments(getTotalPayments());
  }, [guestData]);

  const handleEditGuest = (index) => {
    setEditGuestIndex(index);
    setEditedGuest({ ...guestData[index] });
  };

  const handleSaveEditGuest = (editedGuest, index) => {
    console.log("Saving Edited Guest Details:", editedGuest);

    const updatedGuests = [...guestData];
    updatedGuests[index] = editedGuest;
    setGuestData(updatedGuests);
    setEditGuestIndex(null);
    setLastSavedGuest(editedGuest);
  };

  const handleCancelEditGuest = () => {
    setEditGuestIndex(null);
  };

  const handleEditInputChange = (e) => {
    setEditedGuest({ ...editedGuest, [e.target.name]: e.target.value });
  };

  const handleAddGuest = () => {
    setAddingGuest(true);
  };

  // const handleInputChange = (e) => {
  //   if (e.target.name === "Date" && e.target.value.length === 2) {
  //     e.target.value += "/";
  //   } else if (e.target.name === "Date" && e.target.value.length === 5) {
  //     e.target.value += "/";
  //   }

  //   setNewGuest({ ...newGuest, [e.target.name]: e.target.value });
  // };
  const handleInputChange = (e) => {
    setNewGuest({ ...newGuest, [e.target.name]: e.target.value });
  };

  const handleSaveGuest = () => {
    setGuestData([...guestData, newGuest]);
    setNewGuest({
      "Payment Amount": "",
      Date: "",
      "Payment Mode": "",
    });
    setAddingGuest(false);
  };

  // const handleProceedClick = async () => {
  //   setShowBookingDetails(true);
  //   console.log("Booking Details:", bookingDetails);

  // const logObject = {
  //   amountPaid: parseFloat(editedGuest["Payment Amount"]),
  //   paymentMode: editedGuest["Payment Mode"],
  //   bookingId: customerId, // or replace with the actual bookingId if different
  // };

  // console.log(logObject);

  // try {
  //   const response = await fetch(
  //     "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/transaction/create",
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(logObject),
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  //   const data = await response.json();

  //   console.log("Success:", data);

  //   history.push("/bookingConfirmation", {
  //     bookingDetails: bookingDetails,
  //     guestData: guestData,
  //   });
  // } catch (error) {
  //   console.error("Error during API call:", error);
  //   alert("Error submitting form. Check console for details.");
  // }
  // };
  const handleProceedClick = async () => {
    // history.push("/bookingConfirmation", {
    //   // Pass the necessary data as state
    //   bookingDetails: bookingDetails,
    //   guestData: guestData,
    // });
    // const logObject = {
    //   amountPaid: parseFloat(editedGuest["Payment Amount"]),
    //   paymentMode: editedGuest["Payment Mode"],
    //   bookingId: customerId, // or replace with the actual bookingId if different
    // };
    const guestToProcess = editGuestIndex !== null ? lastSavedGuest : newGuest;

    const logObject = {
      amountPaid: parseFloat(guestToProcess["Payment Amount"] || 0),
      paymentMode: guestToProcess["Payment Mode"].toLowerCase(),
      bookingId: customerId,
      date: guestToProcess.Date,
    };

    console.log(logObject);

    try {
      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/transaction/create",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logObject),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error during API call:", error);
      alert("Error submitting form. Check console for details.");
    }

    history.push("/bookingConfirmation", {
      bookingDetails: bookingDetails,
      guestData: guestData,
      customerId: customerId,
    });

    setShowBookingDetails(true);
  };

  const handleDeleteGuest = (index) => {
    const updatedGuests = guestData.filter((_, i) => i !== index);
    setGuestData(updatedGuests);
  };


  
  if (showBookingDetails) {
    return (
      <BookingConfirmation
        bookingDetails={bookingDetails}
        guestData={guestData}
        customerId={customerId}
        onBackClick={handleBackClick}
        handleAddGuest={handleAddGuest}
        handleEditGuest={handleEditGuest}
        handleSaveEditGuest={handleSaveEditGuest}
        handleCancelEditGuest={handleCancelEditGuest}
        setGuestData={setGuestData}
        addingGuest={addingGuest}
        selectedRoom={selectedRoom}
        setAddingGuest={setAddingGuest}
      />
    );
  }

  const handleCancelAddGuest = () => {
    setAddingGuest(false);
    setNewGuest({
      "Payment Amount": "",
      Date: "",
      "Payment Mode": "",
    });
  };

  return (
    <>
      <div className="container">
        <div className="left-section">
          <div className="payment-information">
            <h2>Payment Information</h2>
          </div>

          <div className="guest-details">
            <div className="guest-details-header">
              <Button onClick={handleAddGuest} className="add-guest-button">
                Add Transaction
              </Button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Payment Amount</th>
                  <th>Date</th>
                  <th>Payment Mode</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {addingGuest && (
                  <tr>
                    <td>
                      <input
                        style={{ width: "80%" }}
                        type="text"
                        name="Payment Amount"
                        value={newGuest["Payment Amount"]}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        style={{ width: "80%" }}
                        type="date"
                        name="Date"
                        value={newGuest.Date}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <select
                        style={{ width: "80%" }}
                        name="Payment Mode"
                        value={newGuest["Payment Mode"]}
                        onChange={handleInputChange}
                      >
                        <option value="Select">Select</option>
                        <option value="Online">Online</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </td>
                    <td>
                      <Tooltip title="Save">
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={handleSaveGuest}
                        />
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <Button
                          type="default"
                          icon={<CloseOutlined />}
                          onClick={handleCancelAddGuest}
                        />
                      </Tooltip>
                    </td>
                  </tr>
                )}
                {guestData.map((guest, index) => (
                  <tr key={index}>
                    {editGuestIndex === index ? (
                      <>
                        <td>
                          <input
                            type="text"
                            name="Payment Amount"
                            value={editedGuest["Payment Amount"]}
                            onChange={handleEditInputChange}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            name="Date"
                            value={editedGuest.Date}
                            onChange={handleEditInputChange}
                          />
                        </td>
                        <td>
                          <select
                            name="Payment Mode"
                            value={editedGuest["Payment Mode"]}
                            onChange={handleEditInputChange}
                          >
                            <option value="Online">Online</option>
                            <option value="Cash">Cash</option>
                          </select>
                        </td>
                        <td>
                          <Tooltip title="Edit">
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => handleEditGuest(index)}
                            />
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              type="link"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteGuest(index)}
                              danger
                            />
                          </Tooltip>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{guest["Payment Amount"]}</td>
                        <td>{guest.Date}</td>
                        <td>{guest["Payment Mode"]}</td>
                        <td>
                          <Tooltip title="Edit">
                            <Button onClick={() => handleEditGuest(index)}>
                              <EditIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <button
                              onClick={() => handleDeleteGuest(index)}
                              className="delete-button"
                            >
                              Delete
                            </button>
                          </Tooltip>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="right-section">
          <div className="booking-summary">
            <div className="summaryHeader">Booking Summary</div>
            <div className="summaryRow">
              <span>Room Total (1 Night)</span>
              <span>₹ {selectedRoom?.costPerDay.toFixed(2)}</span>
            </div>
            <div className="summaryItem">
              <span>GST (18%)</span>
              <span>₹ {(selectedRoom?.costPerDay * 0.18).toFixed(2)}</span>
            </div>
            <div className="divider"></div>
            <div className="summaryRow total">
              <strong>Total</strong>
              <strong>₹ {(selectedRoom?.costPerDay * 1.18).toFixed(2)}</strong>
            </div>
            <div className="summaryRow">
              <span>GST (18%)</span>
              <span>₹ 108.12</span>
            </div>
            <hr />
            <div className="summaryRow">
              {/* <span>Paid</span>
              <span>₹ 500.00</span> */}
            </div>

            {/* <div className="summaryRow pending">
              <span>Due</span>
              <span>
                ₹{" "}
                {(selectedRoom?.room.roomType.costPerDay * 1.18 - 500).toFixed(
                  2
                )}
              </span>
            </div> */}
            <div className="summaryRow">
              <span>Paid</span>
              <span>₹ {totalPayments.toFixed(2)}</span>
            </div>
            <div className="summaryRow pending">
              <span>Due</span>
              <span>
                ₹ {(selectedRoom?.costPerDay * 1.18 - totalPayments).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="footer-buttons"
      >
          <Button className="backButton" onClick={onBackClick}>
          Back
        </Button>
        <button className="proceed-button" onClick={handleProceedClick}>
          Confirm Booking
        </button>
      </div>
    </>
  );
}

export default Payment;