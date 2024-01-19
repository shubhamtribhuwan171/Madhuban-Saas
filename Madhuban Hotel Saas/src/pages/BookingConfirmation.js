import React, { useState, useEffect } from "react";
import {
  CardContent,
  Grid,
  TextField,
  MenuItem,
  InputLabel,
  bookingDetails,
  FormControl,
} from "@mui/material";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Card,
  Typography,
  Row,
  Col,
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  Table,
  Tooltip,
  Space,
  Modal,
  Drawer,
  Upload,
} from "antd";


import {
  EyeOutlined,
  CheckOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ViewBookings from "./ViewBookings.js";
import guestData from "./Pdata";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import { DatePicker } from "antd";
import { message } from 'antd';
function BookingConfirmation({
  guestData,

  onBackClick,
  handleAddGuest,
  handleEditGuest,
  handleSaveEditGuest,
  handleCancelEditGuest,
  setGuestData,
  customerId: propCustomerId,
  selectedRoom,
}) {
  const location = useLocation();

  const customerId = location.state?.customerId;

  console.log(customerId);
  const [editGuestIndex, setEditGuestIndex] = useState(null);
  const [editedGuest, setEditedGuest] = useState({});
  const [guestDetails, setGuestDetails] = useState([]);
  const [isCurrentGuestValid, setIsCurrentGuestValid] = useState(true);
  const [allBookings, setAllBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [guestEditStates, setGuestEditStates] = useState({});
  const [showInvoice, setShowInvoice] = useState(false);
  const [openCardId, setOpenCardId] = useState(null);
  const history = useHistory();
  const setGuestToEditMode = (guestId) => {
    setGuestEditStates((prevStates) => ({ ...prevStates, [guestId]: true }));
  };

  const [editedTransaction, setEditedTransaction] = useState({
    amount: "",
    date: "",
    paymentMode: "",
  });
  const [bookingDetails, setBookingDetails] = useState({});
  const [totalRoomCharges, setTotalRoomCharges] = useState(0);
  const [totalAddonCharges, setTotalAddonCharges] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editTransactionIndex, setEditTransactionIndex] = useState(null);
  const [addingTransaction, setAddingTransaction] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isAddTaskDrawerVisible, setIsAddTaskDrawerVisible] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [addingGuest, setAddingGuest] = useState(false);
  const guestIndex = 0;
  const handleLocalEditGuest = (index) => {
    setEditGuestIndex(index);
    setEditedGuest({ ...guestData[index] });
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const day = `0${today.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    date: getCurrentDate(),
    paymentMode: "",
  });
  const showAddTaskDrawer = () => {
    setIsAddTaskDrawerVisible(true);
  };

  const closeAddTaskDrawer = () => {
    form.resetFields();
    setIsAddTaskDrawerVisible(false);
  };
  const startEditTransaction = (index) => {
    setEditTransactionIndex(index);
    setEditedTransaction({ ...transactions[index] });
  };

  const cancelEditTransaction = () => {
    setEditTransactionIndex(null);
  };

  const saveEditTransaction = (index) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = editedTransaction;
    setTransactions(updatedTransactions);
    setEditTransactionIndex(null);
  };

  const handleSaveGuest = async (guestId) => {
    const guestIndex = guestDetails.findIndex((g) => g.id === guestId);
    if (guestIndex === -1) {
      console.error(`Guest with ID ${guestId} not found.`);
      return;
    }

    const guest = guestDetails[guestIndex];

    if (!guest.firstName || guest.firstName.trim() === "") {
      alert("First Name is required.");
      setIsCurrentGuestValid(false);
      return;
    }

    const guestData = {
      guestId: guest.id,
      title: guest.title,
      firstName: guest.firstName,
      lastName: guest.lastName,

      age: guest.age,
    };

    try {
      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/guests/addList",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(guestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Guest saved successfully:", data);
    } catch (error) {
      console.error("Error saving guest:", error);
    }
  };
  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/billing/getAllTransactions?bookingId=${customerId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Transactions:", data);
      setTransactions(
        data.map((tx) => ({
          ...tx,
          key: tx.transactionId,
        }))
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchTransactions();
    }
  }, [customerId]);

  const onAddTask = async () => {
    try {
      const values = await form.validateFields();
      console.log("Received values of form: ", values);

      const taskData = {
        taskName: values.taskName,
        dueDate: values.date.format("YYYY-MM-DD"),
        priority: values.priority,
        status: values.status,
        autoGenerated: false,
        roomNumber: values.roomNumber,
      };

      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Error ${response.status}: ${errorResponse.message}`);
      }

      const result = await response.json();
      console.log("Task created successfully:", result);

      form.resetFields();
      setIsAddTaskDrawerVisible(false);
    } catch (errorInfo) {
      console.log("Failed to create task:", errorInfo);
    }
  };

  const handleAddGuestClick = () => {
    const newGuestId = guestDetails.length + 1;
    const newGuest = {
      id: newGuestId,
      firstName: "",
      lastName: "",
    };

    setGuestDetails([...guestDetails, newGuest]);

    setGuestEditStates((prevStates) => ({ ...prevStates, [newGuestId]: true }));

    setOpenCardId(newGuestId);
  };

  const handleCancelAddTransaction = () => {
    setAddingTransaction(false);
    setNewTransaction({ amount: "", date: getCurrentDate(), paymentMode: "" }); // Reset the form
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
  const handleAddTransaction = () => {
    setAddingTransaction(true);

    setNewTransaction({
      amount: "",
      date: "",
      paymentMode: "",
    });
  };
  const handleTransactionInputChange = (e) => {
    const { name, value } = e.target;
    if (editTransactionIndex != null) {
      setEditedTransaction((prevState) => {
        const updatedState = { ...prevState, [name]: value };
        console.log("Editing Transaction:", updatedState);
        return updatedState;
      });
    } else {
      setNewTransaction((prevState) => {
        const updatedState = { ...prevState, [name]: value };
        console.log("New Transaction:", updatedState);
        return updatedState;
      });
    }
  };

  const handleSaveEdit = () => {
    const updatedTransactions = [...transactions];
    updatedTransactions[editIndex] = editedTransaction;
    setTransactions(updatedTransactions);
    setEditIndex(null);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
  };
  const handleEditTransaction = (index) => {
    setEditTransactionIndex(index);
    setEditedTransaction({ ...transactions[index] });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
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

  const handleRemoveFile = (file) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
    setIsFileUploaded(false);
    setPreviewVisible(false);
  };

  const handleLocalCancelEditGuest = () => {
    setEditGuestIndex(null);
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
  const handleViewBookings = () => {
    history.push("/view-bookings");
  };
  const handleEditInputChange = (e) => {
    setEditedTransaction({
      ...editedTransaction,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    const bookingData = {
      checkInDate: bookingDetails.checkInDate,
      checkOutDate: bookingDetails.checkOutDate,
      roomNumber: bookingDetails.roomNumber,
      totalAmount: bookingDetails.totalAmount,
      firstName: bookingDetails.guestFirstName,
    };

    history.push({
      pathname: "/bookingDetails",
      state: { ...bookingData },
    });
  };

  const createTransaction = async (transactionDetails) => {
    try {
      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/transaction/create",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionDetails),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Transaction created successfully:", data);
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const handleSaveTransaction = () => {
    if (!customerId || isNaN(customerId)) {
      console.error("Invalid booking ID");
      return;
    }

    const transactionData = {
      amountPaid: parseFloat(newTransaction.amount),
      paymentMode: newTransaction.paymentMode,
      bookingId: parseInt(customerId, 10),
      date: newTransaction.date,
    };

    createTransaction(transactionData);

    console.log("Saving transaction with data:", transactionData);
    setTransactions([...transactions, transactionData]);
    setAddingTransaction(false);
    setNewTransaction({ amount: "", date: getCurrentDate(), paymentMode: "" });
  };

  useEffect(() => {
    console.log("Received Booking ID in BookingConfirmation:", customerId);
  }, [customerId]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(
          `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/reservation/getSummary?bookingId=${customerId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBookingDetails({
          id: data.bookingId,
          checkInDate: data.checkIn,
          checkOutDate: data.checkOut,
          guests: `${data.guestList.length} Guests`,
          roomNumber: data.roomNumber,
          roomType: data.roomType,
        });
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    const fetchBillingDetails = async () => {
      try {
        const response = await fetch(
          `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/billing/getBill?bookingId=${customerId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const parsedTransactions = data.transactions.map((transaction) => {
          const [id, amount, paymentMode, date] = transaction.split(" ");
          return { id, amount, paymentMode, date };
        });

        setTransactions(parsedTransactions);
        setTotalRoomCharges(data.total_room_charges);
        setTotalAddonCharges(data.total_addon_charges);
        setPaidAmount(data.paid_amount);
        setPendingAmount(data.pending_amount);
      } catch (error) {
        console.error(
          "There was a problem with your fetch operation for billing details:",
          error
        );
      }
    };

    fetchBookingDetails();
    fetchBillingDetails();
  }, [customerId]);

  const handleGenerateInvoice = () => {
    const bookingData = {
      booking: bookingDetails,
      guests: guestData,
    };

    setCurrentBooking(bookingData);
    setShowInvoice(true);
  };

  const handleCheckIn = async () => {
    console.log("Check In clicked. Booking ID:", customerId);

    const url = `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/roomStatus/checkIn?bookingId=${customerId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Check-in successful:", data);
    } catch (error) {
      console.error("There was a problem with the check-in operation:", error);
    }
  };

  const handleCheckOut = async () => {
    console.log("Check Out clicked. Booking ID:", customerId);

    const url = `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/roomStatus/checkOut?bookingId=${customerId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Check-out successful:", data);
    } catch (error) {
      console.error("There was a problem with the check-out operation:", error);
    }
  };

  const handleGetInvoice = () => {
    console.log("Get Invoice clicked. Booking ID:", customerId);

    history.push("/invoice");
  };
  const handleDeleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    if (editIndex === index) {
      setEditIndex(null);
    }
  };

  return (
    <>
      <div className="bookingContainer">
        <div className="bookingForm">
          <div style={{ textAlign: "center", margin: "20px", width: "80%" }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item>
                <Row align="middle" justify="space-between" gutter={[16, 16]}>
                  <Grid item>
                    <Typography variant="h4" style={{ fontWeight: "bold" }}>
                      {bookingDetails.guestFirstName}{" "}
                      {bookingDetails.guestLastName}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="subtitle2"
                      style={{ color: "grey", fontSize: "0.9rem" }}
                    >
                      Booking ID #{bookingDetails.id}
                    </Typography>
                  </Grid>
                </Row>
              </Grid>
              <Grid item>
                <Typography variant="h5" style={{ color: "green" }}>
                  Confirmed Booking
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={handleEditClick}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={showAddTaskDrawer}
                >
                  Add Task
                </Button>
              </Grid>
            </Grid>
            <Card>
              <CardContent>
                <Row align="middle" justify="space-between" gutter={[16, 16]}>
                  <Grid item xs={4}>
                    <Typography gutterBottom>Check-in</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {bookingDetails.checkInDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography gutterBottom>Check-out</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {bookingDetails.checkOutDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography gutterBottom>Guests</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {bookingDetails.adults} Adults, {bookingDetails.children}{" "}
                      Children
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography gutterBottom>Room Number</Typography>
                    <Typography variant="body2" color="textSecondary">
                      #{bookingDetails.roomNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography gutterBottom>Room Type</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {bookingDetails.roomType}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography gutterBottom>Add Ons</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Extra Bed
                    </Typography>
                  </Grid>
                </Row>
              </CardContent>
            </Card>
          </div>
          <div className="guest-details">
            <div className="guest-details-header">
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
                    <Space>
                      {guestEditStates[guest.id] ? (
                        <Button
                          type="primary"
                          onClick={() => handleSaveGuest(guest.id)}
                        >
                          Save
                        </Button>
                      ) : (
                        <IconButton
                          onClick={() => setGuestToEditMode(guest.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      <Button
                        type="default"
                        danger
                        onClick={() => handleDeleteGuest(guest.id)}
                        icon={<DeleteOutlined />}
                      >
                        Delete
                      </Button>
                    </Space>
                  }
                  style={{
                    width: "80%",
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
                    <Typography.Title level={4} style={{ fontWeight: "bold" }}>
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
                          rules={[
                            {
                              required: true,
                              message: "Please enter the First Name.",
                            },
                          ]}
                        >
                          <Input
                            style={{ width: "80%" }}
                            onChange={(e) => {
                              const updatedGuests = [...guestDetails];
                              updatedGuests[guestIndex].firstName =
                                e.target.value;
                              setGuestDetails(updatedGuests);
                            }}
                          />
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
                    <Typography.Title level={4} style={{ fontWeight: "bold" }}>
                      Identification
                    </Typography.Title>
                    <Row gutter={16}>
                      <Col span={5.5}>
                        <Form.Item label="ID Type" name={`idType_${guest.id}`}>
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
                            placeholder="Enter your ID number"
                            style={{ width: "80%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="Document"
                          name={`identificationDocument_${guest.id}`}
                        >
                          <Upload
                            name={`files_${guest.id}`}
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            onRemove={handleRemoveFile}
                            accept=".jpg,.jpeg,.png"
                            fileList={fileList}
                            showUploadList={false}
                          >
                            <Button
                              icon={
                                isFileUploaded ? (
                                  <EyeOutlined />
                                ) : (
                                  <UploadOutlined />
                                )
                              }
                              onClick={
                                isFileUploaded
                                  ? () => handlePreview(fileList[0])
                                  : undefined
                              }
                            >
                              {isFileUploaded ? "View" : "Click to upload"}
                            </Button>
                          </Upload>
                          {isFileUploaded && (
                            <Button
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveFile(fileList[0])}
                              size="small"
                              style={{ marginLeft: 8 }}
                            />
                          )}
                        </Form.Item>
                        <Modal
                          visible={previewVisible}
                          footer={null}
                          onCancel={() => setPreviewVisible(false)}
                        >
                          <img
                            alt="Preview"
                            style={{ width: "100%" }}
                            src={previewImage}
                          />
                        </Modal>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              ))}
            </div>
            <Card>
              <CardContent>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Grid item>
                    <Typography.Title level={4} style={{ fontWeight: "bold" }}>
                      Payment Information
                    </Typography.Title>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={handleAddTransaction}
                      className="add-transaction-button"
                    >
                      Add Transaction
                    </Button>
                  </Grid>
                </Grid>

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
                    {transactions.map((transaction, index) => (
                      <tr key={transaction.transactionId}>
                        {editTransactionIndex === index ? (
                          <>
                            <td>
                              <input
                                style={{ width: "80%" }}
                                type="text"
                                name="amount"
                                value={editedTransaction.amount}
                                onChange={handleEditInputChange}
                              />
                            </td>
                            <td>
                              <input
                                style={{ width: "80%" }}
                                type="date"
                                name="date"
                                value={editedTransaction.date}
                                onChange={handleEditInputChange}
                              />
                            </td>
                            <td>
                              <select
                                name="paymentMode"
                                value={editedTransaction.paymentMode}
                                onChange={handleEditInputChange}
                              >
                                <option value="Online">Online</option>
                                <option value="Cash">Cash</option>
                              </select>
                            </td>
                            <td>
                              <Tooltip title="Save">
                                <Button
                                  onClick={() => saveEditTransaction(index)}
                                >
                                  <CheckOutlined />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Cancel">
                                <Button onClick={() => cancelEditTransaction()}>
                                  <CancelIcon />
                                </Button>
                              </Tooltip>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{transaction.amountPaid}</td>
                            <td>{transaction.paymentDate}</td>
                            <td>{transaction.paymentMode}</td>
                            <td>
                              <Tooltip title="Edit">
                                <Button
                                  onClick={() => startEditTransaction(index)}
                                >
                                  <EditIcon />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <Button
                                  onClick={() => handleDeleteTransaction(index)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </Tooltip>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {addingTransaction && (
                      <tr>
                        <td>
                          <input
                            style={{ width: "80%" }}
                            type="text"
                            name="amount"
                            value={newTransaction.amount}
                            onChange={handleTransactionInputChange}
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: "80%" }}
                            type="date"
                            name="date"
                            value={newTransaction.date}
                            onChange={handleTransactionInputChange}
                          />
                        </td>
                        <td>
                          <select
                            name="paymentMode"
                            value={newTransaction.paymentMode}
                            onChange={handleTransactionInputChange}
                          >
                            <option value="Online">Online</option>
                            <option value="Cash">Cash</option>
                          </select>
                        </td>
                        <td>
                          <Tooltip title="Save">
                            <Button onClick={handleSaveTransaction}>
                              <SaveIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <Button onClick={handleCancelAddTransaction}>
                              <CancelIcon />
                            </Button>
                          </Tooltip>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="booking-summary">
          <div className="summaryHeader">Booking Summary</div>
          <div className="summaryRow">
            <span>Room Total</span>
            <span>₹ {totalRoomCharges.toFixed(2)}</span>
          </div>
          <div className="summaryItem">
            <span>Add-on Charges</span>
            <span>₹ {totalAddonCharges.toFixed(2)}</span>
          </div>
          <div className="divider"></div>
          <div className="summaryRow total">
            <strong>Total</strong>
            <strong>
              ₹ {(totalRoomCharges + totalAddonCharges).toFixed(2)}
            </strong>
          </div>
          <hr />
          <div className="summaryRow">
            <span>Paid</span>
            <span>₹ {paidAmount.toFixed(2)}</span>
          </div>
          <div className="summaryRow pending">
            <span>Due</span>
            <span>₹ {pendingAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Drawer
        title="Add New Task"
        placement="right"
        closable={false}
        onClose={closeAddTaskDrawer}
        visible={isAddTaskDrawerVisible}
        width={300}
      >
        <Form layout="vertical" form={form} onFinish={onAddTask}>
          <Form.Item
            name="roomNumber"
            label="Room Number"
            rules={[
              { required: true, message: "Please enter the room number" },
            ]}
          >
            <Input placeholder="Enter Room Number" />
          </Form.Item>
          <Form.Item
            name="taskId"
            label="Task ID"
            rules={[{ required: true, message: "Please enter the task ID" }]}
          >
            <Input placeholder="Enter Task ID" />
          </Form.Item>
          <Form.Item
            name="taskName"
            label="Task Name"
            rules={[{ required: true, message: "Please enter the task name" }]}
          >
            <Input placeholder="Enter Task Name" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select the date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please select the priority" }]}
          >
            <Select placeholder="Select Priority">
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status" }]}
          >
            <Select placeholder="Select Status">
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="inProgress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              onClick={closeAddTaskDrawer}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <div style={{ position: "absolute", width: "100%", bottom: 0 }}>
        <footer className="footer">
          <Button
            onClick={() => history.push("/view-bookings")}
            className="blue-button"
          >
            View Bookings
          </Button>
          <Button onClick={handleCheckIn} className="blue-button">
            Check In
          </Button>
          <Button 
    onClick={() => {
      handleCheckOut();
      message.success('Check Out Confirmed');
    }} 
    className="blue-button"
  >
    Check Out
  </Button>
          <Button onClick={handleGetInvoice} className="blue-button">
            Get Invoice
          </Button>
        </footer>
      </div>
    </>
  );
}

export default BookingConfirmation;  