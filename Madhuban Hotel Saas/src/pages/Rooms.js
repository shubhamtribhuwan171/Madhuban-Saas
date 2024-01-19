import React, { useState, useEffect } from "react";
import { Input, Table, Button, Modal, Space, Select, Tag, Tooltip } from "antd";
import initialRoomData from "./data.js";
import AddRoom from "../pages/AddRoom";
import "./Rooms.css";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Option } = Select;

function Rooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsData, setRoomsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const itemsPerPage = 5;
  const [bedTypeFilter, setBedTypeFilter] = useState("all");
  const [viewTypeFilter, setViewTypeFilter] = useState("all");
  const [bathroomTypeFilter, setBathroomTypeFilter] = useState("all");
  const [filterCriteria, setFilterCriteria] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/roomStatus/getAll"
        );
        const data = await response.json();
        setRoomsData(data.map((item) => item.first));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = roomsData
    .filter((room) => {
      if (filterCriteria === "all") return true;
      if (filterCriteria === "available")
        return room.status.toLowerCase() === "vacant";
      if (filterCriteria === "booked")
        return room.status.toLowerCase() === "occupied";
      return room;
    })
    .filter(
      (room) =>
        room.room.toString().includes(searchTerm) ||
        room.bedType.includes(searchTerm) ||
        room.floor.includes(searchTerm) ||
        room.roomType.includes(searchTerm) ||
        room.status.includes(searchTerm)
    )
    .filter((room) =>
      bedTypeFilter === "all" ? true : room.bedType === bedTypeFilter
    )
    .filter((room) =>
      viewTypeFilter === "all" ? true : room.viewType === viewTypeFilter
    )
    .filter((room) =>
      bathroomTypeFilter === "all"
        ? true
        : room.bathroomType === bathroomTypeFilter
    );

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filteredData.slice(firstItemIndex, lastItemIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePreviousPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const addNewRoom = (newRoom) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms, newRoom];
      const newTotalPages = Math.ceil(updatedRooms.length / itemsPerPage);
      if (currentPage < newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      return updatedRooms;
    });
  };

  const handleEditRow = (index) => {
    setEditRowIndex(index);
  };

  const handleSaveRow = (index, updatedRoom) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = updatedRoom;
    setRooms(updatedRooms);
    setEditRowIndex(null);
  };

  const handleDeleteRow = (index) => {
    const updatedRooms = [...rooms];
    updatedRooms.splice(index, 1);
    setRooms(updatedRooms);
  };

  function getTagColor(text) {
    switch (text.toLowerCase()) {
      case "single":
        return "#80C7E5";
      case "double":
        return "#B6EBA0";
      case "mountain":
        return "#FFD19A";
      case "balcony":
        return "#FFA0A0";
      case "indian":
        return "#D6A4E0";
      case "western":
        return "#FFB6C1";
      case "parking":
        return "#FFD700";

      default:
        return "#B0B0B0";
    }
  }

  const columns = [
    {
      title: "Room Number",
      dataIndex: "room",
      key: "room",
      width: 100,
      render: (text, record, index) =>
        editRowIndex === index ? (
          <Input
            value={text}
            onChange={(e) => handleEditChange(e, index, "room")}
          />
        ) : (
          <div className="table-cell">{text}</div>
        ),
    },
    {
      title: "Room Floor",
      dataIndex: "floor",
      key: "floor",
      width: 80,
      render: (text, record, index) =>
        editRowIndex === index ? (
          <Input
            value={text}
            onChange={(e) => handleEditChange(e, index, "floor")}
          />
        ) : (
          <div className="table-cell">{text}</div>
        ),
    },
    {
      title: "Room Facility",
      dataIndex: "amenities",
      key: "amenities",
      width: 180,
      render: (text, record, index) =>
        editRowIndex === index ? (
          <Input
            value={text}
            onChange={(e) => handleEditChange(e, index, "amenities")}
          />
        ) : (
          <div className="table-cell">{text}</div>
        ),
    },
    {
      title: "Bed Type",
      dataIndex: "bedType",
      key: "bedType",
      width: 100,
      render: (text, record, index) =>
        editRowIndex === index ? (
          <Input
            value={text}
            onChange={(e) => handleEditChange(e, index, "bedType")}
          />
        ) : (
          <Tag color={getTagColor(text)}>{text}</Tag>
        ),
    },
    {
      title: "View Type",
      dataIndex: "viewType",
      key: "viewType",
      width: 100,
      render: (text, record, index) =>
        editRowIndex === index ? (
          <Input
            value={text}
            onChange={(e) => handleEditChange(e, index, "viewType")}
          />
        ) : (
          <Tag color={getTagColor(text)}>{text}</Tag>
        ),
    },
    {
      title: "Bathroom Type",
      dataIndex: "bathroomType",
      key: "bathroomType",
      width: 100,
      render: (text, record, index) =>
        editRowIndex === index ? (
          <Input
            value={text}
            onChange={(e) => handleEditChange(e, index, "bathroomType")}
          />
        ) : (
          <Tag color={getTagColor(text)}>{text}</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text, record, index) =>
        editRowIndex === index ? (
          <Input
            value={text}
            onChange={(e) => handleEditChange(e, index, "status")}
          />
        ) : (
          <div className="table-cell">{text}</div>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (text, record, index) => (
        <Space size="middle">
          {editRowIndex === index ? (
            <>
              <Button
                icon={<CheckOutlined />}
                type="link"
                onClick={() => handleSaveRow(index, record)}
              />
              <Button
                icon={<CloseOutlined />}
                type="link"
                onClick={() => setEditRowIndex(null)}
              />
            </>
          ) : (
            <>
              <Button
                icon={<EditOutlined />}
                type="link"
                onClick={() => handleEditRow(index)}
              />
              <Button
                icon={<DeleteOutlined />}
                type="link"
                onClick={() => handleDeleteRow(index)}
                danger
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}></div>
      )}

      <div style={{ position: "relative", marginTop: "10px" }}>
        <Button
          type="primary"
          onClick={handleOpenModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1,
          }}
        >
          Add Room
        </Button>
      </div>

      <div className="filter-container">
        <div className="filter-card">
          <label>Room Status</label>

          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={(value) => setFilterCriteria(value)}
          >
            <Option value="all">All Rooms</Option>
            <Option value="available">Available Rooms</Option>
            <Option value="booked">Booked Rooms</Option>
          </Select>
        </div>
        <div className="filter-card">
          <label>Bed Type</label>

          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={(value) => setBedTypeFilter(value)}
          >
            <Option value="all">All Bed Types</Option>
            <Option value="single">Single</Option>
            <Option value="double">Double</Option>
          </Select>
        </div>
        <div className="filter-card">
          <label>View Type</label>

          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={(value) => setViewTypeFilter(value)}
          >
            <Option value="mountain">Mountain</Option>
            <Option value="balcony">Balcony</Option>
            <Option value="parking">Parking</Option>
            <Option value="all">All</Option>
          </Select>
        </div>
        <div className="filter-card">
          <label>Bathroom Type</label>

          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={(value) => setBathroomTypeFilter(value)}
          >
            <Option value="indian">Indian</Option>
            <Option value="western">Western</Option>
            <Option value="all">All</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={currentItems}
        pagination={false}
        bordered
        className="custom-table"
      />

      <div className="pagination-controls">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (number) => (
            <Button
              key={number}
              className={`page-number ${
                currentPage === number ? "active" : ""
              }`}
              onClick={() => handlePageClick(number)}
            >
              {number}
            </Button>
          )
        )}
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {isModalOpen && (
        <AddRoom onClose={handleCloseModal} onSave={addNewRoom} />
      )}
    </div>
  );
}

export default Rooms;
