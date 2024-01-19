import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./BookingDetails.css";
import Payment from "./Payment";
import moment from "moment";
import { InboxOutlined, UploadOutlined, EyeOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Upload, message, Button, Row, Col, Card, Form, Input, Select, DatePicker, InputNumber, Typography } from "antd";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import { useLocation } from "react-router-dom";
import countriesList from 'countries-list';
import { countries } from 'countries-list';
const { Option } = Select;


function BookingDetails({ onBackClick }) {
  const location = useLocation();
  const history = useHistory();
  const {
    checkInDate,
    checkOutDate,
    adults,
    children,
    selectedRoom,
    numberOfNights,
  } = location.state;
  console.log("room:", selectedRoom);
  
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [form] = Form.useForm();
  const [selectedAddOnsArray, setSelectedAddOnsArray] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [guestDetails, setGuestDetails] = useState([]);
  const [showGuestCard, setShowGuestCard] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [guestData, setGuestData] = useState([]);
  const room = selectedRoom?.room;
  const roomType = selectedRoom?.roomType;
 
  const bookingData = location.state;

  const parsedCheckIn = checkInDate ? moment(checkInDate) : null;
  const parsedCheckOut = checkOutDate ? moment(checkOutDate) : null;
  
  const [checkIn, setCheckIn] = useState(parsedCheckIn || moment().startOf("day"));
  const [checkOut, setCheckOut] = useState(parsedCheckOut || moment().add(1, "day").startOf("day"));
  
  const formattedCheckInDate = moment(checkIn).format("YYYY-MM-DD");
  const formattedCheckOutDate = moment(checkOut).format("YYYY-MM-DD");
  

  

  const countryOptions = Object.keys(countries).map((countryCode) => (
    <Option key={countryCode} value={countries[countryCode].name}>
      {countries[countryCode].name}
    </Option>
  ));
  const handleonBackClick = () => {
    history.push({
      pathname: "/bookings",
    });
  };
  const setGuestToEditMode = (guestId) => {
    setGuestEditStates((prevStates) => ({ ...prevStates, [guestId]: true }));
  };

  const handleSubmit = (values) => {
    console.log("Form submitted:", values);

    history.push({
      pathname: "/payments",
      state: {
        bookingSummary: bookingSummary,
        selectedRoom: selectedRoom,
        selectedAddOns: selectedAddOns,
      },
    });
  };
  const filterSortCountries = (input, option) => {
    return option.children.toLowerCase().startsWith(input.toLowerCase());
  };

  const handleAddGuestClick = () => {
    const lastGuest = guestDetails[guestDetails.length - 1];
    if (!lastGuest || lastGuest.isSaved) {
      const newGuest = {
        id: guestDetails.length + 1,
        title: "",
        firstName: "",
        lastName: "",
        age: 0,
        idType: "",
        identificationNumber: "",
        isSaved: false,
      };
      setGuestDetails([...guestDetails, newGuest]);
    } else {
      alert("Please save the last guest details before adding a new one.");
    }
  };

  const onUploadChange = (info) => {
    if (info.file.status === "done") {
      setUploadedFile(info.file);
    } else if (info.file.status === "removed") {
      setUploadedFile(null);
    }
  };

  const roomCost = selectedRoom?.costPerDay;
  const gst = roomCost * 0.18;
  const totalCost = roomCost + gst;
  const calculateTotalCost = () => {
    const roomTotal = selectedRoom?.costPerDay || 0;
    const addOnsTotal = selectedAddOns.reduce((total, addon) => {
      if (addon === "Extra Mattress") return total + 50;
      if (addon === "Breakfast Included") return total + 30;

      return total;
    }, 0);
    return roomTotal + addOnsTotal + gst;
  };

  const bookingSummary = {
    roomTotal: selectedRoom?.costPerDay || 0,
    gst: roomCost * 0.18,
    selectedAddOnsTotal: selectedAddOns.reduce((total, addon) => {
      if (addon === "Extra Mattress") return total + 50;
      if (addon === "Breakfast Included") return total + 30;
      return total;
    }, 0),
    totalCost: calculateTotalCost(),
  };
  const handleUploadChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      setPreviewImage(URL.createObjectURL(file));
      setIsFileUploaded(true);
    } else {
      setIsFileUploaded(false);
    }
  };
  useEffect(() => {
    if (location.state) {
      form.setFieldsValue({
        checkInDate: moment(location.state.checkInDate).format("YYYY-MM-DD"),
        checkOutDate: moment(location.state.checkOutDate).format("YYYY-MM-DD"),
        roomNumber: location.state.roomNumber,
        totalAmount: location.state.totalAmount,
        firstName: location.state.firstName,
        lastName: location.state.lastName,
      });
    }
  }, [location.state, form]);

  useEffect(() => {
    if (location.state && location.state.selectedRoom) {
      const { room, roomType, costPerDay } = location.state.selectedRoom;
      console.log("trigger 1");
      form.setFieldsValue({
        room,
        roomType,
        costPerDay,
      });
    }
  }, [location.state, form]);

  useEffect(() => {
    if (
      location.state &&
      location.state.selectedRoom &&
      location.state.selectedRoom.room
    ) {
      const { room, roomType, costPerDay } = location.state.selectedRoom.room;
      form.setFieldsValue({
        room,
        roomType,
        costPerDay,
      });
    }
  }, [location.state, form]);

  // useEffect(() => {
  //   if (location.state) {
  //     if (location.state.selectedRoom) {
  //       // const { roomNumber, roomType, costPerDay } =
  //       //   location.state.selectedRoom.room;
  //       console.log(location.state.selectedRoom.room);
  //       const { roomNumber, roomType, costPerDay } =
  //         location.state.selectedRoom.room;
  //       console.log({ roomNumber, roomType, costPerDay });
  //       form.setFieldsValue({
  //         roomNumber,
  //         roomType,
  //         costPerDay,
  //       });
  //     } else {
  //       const { roomNumber, roomType, costPerDay } = location.state;
  //       form.setFieldsValue({
  //         roomNumber,
  //         roomType,
  //         costPerDay,
  //       });
  //     }
  //   }
  // }, [location, form]);

  const handlePreview = () => {
    if (isFileUploaded) {
      setPreviewVisible(true);
    }
  };
  const handleFileChange = (info) => {
    if (
      info.file.status === "done" ||
      (info.fileList && info.fileList.length > 0)
    ) {
      const file = info.fileList[0];
      const fileUrl = file.thumbUrl || URL.createObjectURL(file.originFileObj);
      setPreviewImage(fileUrl);
      setFileList(info.fileList);
      setIsFileUploaded(true);
    } else {
      setFileList([]);
      setIsFileUploaded(false);
    }
  };
  const handleDeleteCard = (guestId) => {
    const updatedGuestDetails = guestDetails.filter(
      (guest) => guest.id !== guestId
    );
    setGuestDetails(updatedGuestDetails);

    if (openCardId === guestId) {
      setOpenCardId(null);
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      checkInDate: checkInDate
        ? moment(checkInDate).format("YYYY-MM-DD")
        : null,
      checkOutDate: checkOutDate
        ? moment(checkOutDate).format("YYYY-MM-DD")
        : null,
      adults: adults,
      children: children,
    });
  }, [checkInDate, checkOutDate, adults, children, form]);

  const handleRemoveFile = (file) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
    setIsFileUploaded(false);
    setPreviewVisible(false);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };
  const handleBackClick = () => {
    setShowBookingDetails(false);
  };

  const handleProceedClick = async () => {
   
    const formData = form.getFieldsValue();

   
    const dynamicData = {
      customer: {
        title: formData.guestTitle,
        firstName: formData.guestFirstName,
        lastName: formData.guestLastName,
        email: formData.guestEmail,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        phoneNumber: formData.guestPhone,
        customerDocs: {
          pan: formData.panCard, 
        },
        age: formData.guestAge,
      },
      booking: {
        roomNumber: formData.room,
        custId: 1, // Assuming you have customerId state
        totalGuestCount:
          parseInt(formData.adults) + parseInt(formData.children),
          checkIn: formattedCheckInDate,
          checkOut: formattedCheckOutDate,
        checkInTime: "14:00", // Static values as example
        checkOutTime: "14:00",
      },
    };

    console.log(dynamicData);

    try {
      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/reservation/addNested",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dynamicData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const bookingId = await response.text();
      console.log("Success: Booking ID", bookingId);

      // Navigate to the Payments component and pass the bookingData as state
      // history.push("/payments", { state: bookingData });
      // setCustomerId(bookingId);
      setCustomerId(bookingId);

      // Modify here to include customerId in the state
      history.push({
        pathname: "/payments",
        state: {
          bookingSummary: bookingSummary, // existing data
          selectedRoom: selectedRoom, // existing data
          selectedAddOns: selectedAddOns, // existing data
          customerId: bookingId, // add this line
        },
      });

      // Set showBookingDetails to true to display the Payment component
      setShowBookingDetails(true);
    } catch (error) {
      history.push({
        pathname: "/payments",
      });
      setShowBookingDetails(true);
      console.error("Error:", error);
      // Handle error here (e.g., show error message)
    }
  };

  const bookingDetailsWithRoom = {
    ...form.getFieldsValue(),
    roomDetails: selectedRoom,
  };
  const handleDeleteGuest = (guestId) => {
    const updatedGuestDetails = guestDetails.filter(
      (guest) => guest.id !== guestId
    );
    setGuestDetails(updatedGuestDetails);

    if (openCardId === guestId) {
      setOpenCardId(null);
    }
  };
  if (showBookingDetails) {
    return (
      <Payment
        onBackClick={handleBackClick}
        bookingDetails={form.getFieldsValue()}
        selectedRoom={selectedRoom}
        customerId={customerId}
      />
    );
  }

  const initialFormValues = {
    room: selectedRoom?.room,
    roomType: selectedRoom?.roomType,
  };
  const handleSaveGuest = (guestId) => {
    const updatedGuests = guestDetails.map((guest) => {
      if (guest.id === guestId) {
        if (!guest.firstName || guest.firstName.trim() === "") {
          alert("First Name is required.");
          return guest; // Return without changing the isSaved flag
        }
        return { ...guest, isSaved: true }; // Mark as saved
      }
      return guest;
    });
    setGuestDetails(updatedGuests);
  };
  useEffect(() => {
    if (selectedRoom) {
      form.setFieldsValue({
        room: selectedRoom.room,

        roomType: selectedRoom.roomType,
      });
    }
  }, [selectedRoom, form]);

  return (
    <>
      <div>
        <div className="bookingContainer">
          <Form
            form={form}
            onFinish={handleSubmit}
            className="bookingForm"
            initialValues={initialFormValues}
            layout="vertical"
          >
            <Typography.Title level={4}>Booking Details</Typography.Title>

            <Row gutter={16}>
              <Col span={8}>
               
              <Form.Item label="Check In">
  <DatePicker
    value={checkIn}
    onChange={(date) => setCheckIn(date)}
    format="YYYY-MM-DD"
  />
</Form.Item>

<Form.Item label="Check Out">
  <DatePicker
    value={checkOut}
    onChange={(date) => setCheckOut(date)}
    format="YYYY-MM-DD"
  />
</Form.Item>
              </Col>
              <Col span={4.5}>
                <Form.Item name="room" label="Room Number">
                  <Input style={{ width: "80%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="roomType" label="Room Type">
                  <Select style={{ width: "100%" }}>
                    <Option value="Non AC">Non AC</Option>
                    <Option value="AC">AC</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Add Ons" name="addOns">
                  <Select
                    style={{ width: "100%" }}
                    mode="multiple"
                    onChange={(values) => setSelectedAddOns(values)}
                  >
                    <Option value="Extra Mattress">Extra Mattress</Option>
                    <Option value="Breakfast Included">
                      Breakfast Included
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Adults" name="adults">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Children" name="children">
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Typography.Title level={4}>Guest Details</Typography.Title>

            <Row gutter={16}>
              <Col span={4}>
                <Form.Item label="Title" name="guestTitle">
                  <Select style={{ width: "100%" }}>
                    <Option value="Mr">Mr</Option>
                    <Option value="Ms">Ms</Option>
                    <Option value="Mrs">Mrs</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="First Name" name="guestFirstName">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Last Name" name="guestLastName">
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                {" "}
                <Form.Item label="Age" name="guestAge">
                  <InputNumber min={0} style={{ width: "80%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Email" name="guestEmail">
                  <Input style={{ width: "80%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phone" name="guestPhone">
                  <Input style={{ width: "80%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Typography.Title level={4}>Identification</Typography.Title>

            <Row gutter={16}>
              <Col span={5.5}>
                <Form.Item label="ID Type" name="idType">
                  <Select style={{ width: "150%" }}>
                    <Option value="aadharCard">Aadhar Card</Option>
                    <Option value="panCard">PAN Card</Option>
                    <Option value="drivingLicense">Driving License</Option>
                    <Option value="passport">Passport</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Identification" name="identificationNumber">
                  <Input placeholder="ID number" style={{ width: "80%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Typography.Title level={4}>Address</Typography.Title>

<Row gutter={16}>
  <Col span={8}>
    <Form.Item label="Address" name="address">
      <Input style={{ width: "80%" }} />
    </Form.Item>
  </Col>
  <Col span={8}>
    <Form.Item label="City" name="city">
      <Input style={{ width: "80%" }} />
    </Form.Item>
  </Col>
  <Col span={4}>
    <Form.Item label="State" name="state">
      <Input style={{ width: "100%" }} />
    </Form.Item>
  </Col>
  <Col span={4}>
  <Form.Item label="Country" name="country">
                <Select
                  showSearch
                  placeholder="Select a country"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {countryOptions}
                </Select>
              </Form.Item>
  </Col>
  <Col span={4}>
    <Form.Item label="Pincode" name="pincode">
      <Input style={{ width: "100%" }} />
    </Form.Item>
                <div>
                  <Button type="primary" onClick={handleAddGuestClick}>
                    Add Guest
                  </Button>
                </div>

                {guestDetails.map((guest) => (
                  <Card
                    key={guest.id}
                    title={`Guest ${guest.id} Details & Identification`}
                    extra={
                      <>
                        {guest.isSaved ? (
                          <Button onClick={() => setGuestToEditMode(guest.id)}>
                            Edit
                          </Button>
                        ) : (
                          <Button onClick={() => handleSaveGuest(guest.id)}>
                            Save
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={() => handleDeleteGuest(guest.id)}
                          icon={<DeleteOutlined />}
                        >
                          Delete
                        </Button>
                      </>
                    }
                    style={{
                      width: "300%",
                      margin: "0 auto",
                      marginTop: "20px",
                      padding: "20px",
                      border: "1px solid #eaeaea",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Form layout="vertical">
                      <Typography.Title level={4}>
                        Guest Details
                      </Typography.Title>

                      <Row gutter={16}>
                        <Col span={4}>
                          <Form.Item
                            label="Title"
                            name={`guestTitle_${guest.id}`}
                          >
                            <Select style={{ width: "100%" }}>
                              <Option value="Mr">Mr</Option>
                              <Option value="Ms">Ms</Option>
                              <Option value="Mrs">Mrs</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="First Name"
                            name={`guestFirstName_${guest.id}`}
                          >
                            <Input style={{ width: "80%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="Last Name"
                            name={`guestLastName_${guest.id}`}
                          >
                            <Input style={{ width: "80%" }} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="Age" name={`guestAge_${guest.id}`}>
                            <InputNumber min={0} style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Typography.Title level={4}>
                        Identification
                      </Typography.Title>

                      <Row gutter={16}>
                        <Col span={5.5}>
                          <Form.Item
                            label="ID Type"
                            name={`idType_${guest.id}`}
                          >
                            <Select style={{ width: "100%" }}>
                              <Option value="aadharCard">Aadhar Card</Option>
                              <Option value="panCard">PAN Card</Option>
                              <Option value="drivingLicense">
                                Driving License
                              </Option>
                              <Option value="passport">Passport</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label="Identification"
                            name={`identificationNumber_${guest.id}`}
                          >
                            <Input
                              placeholder="ID number"
                              style={{ width: "80%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                ))}
              </Col>
            </Row>
          </Form>

          <div className="bookingSummary">
            <Typography.Title level={4}>Billing Summary</Typography.Title>
            <div className="summaryTable">
              <div className="summaryRow">
                <span>Room Total (1 Night)</span>
                <span>
                  ₹{" "}
                  {selectedRoom?.costPerDay
                    ? selectedRoom.costPerDay.toFixed(2)
                    : (location.state?.costPerDay || 0).toFixed(2)}
                </span>
              </div>
              <div className="summaryRow">
                <span>GST (18%)</span>
                <span>₹ {(selectedRoom?.costPerDay * 0.18).toFixed(2)}</span>
              </div>
              <div className="summaryRow">
                <span>Add Ons</span>
                <span>
                  ₹{" "}
                  {selectedAddOns
                    .reduce((total, addon) => {
                      if (addon === "Extra Mattress") return total + 50;
                      if (addon === "Breakfast Included") return total + 30;

                      return total;
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="summaryRow total">
                <strong>Total</strong>
                <strong>₹ {calculateTotalCost().toFixed(2)}</strong>
              </div>
              <hr />
              <div className="summaryRow pending">
                <span>Due</span>
                <span>₹ {(calculateTotalCost() - 500).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: "100px",
            }}
          ></div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="button" onClick={handleonBackClick}>
            Back
          </Button>
          <Button type="primary" htmlType="submit" onClick={handleProceedClick}>
            Proceed
          </Button>
        </div>
      </div>
    </>
  );
}

export default BookingDetails;