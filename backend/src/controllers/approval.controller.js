import Expense from "../models/expense.model.js";
import {User} from "../models/user.model.js";
// ✅ Get all pending expenses for a manager/admin
export const getPendingExpenses = async (req, res) => {
  try {
    // Managers only see expenses from their team (simplified for now)
    const filter =
      req.user.role === "Admin" ? {} : { status: "Pending" };

    const expenses = await Expense.find(filter)
      .populate("employee", "name email role")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Approve or Reject expense
export const updateExpenseStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.status !== "Pending")
      return res.status(400).json({ message: "Expense already processed" });

    if (status !== "Approved" && status !== "Rejected")
      return res.status(400).json({ message: "Invalid status" });

    expense.status = status;
    expense.comments = comments || "";
    await expense.save();

    res.json({ message: `Expense ${status.toLowerCase()} successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
