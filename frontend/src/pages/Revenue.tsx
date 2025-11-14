import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Download, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { AddRevenueModal } from '../components/AddRevenueModal';
import { revenueApi } from '../api/revenueApi';
import { vehicleApi } from '../api/vehicleApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Revenue } from '../types';
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

export const Revenue = () => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<any>(null);
  const [deleteRevenueId, setDeleteRevenueId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadRevenues = async () => {
    try {
      setLoading(true);
      const response = await revenueApi.getAll();
      if (response.success) {
        // Fetch vehicle numbers for each revenue
        const revenuesWithVehicleNo = await Promise.all(
          response.data.map(async (revenue: any) => {
            try {
              const vehicleResponse = await vehicleApi.getById(revenue.vehicleId);
              if (vehicleResponse.success) {
                return {
                  ...revenue,
                  id: revenue._id || revenue.id,
                  vehicleNo: vehicleResponse.data.vehicleNo,
                };
              }
              return { ...revenue, id: revenue._id || revenue.id, vehicleNo: 'Unknown' };
            } catch {
              return { ...revenue, id: revenue._id || revenue.id, vehicleNo: 'Unknown' };
            }
          })
        );
        setRevenues(revenuesWithVehicleNo);
      }
    } catch (error) {
      console.error('Error loading revenues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch revenues from API
  useEffect(() => {
    loadRevenues();
  }, []);

  const handleEdit = (revenue: any) => {
    setEditingRevenue(revenue);
    setShowAddModal(true);
  };

  const handleDeleteClick = (revenueId: string) => {
    setDeleteRevenueId(revenueId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRevenueId) return;

    try {
      const result = await revenueApi.delete(deleteRevenueId);
      if (result.success) {
        toast.success('Revenue deleted successfully!');
        setRevenues(revenues.filter(r => (r.id || r._id) !== deleteRevenueId));
      } else {
        throw new Error(result.message || 'Failed to delete revenue');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete revenue');
    } finally {
      setDeleteRevenueId(null);
    }
  };

  const filteredRevenue = revenues.filter(rev => {
    return rev.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
           rev.tripId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           rev.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
           rev.endLocation.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalRevenue = filteredRevenue.reduce((sum, rev) => sum + rev.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-1">Revenue</h1>
          <p className="text-gray-600 dark:text-gray-400">Track all trips and revenue</p>
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
            Add Revenue
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-cyan-600 rounded-2xl p-6 text-white shadow-lg"
      >
        <p className="mb-2">Total Revenue</p>
        <h2 className="text-white">₹{totalRevenue.toLocaleString()}</h2>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by vehicle, trip ID, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
              <TableHead>Trip ID</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Loading revenues...
                </TableCell>
              </TableRow>
            ) : filteredRevenue.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No revenues found
                </TableCell>
              </TableRow>
            ) : (
              filteredRevenue.map((trip, index) => (
                <motion.tr
                  key={trip.id || trip._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <TableCell>{new Date(trip.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className="text-purple-600 dark:text-cyan-400">{trip.tripId}</span>
                  </TableCell>
                  <TableCell>{trip.vehicleNo}</TableCell>
                  <TableCell>
                    {trip.startLocation} → {trip.endLocation}
                  </TableCell>
                  <TableCell>{trip.distance} km</TableCell>
                  <TableCell className="text-green-600 dark:text-green-400">
                    ₹{trip.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(trip)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(trip.id || trip._id || '')}
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

      <AddRevenueModal 
        open={showAddModal} 
        revenue={editingRevenue}
        onClose={() => {
          setShowAddModal(false);
          setEditingRevenue(null);
          loadRevenues();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRevenueId} onOpenChange={() => setDeleteRevenueId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the revenue record.
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
