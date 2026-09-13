export const technicianProfile = {
  id: "TECH-1042",
  name: "Rohit Sharma",
  email: "rohit.sharma@example.com",
  phone: "+91 98765 43210",
  avatar: "",
  category: "Electrician",
  experience: "5 years",
  city: "Jaipur",
  serviceAreas: ["Malviya Nagar", "Vaishali Nagar", "C-Scheme"],
  rating: 4.8,
  totalJobs: 312,
  status: "Verified",
  joinedOn: "2023-02-14",
  documents: [
    { id: 1, name: "Aadhar Card", status: "Verified", uploadedOn: "2023-02-14" },
    { id: 2, name: "Police Verification", status: "Verified", uploadedOn: "2023-02-15" },
    { id: 3, name: "Trade Certificate", status: "Pending", uploadedOn: "2024-11-02" },
  ],
};

export const notifications = [
  { id: 1, title: "New job assigned", message: "Fan repair job at Malviya Nagar assigned to you.", time: "2h ago", read: false },
  { id: 2, title: "Payment received", message: "₹850 credited for Job #JB-2291.", time: "5h ago", read: false },
  { id: 3, title: "Document approved", message: "Your Police Verification has been approved.", time: "1d ago", read: true },
  { id: 4, title: "Reminder", message: "Job #JB-2287 starts in 30 minutes.", time: "2d ago", read: true },
];
