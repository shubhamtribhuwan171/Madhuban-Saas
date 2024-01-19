import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./Frontdesk.css";
import { Select } from "antd";
import { useHistory } from "react-router-dom";

const { Option } = Select;

const Frontdesk = () => {
  const history = useHistory();
  const [roomsData, setRoomsData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [dropdownValue, setDropdownValue] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const dummy = [
    {
      first: {
        room: 101,
        status: "vacant",
        checkIn: "2024-01-15",
        checkOut: "2024-01-18",
        checkInTime: "10:00:00",
        checkOutTime: "10:00:00",
        customer: null,
      },
      second: {
        customerId: 1,
        title: "Ms",
        firstName: "A",
        lastName: "A",
        email: "a.a@email.com",
        address: "street 456",
        city: "City1",
        state: "State1",
        country: "Country1",
        phoneNumber: 5467,
        age: 35,
        customerDocs: {
          pan: "1234abcd456",
        },
      },
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/roomStatus/getAll"
        );
        const data = await response.json();
        // const data = dummy;
        setRoomsData(data);

        console.log("get data", roomsData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (roomData) => {
    setSelectedRoom(roomData);

    const room = roomData.first;
    const customer = roomData.second;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkInDate = today.toISOString().split("T")[0];
    const checkOutDate = tomorrow.toISOString().split("T")[0];
    console.log("Clicked room data:", room);

    if (room.status === "vacant") {
      history.push({
        pathname: "/bookingDetails",
        state: {
          selectedRoom: roomData.first,
          roomNumber: room.room,
          roomType: room.roomType,
          costPerDay: room.costPerDay,

          checkInDate: today.toISOString().split("T")[0],
          checkOutDate: tomorrow.toISOString().split("T")[0],
        },
      });
    } else if (room.status === "reserved" || "occupied" || "dueOut") {
      history.push({
        pathname: "/bookingConfirmation",
        state: {
          customerId: customer.customerId,
        },
      });
    }
  };

  const occupiedCount = roomsData.filter(
    (item) => item.first.status === "occupied"
  ).length;
  const vacantCount = roomsData.filter(
    (item) => item.first.status === "vacant"
  ).length;
  const reservedCount = roomsData.filter(
    (item) => item.first.status === "reserved"
  ).length;
  const outOfOrderCount = roomsData.filter(
    (item) => item.first.status === "outOfOrder"
  ).length;
  const dueOutCount = roomsData.filter(
    (item) => item.first.status === "dueout"
  ).length;
  const dirtyCount = roomsData.filter(
    (item) => item.first.status === "dirty"
  ).length;

  const getFilteredRooms = () => {
    let rooms =
      currentFilter === "All"
        ? roomsData
        : roomsData.filter((item) => item.first.status === currentFilter);

    if (dropdownValue) {
      rooms = rooms.filter((item) =>
        item.first.floor.startsWith(dropdownValue)
      );
    }

    return rooms;
  };

  const filteredRooms = getFilteredRooms();

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  return (
    <div>
      <div className="filter-section">
        <button onClick={() => setCurrentFilter("All")} className="pill-button">
          All ({roomsData.length})
        </button>
        <button
          onClick={() => setCurrentFilter("occupied")}
          className="pill-button pill-button-occupied"
        >
          Occupied ({occupiedCount})
        </button>
        <button
          onClick={() => setCurrentFilter("vacant")}
          className="pill-button pill-button-vacant"
        >
          Vacant ({vacantCount})
        </button>
        <button
          onClick={() => setCurrentFilter("reserved")}
          className="pill-button pill-button-reserved"
        >
          Reserved ({reservedCount})
        </button>
        <button
          onClick={() => setCurrentFilter("outOfOrder")}
          className="pill-button pill-button-outOfOrder"
        >
          Out Of Order ({outOfOrderCount})
        </button>
        <button
          onClick={() => setCurrentFilter("dueout")}
          className="pill-button pill-button-dueOut"
        >
          Due Out ({dueOutCount})
        </button>
        <button
          onClick={() => setCurrentFilter("dirty")}
          className="pill-button pill-button-dirty"
        >
          Dirty ({dirtyCount})
        </button>
      </div>
      <div className="dropdown-container">
        {/* Replace Material-UI Select component with Ant Design Select component */}
        <Select
          value={dropdownValue}
          onChange={handleDropdownChange}
          className="dropdown"
        >
          <Option value="">All</Option>
          <Option value="1">First Floor</Option>
          <Option value="2">Second Floor</Option>
          <Option value="3">Third Floor</Option>
        </Select>
      </div>
      <div className="grid-container">
        {filteredRooms.map((room, index) => (
          <Card
            roomNumber={room.first.room.toString()}
            roomType={room.first.roomType}
            guestName={room.second.firstName}
            status={room.first.status}
            bedType={room.first.bedType}
            viewType={room.first.viewType}
            bathroomType={room.first.bathroomType}
            icons={{
              iconGroup: [
                room.first.bedType,
                room.first.viewType,
                room.first.bathroomType,
              ],
            }}
            onClick={() => {
              console.log("Room data:", room);
              handleCardClick(room);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Frontdesk;
