import React, { useEffect } from "react";

import { Button, Image, Input, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import EmployeeApis from "../modules/employee/apis/EmployeeApis";
import { EmployeeModel } from "../modules/employee/models";
import { EmployeeType, Gender } from "../constants/enum";
import { CreateModal, EditModal } from "../modules/employee/components";

type DataType = {
  key: number;
} & EmployeeModel;

const { Search } = Input;

export const Employee: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      width: "1rem",
      render: (_, record: DataType) => {
        switch (Gender[record.Gender.toString() as keyof typeof Gender]) {
          case Gender.Male:
            return (
              <Image
                width={30}
                src="https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg"
              />
            );
          case Gender.Female:
            return (
              <Image
                width={30}
                src="https://static.vecteezy.com/system/resources/previews/002/596/484/original/default-avatar-photo-placeholder-profile-image-female-vector.jpg"
              />
            );
          default:
            return (
              <Image
                width={30}
                src="https://static.vecteezy.com/system/resources/previews/005/129/844/original/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
              />
            );
        }
      },
    },
    {
      title: "Staff Code",
      dataIndex: "EmployeeCode",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeCode.localeCompare(b.EmployeeCode),
    },
    {
      title: "Full Name",
      dataIndex: "EmployeeName",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeName.localeCompare(b.EmployeeName),
    },
    {
      title: "Job Title",
      dataIndex: "JobTitle",
      render: (value: string) => value || " Not Available",
      sortDirections: ["descend", "ascend"],
      sorter: {
        compare: () => 0,
      },
    },
    {
      title: "Employee Type",
      dataIndex: "EmployeeType",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.EmployeeType.toString().localeCompare(b.EmployeeType.toString()),
      render: (value: string) => {
        switch (EmployeeType[value as keyof typeof EmployeeType]) {
          case EmployeeType.FullTime:
            return "Full-time";
          case EmployeeType.PartTime:
            return "Part-time";
          default:
            return "Not Available";
        }
      },
    },
    {
      title: "Company Join Date",
      dataIndex: "CreatedDate",
      render: (value: string) => new Date(value).toLocaleString(),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => new Date(a.CreatedDate).getTime() - new Date(b.CreatedDate).getTime(),
    },
    {
      width: "2rem",
      render: (_, record: DataType) => (
        <Space>
          <EditModal
            data={record}
            successCallback={fetchLevels}
          />
          <Button
            type="primary"
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const [limit, setLimit] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [positions, setPositions] = React.useState<DataType[]>([]);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = () => {
    setLoading(true);
    EmployeeApis.getAll()
      .then((res) => {
        setPositions(res.value.map((item) => ({ ...item, key: item.Id })));
        setTotal(res.value.length);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  };

  const successCallback = () => {
    setPage(1);
    fetchLevels();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Search
          placeholder="Search by staff code, full name"
          style={{
            width: 400,
          }}
          allowClear
        />

        <CreateModal successCallback={successCallback} />
      </div>
      <Table
        columns={columns}
        dataSource={positions}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize || 5);
          },
        }}
      />
    </>
  );
};
