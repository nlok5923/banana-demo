import React, { createContext } from "react";
import "./InstructionsModal.css";
import { Button, Modal, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const LocalizedModal = () => {
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Modal
      </Button>
      <Modal
        title="Modal"
        open={open}
        onOk={hideModal}
        onCancel={hideModal}
        okText="确认"
        cancelText="取消"
      >
        <ul>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
        </ul>
      </Modal>
    </>
  );
};

const InstructionsModal = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const [open, setOpen] = useState(false);

  const hideModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Space>
      <>
      {/* <Button type="primary" onClick={showModal}>
        Modal
      </Button> */}
      <Modal
        title="Read this instructions Carefully"
        open={props.instructionModalStatus}
        onOk={() => props.instructionModalFun(false)}
        onCancel={() => props.cancelCreation()}
        okText="Read it"
        cancelText="Cancel"
      >
        <ul>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
            <li> This is instruction regardinf the thing you are trying to do </li>
        </ul>
      </Modal>
    </>
      </Space>
    </>
  );
};

export default InstructionsModal;
