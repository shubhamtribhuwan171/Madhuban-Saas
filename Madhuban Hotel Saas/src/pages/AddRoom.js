import React, { useState } from "react";
import { Drawer, Form, Input, Select, Button, message } from "antd";

const { Option } = Select;

function AddRoom({ onClose, onSave }) {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(true);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        fetch(
          "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/rooms/add",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            onSave(values);
            onClose();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
        message.error("Please fill in all required fields");
      });
  };

  return (
    <Drawer
      title="Add Room"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={400}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} type="primary">
            Save
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        name="addRoomForm"
        initialValues={{
          roomNumber: "",
          bedType: "Single",
          roomFloor: "1",
          status: "",
          roomType: "AC",
          viewType: "Parking",
          bathroomType: "Indian",
        }}
      >
        <Form.Item
          name="roomNumber"
          label="Room Number"
          rules={[
            {
              required: true,
              message: "Please enter room number!",
            },
          ]}
        >
          <Input placeholder="Enter room number" />
        </Form.Item>

        <Form.Item
          name="bedType"
          label="Bed Type"
          initialValue="Single"
          rules={[
            {
              required: true,
              message: "Please select bed type!",
            },
          ]}
        >
          <Select>
            <Option value="Single">Single</Option>
            <Option value="Double">Double</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="roomFloor"
          label="Room Floor"
          initialValue="1"
          rules={[
            {
              required: true,
              message: "Please select room floor!",
            },
          ]}
        >
          <Select>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: true,
              message: "Please enter status!",
            },
          ]}
        >
          <Input placeholder="Enter status" />
        </Form.Item>

        <Form.Item
          name="roomType"
          label="Room Type"
          initialValue="AC"
          rules={[
            {
              required: true,
              message: "Please select room type!",
            },
          ]}
        >
          <Select>
            <Option value="AC">AC</Option>
            <Option value="Non AC">Non AC</Option>
            <Option value="Deluxe">Deluxe</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="viewType"
          label="View Type"
          initialValue="Parking"
          rules={[
            {
              required: true,
              message: "Please select view type!",
            },
          ]}
        >
          <Select>
            <Option value="Parking">Parking</Option>
            <Option value="Mountain">Mountain</Option>
            <Option value="Balcony">Balcony</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="bathroomType"
          label="Bathroom Type"
          initialValue="Indian"
          rules={[
            {
              required: true,
              message: "Please select bathroom type!",
            },
          ]}
        >
          <Select>
            <Option value="Indian">Indian</Option>
            <Option value="Western">Western</Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

export default AddRoom;
