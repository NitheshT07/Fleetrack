export const API = {
  getVehicles: () =>
    fetch("http://localhost:5000/api/vehicles").then(res => res.json()),

  addVehicle: (data) =>
    fetch("http://localhost:5000/api/vehicles/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  getDashboard: () =>
    fetch("http://localhost:5000/api/dashboard").then(res => res.json()),
};
