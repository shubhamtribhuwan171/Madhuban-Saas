import React, { useState } from "react";
import {
  Menu,
  Dropdown,
  Drawer,
  Form,
  Input,
  Select,
  Button,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faToilet,
  faMountain,
  faParkingLot,
} from "@fortawesome/free-solid-svg-icons";
import "./Card.css";

const { Option } = Select;

const statusColors = {
  vacant: "#fdddb3",
  occupied: "#92deba",
  reserved: "#f9a63a",
  outOfOrder: "#5d6679",
  dueout: "#b6d3fa",
  dirty: "#aa3028",
};

const iconMapping = {
  double: faBed,
  single: faBed,
  balcony: faMountain,
  parking: faParkingLot,
  mountain: faMountain,
  indian: faToilet,
  western: faToilet,
};

const Card = ({
  roomNumber,
  roomType,
  guestName,
  status,
  icons = { iconGroup: [], soundIcon: [] },
  onClick,
  bathroomType,
}) => {
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleCreateTask = () => {
    form.resetFields();
    form.setFieldsValue({ roomNumber: roomNumber.toString() });
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const handleSaveFromDrawer = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(
        "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            roomNumber: parseInt(values.roomNumber, 10),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      message.success("Task created successfully!");
      setDrawerVisible(false);
    } catch (error) {
      console.error("Error creating task:", error);
      message.error("Failed to create task.");
    }
  };

  const cardContextMenu = (
    <Menu>
      <Menu.Item key="createTask" onClick={handleCreateTask}>
        Create Task
      </Menu.Item>
    </Menu>
  );

  const headerStyle = {
    backgroundColor: statusColors[status.toLowerCase()] || "#00f",
  };

  return (
    <>
      <Dropdown overlay={cardContextMenu} trigger={["contextMenu"]}>
        <div className="card" onClick={onClick}>
          <div className="card-header" style={headerStyle}></div>
          <div className="card-info">
            <span>Room: {roomNumber}</span>
            <span className="room-type">{roomType}</span>
          </div>
          <div className="card-body">
            <div className="guest-name">{guestName}</div>
          </div>
          <div className="card-footer">
            <div className="icons">
              <div className="icon-group">
                {Array.isArray(icons.iconGroup) &&
                  icons.iconGroup.map((iconName) => (
                    <FontAwesomeIcon
                      key={iconName}
                      className="icon-padding"
                      icon={iconMapping[iconName]}
                      title={iconName}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Dropdown>
      <Drawer
        title={drawerVisible && "Add New Task"}
        width={300}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={handleSaveFromDrawer} type="primary">
              Save
            </Button>
          </div>
        }
      >
        <Form
          layout="vertical"
          hideRequiredMark
          initialValues={{ status: "Pending", priority: "Medium" }}
          form={form}
        >
          <Form.Item
            name="roomNumber"
            label="Room Number"
            rules={[
              { required: true, message: "Please input the room number!" },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="taskName"
            label="Task Name"
            rules={[{ required: true, message: "Please input the task name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select>
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Work in Progress">Work in Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default Card;
