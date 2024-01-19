import React, { useState, useEffect } from "react";
import { Table, Button, Card, Select, Input } from "antd";
import { withRouter } from "react-router-dom";
import { DatePicker } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const { Option } = Select;

const ViewBookings = ({ history }) => {
  const [bookings, setBookings] = useState([]);
  const [filterRoomNumber, setFilterRoomNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAllRooms, setShowAllRooms] = useState(false); 
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/reservation/getAll"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const processedData = data.map((booking) => {
          const [firstName, lastName] = booking.customerName.split(" ");
          return { ...booking, firstName, lastName, status: booking.status }; // Include status here
        });

        setBookings(processedData);
        const uniqueRoomNumbers = [
          ...new Set(data.map((booking) => booking.roomNumber)),
        ];
        setRoomNumbers(uniqueRoomNumbers);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleEditClick = (booking) => {
    console.log(booking);
    const customer = booking;

    history.push({
      pathname: "/bookingConfirmation",
      state: {
        customerId: customer,
      },
    });
  };
  const handleAllRoomClick = () => {
    setFilterRoomNumber(""); 
    setShowAllRooms(true); 
  };
  const handleClearFilterClick = () => {
    setFilterRoomNumber("");
    setFilterStatus("");
    setFilterName("");
    setStartDate(null); // Clear the selected date
    setEndDate(null); // Clear the selected date
    setShowAllRooms(false); // Reset "All Room" flag
  };
  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Check In",
      dataIndex: "checkIn",
      key: "checkIn",
    },
    {
      title: "Check Out",
      dataIndex: "checkOut",
      key: "checkOut",
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Amount Due",
      dataIndex: "pendingAmt",
      key: "pendingAmt",
    },
    {
      title: "Room Number",
      dataIndex: "roomNumber",
      key: "roomNumber",
      onFilter: (value, record) =>
        String(record.roomNumber).includes(filterRoomNumber),
      render: (roomNumber) => <span>{roomNumber}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEditClick(record.bookingId)}
        />
      ),
    },
  ];



  const handleBackButtonClick = () => {
    history.goBack();
  };
 
  return (
    <div>
      <Card title="Filters">
        <Button
          type="primary"
          onClick={handleAllRoomClick}
          style={{ marginRight: 10 }}
        >
          All Room
        </Button>
        <Select
          style={{ width: 120 }}
          placeholder="Room Number"
          onChange={(value) => {
            setFilterRoomNumber(value);
            setShowAllRooms(false);
          }}
          value={filterRoomNumber}
        >
          {roomNumbers.map((roomNumber) => (
            <Option key={roomNumber} value={roomNumber}>
              {roomNumber}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="Customer Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          style={{ width: 200, marginLeft: 10 }}
        />
        <DatePicker
          style={{ width: 200, marginLeft: 10 }}
          onChange={(date) => {
            setStartDate(date);
          }}
        />
        <DatePicker
          style={{ width: 200, marginLeft: 10 }}
          onChange={(date) => {
            setEndDate(date);
          }}
        />
        <Button
          type="primary"
          onClick={handleClearFilterClick}
          style={{ marginLeft: 10 }}
        >
          Clear Filter
        </Button>
      </Card>

      <Table
        columns={columns}
        dataSource={bookings.filter((record) => {
          const checkInDate = new Date(record.checkIn);
          const checkOutDate = new Date(record.checkOut);
          const isInRange =
            (!startDate || checkInDate >= startDate) &&
            (!endDate || checkOutDate <= endDate);

          return (
            (showAllRooms ||
              !filterRoomNumber ||
              record.roomNumber === filterRoomNumber) &&
            (!filterStatus || record.status === filterStatus) &&
            (!filterName ||
              record.customerName.toLowerCase().includes(filterName.toLowerCase())) &&
            isInRange
          );
        })}
      />
    </div>
  );
};

export default ViewBookings;