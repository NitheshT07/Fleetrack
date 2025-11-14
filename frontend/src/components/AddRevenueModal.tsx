import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { vehicleApi } from '../api/vehicleApi';
import { revenueApi } from '../api/revenueApi';
import { Vehicle } from '../types';

interface AddRevenueModalProps {
  open: boolean;
  onClose: () => void;
  revenue?: any; // For edit mode
}

export const AddRevenueModal = ({ open, onClose, revenue }: AddRevenueModalProps) => {
  const isEditMode = !!revenue;
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: '',
    tripId: '',
    amount: '',
    date: '',
    startLocation: '',
    endLocation: '',
    distance: '',
    notes: ''
  });

  // Fetch vehicles when modal opens, or load revenue data for edit
  useEffect(() => {
    if (open) {
      if (isEditMode && revenue) {
        // Load revenue data for editing
        setFormData({
          vehicleId: revenue.vehicleId || '',
          tripId: revenue.tripId || '',
          amount: revenue.amount?.toString() || '',
          date: revenue.date ? new Date(revenue.date).toISOString().split('T')[0] : '',
          startLocation: revenue.startLocation || '',
          endLocation: revenue.endLocation || '',
          distance: revenue.distance?.toString() || '',
          notes: revenue.notes || ''
        });
      }
      
      const loadVehicles = async () => {
        try {
          const response = await vehicleApi.getAll();
          if (response.success) {
            setVehicles(response.data);
          }
        } catch (error) {
          console.error('Error loading vehicles:', error);
        }
      };
      loadVehicles();
    }
  }, [open, revenue, isEditMode]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.vehicleId || !formData.tripId || !formData.amount || !formData.date) {
      return toast.error('Please fill all required fields');
    }

    try {
      const revenueData = {
        vehicleId: formData.vehicleId,
        tripId: formData.tripId,
        amount: Number(formData.amount),
        date: formData.date,
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        distance: Number(formData.distance),
        notes: formData.notes,
      };

      let response;
      if (isEditMode && revenue?._id) {
        response = await revenueApi.update(revenue._id, revenueData);
        if (response.success) {
          toast.success('Revenue entry updated successfully!');
        } else {
          throw new Error(response.message || 'Failed to update revenue');
        }
      } else {
        response = await revenueApi.add(revenueData);
        if (response.success) {
          toast.success('Revenue entry added successfully!');
        } else {
          throw new Error(response.message || 'Failed to add revenue');
        }
      }

      onClose();
      
      if (!isEditMode) {
        setFormData({
          vehicleId: '',
          tripId: '',
          amount: '',
          date: '',
          startLocation: '',
          endLocation: '',
          distance: '',
          notes: ''
        });
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} revenue:`, error);
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'add'} revenue entry`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Revenue / Trip' : 'Add Revenue / Trip'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the trip and revenue details below.' : 'Record a new trip and revenue entry for a vehicle.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle *</Label>
              <Select value={formData.vehicleId} onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle._id || vehicle.id} value={vehicle._id || vehicle.id}>
                      {vehicle.vehicleNo} - {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tripId">Trip ID *</Label>
              <Input
                id="tripId"
                placeholder="TR001"
                value={formData.tripId}
                onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startLocation">Start Location *</Label>
              <Input
                id="startLocation"
                placeholder="Chennai"
                value={formData.startLocation}
                onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endLocation">End Location *</Label>
              <Input
                id="endLocation"
                placeholder="Bangalore"
                value={formData.endLocation}
                onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="distance">Distance (km) *</Label>
              <Input
                id="distance"
                type="number"
                placeholder="350"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional trip details..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-cyan-500 dark:to-purple-600 text-white">
              {isEditMode ? 'Update Revenue' : 'Add Revenue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
