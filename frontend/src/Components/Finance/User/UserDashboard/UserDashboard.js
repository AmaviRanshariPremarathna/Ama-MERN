import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDashboard.css";

function UserDashboard() {
  const [wallet, setWallet] = useState(null);
  const userId = localStorage.getItem("userId") || "IT23650534"; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/wallets/${userId}`);
        setWallet(res.data.wallet);
      } catch (err) {
        console.error(err);
        setWallet(null);
      }
    };
    fetchWallet();
  }, [userId]);

  // Dashboard cards
  const cards = [
    { title: "Payment", desc: "Make or view payments", color: "payment", path: "/user/payment" },
    { title: "Refund Request", desc: "Request refunds", color: "refund", path: "/user/request-refund" },
    { title: "Fines", desc: "View your fines", color: "fines", path: "/user/fines" },
    { title: "Transactions", desc: "See all your transactions", color: "reports", path: "/user/transactions" }
  ];

  return (
    <div className="user-dashboard-page">
      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`dashboard-card ${card.color}`}
            onClick={() => navigate(card.path)}
          >
            <h3>{card.title}</h3>
            <br></br>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Wallet Info */}
      <div className="wallet-container">
        <div className="wallet-card">
          <h2>💰 My Wallet</h2>
          {!wallet ? (
            <p>No wallet found for this user.</p>
          ) : (
            <>
              <p><strong>User ID:</strong> {wallet.userId}</p>
              <p><strong>Balance:</strong> Rs.{wallet.balance.toFixed(2)}</p>
              <p><strong>Last Updated:</strong> {new Date(wallet.updatedAt).toLocaleString()}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
