import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, Download, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { expenseApi } from '../api/expenseApi';
import { vehicleApi } from '../api/vehicleApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Expense } from '../types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';

export const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseApi.getAll();
      if (response.success) {
        // Fetch vehicle numbers for each expense
        const expensesWithVehicleNo = await Promise.all(
          response.data.map(async (expense: any) => {
            try {
              const vehicleResponse = await vehicleApi.getById(expense.vehicleId);
              if (vehicleResponse.success) {
                return {
                  ...expense,
                  id: expense._id || expense.id,
                  vehicleNo: vehicleResponse.data.vehicleNo,
                };
              }
              return { ...expense, id: expense._id || expense.id, vehicleNo: 'Unknown' };
            } catch {
              return { ...expense, id: expense._id || expense.id, vehicleNo: 'Unknown' };
            }
          })
        );
        setExpenses(expensesWithVehicleNo);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenses from API
  useEffect(() => {
    loadExpenses();
  }, []);

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setShowAddModal(true);
  };

  const handleDeleteClick = (expenseId: string) => {
    setDeleteExpenseId(expenseId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteExpenseId) return;

    try {
      const result = await expenseApi.delete(deleteExpenseId);
      if (result.success) {
        toast.success('Expense deleted successfully!');
        setExpenses(expenses.filter(e => (e.id || e._id) !== deleteExpenseId));
      } else {
        throw new Error(result.message || 'Failed to delete expense');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete expense');
    } finally {
      setDeleteExpenseId(null);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-1">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage all expenses</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2" size={20} />
            Export
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-cyan-500 dark:to-purple-600 text-white shadow-lg"
          >
            <Plus className="mr-2" size={20} />
            Add Expense
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-cyan-500 dark:to-purple-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <p className="mb-2">Total Expenses</p>
        <h2 className="text-white">₹{totalExpenses.toLocaleString()}</h2>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by vehicle number or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2" size={16} />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Fuel">Fuel</SelectItem>
            <SelectItem value="Spare Parts">Spare Parts</SelectItem>
            <SelectItem value="Employee Salary">Employee Salary</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Insurance">Insurance</SelectItem>
            <SelectItem value="Others">Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>KM Reading</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Loading expenses...
                </TableCell>
              </TableRow>
            ) : filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No expenses found
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense, index) => (
                <motion.tr
                  key={expense.id || expense._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className="text-purple-600 dark:text-cyan-400">{expense.vehicleNo}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-red-600 dark:text-red-400">
                    ₹{expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{expense.supplier || '-'}</TableCell>
                  <TableCell>{expense.kmReading || '-'}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {expense.notes || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(expense.id || expense._id || '')}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      <AddExpenseModal 
        open={showAddModal} 
        expense={editingExpense}
        onClose={() => {
          setShowAddModal(false);
          setEditingExpense(null);
          loadExpenses();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteExpenseId} onOpenChange={() => setDeleteExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
