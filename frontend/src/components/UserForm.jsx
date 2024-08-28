import React from "react";
import { Modal, Input, Form } from "antd";

const UserForm = ({
  visible,
  onCancel,
  onOk,
  form,
  title,
  okText,
  onFinish,
}) => {
  return (
    <Modal
      title={title}
      okText={okText}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Book Title"
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
          name="director"
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
