import React from "react";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Legend,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

const Colors = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"];
const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(data);
    setLoading(false);
    if (data.length === 0) {
      toast("No expenses yet");
    } else {
      toast.success("Expenses loaded");
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const data = JSON.parse(localStorage.getItem("expenses")) || [];
      setExpenses(data);
    };
    window.addEventListener("expensesUpdated", handler);
    return () => window.removeEventListener("expensesUpdated", handler);
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const filteredExpenses = expenses.filter((e) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const desc = (e.description || e.name || "").toString().toLowerCase();
    return (
      (e.category && e.category.toLowerCase().includes(term)) ||
      desc.includes(term) ||
      (e.type && e.type.toLowerCase().includes(term)) ||
      (e.date && e.date.toString().toLowerCase().includes(term))
    );
  });

  const totalIncome = filteredExpenses
    .filter((e) => e.type === "income")
    .reduce((a, b) => a + +b.amount, 0);
  const totalExpense = filteredExpenses
    .filter((e) => e.type === "expense")
    .reduce((a, b) => a + +b.amount, 0);

  const categoryTotals = filteredExpenses.reduce((acc, curr) => {
    if (curr.type === "expense") {
      acc[curr.category] = (acc[curr.category] || 0) + +curr.amount;
    }
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([key, value]) => ({
    name: key,
    value,
  }));

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const barData = months.map((m, i) => {
    const monthExpenses = filteredExpenses.filter(
      (e) => new Date(e.date).getMonth() === i
    );
    const income = monthExpenses
      .filter((e) => e.type === "income")
      .reduce((a, b) => a + +b.amount, 0);
    const expense = monthExpenses
      .filter((e) => e.type === "expense")
      .reduce((a, b) => a + +b.amount, 0);

    return { month: m, income, expense };
  });
  if (loading)
    return (
      <p className="text-center mt-20">
        <ClipLoader size={30} />
      </p>
    );
  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-2">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by category, description, type or date"
          className="border rounded px-3 py-2 w-full md:w-1/2 border-gray-400 ring-2 ring-transparent focus:ring-blue-300 outline-none"
        />
        <button
          onClick={() => setSearchTerm("")}
          className="text-sm text-gray-500"
        >
          Clear
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-emerald-400 to-emerald-600 p-6 rounded-xl shadow-lg flex items-center space-x-4 text-white">
          <FaWallet size={28} className="text-white" />
          <div>
            <p className="text-sm font-medium opacity-90">Total Income</p>
            <p className="text-2xl font-bold">${totalIncome}</p>
          </div>
        </div>
        <div className="bg-linear-to-br from-orange-400 to-orange-600 p-6 rounded-xl shadow-lg flex items-center space-x-4 text-white">
          <FaArrowDown size={28} className="text-white" />
          <div>
            <p className="text-sm font-medium opacity-90">Total Expenses</p>
            <p className="text-2xl font-bold">${totalExpense}</p>
          </div>
        </div>
        <div className="bg-linear-to-br from-violet-400 to-violet-600 p-6 rounded-xl shadow-lg flex items-center space-x-4 text-white">
          <FaArrowUp size={28} className="text-white" />
          <div>
            <p className="text-sm font-medium opacity-90">Balance</p>
            <p className="text-2xl font-bold">
              ${totalIncome - totalExpense}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-500">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Expenses by Category</h2>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <ClipLoader size={32} color="#3b82f6" />
            </div>
          ) : pieData.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No expenses yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={isMobile ? 280 : 360}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={isMobile ? 70 : 100}
                  label={!isMobile}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={Colors[i % Colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-white p-6 shadow-lg rounded-xl border-t-4 border-orange-500">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Monthly Income vs Expense</h2>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <ClipLoader size={32} color="#3b82f6" />
            </div>
          ) : filteredExpenses.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No data to show</p>
          ) : (
            <ResponsiveContainer width="100%" height={isMobile ? 320 : 360}>
              <BarChart
                data={barData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: isMobile ? 24 : 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  interval={0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10B981" />
                <Bar dataKey="expense" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
