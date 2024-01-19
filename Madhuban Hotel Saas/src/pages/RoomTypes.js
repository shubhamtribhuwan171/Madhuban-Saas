
import React from "react";
import { Layout, Breadcrumb, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

function RoomTypes() {
  return (
    <Content className="content">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Room Types</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background">
        <Title level={2}>Room Types Page</Title>
      </div>
    </Content>
  );
}

export default RoomTypes;
