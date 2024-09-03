import React from "react";
import { Modal, Input, Form } from "antd";

const UserForm = ({ open, onCancel, onOk, form, title, okText, onFinish }) => {
  return (
    <Modal
      title={title}
      okText={okText}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Movie Title"
          rules={[{ required: true, message: "Please enter the Movie title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="year"
          label="Year"
          rules={[{ required: true, message: "Please enter the movie year" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="directorName"
          label="Director"
          rules={[
            { required: true, message: "Please enter the director name" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
