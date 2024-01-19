import React, { useState, useEffect } from "react";
import {
  Button,
  DatePicker,
  Space,
  Table,
  Pagination,
  Tag,
  Select,
} from "antd";
import { MinusOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { BathOutlined, AppstoreOutlined } from "@ant-design/icons";
import BookingDetails from "./BookingDetails";
import "./Bookings.css";
import { Card, Checkbox, Row, Col } from "antd";
import { useBooking } from "./BookingContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";
import { message } from "antd";

const { Option } = Select;

function Bookings() {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [tableData, setTableData] = useState(apiData);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [pageSize, setPageSize] = useState(5);
  const { setBookingData } = useBooking();
  const history = useHistory();
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const bedTypeOptions = ["All", "Single", "Double"];
  const viewOptions = ["All", "Balcony", "Parking", "Mountain"];
  const bathroomOptions = ["All", "Indian", "Western"];

  const [viewFilter, setViewFilter] = useState("All");
  const [bathroomFilter, setBathroomFilter] = useState("All");
  const [bedTypeFilter, setBedTypeFilter] = useState("All");

  const dummy = [
    {
      id: 1,
      room: {
        roomId: 1,
        roomNumber: 101,
        roomType: {
          id: 1,
          roomType: "AC",
          amenities: "AC TV Geyser Parking",
          costPerDay: 3000.0,
        },
        roomStatus: "vacant",
        bedType: "double",
        viewType: "balcony",
        bathroomType: "indian",
        floor: "1",
      },
      status: "vacant",
      checkinDate: null,
      checkoutDate: null,
      checkinTime: null,
      checkoutTime: null,
    },
    {
      id: 2,
      room: {
        roomId: 2,
        roomNumber: 102,
        roomType: {
          id: 1,
          roomType: "AC",
          amenities: "AC TV Geyser Parking",
          costPerDay: 3000.0,
        },
        roomStatus: "vacant",
        bedType: "double",
        viewType: "mountain",
        bathroomType: "western",
        floor: "1",
      },
      status: "vacant",
      checkinDate: null,
      checkoutDate: null,
      checkinTime: null,
      checkoutTime: null,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/roomStatus/getAllRooms"
        );
        const data = await response.json();
        setApiData(data);
        setTableData(data); // Set initial table data
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = apiData;

    if (selectedRoomType !== "All") {
      filteredData = filteredData.filter(
        (item) => item.room.roomType === selectedRoomType
      );
    }

    if (viewFilter !== "All") {
      filteredData = filteredData.filter(
        (item) =>
          item.room.viewType &&
          item.room.viewType.toLowerCase() === viewFilter.toLowerCase()
      );
    }

    if (bathroomFilter !== "All") {
      filteredData = filteredData.filter(
        (item) =>
          item.room.bathroomType &&
          item.room.bathroomType.toLowerCase() === bathroomFilter.toLowerCase()
      );
    }

    if (bedTypeFilter !== "All") {
      filteredData = filteredData.filter(
        (item) =>
          item.room.bedType &&
          item.room.bedType.toLowerCase() === bedTypeFilter.toLowerCase()
      );
    }

    setTableData(filteredData);
  }, [selectedRoomType, viewFilter, bathroomFilter, bedTypeFilter, apiData]);

  const columns = [
    {
      title: "Room Number",
      dataIndex: "room",
      //dataIndex: ["first", "room"],
      key: "room",
    },

    {
      title: "Amenities",
      dataIndex: "amenities",
      key: "amenities",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "View",
      dataIndex: "viewType",
      key: "viewType",
    },
    {
      title: "Bed",
      dataIndex: "bedType",
      key: "bedType",
    },
    {
      title: "Bathroom",
      dataIndex: "bathroomType",
      key: "bathroomType",
    },
    {
      title: "Cost per day",
      dataIndex: "costPerDay",
      key: "costPerDay",
      render: (costPerDay) => (costPerDay ? `₹${costPerDay}` : "Not available"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "vacant" ? (
          <Checkbox onChange={() => setSelectedRoom(record)} />
        ) : (
          <Checkbox disabled />
        ),
    },
  ];
  const updateBookingDetails = (checkIn, checkOut, adults, children) => {
    setBookingData({
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults,
      children,
    });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleRoomTypeFilterChange = (selectedTypes) => {
    onBookingDataChange({ roomTypeFilter: selectedTypes });
  };

  // const handleProceedClick = () => {
  //   setShowBookingDetails(true);
  //   setBookingData({
  //     checkInDate: checkIn,
  //     checkOutDate: checkOut,
  //     adults,
  //     children,
  //   });
  // };
  const handleProceedClick = () => {
    // if (!selectedRoom) {
    //   message.error("Please select a room.");
    //   return;
    // }
    if (!checkIn || !checkOut) {
      message.error("Please select both check-in and check-out dates.");
      return;
    }
    const roomCost = selectedRoom.room.costPerDay;
    const gst = roomCost * 0.18; // Assuming 18% GST
    const totalCost = roomCost + gst;

    history.push("/bookingDetails", {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults: adults,
      children: children,
      selectedRoom: {
        ...selectedRoom,
        roomNumber: selectedRoom.room.roomNumber,
        roomType: selectedRoom.room.roomType,
        roomCost,
        gst,
        totalCost,
      },
      numberOfNights: numberOfNights,
    });
  };

  useEffect(() => {
    let filteredData = apiData;

    if (selectedRoomType !== "All") {
      filteredData = filteredData.filter(
        (item) => item.roomType === selectedRoomType
      );
    }

    if (viewFilter !== "All") {
      filteredData = filteredData.filter(
        (item) =>
          item.viewType &&
          item.viewType.toLowerCase() === viewFilter.toLowerCase()
      );
    }

    if (bathroomFilter !== "All") {
      filteredData = filteredData.filter(
        (item) =>
          item.bathroomType &&
          item.bathroomType.toLowerCase() === bathroomFilter.toLowerCase()
      );
    }

    if (bedTypeFilter !== "All") {
      filteredData = filteredData.filter(
        (item) =>
          item.bedType &&
          item.bedType.toLowerCase() === bedTypeFilter.toLowerCase()
      );
    }

    setTableData(filteredData);
  }, [selectedRoomType, viewFilter, bathroomFilter, bedTypeFilter, apiData]);

  const handleBackClick = () => {
    setShowBookingDetails(false);
  };
  const handleViewFilterChange = (value) => {
    setViewFilter(value);
  };

  const handleBathroomFilterChange = (value) => {
    setBathroomFilter(value);
  };

  const handleBedTypeFilterChange = (value) => {
    setBedTypeFilter(value);
  };

  const handleCheckInChange = (date) => {
    setCheckIn(date ? date.format("YYYY-MM-DD") : null);
  };

  const handleCheckOutChange = (date) => {
    setCheckOut(date ? date.format("YYYY-MM-DD") : null);
  };

  const updateNumberOfNights = (checkInDate, checkOutDate) => {
    if (checkInDate && checkOutDate) {
      const duration = moment(checkOutDate).diff(moment(checkInDate), "days");
      setNumberOfNights(duration);
    }
  };

  const handleCounterChange = (index, action) => {
    const updatedTableData = [...tableData];
    const currentCount = updatedTableData[index].count || 0;
    if (action === "increment") {
      updatedTableData[index].count = currentCount + 1;
    } else if (action === "decrement" && currentCount > 0) {
      updatedTableData[index].count = currentCount - 1;
    }
    setTableData(updatedTableData);
  };

  const searchRooms = () => {
    const filteredData = dummyData.filter((item) => {
      return (
        item.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roomType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setTableData(filteredData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getButtonClass = (type) => {
    return selectedRoomType === type
      ? "selected-filter-button"
      : "filter-button";
  };

  if (showBookingDetails) {
    return (
      <BookingDetails
        onBackClick={() => setShowBookingDetails(false)}
        checkInDate={checkIn}
        checkOutDate={checkOut}
        adults={adults}
        children={children}
        selectedRoom={selectedRoom}
        numberOfNights={numberOfNights}
      />
    );
  }

  return (
    <div className="bookings-wrapper">
      <h1 className="create-booking-header">Create Booking</h1>
      <Card className="booking-card">
        <div className="filter-row">
          <div className="room-type-buttons">
            {["All", "AC", "Non AC", "Deluxe"].map((type) => (
              <Button
                key={type}
                type={selectedRoomType === type ? "primary" : "default"}
                onClick={() => setSelectedRoomType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
          <div className="vertical-divider"></div>
          {/* Room Filters */}
          <div className="room-filters">
            <Select
              defaultValue="All"
              style={{ width: 120 }}
              onChange={handleViewFilterChange} // Ensure this updates viewFilter state
            >
              {viewOptions.map((view) => (
                <Option key={view}>{view}</Option>
              ))}
            </Select>
            <Select
              defaultValue="All"
              style={{ width: 120 }}
              onChange={handleBathroomFilterChange}
            >
              {bathroomOptions.map((bathroom) => (
                <Option key={bathroom}>{bathroom}</Option>
              ))}
            </Select>
            <Select
              defaultValue="All"
              style={{ width: 120 }}
              onChange={handleBedTypeFilterChange}
            >
              {bedTypeOptions.map((bedType) => (
                <Option key={bedType}>{bedType}</Option>
              ))}
            </Select>
          </div>
        </div>

        <Row gutter={[16, 24]} justify="start">
          <Col span={12}>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Check-in"
              value={checkIn}
              onChange={setCheckIn}
            />
          </Col>
          <Col span={12}>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Check-out"
              value={checkOut}
              onChange={setCheckOut}
            />
          </Col>
        </Row>

        <Row gutter={[16, 24]} justify="start">
          <Col>
            <div className="counter-label">Adults:</div>
            <div className="number-picker">
              <Button
                icon={<MinusOutlined />}
                onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}
              />
              <span className="counter-value">{adults}</span>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setAdults(adults + 1)}
              />
            </div>
          </Col>
          <Col>
            <div className="counter-label">Children:</div>
            <div className="number-picker">
              <Button
                icon={<MinusOutlined />}
                onClick={() => setChildren(children > 0 ? children - 1 : 0)}
              />
              <span className="counter-value">{children}</span>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setChildren(children + 1)}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* <div className="table-container">
        <Table
          columns={columns}
          dataSource={apiData}
          rowKey={(record) => record.room.roomNumber}
          pagination={false}
          size="small"
          className="centered-table"
        />

        <Pagination
          current={currentPage}
          total={tableData.length}
          pageSize={5}
          onChange={handlePageChange}
        />
      </div> */}
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div className="table-container">
          <div className="table-container">
            {/* <Table
              columns={columns}
              dataSource={apiData}
              rowKey={(record, index) => index}
              pagination={false}
              size="small"
              className="centered-table"
            /> */}

            <Table
              columns={columns}
              dataSource={tableData} // Use tableData here
              rowKey={(record, index) => index}
              pagination={false}
              size="small"
              className="custom-table"
              rowClassName={(record) =>
                record.status === "reserved" ? "reserved-row" : ""
              }
            />

            <Pagination
              current={currentPage}
              total={tableData.length}
              pageSize={5}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}

      <Button
        type="primary"
        className="proceed-button"
        onClick={handleProceedClick}
      >
        Proceed
      </Button>
    </div>
  );
}

export default Bookings;
