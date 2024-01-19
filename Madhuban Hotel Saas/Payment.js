import React, { useState } from "react";
import "./Payment.css";
import BookingConfirmation from "./BookingConfirmation";
import Tooltip from "@mui/material/Tooltip";
import { useHistory } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";

function Payment({ onBackClick, bookingDetails, customerId, selectedRoom }) {
  console.log("data", customerId);
  const history = useHistory();
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [addingGuest, setAddingGuest] = useState(false);
  const [guestData, setGuestData] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const [newGuest, setNewGuest] = useState({
    "Payment Amount": "",
    Date: today,
    "Payment Mode": "Online",
  });
  const [editGuestIndex, setEditGuestIndex] = useState(null);
  const [editedGuest, setEditedGuest] = useState({});

  const handleEditGuest = (index) => {
    setEditGuestIndex(index);
    setEditedGuest({ ...guestData[index] });
  };

  const handleSaveEditGuest = (editedGuest, index) => {
    console.log("Saving Edited Guest Details:", editedGuest);
    console.log("Saving guest at index:", index);
    const updatedGuests = [...guestData];
    updatedGuests[index] = editedGuest;
    setGuestData(updatedGuests);
    setEditGuestIndex(null);
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

  const handleInputChange = (e) => {
    if (e.target.name === "Date" && e.target.value.length === 2) {
      e.target.value += "/";
    } else if (e.target.name === "Date" && e.target.value.length === 5) {
      e.target.value += "/";
    }

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

  const handleProceedClick = async () => {
    setShowBookingDetails(true);
    console.log("Booking Details:", bookingDetails);

    const logObject = {
      ...editedGuest,
      bookingId: customerId, 
    };

    console.log("Log Object:", logObject);

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

      history.push("/booking-confirmation", {
        bookingDetails: bookingDetails,
        guestData: guestData,
      });
    } catch (error) {
      console.error("Error during API call:", error);
      alert("Error submitting form. Check console for details.");
    }
  };

  const handleDeleteGuest = (index) => {
    const updatedGuests = guestData.filter((_, i) => i !== index);
    setGuestData(updatedGuests);
  };

  const handleBackClick = () => {
    setShowBookingDetails(false);
  };

  if (showBookingDetails) {
    return (
      <BookingConfirmation
        bookingDetails={bookingDetails}
        guestData={guestData}
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
              <button onClick={handleAddGuest} className="add-guest-button">
                Add Transaction
              </button>
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
                        type="text"
                        name="Payment Amount"
                        value={newGuest["Payment Amount"]}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="Date"
                        value={newGuest.Date}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <select
                        name="Payment Mode"
                        value={newGuest["Payment Mode"]}
                        onChange={handleInputChange}
                      >
                        <option value="Online">Online</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </td>
                    <td>
                      <Tooltip title="Save">
                        <IconButton onClick={handleSaveGuest}>
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton onClick={handleCancelAddGuest}>
                          <CancelIcon />
                        </IconButton>
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
                          <Tooltip title="Save">
                            <IconButton
                              onClick={() =>
                                handleSaveEditGuest(editedGuest, index)
                              }
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton onClick={handleCancelEditGuest}>
                              <CancelIcon />
                            </IconButton>
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
                            <IconButton onClick={() => handleEditGuest(index)}>
                              <EditIcon />
                            </IconButton>
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
              <span>₹ {selectedRoom?.room.roomType.costPerDay.toFixed(2)}</span>
            </div>
            <div className="summaryItem">
              <span>GST (18%)</span>
              <span>
                ₹ {(selectedRoom?.room.roomType.costPerDay * 0.18).toFixed(2)}
              </span>
            </div>
            <div className="divider"></div>
            <div className="summaryRow total">
              <strong>Total</strong>
              <strong>
                ₹ {(selectedRoom?.room.roomType.costPerDay * 1.18).toFixed(2)}
              </strong>
            </div>
            <div className="summaryRow">
              <span>GST (18%)</span>
              <span>₹ 108.12</span>
            </div>
            <hr />
            <div className="summaryRow">
              <span>Paid</span>
              <span>₹ 500.00</span>
            </div>

            <div className="summaryRow pending">
              <span>Due</span>
              <span>
                ₹{" "}
                {(selectedRoom?.room.roomType.costPerDay * 1.18 - 500).toFixed(
                  2
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="footer-buttons"
      >
        <button className="backButton" onClick={onBackClick}>
          Back
        </button>
        <button className="proceed-button" onClick={handleProceedClick}>
          Confirm Booking
        </button>
      </div>
    </>
  );
}

export default Payment;
