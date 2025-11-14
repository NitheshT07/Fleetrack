// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Textarea } from './ui/textarea';
// import { toast } from 'sonner@2.0.3';
// import { Upload } from 'lucide-react';

// interface AddExpenseModalProps {
//   open: boolean;
//   onClose: () => void;
//   vehicleId?: string;
//   vehicleNo?: string;
// }

// export const AddExpenseModal = ({ open, onClose, vehicleId, vehicleNo }: AddExpenseModalProps) => {
//   const [formData, setFormData] = useState({
//     vehicleId: vehicleId || '',
//     category: '',
//     amount: '',
//     date: '',
//     kmReading: '',
//     supplier: '',
//     notes: ''
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast.success('Expense added successfully!');
//     onClose();
//     setFormData({
//       vehicleId: vehicleId || '',
//       category: '',
//       amount: '',
//       date: '',
//       kmReading: '',
//       supplier: '',
//       notes: ''
//     });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Add Expense {vehicleNo && `- ${vehicleNo}`}</DialogTitle>
//           <DialogDescription>
//             Record a new expense entry for this vehicle.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="category">Category *</Label>
//               <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Fuel">Fuel</SelectItem>
//                   <SelectItem value="Spare Parts">Spare Parts</SelectItem>
//                   <SelectItem value="Employee Salary">Employee Salary</SelectItem>
//                   <SelectItem value="Maintenance">Maintenance</SelectItem>
//                   <SelectItem value="Insurance">Insurance</SelectItem>
//                   <SelectItem value="Others">Others</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="amount">Amount (₹) *</Label>
//               <Input
//                 id="amount"
//                 type="number"
//                 placeholder="5000"
//                 value={formData.amount}
//                 onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="date">Date *</Label>
//               <Input
//                 id="date"
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="kmReading">KM Reading</Label>
//               <Input
//                 id="kmReading"
//                 type="number"
//                 placeholder="12500"
//                 value={formData.kmReading}
//                 onChange={(e) => setFormData({ ...formData, kmReading: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2 col-span-2">
//               <Label htmlFor="supplier">Supplier</Label>
//               <Input
//                 id="supplier"
//                 placeholder="Supplier name"
//                 value={formData.supplier}
//                 onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2 col-span-2">
//               <Label htmlFor="notes">Notes</Label>
//               <Textarea
//                 id="notes"
//                 placeholder="Additional notes..."
//                 value={formData.notes}
//                 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                 rows={3}
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label>Upload Receipt</Label>
//             <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-purple-500 dark:hover:border-cyan-500 transition-colors cursor-pointer">
//               <Upload className="mx-auto mb-2 text-gray-400" size={28} />
//               <p className="text-gray-600 dark:text-gray-400">
//                 Click to upload receipt
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-3 justify-end">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-cyan-500 dark:to-purple-600 text-white">
//               Add Expense
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };



import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  vehicleId?: string;   // Optional - if not provided, user can select
  vehicleNo?: string;
  expense?: any; // For edit mode
}

export const AddExpenseModal = ({ open, onClose, vehicleId, vehicleNo, expense }: AddExpenseModalProps) => {
  const isEditMode = !!expense;
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vehicleId: "",
    category: "",
    amount: "",
    date: "",
    kmReading: "",
    supplier: "",
    notes: "",
  });

  // Load vehicles if vehicleId is not provided, or load expense data for edit
  useEffect(() => {
    if (open) {
      if (isEditMode && expense) {
        // Load expense data for editing
        setFormData({
          vehicleId: expense.vehicleId || "",
          category: expense.category || "",
          amount: expense.amount?.toString() || "",
          date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : "",
          kmReading: expense.kmReading?.toString() || "",
          supplier: expense.supplier || "",
          notes: expense.notes || "",
        });
        // Load vehicles for selection
        const loadVehicles = async () => {
          try {
            const { vehicleApi } = await import('../api/vehicleApi');
            const response = await vehicleApi.getAll();
            if (response.success) {
              setVehicles(response.data);
            }
          } catch (error) {
            console.error("Error loading vehicles:", error);
          }
        };
        loadVehicles();
      } else if (vehicleId) {
        setFormData((prev) => ({ ...prev, vehicleId }));
      } else {
        // Load vehicles for selection
        const loadVehicles = async () => {
          try {
            const { vehicleApi } = await import('../api/vehicleApi');
            const response = await vehicleApi.getAll();
            if (response.success) {
              setVehicles(response.data);
            }
          } catch (error) {
            console.error("Error loading vehicles:", error);
          }
        };
        loadVehicles();
      }
    }
  }, [vehicleId, open, expense, isEditMode]);

  /* ---------------------------------------------
     SUBMIT FORM → POST to /api/expenses
  --------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicleId || !formData.category || !formData.amount || !formData.date) {
      return toast.error("Please fill all required fields");
    }

    try {
      const { expenseApi } = await import('../api/expenseApi');
      
      const expenseData = {
        vehicleId: formData.vehicleId,
        category: formData.category,
        amount: Number(formData.amount),
        date: formData.date,
        kmReading: formData.kmReading ? Number(formData.kmReading) : undefined,
        supplier: formData.supplier,
        notes: formData.notes,
      };

      let data;
      if (isEditMode && expense?._id) {
        data = await expenseApi.update(expense._id, expenseData);
        if (!data.success) throw new Error(data.message || 'Failed to update expense');
        toast.success("Expense updated successfully!");
      } else {
        if (vehicleId) {
          data = await expenseApi.add({ ...expenseData, vehicleId });
        } else {
          data = await expenseApi.add(expenseData);
        }
        if (!data.success) throw new Error(data.message || 'Failed to add expense');
        toast.success("Expense added successfully!");
      }

      onClose();  
      
      // reset form only if not in edit mode
      if (!isEditMode) {
        setFormData({
          vehicleId: vehicleId || "",
          category: "",
          amount: "",
          date: "",
          kmReading: "",
          supplier: "",
          notes: "",
        });
      }

    } catch (err: any) {
      console.error("Add Expense Error:", err);
      toast.error("Failed to add expense");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Expense' : `Add Expense${vehicleNo ? ` - ${vehicleNo}` : ''}`}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the expense details below.' : 'Record a new expense entry for this vehicle.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            
            {/* Vehicle Selector - only show if vehicleId not provided */}
            {!vehicleId && (
              <div className="col-span-2 space-y-2">
                <Label>Vehicle *</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
                >
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle._id || vehicle.id} value={vehicle._id || vehicle.id}>
                        {vehicle.vehicleNo} - {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                  <SelectItem value="Spare Parts">Spare Parts</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Employee Salary">Employee Salary</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount (₹) *</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            {/* KM Reading */}
            <div className="space-y-2">
              <Label>KM Reading</Label>
              <Input
                type="number"
                placeholder="12500"
                value={formData.kmReading}
                onChange={(e) => setFormData({ ...formData, kmReading: e.target.value })}
              />
            </div>

            {/* Supplier */}
            <div className="col-span-2 space-y-2">
              <Label>Supplier</Label>
              <Input
                placeholder="Supplier name"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>

            {/* Notes */}
            <div className="col-span-2 space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              {isEditMode ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
};
