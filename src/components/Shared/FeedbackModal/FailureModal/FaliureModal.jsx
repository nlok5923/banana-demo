import "./FaliureModal.css";
import React from "react";
import { Modal, Button } from "antd";

const FaliureModal = (props) => {

  const handleCancel = () => {
    props.setModalStatus(false);
  };

  return (
    <div>
      <Modal
        open={props.isModalOpen}
        title="Greetings!🙏🏻"
        footer={false}
        onCancel={handleCancel}
        style={{ textAlign: "center" }}
      >
        <h2>
         Oops! Something broke 🐞
        </h2>
        <p> Please report the bug! </p>
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

export default FaliureModal;
