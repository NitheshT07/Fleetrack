// import { useState } from 'react';
// import { motion } from 'motion/react';
// import { Plus, Search, Filter, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
// import { Button } from '../components/ui/button';
// import { Input } from '../components/ui/input';
// import { Badge } from '../components/ui/badge';
// import { AddVehicleModal } from '../components/AddVehicleModal';
// import { mockVehicles } from '../utils/mockData';
// import { Vehicle } from '../types';

// interface VehiclesProps {
//   onNavigate: (page: string, vehicleId?: string) => void;
// }

// export const Vehicles = ({ onNavigate }: VehiclesProps) => {
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Maintenance' | 'Inactive'>('All');

//   const filteredVehicles = mockVehicles.filter(vehicle => {
//     const matchesSearch = vehicle.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = filterStatus === 'All' || vehicle.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Active': return 'bg-green-100 text-green-800 dark:bg-[#10d9b4]/20 dark:text-[#10d9b4]';
//       case 'Maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-[#ffa726]/20 dark:text-[#ffa726]';
//       case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
//       default: return '';
//     }
//   };

//   const isInsuranceExpiring = (expiryDate: string) => {
//     const expiry = new Date(expiryDate);
//     const today = new Date();
//     const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//     return daysUntilExpiry <= 60 && daysUntilExpiry >= 0;
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-gray-900 dark:text-white mb-1">Vehicles</h1>
//           <p className="text-gray-600 dark:text-gray-400">Manage your fleet vehicles</p>
//         </div>
//         <Button
//           onClick={() => setShowAddModal(true)}
//           className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-[#10d9b4] dark:to-[#0dd9b4] text-white shadow-lg dark:shadow-[0_0_20px_rgba(16,217,180,0.3)]"
//         >
//           <Plus className="mr-2" size={20} />
//           Add Vehicle
//         </Button>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//           <Input
//             placeholder="Search by vehicle number or model..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <div className="flex gap-2">
//           {(['All', 'Active', 'Maintenance', 'Inactive'] as const).map((status) => (
//             <Button
//               key={status}
//               variant={filterStatus === status ? 'default' : 'outline'}
//               onClick={() => setFilterStatus(status)}
//               className={filterStatus === status ? 'bg-purple-600 dark:bg-[#10d9b4] dark:text-[#0a0b14]' : ''}
//             >
//               {status}
//             </Button>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredVehicles.map((vehicle, index) => (
//           <motion.div
//             key={vehicle.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.05 }}
//             whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2)' }}
//             onClick={() => onNavigate('vehicle-detail', vehicle.id)}
//             className="bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-white/[0.08] cursor-pointer"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <h3 className="text-gray-900 dark:text-white mb-1">{vehicle.vehicleNo}</h3>
//                 <p className="text-gray-600 dark:text-gray-400">{vehicle.model}</p>
//               </div>
//               <Badge className={getStatusColor(vehicle.status)}>
//                 {vehicle.status}
//               </Badge>
//             </div>

//             {isInsuranceExpiring(vehicle.insuranceExpiry) && (
//               <div className="mb-4 p-3 bg-yellow-50 dark:bg-[#ffa726]/10 border border-yellow-200 dark:border-[#ffa726]/30 rounded-lg flex items-center gap-2">
//                 <AlertTriangle className="text-yellow-600 dark:text-[#ffa726]" size={16} />
//                 <p className="text-yellow-800 dark:text-[#ffa726]">Insurance expiring soon</p>
//               </div>
//             )}

//             <div className="space-y-2 mb-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-600 dark:text-gray-400">Type</span>
//                 <span className="text-gray-900 dark:text-white">{vehicle.type}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600 dark:text-gray-400">Purchase Date</span>
//                 <span className="text-gray-900 dark:text-white">
//                   {new Date(vehicle.purchaseDate).toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600 dark:text-gray-400">Insurance Expiry</span>
//                 <span className="text-gray-900 dark:text-white">
//                   {new Date(vehicle.insuranceExpiry).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>

