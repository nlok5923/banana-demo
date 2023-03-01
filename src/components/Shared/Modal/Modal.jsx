import React, { useState } from "react";
import "./Modal.css";
import { Modal, Button } from "antd";

const WalletModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [walletName, setWalletName] = useState('');

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
        title="Provide Unique Wallet Name"
        onOk={handleOk}
        footer={false}
        onCancel={handleCancel}
        style={{ textAlign:'center' }}
      >
        <input className="wallet-identifier-input" placeholder="Wallet unique identifier" onChange={(e) => setWalletName(e.target.value)} /> <br />
        <button className="init-wallet-modal-btn" onClick={() => props.createWallet(walletName)} >Create Wallet</button>
        <p className="disclaimer"> *Please note: When creating/connecting in, you will have the option to authenticate using your biometric data or password. Dont worry! we do not store or use your biometric data or password for any purpose.</p>
      </Modal>
    </div>
  );
};

export default WalletModal;
