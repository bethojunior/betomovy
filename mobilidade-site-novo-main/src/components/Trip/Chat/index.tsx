import { Modal } from "@mui/material";
import { ChatProps } from "./types";
import { Container } from "./styles";
import { IoClose, IoSend } from "react-icons/io5";
import { useEffect, useRef } from "react";
import api from "../../../api/apiAxios";
import { useStorage } from "../../../utils/Storage";

export const Chat = ({ open, close, trip, messages }: ChatProps) => {
  const { getItem } = useStorage();
  const scroll = useRef<any>(null);
  const user = getItem("user");
  const userParse = user ? JSON.parse(user) : null;

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const message = e.target.message.value;
    const isVal = validate(message);
    if (!isVal) return;
    e.target.message.value = "";
    const { data } = await api.post("ChatTrip/SendMessage", {
      stdObject: [
        {
          tripReference: trip.tripReference,
          message,
          userId: userParse?.idUser,
        },
      ],
    });
    if (!data.status) return;
  };

  const validate = (text: string) => {
    if (!text || text.length == 0) return false;
    return true;
  };

  const executeScroll = () => {
    scroll.current.scrollIntoView();
  };

  useEffect(() => {
    const intervalTime = setInterval(() => {
      if (scroll.current) {
        executeScroll();
      }
    }, 500);

    return () => clearInterval(intervalTime);
  }, [open]);

  useEffect(() => {
    if (scroll.current) {
      executeScroll();
    }
  }, [messages]);

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container>
        <div className="chat-container">
          <div className="header-container">
            <div className="driver-data">
              <img
                src={`${window.env.REACT_APP_BUCKET_URL}driver/profile/${trip?.driver?.profileImage}`}
                alt="photo-driver"
                className="img"
              />
              <span>{trip?.driver.name}</span>
            </div>
            <IoClose fontSize={20} onClick={close} className="pointer" />
          </div>
          <div className="body-container">
            <div className="messages-container">
              {messages.map((item, index) =>
                item.userId === Number(userParse?.idUser) ? (
                  <div key={index} className="bubble right space">
                    {item.message}
                  </div>
                ) : (
                  <div key={index} className="bubble left space">
                    {item.message}
                  </div>
                )
              )}
              <div ref={scroll} />
            </div>
            <form onSubmit={(e) => sendMessage(e)}>
              <div className="input-container">
                <input name="message" className="text-send" type="text" />
                <button type="submit" className="send-button">
                  <IoSend fontSize={20} className="pointer" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Modal>
  );
};
