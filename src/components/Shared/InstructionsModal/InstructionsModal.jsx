import React, { createContext, useState, useEffect } from "react";
import "./InstructionsModal.css";
import { Button, Modal, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

// const LocalizedModal = () => {
//   const [open, setOpen] = useState(false);
//   const showModal = () => {
//     setOpen(true);
//   };
//   const hideModal = () => {
//     setOpen(false);
//   };
//   return (
//     <>
//       <Button type="primary" onClick={showModal}>
//         Modal
//       </Button>
//       <Modal
//         title="Modal"
//         open={open}
//         onOk={hideModal}
//         onCancel={hideModal}
//         okText="确认"
//         cancelText="取消"
//       >
//         <ul>
//             <li> Please follow the intructions to try our demo: </li>
//             <li> If you have an external key device(ex. UbiKey) connect it.  </li>
//             <li>                    OR  </li>
//             <li> 1. If you don't it then cancel the key setup and select "A different device" in pop-up </li>
//             <li> 2. Scan the QR code with your phone and allow Chrome to find and connect with your device. </li>
//             <li> 3. Give your fingerprint and voila! Your wallet is ready to use. </li>
//             <li> 4. To execute a transaction, approve transactions on your phone with just a tap. </li>
//         </ul>
//       </Modal>
//     </>
//   );
// };

const InstructionsModal = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const [open, setOpen] = useState(false);

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

  const hideModal = () => {
    setOpen(false);
  };
  const instructions = [
    "If a pop-up appears asking for security key setup, click on 'cancel'. Then continue with step-2.",
    "You will also see a pop-up for authentication, select 'A different device' in the pop-up.",
    "Scan the QR code with your phone and allow the browser to find and connect with your device.",
    "Give your fingerprint/face-id for authentication, and voila! Your wallet is ready to use.",
    "To execute a transaction, Complete the authentication process with your phone, and you are done!"
  ];

  return (
    <>
      <Space>
      <>
      {/* <Button type="primary" onClick={showModal}>
        Modal
      </Button> */}
      <Modal
      className="instructions"
        title={<h2 style={{ fontWeight: 'bold' }}>{"Read this instructions Carefully"}</h2>}
        open={props.instructionModalStatus}
        onOk={() => props.instructionModalFun(false)}
        onCancel={() => props.cancelCreation()}
        style={{ textAlign: "center", width: (30 * width / 100), minWidth: (30 * width / 100) }}
        okText="Continue"
      >
        <div className="instruction-container">
        <div className="instruction-item">
          {<div className="instruction-text">{"If you have an external key device(ex. UbiKey) connect it."}</div>}
        </div>
          <div style={{ textAlign: 'center' }}>{"OR"}</div>
      {instructions.map((instruction, index) => (
        <div key={index} className="instruction-item" style={{ textAlign: 'left' }}>
          <div className="instruction-index">{index + 1}.</div>
          <div className="instruction-text">{instruction}</div>
        </div>
      ))}
    </div>
      </Modal>
      <Modal
    title="Instructions"
    footer={null}
  >
    <div className="instruction-container">
      {instructions.map((instruction, index) => (
        <div key={index} className="instruction-item">
          <div className="instruction-index">{index + 1}.</div>
          <div className="instruction-text">{instruction}</div>
        </div>
      ))}
    </div>
  </Modal>
    </>
      </Space>
    </>
  );
};

export default InstructionsModal;
