import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .order("id", { ascending: false });
        if (error) throw error;
        setMenu(data || []);
      } catch (err) {
        setMenu([]);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    // Check if restaurant profile exists for current user
    const checkRestaurantProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Fetch numeric user id from users table using email
      const { data: userRow, error: userFetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();
      if (userFetchError || !userRow) {
        // Optionally handle error
        return;
      }
      // Use maybeSingle to avoid error if no row is found
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_id", userRow.id)
        .maybeSingle();
      if (error) {
        // Optionally handle error
        return;
      }
      if (!data) {
        navigate("/restaurant/setup");
        return;
      }
      setRestaurant(data);
    };
    checkRestaurantProfile();
  }, [navigate]);

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
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <button
          style={{
            background: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 28px",
            fontWeight: 600,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(52,152,219,0.15)",
            marginRight: 16,
          }}
          onClick={() => navigate("/restaurant/setup")}
        >
          Edit Restaurant Profile
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <button
          style={{
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 28px",
            fontWeight: 600,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(231,76,60,0.15)",
          }}
          onClick={() => navigate("/restaurant/add-menu")}
        >
          + Add Menu
        </button>
      </div>
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
      <div style={{ maxWidth: 900, margin: "40px auto 0", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Menu Items</h3>
        {loading ? (
          <div>Loading menu...</div>
        ) : menu.length === 0 ? (
          <div>No menu items found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f7f8fa" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Image</th>
                <th style={{ padding: 8, textAlign: "left" }}>Name</th>
                <th style={{ padding: 8, textAlign: "left" }}>Category ID</th>
                <th style={{ padding: 8, textAlign: "left" }}>Restaurant ID</th>
                <th style={{ padding: 8, textAlign: "left" }}>Price</th>
                <th style={{ padding: 8, textAlign: "left" }}>Available</th>
              </tr>
            </thead>
            <tbody>
              {menu.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>
                    {item.image_url ? (
                      (() => {
                        let imgArr: string[] = [];
                        if (Array.isArray(item.image_url)) {
                          imgArr = item.image_url;
                        } else if (typeof item.image_url === "string") {
                          try {
                            imgArr = JSON.parse(item.image_url);
                          } catch {
                            imgArr = [];
                          }
                        }
                        return imgArr.length > 0 && imgArr[0] ? (
                          <img src={imgArr[0]} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                        ) : (
                          <span style={{ color: "#ccc" }}>No Image</span>
                        );
                      })()
                    ) : (
                      <span style={{ color: "#ccc" }}>No Image</span>
                    )}
                  </td>
                  <td style={{ padding: 8 }}>{item.name}</td>
                  <td style={{ padding: 8 }}>{item.category_id}</td>
                  <td style={{ padding: 8 }}>{item.restaurant_id}</td>
                  <td style={{ padding: 8 }}>₹{item.price}</td>
                  <td style={{ padding: 8 }}>{item.available ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
