// import React from "react";
// import { Layout, Menu } from "antd";
// import {
//   HomeOutlined,
//   CalendarOutlined,
//   ApartmentOutlined,
//   AppstoreAddOutlined,
// } from "@ant-design/icons";
// import { Link } from "react-router-dom";
// import "./Sidebar.css";

// const { Sider } = Layout;

// const Sidebar = () => {
//   return (
//     <Sider width={200} theme="dark" className="sider">
//       <div className="product-name">Madhuban Hotel</div>{" "}
//       <Menu
//         mode="vertical"
//         theme="dark"
//         defaultSelectedKeys={["1"]}
//         className="menu"
//       >
//         <Menu.Item key="1" icon={<HomeOutlined />} className="menu-item">
//           <Link to="/frontdesk">Frontdesk</Link>
//         </Menu.Item>
//         <Menu.Item key="2" icon={<CalendarOutlined />} className="menu-item">
//           <Link to="/bookings">Bookings</Link>
//         </Menu.Item>
//         <Menu.Item key="3" icon={<ApartmentOutlined />} className="menu-item">
//           <Link to="/rooms">Rooms</Link>
//         </Menu.Item>
//         <Menu.Item key="4" icon={<ApartmentOutlined />} className="menu-item">
//           <Link to="/view-bookings">View Bookings</Link>
//         </Menu.Item>
//       </Menu>
//     </Sider>
//   );
// };

// export default Sidebar;

import React from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider width={200} theme="dark" className="sider">
      <div className="product-name">Madhuban Hotel</div>{" "}
      <Menu
        mode="vertical"
        theme="dark"
        defaultSelectedKeys={["1"]}
        className="menu"
      >
        <Menu.Item key="1" icon={<HomeOutlined />} className="menu-item">
          <Link to="/frontdesk">Frontdesk</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<CalendarOutlined />} className="menu-item">
          <Link to="/bookings">Bookings</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<ApartmentOutlined />} className="menu-item">
          <Link to="/rooms">Rooms</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<AppstoreAddOutlined />} className="menu-item">
          <Link to="/HouseKeeping">HouseKeeping</Link>{" "}
        </Menu.Item>
        <Menu.Item key="5" icon={<ApartmentOutlined />} className="menu-item">
          <Link to="/view-bookings">View Bookings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
