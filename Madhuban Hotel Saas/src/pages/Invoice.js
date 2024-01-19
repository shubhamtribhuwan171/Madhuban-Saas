import React, { useRef, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Typography,
  Divider,
  Select,
} from "antd";
import {
  PrinterOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ReactToPrint from "react-to-print";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
const { Title, Paragraph } = Typography;
const { Option } = Select;

const Invoice = () => {
  const [form] = Form.useForm();
  const [invoiceData, setInvoiceData] = useState({
    invoiceId: "",
    date: null,
    name: "",
    email: "",
    address: "",
    items: [],
  });
  const componentRef = useRef();
  const location = useLocation();
  const { customerId } = location.state || {};
  const onValuesChange = (_, allValues) => {
    setInvoiceData(allValues);
  };

  const handleDownloadPdf = async () => {
    const element = componentRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    let pdf = new jsPDF("p", "mm", "a4");
    let width = pdf.internal.pageSize.getWidth();
    let height = (canvas.height * width) / canvas.width;
    pdf.addImage(data, "PNG", 0, 0, width, height);
    pdf.save("invoice.pdf");
  };

  const addItem = (description, rate) => {
    const newItem = {
      description,
      quantity: 1,
      rate,
      amount: rate, // Initialize the amount with the rate
    };

    setInvoiceData((prevData) => ({
      ...prevData,
      items: [...prevData.items, newItem],
    }));
  };

  const removeItem = (index) => {
    setInvoiceData((prevData) => {
      const updatedItems = [...prevData.items];
      updatedItems.splice(index, 1);
      return {
        ...prevData,
        items: updatedItems,
      };
    });
  };

  const calculateTotalAmount = () => {
    const itemsWithAmount = invoiceData.items.map((item) => {
      const quantity = item.quantity || 0;
      const rate = item.rate || 0;
      return {
        ...item,
        amount: quantity * rate,
      };
    });

    return itemsWithAmount.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="Create New Invoice"
            bordered={false}
            style={{ minHeight: "100%" }}
          >
            <Form
              form={form}
              layout="vertical"
              onValuesChange={onValuesChange}
              initialValues={invoiceData}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="invoiceId"
                    label="Invoice ID"
                    rules={[
                      {
                        required: true,
                        message: "Please input the invoice ID!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="date"
                    label="Date"
                    rules={[
                      { required: true, message: "Please input the date!" },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      { required: true, message: "Please input the name!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        type: "email",
                        message: "The input is not a valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please input your address!" },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              {/* Dynamically add item fields here */}
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing item description",
                              },
                            ]}
                          >
                            <Input placeholder="Item Description" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            rules={[
                              { required: true, message: "Missing quantity" },
                            ]}
                          >
                            <InputNumber
                              placeholder="Quantity"
                              min={1}
                              onChange={() => updateItemAmount(name)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "rate"]}
                            rules={[
                              { required: true, message: "Missing rate" },
                            ]}
                          >
                            <InputNumber
                              placeholder="Rate"
                              min={0}
                              onChange={() => updateItemAmount(name)}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item {...restField} name={[name, "amount"]}>
                            <InputNumber
                              placeholder="Amount"
                              disabled
                              value={
                                invoiceData.items[name]?.quantity *
                                invoiceData.items[name]?.rate
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Button type="danger" onClick={() => remove(name)}>
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Item
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
          <Card title="Invoice Preview" bordered={false}>
            <div ref={componentRef} style={{ padding: 20 }}>
              <Title level={3}>Madhuban Hotel</Title>
              <Title level={4}>Invoice #{invoiceData.invoiceId}</Title>
              <Paragraph>
                Date:{" "}
                {invoiceData.date
                  ? invoiceData.date.format("DD/MM/YYYY")
                  : "N/A"}
              </Paragraph>
              <Paragraph>Name: {invoiceData.name}</Paragraph>
              <Paragraph>Email: {invoiceData.email}</Paragraph>
              <Paragraph>Address: {invoiceData.address}</Paragraph>
              <Divider />
              {invoiceData.items.map((item, index) => (
                <div key={index}>
                  <Row>
                    <Col span={8}>{item?.description}</Col>
                    <Col span={8}>
                      {item?.quantity} @ ₹{item?.rate.toFixed(2)}
                    </Col>
                    <Col span={8}>₹{(item?.amount || 0).toFixed(2)}</Col>
                  </Row>
                </div>
              ))}
              <Divider />
              <Row>
                <Col span={16}>Total</Col>
                <Col span={8}>₹{calculateTotalAmount().toFixed(2)}</Col>
              </Row>
              <Paragraph>
                Note: All amounts are in INR. Make the payment within 15 days
                from the issue date of this invoice.
              </Paragraph>
            </div>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <ReactToPrint
                trigger={() => <Button icon={<PrinterOutlined />} />}
                content={() => componentRef.current}
              />
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadPdf}
                style={{ marginLeft: 8 }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Invoice;
