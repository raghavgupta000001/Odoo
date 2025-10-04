import Expense from "../models/expense.model.js";
import { User } from "../models/user.model.js";
export const submitExpense = async (req, res) => {
  try {
    const { amount, currency, category, description, date } = req.body;

    if (!amount || !currency || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = await Expense.create({
      employee: req.user._id,
      amount,
      currency,
      category,
      description,
      date: date || new Date(),
    });

    res.status(201).json({ message: "Expense submitted successfully", expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Employee views their own expenses
export const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ employee: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};