//             <div className="border-t border-gray-200 dark:border-white/[0.08] pt-4 space-y-2">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-400">Total Revenue</span>
//                 <span className="text-green-600 dark:text-[#10d9b4] flex items-center gap-1">
//                   <TrendingUp size={16} />
//                   ₹{(vehicle.totalRevenue / 1000).toFixed(0)}K
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-400">Total Expenses</span>
//                 <span className="text-red-600 dark:text-[#ef4464] flex items-center gap-1">
//                   <TrendingDown size={16} />
//                   ₹{(vehicle.totalExpenses / 1000).toFixed(0)}K
//                 </span>
//               </div>
//               <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-white/[0.08]">
//                 <span className="text-gray-900 dark:text-white">Profit</span>
//                 <span className="text-purple-600 dark:text-[#10d9b4]">
//                   ₹{(vehicle.profit / 1000).toFixed(0)}K
//                 </span>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <AddVehicleModal open={showAddModal} onClose={() => setShowAddModal(false)} />
//     </div>
//   );
// };

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, AlertTriangle, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { AddVehicleModal } from '../components/AddVehicleModal';
import { Vehicle } from '../types';
import { vehicleApi } from '../api/vehicleApi';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { toast } from 'sonner';

interface VehiclesProps {
  onNavigate: (page: string, vehicleId?: string) => void;
}

export const Vehicles = ({ onNavigate }: VehiclesProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Maintenance' | 'Inactive'>('All');

  // -------------------------------------
  // ✅ Fetch vehicles from backend
  // -------------------------------------
  const loadVehicles = async () => {
    try {
      const response = await vehicleApi.getAll();
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // -------------------------------------
  // Filters
  // -------------------------------------
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'All' || vehicle.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-[#10d9b4]/20 dark:text-[#10d9b4]';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-[#ffa726]/20 dark:text-[#ffa726]';
      case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
      default: return '';
    }
  };

  const isInsuranceExpiring = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 60 && daysLeft >= 0;
  };

  const handleEdit = (vehicle: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVehicle(vehicle);
    setShowAddModal(true);
  };

  const handleDeleteClick = (vehicleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteVehicleId(vehicleId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteVehicleId) return;

    try {
      const result = await vehicleApi.delete(deleteVehicleId);
      if (result.success) {
        toast.success('Vehicle deleted successfully!');
        setVehicles(vehicles.filter(v => (v._id || v.id) !== deleteVehicleId));
      } else {
        throw new Error(result.message || 'Failed to delete vehicle');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete vehicle');
    } finally {
      setDeleteVehicleId(null);
    }
  };

  // -------------------------------------
  // Render Vehicles
  // -------------------------------------
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-1">Vehicles</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your fleet vehicles</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-[#10d9b4] dark:to-[#0dd9b4] text-white shadow-lg"
        >
          <Plus className="mr-2" size={20} />
          Add Vehicle
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by vehicle number or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {(['All', 'Active', 'Maintenance', 'Inactive'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? 'bg-purple-600 dark:bg-[#10d9b4]' : ''}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle._id || vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-[#1a1b2e] rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 dark:border-white/[0.08] relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onNavigate('vehicle-detail', vehicle._id || vehicle.id)}
              >
                <h3 className="text-gray-900 dark:text-white mb-1">{vehicle.vehicleNo}</h3>
                <p className="text-gray-600 dark:text-gray-400">{vehicle.model}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => handleEdit(vehicle, e)}>
                      <Edit2 className="mr-2" size={16} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => handleDeleteClick(vehicle._id || vehicle.id || '', e)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="mr-2" size={16} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isInsuranceExpiring(vehicle.insuranceExpiry) && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-[#ffa726]/10 border border-yellow-200 dark:border-[#ffa726]/30 rounded-lg flex items-center gap-2">
                <AlertTriangle className="text-yellow-600 dark:text-[#ffa726]" size={16} />
                <p className="text-yellow-800 dark:text-[#ffa726]">Insurance expiring soon</p>
              </div>
            )}

            <div 
              className="space-y-2 mb-4 cursor-pointer"
              onClick={() => onNavigate('vehicle-detail', vehicle._id || vehicle.id)}
            >
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type</span>
                <span className="text-gray-900 dark:text-white">{vehicle.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Purchase Date</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(vehicle.purchaseDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Insurance Expiry</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(vehicle.insuranceExpiry).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Vehicle Modal */}
      <AddVehicleModal
        open={showAddModal}
        vehicle={editingVehicle}
        onClose={() => {
          setShowAddModal(false);
          setEditingVehicle(null);
          loadVehicles(); // refresh list after modal close
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteVehicleId} onOpenChange={() => setDeleteVehicleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle and all associated data.
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
