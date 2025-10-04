import { useEffect, useState } from "react";
import axios from "axios";

function Approvals() {
  const [pending, setPending] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const token = localStorage.getItem("token");

  const fetchPending = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/approval/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [refresh]);

  const handleAction = async (id, status) => {
    const comments = prompt(`Enter comments for ${status}:`) || "";
    try {
      await axios.put(
        `http://localhost:5000/api/approval/${id}/status`,
        { status, comments },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Expense ${status.toLowerCase()} successfully`);
      setRefresh(!refresh);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating expense");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Expense Approvals</h1>
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        {pending.length === 0 ? (
          <p className="text-center text-gray-600 py-6">No pending expenses to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-green-600 text-white">
                <tr>
                  {["Employee", "Category", "Amount", "Description", "Status", "Actions"].map((col) => (
                    <th key={col} className="py-3 px-4 text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-100 border-b">
                    <td className="py-2 px-4">{e.employee?.name}</td>
                    <td className="py-2 px-4">{e.category}</td>
                    <td className="py-2 px-4">{e.amount} {e.currency}</td>
                    <td className="py-2 px-4">{e.description}</td>
                    <td className="py-2 px-4">{e.status}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => handleAction(e._id, "Approved")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(e._id, "Rejected")}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Approvals;
