import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email notification
export const sendEmailNotification = async (to, subject, html) => {
  try {
    // Only send if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email credentials not configured. Skipping email notification.");
      return false;
    }

    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log(`Email notification sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
};

// Send notification when vehicle is added
export const notifyVehicleAdded = async (userEmail, userName, vehicleData) => {
  const subject = "New Vehicle Added to Fleet";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #5b68f4;">New Vehicle Added</h2>
      <p>Hello ${userName},</p>
      <p>A new vehicle has been added to your fleet:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Vehicle Number:</strong> ${vehicleData.vehicleNo}</p>
        <p><strong>Model:</strong> ${vehicleData.model}</p>
        <p><strong>Type:</strong> ${vehicleData.type}</p>
        <p><strong>Status:</strong> ${vehicleData.status}</p>
        <p><strong>Purchase Date:</strong> ${new Date(vehicleData.purchaseDate).toLocaleDateString()}</p>
        <p><strong>Insurance Expiry:</strong> ${new Date(vehicleData.insuranceExpiry).toLocaleDateString()}</p>
      </div>
      <p>You can view and manage this vehicle in your FleetTrack dashboard.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated notification from FleetTrack.</p>
    </div>
  `;
  return await sendEmailNotification(userEmail, subject, html);
};

// Send notification when expense is added
export const notifyExpenseAdded = async (userEmail, userName, expenseData) => {
  const subject = "New Expense Recorded";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4464;">New Expense Recorded</h2>
      <p>Hello ${userName},</p>
      <p>A new expense has been recorded:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Category:</strong> ${expenseData.category}</p>
        <p><strong>Amount:</strong> ₹${expenseData.amount}</p>
        <p><strong>Date:</strong> ${new Date(expenseData.date).toLocaleDateString()}</p>
        ${expenseData.supplier ? `<p><strong>Supplier:</strong> ${expenseData.supplier}</p>` : ''}
        ${expenseData.kmReading ? `<p><strong>KM Reading:</strong> ${expenseData.kmReading}</p>` : ''}
        ${expenseData.notes ? `<p><strong>Notes:</strong> ${expenseData.notes}</p>` : ''}
      </div>
      <p>You can view this expense in your FleetTrack dashboard.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated notification from FleetTrack.</p>
    </div>
  `;
  return await sendEmailNotification(userEmail, subject, html);
};

// Send notification when revenue is added
export const notifyRevenueAdded = async (userEmail, userName, revenueData) => {
  const subject = "New Revenue/Trip Recorded";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10d9b4;">New Revenue Recorded</h2>
      <p>Hello ${userName},</p>
      <p>A new revenue/trip has been recorded:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Trip ID:</strong> ${revenueData.tripId}</p>
        <p><strong>Amount:</strong> ₹${revenueData.amount}</p>
        <p><strong>Date:</strong> ${new Date(revenueData.date).toLocaleDateString()}</p>
        <p><strong>Route:</strong> ${revenueData.startLocation} → ${revenueData.endLocation}</p>
        ${revenueData.distance ? `<p><strong>Distance:</strong> ${revenueData.distance} km</p>` : ''}
        ${revenueData.notes ? `<p><strong>Notes:</strong> ${revenueData.notes}</p>` : ''}
      </div>
      <p>You can view this revenue in your FleetTrack dashboard.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated notification from FleetTrack.</p>
    </div>
  `;
  return await sendEmailNotification(userEmail, subject, html);
};

