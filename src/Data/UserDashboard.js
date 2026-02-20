import toast from "react-hot-toast";
import { users } from "./Users";


/* 🔴 LOGGED IN USER (frontend dummy – ONLY THIS IS NEW) */
export const loggedInUser = {
  gender: "FeMale", // change to "Female" to test
};

export const getUserById = (id) => {
  return users.find((u) => u.id === id);
};

export const dummyConnections = [
  { id: 1, gender: "Male", raasi: "Kanni (Virgo)", star: "Uthiram", work: "Software Engineer", salary: "12 LPA", location: "Chennai", visibility: "Public" },
  { id: 2, gender: "Male", raasi: "Rishabam (Taurus)", star: "Rohini", work: "Chartered Accountant", salary: "10 LPA", location: "Coimbatore", visibility: "Private" },
  { id: 3, gender: "Male", raasi: "Mesham (Aries)", star: "Ashwini", work: "Business Owner", salary: "15 LPA", location: "Madurai", visibility: "Public" },
  { id: 4, gender: "Male", raasi: "Kadagam (Cancer)", star: "Pushyam", work: "Bank Manager", salary: "9 LPA", location: "Trichy", visibility: "Private" },
  { id: 5, gender: "Male", raasi: "Makaram (Capricorn)", star: "Thiruvonam", work: "Civil Engineer", salary: "8 LPA", location: "Salem", visibility: "Public" },
  { id: 6, gender: "Female", raasi: "Meenam (Pisces)", star: "Revathi", work: "HR Manager", salary: "7 LPA", location: "Bangalore", visibility: "Public" }
];

/* 🔥 ONLY LOGIC ADD – FILTERED CONNECTIONS */
export const visibleConnections = dummyConnections.filter(
  (u) =>
    u.gender.toLowerCase() !== loggedInUser.gender.toLowerCase()
);


// Tracking sent requests
let sentRequests = [];

export const handleConnectLogic = (id) => {
  if (sentRequests.includes(id)) {
    toast.error(
      `Request already sent to . Next request can only be sent after 24 hours!`,
      {
        duration: 4000,
        style: {
          background: "#FF7444",
          color: "#EEEEEE",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "bold",
          border: "2px solid #D4BEE4",
        },
        icon: "⏳",
      }
    );
  } else {
    sentRequests.push(id);
    toast.success(`Request Sent Successfully  `, {
      duration: 3000,
      style: {
        background: "#059669",
        color: "#FFFFFF",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "bold",
        marginBottom:"20px",
      },
      icon: "✅",
    });
  }
};
