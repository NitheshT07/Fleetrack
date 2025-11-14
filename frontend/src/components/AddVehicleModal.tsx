// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { toast } from 'sonner@2.0.3';
// import { Upload } from 'lucide-react';

// interface AddVehicleModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// export const AddVehicleModal = ({ open, onClose }: AddVehicleModalProps) => {
//   const [formData, setFormData] = useState({
//     vehicleNo: '',
//     type: '',
//     model: '',
//     purchaseDate: '',
//     insuranceExpiry: ''
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast.success('Vehicle added successfully!');
//     onClose();
//     setFormData({
//       vehicleNo: '',
//       type: '',
//       model: '',
//       purchaseDate: '',
//       insuranceExpiry: ''
//     });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Add New Vehicle</DialogTitle>
//           <DialogDescription>
//             Fill in the vehicle details below to add it to your fleet.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="vehicleNo">Vehicle Number *</Label>
//               <Input
//                 id="vehicleNo"
//                 placeholder="TN-01-AB-1234"
//                 value={formData.vehicleNo}
//                 onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="type">Vehicle Type *</Label>
//               <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Truck">Truck</SelectItem>
//                   <SelectItem value="Van">Van</SelectItem>
//                   <SelectItem value="Container">Container</SelectItem>
//                   <SelectItem value="Pickup">Pickup</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="model">Model *</Label>
//               <Input
//                 id="model"
//                 placeholder="Tata LPT 1613"
//                 value={formData.model}
//                 onChange={(e) => setFormData({ ...formData, model: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="purchaseDate">Purchase Date *</Label>
//               <Input
//                 id="purchaseDate"
//                 type="date"
//                 value={formData.purchaseDate}
//                 onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="insuranceExpiry">Insurance Expiry *</Label>
//               <Input
//                 id="insuranceExpiry"
//                 type="date"
//                 value={formData.insuranceExpiry}
//                 onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label>Upload Documents</Label>
//             <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-purple-500 dark:hover:border-cyan-500 transition-colors cursor-pointer">
//               <Upload className="mx-auto mb-2 text-gray-400" size={32} />
//               <p className="text-gray-600 dark:text-gray-400">
//                 Click to upload or drag and drop
//               </p>
//               <p className="text-gray-500 dark:text-gray-500">
//                 PDF, PNG, JPG (max. 10MB)
//               </p>
//             </div>
//           </div>

//           <div className="flex gap-3 justify-end">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-cyan-500 dark:to-purple-600 text-white">
//               Add Vehicle
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
import { toast } from 'sonner';
import { Vehicle } from '../types';

interface AddVehicleModalProps {
  open: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null; // For edit mode
}

export const AddVehicleModal = ({ open, onClose, vehicle }: AddVehicleModalProps) => {
  const isEditMode = !!vehicle;
  const [formData, setFormData] = useState({
    vehicleNo: '',
    type: '',
    model: '',
    purchaseDate: '',
    insuranceExpiry: '',
    status: 'Active'
  });

  // Load vehicle data when editing
  useEffect(() => {
    if (vehicle && open) {
      setFormData({
        vehicleNo: vehicle.vehicleNo || '',
        type: vehicle.type || '',
        model: vehicle.model || '',
        purchaseDate: vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toISOString().split('T')[0] : '',
        insuranceExpiry: vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toISOString().split('T')[0] : '',
        status: vehicle.status || 'Active'
      });
    } else if (!vehicle && open) {
      // Reset form for add mode
      setFormData({
        vehicleNo: '',
        type: '',
        model: '',
        purchaseDate: '',
        insuranceExpiry: '',
        status: 'Active'
      });
    }
  }, [vehicle, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { vehicleApi } = await import('../api/vehicleApi');
      
      if (isEditMode && vehicle?._id) {
        const result = await vehicleApi.update(vehicle._id, formData);
        if (!result.success) throw new Error(result.message || 'Failed to update vehicle');
        toast.success("Vehicle updated successfully!");
      } else {
        const result = await vehicleApi.add(formData);
        if (!result.success) throw new Error(result.message || 'Failed to add vehicle');
        toast.success("Vehicle added successfully!");
      }

      onClose();

      if (!isEditMode) {
        setFormData({
          vehicleNo: '',
          type: '',
          model: '',
          purchaseDate: '',
          insuranceExpiry: '',
          status: 'Active'
        });
      }

    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'add'} vehicle`);
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the vehicle details below.' : 'Fill in the vehicle details below to add it to your fleet.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="vehicleNo">Vehicle Number *</Label>
              <Input
                id="vehicleNo"
                value={formData.vehicleNo}
                onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Vehicle Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Container">Container</SelectItem>
                  <SelectItem value="Pickup">Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Purchase Date *</Label>
              <Input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Insurance Expiry *</Label>
              <Input
                type="date"
                value={formData.insuranceExpiry}
                onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                required
              />
            </div>

          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              {isEditMode ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
