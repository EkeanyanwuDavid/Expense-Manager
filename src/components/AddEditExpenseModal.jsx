import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

const AddEditExpenseModal = ({ closeModal, exisitingExpense, setExpense }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("expense");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exisitingExpense) {
      setName(exisitingExpense.name);
      setAmount(exisitingExpense.amount);
      setCategory(exisitingExpense.category);
      setDate(exisitingExpense.date);
      setType(exisitingExpense.type);
    }
  }, [exisitingExpense]);

  const handleSave = (e) => {
    e.preventDefault();

    if (!name || !amount || !category || !date) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

      if (exisitingExpense) {
        const updated = storedExpenses.map((exp) =>
          exp.id === exisitingExpense.id
            ? { ...exp, name, amount, category, date, type }
            : exp
        );
        localStorage.setItem("expenses", JSON.stringify(updated));
        setExpense(updated);
        window.dispatchEvent(new Event("expensesUpdated"));
        toast.success("Expense updated");
      } else {
        const newExpense = {
          id: Date.now().toString(),
          name,
          amount,
          category,
          date,
          type,
        };
        const updated = [...storedExpenses, newExpense];
        localStorage.setItem("expenses", JSON.stringify(updated));
        setExpense(updated);
        window.dispatchEvent(new Event("expensesUpdated"));
        toast.success("Expense added");
      }

      setLoading(false);
      closeModal();
    }, 1000);
  };
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-indigo-200 via-blue-200 to-violet-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-8 max-w-md mx-auto mt-16 bg-gradient-to-r from-indigo-50 via-sky-50 to-rose-50 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-2 text-blue-700">
          {exisitingExpense ? "Edit Expense" : "Add Expense"}
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="w-full  p-3 rounded-lg shadow-sm  bg-gradient-to-r transition from-gray-400 to-gray-600 hover:from-gray-500 hover:to-bg-gray-500 text-white flex items-center justify-center "
              onClick={closeModal}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full  p-3 rounded-lg shadow-sm transition bg-gradient-to-r from-green-600 to-emerald-500 hover:from-emerald-700 hover:to-green-600 text-white flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <ClipLoader color="#fff" size={18} /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditExpenseModal;
