import React, { useEffect, useState } from "react";
import { fetchLeaders, leaderColumns, LeaderButtons } from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";

const LeaderList = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLeaders = async () => {
      setLoading(true);
      const leadersData = await fetchLeaders();
      setLeaders(leadersData);
      setLoading(false);
    };

    loadLeaders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">List of Leaders</h2>
      <DataTable columns={leaderColumns} data={leaders} pagination />
    </div>
  );
};

export default LeaderList;
