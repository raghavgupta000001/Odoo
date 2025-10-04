import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    currency: "INR",
    category: "",
    description: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      window.location.href = "/";
      return;
    }
    setUser(JSON.parse(userData));
  }, [token]);

  const fetchExpenses = async () => {
    if (!token) return;
    
    try {
      const { data } = await axios.get("http://localhost:3000/api/expense/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Basic validation
    if (!form.amount || !form.category || !form.date) {
      setError("Please fill in all required fields (Amount, Category, Date)");
      setLoading(false);
      return;
    }
    
    if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      setError("Please enter a valid amount");
      setLoading(false);
      return;
    }
    
    try {
      await axios.post("http://localhost:3000/api/expense/submit", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ amount: "", currency: "INR", category: "", description: "", date: "" });
      fetchExpenses();
    } catch (err) {
      console.error("Error submitting expense:", err);
      setError(err.response?.data?.message || "Failed to submit expense");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Employee Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Submit Expense</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            name="amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <select
            name="currency"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="INR">INR - Indian Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
          
          <input
            type="text"
            placeholder="Category (e.g., Travel, Meals, Office Supplies)"
            name="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <input
            type="text"
            placeholder="Description (optional)"
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Expense"}
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Expense History</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No expenses yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {["Category", "Amount", "Currency", "Description", "Status", "Date"].map((col) => (
                    <th key={col} className="py-3 px-4 text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-100 border-b">
                    <td className="py-2 px-4">{e.category}</td>
                    <td className="py-2 px-4">{e.amount}</td>
                    <td className="py-2 px-4">{e.currency}</td>
                    <td className="py-2 px-4">{e.description}</td>
                    <td className="py-2 px-4">{e.status}</td>
                    <td className="py-2 px-4">{new Date(e.date).toLocaleDateString()}</td>
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

export default Dashboard;
