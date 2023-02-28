import "./SuccessModal.css";
import React from "react";
import { Modal, Button } from "antd";

const SuccessModal = (props) => {
  const handleCancel = () => {
    props.setModalStatus(false);
  };

  return (
    <div>
      <Modal
        open={props.isModalOpen}
        title="Greetings 🙏🏻"
        footer={false}
        onCancel={handleCancel}
        style={{ textAlign: "center" }}
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
