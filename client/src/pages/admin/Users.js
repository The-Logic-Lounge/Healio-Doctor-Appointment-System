import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);

  // getUsers
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span style={{ fontWeight: 600, color: "var(--theme-text-primary)" }}>
          {record.name}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => (
        <span
          className={`appointment-status ${record.isAdmin ? "approved" : record.isDoctor ? "pending" : "completed"}`}
        >
          {record.isAdmin ? "Admin" : record.isDoctor ? "Doctor" : "Patient"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: () => <span style={{ color: "var(--theme-teal)", fontWeight: 600 }}>Active</span>,
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-3">Registered Users Directory</h1>
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </Layout>
  );
};

export default Users;