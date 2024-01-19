import React from "react";
import { Layout, Input } from "antd";
import "./Navbar.css";

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
  return (
    <Header className="navbar">
      {" "}
      <div className="logo"></div>
      <Search
        className="search-bar"
        placeholder="Search..."
        onSearch={(value) => console.log(value)}
      />
    </Header>
  );
};

export default Navbar;
