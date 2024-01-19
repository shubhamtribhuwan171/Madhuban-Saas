import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Form,
  Input,
  Select,
  Popconfirm,
  Drawer,
  Button,
  Card,
  Row,
  Col,
  Tag,
  message,
} from "antd";
import "./HouseKeeping.css";

const { Option } = Select;

function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) {
  let inputNode =
    dataIndex === "priority" || dataIndex === "status" ? (
      <Select>
        {dataIndex === "priority" && (
          <>
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </>
        )}
        {dataIndex === "status" && (
          <>
            <Option value="Pending">Pending</Option>
            <Option value="Work in Progress">Work in Progress</Option>
            <Option value="Completed">Completed</Option>
          </>
        )}
      </Select>
    ) : (
      children
    );
  return (
    <td {...restProps}>
      {editing && (dataIndex === "priority" || dataIndex === "status") ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

function HouseKeeping() {
  const [form] = Form.useForm();
  const initialData = [];
  const [data, setData] = useState(initialData);
  const [editingKey, setEditingKey] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filters, setFilters] = useState({
    roomNumber: null,
    status: null,
    priority: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState(null);

  const PriorityTag = ({ priority }) => {
    const color =
      priority === "High"
        ? "volcano"
        : priority === "Medium"
        ? "geekblue"
        : "green";
    return <Tag color={color}>{priority}</Tag>;
  };

  const StatusTag = ({ status }) => {
    const color =
      status === "Pending"
        ? "orange"
        : status === "Work in Progress"
        ? "cyan"
        : "green";
    return <Tag color={color}>{status}</Tag>;
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/getAll"
  //       );
  //       setData(
  //         response.data.map((task) => ({
  //           ...task,
  //           key: task.taskId.toString(),
  //         }))
  //       );
  //     } catch (error) {
  //       console.error("Error fetching tasks:", error);
  //       message.error("Failed to fetch tasks.");
  //     }
  //   };

  //   fetchData();
  // }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/getAll"
  //       );
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setData(
  //         data.map((task) => ({
  //           ...task,
  //           key: task.taskId.toString(),
  //         }))
  //       );
  //     } catch (error) {
  //       console.error("Error fetching tasks:", error);
  //       message.error("Failed to fetch tasks.");
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/getAll"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setData(
          data.map((task) => ({
            ...task,
            key: task.taskId.toString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
        message.error("Failed to fetch tasks.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshData]);

  const applyFilters = (data, filters) => {
    return data.filter((item) => {
      if (filters.roomNumber && item.roomNumber !== filters.roomNumber) {
        return false;
      }
      if (filters.status && item.status !== filters.status) {
        return false;
      }
      if (filters.priority && item.priority !== filters.priority) {
        return false;
      }
      return true;
    });
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const editedTask = {
        taskId: parseInt(key, 10),
        dueDate: row.date,
        taskName: row.taskName,
        priority: row.priority,
        status: row.status,
      };

      const response = await fetch(
        `https://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/editTask?taskId=${key}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedTask),
        }
      );

      const responseData = await response.json();
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
      message.error("Error saving task: " + errInfo.message);
    }
  };

  const deleteRow = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };

  const showDrawer = (record) => {
    if (record) {
      setCurrentRecord(record);
      form.setFieldsValue({ ...record });
    } else {
      setCurrentRecord(null);
      form.resetFields();
    }
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const handleCreateTask = (roomNumber) => {
    // Set the room number in the form and show the drawer
    form.setFieldsValue({ roomNumber });
    showDrawer(null); // assuming null indicates a new task
  };

  const handleSaveFromDrawer = async () => {
    try {
      const row = await form.validateFields();

      const taskData = {
        taskId: row.taskId, // Assuming taskId is coming from the form
        dueDate: row.date, // Assuming dueDate is the same as the date field in the form
        taskName: row.taskName,
        priority: row.priority,
        status: "Assigned", // Assuming status is always set to "Assigned" here
        autoGenerated: false,
        roomNumber: parseInt(row.roomNumber, 10), // Converting roomNumber to a number
      };
      console.log(taskData);

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

      const responseData = await response.json();

      if (responseData && responseData.taskId) {
        const newTask = {
          ...row,
          key: `new_${data.length + 1}`,
          taskId: responseData.taskId,
        };
        setData([...data, newTask]); // Update the state with the new task
        message.success("Task creation successful!");
        onClose(); // Close the drawer here after successful task creation
      } else {
        console.error("Task creation failed", responseData);
      }

      onClose();
    } catch (errInfo) {
      console.error("API call failed:", errInfo);
      message.error("Error saving task: " + errInfo.message);
    }
    onClose();
  };

  const columns = [
    {
      title: "Room Number",
      dataIndex: "roomNumber",
      key: "roomNumber",
    },
    {
      title: "Task ID",
      dataIndex: "taskId",
      key: "taskId",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <a onClick={() => save(record.key)}>{text}</a>
        ) : (
          <a onClick={() => edit(record)}>{text}</a>
        );
      },
    },

    {
      title: "Task Name",
      dataIndex: "taskName",
      key: "taskName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      editable: true,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      editable: true,
      render: (priority) => <PriorityTag priority={priority} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      editable: true,
    },
    {
      title: "No. of Guests",
      dataIndex: "numberOfGuests",
      key: "numberOfGuests",
      editable: true,
    },
    {
      title: "Room Status",
      dataIndex: "roomStatus",
      key: "roomStatus",
      editable: true,
    },
    {
      title: "Check Out Time",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a disabled={editingKey !== ""} onClick={() => edit(record)}>
              Edit
            </a>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => {
                const deleteUrl = `http://ec2-54-211-23-206.compute-1.amazonaws.com:8081/task/delete?roomNumber=${
                  record.roomNumber
                }&taskName=${encodeURIComponent(record.taskName)}`;
                fetch(deleteUrl, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (response.ok) {
                      const newData = data.filter(
                        (item) => item.key !== record.key
                      );
                      setData(newData);
                      message.success("Delete successful");
                    } else {
                      message.error("Delete failed");
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                    message.error("Delete failed");
                  });
              }}
            >
              <a style={{ marginLeft: 8 }}>Delete</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "priority" || col.dataIndex === "status"
            ? "select"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleFilterAll = () => {
    setFilters({
      roomNumber: null,
      status: null,
      priority: null,
    });
  };

  return (
    <div className="house-keeping-container">
      <div className="filter-container">
        <Row gutter={16} justify="end">
          <Col span={8}>
            <Input
              placeholder="Filter by Room Number"
              onChange={(e) =>
                setFilters({ ...filters, roomNumber: e.target.value })
              }
            />
          </Col>
          <Col span={8}>
            <Select
              allowClear
              placeholder="Filter by Status"
              style={{ width: "100%" }}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <Option value="Pending">Pending</Option>
              <Option value="Work in Progress">Work in Progress</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Select
              allowClear
              placeholder="Filter by Priority"
              style={{ width: "100%" }}
              onChange={(value) => setFilters({ ...filters, priority: value })}
            >
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Col>
        </Row>
        <Button onClick={handleFilterAll}>All</Button>
      </div>
      <Button
        type="primary"
        onClick={() => showDrawer(null)}
        style={{ marginBottom: 16, float: "right" }}
      >
        Add Task
      </Button>
      <Form form={form} component={false}>
        <Table
          key={data.length}
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={applyFilters(data, filters)}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 5 }}
        />
      </Form>
      <Drawer
        title={currentRecord ? "Edit Task" : "Add New Task"}
        width={300}
        onClose={onClose}
        visible={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            {" "}
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
          initialValues={
            currentRecord || { status: "Pending", priority: "Medium" }
          }
          form={form}
        >
          <Form.Item
            name="roomNumber"
            label="Room Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="taskId" label="Task ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="taskName"
            label="Task Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
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
    </div>
  );
}

export default HouseKeeping;
