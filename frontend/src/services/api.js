const BASE_URL = import.meta.env.VITE_API_URL;

export const API = {
  getVehicles: () =>
    fetch(`${BASE_URL}/api/vehicles`).then(res => res.json()),

  addVehicle: (data) =>
    fetch(`${BASE_URL}/api/vehicles/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  getDashboard: () =>
    fetch(`${BASE_URL}/api/dashboard`).then(res => res.json()),
};

