import React, { useEffect, useState } from "react";
import { Table, Button, Form, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UserForm from "./components/userForm";

import "./App.css";

function App() {
  const [addMovie, setAddMovie] = useState(false);
  const [editMovie, setEditMovie] = useState(false);
  const [movieData, setMovieData] = useState([]);
  const [edittingMovie, setEdittingMovie] = useState([]);
  const [form] = Form.useForm();

  const BASE_URL = "http://localhost:9091";

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
      dataIndex: "directorName",
      key: "directorName",
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

  useEffect(() => async () => {
    try {
      const response = await fetch(`${BASE_URL}/movies`);
      const data = await response.json();
      setMovieData(data);
    } catch (error) {
      console.log(error);
    }
  });

  const handleAddMovie = async (values) => {
    try {
      const data = {
        ...values,
        year: parseInt(values.year, 10),
      };

      const response = await fetch(`${BASE_URL}/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add movie");
      }
      message.success("Movie added successfully");
      setAddMovie(false);
    } catch (error) {
      console.log("Failed to add movie", error);
      message.error("Failed to add movie");
    }
  };

  const handleUpdateMovie = async (values) => {
    try {
      const data = {
        ...values,
        year: parseInt(values.year, 10),
      };

      const response = await fetch(`${BASE_URL}/movies/${edittingMovie.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update movie");
      }
      message.success("Movie updated successfully");
      setEditMovie(false);
    } catch (error) {
      console.log("Failed to update movie", error);
      message.error("Failed to update movie");
    }
  };

  const onAddMovie = () => {
    setAddMovie(true);
    form.resetFields();
  };

  const onDeleteUser = async (record) => {
    try {
      const response = await fetch(`${BASE_URL}/movies/${record.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok){
        throw new Error("Failed to delete movie");
      }

      message.success("Movie deleted successfully");
    } catch (error) {
      console.log("Failed to delete movie", error);
      message.error("Failed to delete movie");
    }
  };

  const onUpdateUser = (record) => {
    setEditMovie(true);
    setEdittingMovie(record);
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
      <Table columns={colomns} dataSource={movieData} rowKey="id" />
      <UserForm
        open={addMovie}
        onCancel={() => setAddMovie(false)}
        onOk={form.submit}
        form={form}
        title="Add a new movie"
        okText="Add"
        onFinish={handleAddMovie}
      />
      <UserForm
        open={editMovie}
        onCancel={() => setEditMovie(false)}
        onOk={form.submit}
        form={form}
        title="Edit Movie Details"
        okText="Update"
        onFinish={handleUpdateMovie}
      />
    </>
  );
}

export default App;
