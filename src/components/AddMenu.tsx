import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const MENU_TABLE = "menu_items";

const AddMenu: React.FC = () => {
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(""); // keep as string
  const [restaurantId, setRestaurantId] = useState(""); // keep as string
  const [available, setAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!dishName || !price || !categoryId || !restaurantId) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    let imageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("item-images-1")
        .upload(fileName, imageFile);

      if (uploadError) {
        setError("Image upload failed.");
        setLoading(false);
        return;
      }
      imageUrl = supabase.storage.from("item-images-1").getPublicUrl(fileName).data.publicUrl;
    }

    const menuInsert = {
      name: dishName,
      description,
      price: parseFloat(price),
      available,
      image_url: imageUrl ? JSON.stringify([imageUrl]) : null,
      category_id: categoryId || null, // do not parseInt if it's a uuid
      restaurant_id: restaurantId || null, // do not parseInt if it's a uuid
    };

    const { error: insertError } = await supabase
      .from(MENU_TABLE)
      .insert([menuInsert]);

    setLoading(false);

    if (insertError) {
      setError(`Menu insert failed: ${insertError.message}`);
      return;
    }

    navigate("/restaurant/dashboard");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Add New Dish</h2>
      {error && <div style={{ color: "#e74c3c", marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Dish Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "block", marginTop: 8 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Dish Name *</label>
          <input type="text" value={dishName} onChange={e => setDishName(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={200} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Price *</label>
          <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Category ID *</label>
          <input type="text" value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Restaurant ID *</label>
          <input type="text" value={restaurantId} onChange={e => setRestaurantId(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />
            Available
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, borderRadius: 8, background: "#e74c3c", color: "#fff", fontWeight: 600, border: "none" }}>
          {loading ? "Saving..." : "Add Dish"}
        </button>
        <button type="button" onClick={() => navigate("/restaurant/dashboard")} style={{ width: "100%", marginTop: 12, padding: 12, borderRadius: 8, background: "#eee", color: "#333", border: "none" }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddMenu;
