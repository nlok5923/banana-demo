import "./SuccessModal.css";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";

const SuccessModal = (props) => {
  const handleCancel = () => {
    props.setModalStatus(false);
  };

  const [visible, setVisible] = useState(false);

  const getWindowDimensions = () => {
     const { innerWidth: width, innerHeight: height } = window
     return { width, height }
  }

  const useWindowDimensions = () => {
     const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

     useEffect(() => {
        const handleResize = () => setWindowDimensions(getWindowDimensions())

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)

      }, [])

      return windowDimensions
  }

  const { width } = useWindowDimensions();

  return (
    <div>
      <Modal
        open={props.isModalOpen}
        title="Greetings 🙏🏻"
        footer={false}
        onCancel={handleCancel}
        style={{ textAlign: "center", width: (30 * width / 100), minWidth: (30 * width / 100) }}
      >
        <h2>
          Thank you for using Banana Wallet! ✨
        </h2>
        <p> Would love to get your feedback on wallet experience </p>
        <a
          href={"https://forms.gle/Bw5eg16yKGxeagjG6"}
          rel="noreferrer"
          target={"_blank"}
          className="lp-footer-links-li"
        >
            here
        </a>
      </Modal>
    </div>
  );
};

export default SuccessModal;
