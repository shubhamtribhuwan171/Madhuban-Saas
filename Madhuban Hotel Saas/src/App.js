import React from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer.js";
import Frontdesk from "./pages/Frontdesk";
import Bookings from "./pages/Bookings";
import Rooms from "./pages/Rooms";
import Card from "./pages/Card";
import RoomTypes from "./pages/RoomTypes";
import FilterBar from "./pages/FilterBar";
import { BookingProvider } from "./pages/BookingContext";
import ViewBookings from "./pages/ViewBookings";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingDetails from "./pages/BookingDetails";
import HouseKeeping from "./pages/HouseKeeping";
import Payment from "./pages/Payment";
import Invoice from "./pages/Invoice";
import "./App.css";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <BookingProvider>
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar />
          <Layout>
            <Navbar />
            <Content style={{ margin: "16px" }}>
              <Switch>
                <Route path="/frontdesk" component={Frontdesk} />
                <Route path="/bookings" component={Bookings} />
                <Route path="/bookingDetails" component={BookingDetails} />
                <Route
                  path="/bookingConfirmation"
                  component={BookingConfirmation}
                />
                <Route path="/payments" component={Payment} />
                <Route path="/rooms" component={Rooms} />
                <Route path="/room-types" component={RoomTypes} />
                <Route path="/view-bookings" component={ViewBookings} />
                <Route path="/HouseKeeping" component={HouseKeeping} />
                <Route path="/invoice" component={Invoice} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </BookingProvider>
    </Router>
  );
}

export default App;
