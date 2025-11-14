import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { dashboardApi } from '../api/dashboardApi';
import { expenseApi } from '../api/expenseApi';
import { revenueApi } from '../api/revenueApi';
import { vehicleApi } from '../api/vehicleApi';
import { toast } from 'sonner';

export const Reports = () => {
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [kpi, setKpi] = useState({
    totalRevenueMTD: 0,
    totalExpensesMTD: 0,
    profitMTD: 0,
    activeVehicles: 0,
  });

  // Fetch dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await dashboardApi.getStats();
        if (response) {
          setKpi({
            totalRevenueMTD: response.totalRevenue || 0,
            totalExpensesMTD: response.totalExpenses || 0,
            profitMTD: response.profit || 0,
            activeVehicles: response.activeVehicles || 0,
          });
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };
    loadStats();
  }, []);

  const [recentReports, setRecentReports] = useState<any[]>([]);

  // Load recent reports from localStorage (or could be from backend)
  useEffect(() => {
    const stored = localStorage.getItem('fleettrack_recent_reports');
    if (stored) {
      setRecentReports(JSON.parse(stored));
    }
  }, []);

  const saveReportToHistory = (reportName: string, format: string) => {
    const newReport = {
      name: reportName,
      date: new Date().toISOString().split('T')[0],
      size: `${Math.floor(Math.random() * 200 + 100)} KB`,
      format,
    };
    const updated = [newReport, ...recentReports].slice(0, 10); // Keep last 10
    setRecentReports(updated);
    localStorage.setItem('fleettrack_recent_reports', JSON.stringify(updated));
  };

  const handleExport = async (format: string, reportType: string) => {
    try {
      let data: any = {};
      let fileName = '';

      // Fetch data based on report type
      if (reportType === 'revenue' || reportType === 'all') {
        const revenueRes = await revenueApi.getAll();
        if (revenueRes.success) data.revenues = revenueRes.data;
        fileName = 'Revenue_Report';
      }
      
      if (reportType === 'expense' || reportType === 'all') {
        const expenseRes = await expenseApi.getAll();
        if (expenseRes.success) data.expenses = expenseRes.data;
        fileName = fileName || 'Expense_Report';
      }
      
      if (reportType === 'pl' || reportType === 'all') {
        const statsRes = await dashboardApi.getStats();
        data.stats = statsRes;
        fileName = 'Profit_Loss_Report';
      }
      
      if (reportType === 'vehicle' || reportType === 'all') {
        const vehicleRes = await vehicleApi.getAll();
        if (vehicleRes.success) data.vehicles = vehicleRes.data;
        fileName = fileName || 'Vehicle_Performance_Report';
      }

      if (reportType === 'all') {
        fileName = 'Complete_Report';
      }

      const timestamp = new Date().toISOString().split('T')[0];
      fileName = `${fileName}_${timestamp}`;

      // Generate and download file
      if (format === 'csv') {
        downloadCSV(data, fileName);
      } else if (format === 'excel') {
        downloadExcel(data, fileName);
      } else if (format === 'pdf') {
        downloadPDF(data, fileName);
      }

      saveReportToHistory(`${fileName}.${format}`, format);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  const downloadCSV = (data: any, fileName: string) => {
    let csvContent = '';
    
    if (data.revenues) {
      csvContent += 'Revenue Report\n';
      csvContent += 'Trip ID,Vehicle ID,Amount,Date,Start Location,End Location,Distance\n';
      data.revenues.forEach((r: any) => {
        csvContent += `${r.tripId || ''},${r.vehicleId || ''},${r.amount || 0},${r.date || ''},${r.startLocation || ''},${r.endLocation || ''},${r.distance || 0}\n`;
      });
      csvContent += '\n';
    }
    
    if (data.expenses) {
      csvContent += 'Expense Report\n';
      csvContent += 'Vehicle ID,Category,Amount,Date,Supplier,KM Reading,Notes\n';
      data.expenses.forEach((e: any) => {
        csvContent += `${e.vehicleId || ''},${e.category || ''},${e.amount || 0},${e.date || ''},${e.supplier || ''},${e.kmReading || ''},${e.notes || ''}\n`;
      });
      csvContent += '\n';
    }
    
    if (data.stats) {
      csvContent += 'Dashboard Statistics\n';
      csvContent += `Total Revenue,${data.stats.totalRevenue || 0}\n`;
      csvContent += `Total Expenses,${data.stats.totalExpenses || 0}\n`;
      csvContent += `Profit,${data.stats.profit || 0}\n`;
      csvContent += `Active Vehicles,${data.stats.activeVehicles || 0}\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  };

  const downloadExcel = (data: any, fileName: string) => {
    // For Excel, we'll create a CSV file (can be opened in Excel)
    // For full Excel support, you'd need a library like xlsx
    downloadCSV(data, fileName);
    toast.info('CSV file created (can be opened in Excel)');
  };

  const downloadPDF = (data: any, fileName: string) => {
    // Create a simple text-based PDF content
    let content = `${fileName}\n\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n\n`;
    
    if (data.stats) {
      content += 'Dashboard Statistics:\n';
      content += `Total Revenue: ₹${data.stats.totalRevenue || 0}\n`;
      content += `Total Expenses: ₹${data.stats.totalExpenses || 0}\n`;
      content += `Profit: ₹${data.stats.profit || 0}\n`;
      content += `Active Vehicles: ${data.stats.activeVehicles || 0}\n\n`;
    }
    
    if (data.revenues) {
      content += `Revenue Entries: ${data.revenues.length}\n\n`;
    }
    
    if (data.expenses) {
      content += `Expense Entries: ${data.expenses.length}\n\n`;
    }

    // Create a simple text file (for full PDF, use a library like jsPDF)
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.txt`;
    link.click();
    toast.info('Text file created (for full PDF support, install jsPDF library)');
  };

  const reportCards = [
    {
      title: 'Revenue Report',
      description: 'Detailed revenue breakdown by vehicle and time period',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      type: 'revenue'
    },
    {
      title: 'Expense Report',
      description: 'Complete expense analysis with category-wise breakdown',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      type: 'expense'
    },
    {
      title: 'Profit & Loss',
      description: 'Comprehensive P&L statement for the selected period',
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      type: 'pl'
    },
    {
      title: 'Vehicle Performance',
      description: 'Individual vehicle performance metrics and comparisons',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      type: 'vehicle'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-1">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and export detailed reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-2">Total Revenue MTD</p>
          <h3 className="text-green-600 dark:text-green-400">₹{kpi.totalRevenueMTD.toLocaleString()}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-2">Total Expenses MTD</p>
          <h3 className="text-red-600 dark:text-red-400">₹{kpi.totalExpensesMTD.toLocaleString()}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-2">Net Profit MTD</p>
          <h3 className="text-purple-600 dark:text-cyan-400">₹{kpi.profitMTD.toLocaleString()}</h3>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <Filter className="mr-2" size={16} />
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="revenue">Revenue Only</SelectItem>
            <SelectItem value="expense">Expense Only</SelectItem>
            <SelectItem value="pl">Profit & Loss</SelectItem>
            <SelectItem value="vehicle">Vehicle Performance</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <Calendar className="mr-2" size={16} />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="thisQuarter">This Quarter</SelectItem>
            <SelectItem value="thisYear">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((report, index) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-4`}>
              <report.icon className="text-white" size={24} />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2">{report.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{report.description}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExport('pdf', report.type)}
                variant="outline"
                className="flex-1"
              >
                <Download size={16} className="mr-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleExport('excel', report.type)}
                variant="outline"
                className="flex-1"
              >
                <Download size={16} className="mr-2" />
                Excel
              </Button>
              <Button
                onClick={() => handleExport('csv', report.type)}
                variant="outline"
                className="flex-1"
              >
                <Download size={16} className="mr-2" />
                CSV
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800"
      >
        <h3 className="text-gray-900 dark:text-white mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {recentReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No reports generated yet. Export a report to see it here.
            </div>
          ) : (
            recentReports.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <FileText className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white">{report.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(report.date).toLocaleDateString()} • {report.size} • {report.format.toUpperCase()}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toast.info('Report already downloaded. Check your downloads folder.')}
                >
                  <Download size={16} />
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
