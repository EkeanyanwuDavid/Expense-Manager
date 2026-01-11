import React from "react";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import AddEditExpenseModal from "../components/AddEditExpenseModal";
import toast from "react-hot-toast";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(data);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
    window.dispatchEvent(new Event("expensesUpdated"));
    toast.success("Expense deleted");
  };

  const filteredExpenses = expenses.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
  );

  const categoryTotals = filteredExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + +curr.amount;
    return acc;
  }, {});

  if (loading)
    return (
      <p className="text-center mt-20">
        <ClipLoader size={30} />
      </p>
    );
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-8 shadow-lg">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <button
            className="bg-white text-blue-600 px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-100 transition font-semibold flex items-center space-x-2 shadow-md"
            onClick={() => {
              setModalOpen(true);
              setEditExpense(null);
            }}
          >
            <FaPlus />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6 max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg ring-2 ring-transparent focus:ring-blue-400 outline-none shadow-sm"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-8">
              No category totals yet.
            </p>
          ) : (
            Object.entries(categoryTotals).map(([cat, amt]) => (
              <div
                key={cat}
                className="bg-linear-to-br from-blue-400 to-blue-600 p-4 rounded-lg shadow-md text-white hover:shadow-lg transition"
              >
                <p className="font-semibold text-sm opacity-90">{cat}</p>
                <p className="text-2xl font-bold mt-1">${amt.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-20 bg-white rounded-lg shadow">
            No expenses found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr className="bg-linear-to-r from-blue-600 to-blue-700 text-white">
                  <th className="p-4 text-left font-semibold">Name</th>
                  <th className="p-4 text-left font-semibold">Category</th>
                  <th className="p-4 text-left font-semibold">Amount</th>
                  <th className="p-4 text-left font-semibold">Date</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp, idx) => (
                  <tr
                    key={exp.id}
                    className={`border-b border-gray-200 hover:bg-blue-50 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-4 text-gray-800">{exp.name}</td>
                    <td className="p-4 text-gray-600">{exp.category}</td>
                    <td className="p-4 font-semibold text-blue-600">
                      ${exp.amount}
                    </td>
                    <td className="p-4 text-gray-600">{exp.date}</td>
                    <td className="p-4 flex space-x-3">
                      <button
                        className="text-blue-500 hover:text-blue-700 hover:scale-110 transition"
                        onClick={() => {
                          setEditExpense(exp);
                          setModalOpen(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 cursor-pointer hover:text-red-700 hover:scale-110 transition"
                        onClick={() => handleDelete(exp.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalOpen && (
          <AddEditExpenseModal
            closeModal={() => setModalOpen(false)}
            exisitingExpense={editExpense}
            setExpense={setExpenses}
          />
        )}
      </div>
    </div>
  );
};
export default Expenses;
