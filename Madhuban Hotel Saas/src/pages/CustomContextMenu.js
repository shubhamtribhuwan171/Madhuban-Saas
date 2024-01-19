import React from "react";
import { ContextMenu, MenuItem } from "right-click-menu";

const CustomContextMenu = ({ onTaskClick, onBookingClick, xPos, yPos }) => {
  return (
    <ContextMenu xPos={xPos} yPos={yPos}>
      <MenuItem onClick={onTaskClick}>Create Task</MenuItem>
      <MenuItem onClick={onBookingClick}>Create Booking</MenuItem>
    </ContextMenu>
  );
};

export default CustomContextMenu;
