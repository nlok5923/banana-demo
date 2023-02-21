import React, { useState } from "react";
import "./Modal.css";
import { Modal, Button } from "antd";

const WalletModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    props.setModalStatus(false)
  };

  return (
    <div>
      <Modal
        open={props.isModalOpen}
        title="Provide Unqiue Wallet Name"
        onOk={handleOk}
        footer={false}
        onCancel={handleCancel}
        style={{ textAlign:'center' }}
      >
        <input className="wallet-identifier-input" placeholder="Wallet unique identifier" /> <br />
        <button className="init-wallet-modal-btn">Init Wallet</button>
      </Modal>
    </div>
  );
};

export default WalletModal;
