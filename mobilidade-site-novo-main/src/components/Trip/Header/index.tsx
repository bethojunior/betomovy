import React, { useEffect, useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { FaBars, FaCar, FaBox, FaShareAlt } from "react-icons/fa";
import { PiReceiptFill } from "react-icons/pi";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useStorage } from "../../../utils/Storage";
import { useAuthStore } from "../../../store/authStore";
import Menu from "../../DropDown";
import { getPathImageDefault } from "../../../config/configApp";
import { Container } from "./styles";

export const Header = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [profileImage, setProfileImage] = useState(getPathImageDefault());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { getItem, removeItem } = useStorage();
  const { setAuthenticated } = useAuthStore();

  useEffect(() => {
    const user = getItem("user");
    if (!user) return;
    const userParse = JSON.parse(user);
    setProfileImage(userParse.profileImageLink || "");
  }, []);

  const logout = () => {
    setAuthenticated(false);
    removeItem("user");
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { icon: <FaCar />, text: "Viagem" },
    { icon: <FaBox />, text: "Item" },
    { icon: <PiReceiptFill />, text: "Minhas Viagens" },
    { icon: <IoMdLogOut />, text: "Sair", action: logout },
  ];

  const menuList = [
    {
      title: "Sair",
      action: logout,
      icon: <IoMdLogOut fontSize={16} />,
    },
  ];

  if (isMobile) {
    // Layout para telas menores que 600px
    return (
      <Container>
        <div className="header-container">
          <IconButton className="menu-button" onClick={toggleDrawer(true)}>
            <FaBars />
          </IconButton>
          <img
            className="profile-avatar"
            src={getPathImageDefault()}
            alt="Perfil"
            width={65}
            height={65}
          />
        </div>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={item.action || toggleDrawer(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Container>
    );
  }

  // Layout para telas maiores que 600px
  return (
    <Container>
      <div className="header-container">
        <div className="logo-container">
          <img
            className="logo"
            width={65}
            height={65}
            src={getPathImageDefault()}
            alt="logo"
          />
        </div>
        <div className="menu-container">
          <div className="first-section">
            <div className="item-container pointer align-container">
              <FaCar fontSize={18} />
              <span className="menu-item-label">Viagem</span>
            </div>
            <div className="item-container pointer align-container">
              <FaBox />
              <span className="menu-item-label">Item</span>
            </div>
          </div>
          <div className="second-container">
            <div className="align-container item-container pointer">
              <FaShareAlt className="share-icon" />
            </div>
            <div className="align-container item-container pointer">
              <PiReceiptFill fontSize={25} className="my-trips-icon" />
              <span>Minhas viagens</span>
            </div>
            <Menu
              button={
                <div className="align-container pointer">
                  <img
                    className="perfil-picture"
                    width={50}
                    height={50}
                    src={profileImage}
                    alt={`perfil`}
                  />
                  <MdOutlineKeyboardArrowDown fontSize={20} />
                </div>
              }
              menuList={menuList}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
