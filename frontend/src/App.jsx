import React from "react";
import { Table } from "antd";

import "./App.css";

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
    render: () => (
      <span>
        <a style={{ marginRight: 16 }}>Edit</a>
        <a>Delete</a>
      </span>
    ),
  },
];

function App() {
  return (
    <>
      <h1 className="w-full shadow-md bg-white mb-4 p-2 rounded-md flex justify-center text-xl font-bold">
        Movie List
      </h1>
      <Table columns={colomns} dataSource={[]} />
    </>
  );
}

export default App;
