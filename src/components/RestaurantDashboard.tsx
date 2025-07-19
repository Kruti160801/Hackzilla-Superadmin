import React from "react";

const mockStats = {
  totalOrders: 128,
  totalSales: 45230,
  netProfit: 12340,
  menuItems: 24,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  padding: "32px 24px",
  minWidth: 220,
  margin: "16px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const labelStyle: React.CSSProperties = {
  fontSize: 18,
  color: "#888",
  marginBottom: 8,
};

const valueStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: "#e74c3c",
};

const RestaurantDashboard: React.FC = () => {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7f8fa",
      padding: "40px 0",
    }}>
      <h2 style={{
        textAlign: "center",
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 32,
        color: "#333",
      }}>
        Restaurant Dashboard
      </h2>
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 24,
        maxWidth: 900,
        margin: "0 auto",
      }}>
        <div style={cardStyle}>
          <span style={labelStyle}>Total Orders</span>
          <span style={valueStyle}>{mockStats.totalOrders}</span>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>Total Sales</span>
          <span style={valueStyle}>₹{mockStats.totalSales.toLocaleString()}</span>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>Net Profit</span>
          <span style={valueStyle}>₹{mockStats.netProfit.toLocaleString()}</span>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>Menu Items</span>
          <span style={valueStyle}>{mockStats.menuItems}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
