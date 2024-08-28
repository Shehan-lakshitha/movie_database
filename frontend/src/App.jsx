import React, { useState } from "react";
import { Table, Button, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UserForm from "./components/userForm";

import "./App.css";

function App() {
  const [addMovie, setAddMovie] = useState(false);
  const [editMovie, setEditMovie] = useState(false);
  const [form] = Form.useForm();

  const colomns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Director",
      dataIndex: "director",
      key: "director",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <EditOutlined
            onClick={() => onUpdateUser(record)}
            style={{ cursor: "pointer" }}
          />
          <DeleteOutlined
            onClick={() => onDeleteUser(record)}
            style={{ color: "red", marginLeft: 24, cursor: "pointer" }}
          />
        </>
      ),
    },
  ];

  const data = [
    {
      title: "The Shawshank Redemption",
      year: 1994,
      director: "Frank Darabont",
    },
  ];

  const onAddMovie = () => {
    setAddMovie(true);
    form.resetFields();
  };

  const onDeleteUser = (record) => {};

  const onUpdateUser = (record) => {
    setEditMovie(true);
    form.setFieldsValue(record);
  };

  return (
    <>
      <h1 className="w-full shadow-md bg-white mb-4 p-2 rounded-md flex justify-center text-xl font-bold">
        Movie List
      </h1>
      <Button onClick={onAddMovie} type="primary" className="mb-4">
        Add Movie
      </Button>
      <Table columns={colomns} dataSource={data} />
      <UserForm
        visible={addMovie}
        onCancel={() => setAddMovie(false)}
        onOk={() => setAddMovie(false)}
        form={form}
        title="Add Movie"
        okText="Add"
        onFinish={() => console.log("done")}
      />
      <UserForm
        visible={editMovie}
        onCancel={() => setEditMovie(false)}
        onOk={() => setEditMovie(false)}
        form={form}
        title="Edit Movie Details"
        okText="Update"
        onFinish={() => console.log("Update")}
      />
    </>
  );
}

export default App;
