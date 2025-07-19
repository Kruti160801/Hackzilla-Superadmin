import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CATEGORY_OPTIONS = [
  "Indian",
  "Pizza",
  "Chinese",
  "Burgers",
  "Italian",
  "Mexican",
  "Cafe",
  "Bakery",
  "Seafood",
  "Barbecue",
  "Other"
];

const CUISINE_OPTIONS = [
  "North Indian",
  "South Indian",
  "Punjabi",
  "Gujarati",
  "Rajasthani",
  "Mughlai",
  "Continental",
  "Thai",
  "Japanese",
  "Mediterranean",
  "Other"
];

const RestaurantSetup: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    location_address: "",
    location_latitude: "",
    location_longitude: "",
    open_hours: "",
    cuisines: [] as string[],
    categories: "",
    logo_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing restaurant profile for current user
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        // Redirect to login if user not found
        navigate("/");
        return;
      }
      // Fetch numeric user id from users table using email
      const { data: userRow, error: userFetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();
      if (userFetchError || !userRow) {
        setError("Could not fetch user profile from database.");
        setLoading(false);
        return;
      }
      // Use maybeSingle to avoid error if no row is found
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_id", userRow.id)
        .maybeSingle();
      if (error) {
        setError("Error fetching restaurant profile.");
        setLoading(false);
        return;
      }
      if (data) {
        setForm({
          name: data.name || "",
          location_address: data.location_address || "",
          location_latitude: data.location_latitude ? String(data.location_latitude) : "",
          location_longitude: data.location_longitude ? String(data.location_longitude) : "",
          open_hours: data.open_hours || "",
          cuisines: data.cuisines || [],
          categories: data.categories || "",
          logo_url: data.logo_url || "",
        });
        setEditId(data.id);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "select-multiple") {
      const options = (e.target as HTMLSelectElement).selectedOptions;
      setForm(f => ({
        ...f,
        [name]: Array.from(options).map(o => o.value)
      }));
    } else {
      setForm(f => ({
        ...f,
        [name]: value
      }));
    }
  };

  const handleCuisinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.selectedOptions;
    setForm(f => ({
      ...f,
      cuisines: Array.from(options).map(o => o.value)
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      setSaving(true);
      const { error: uploadError } = await supabase.storage
        .from("item-images-1")
        .upload(fileName, file);
      if (uploadError) {
        setError("Logo upload failed.");
        setSaving(false);
        return;
      }
      const publicUrl = supabase.storage.from("item-images-1").getPublicUrl(fileName).data.publicUrl;
      setForm(f => ({
        ...f,
        logo_url: publicUrl
      }));
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("User not found. Please login again.");
      setSaving(false);
      navigate("/");
      return;
    }

    // Fetch the numeric user id from your users table using the email
    // Use maybeSingle to avoid error if no row is found
    const { data: userRow, error: userFetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (userFetchError) {
      setError("Could not fetch user profile from database.");
      setSaving(false);
      return;
    }
    if (!userRow) {
      setError("Could not find user profile in database.");
      setSaving(false);
      return;
    }

    const payload = {
      owner_id: userRow.id, // Use numeric id from users table
      name: form.name,
      location_address: form.location_address,
      location_latitude: form.location_latitude ? parseFloat(form.location_latitude) : null,
      location_longitude: form.location_longitude ? parseFloat(form.location_longitude) : null,
      open_hours: form.open_hours,
      cuisines: form.cuisines,
      categories: form.categories,
      logo_url: form.logo_url,
      is_open: false,
      is_active: true,
      status: "pending"
    };
    let result;
    if (editId) {
      result = await supabase.from("restaurants").update(payload).eq("id", editId);
    } else {
      result = await supabase.from("restaurants").insert([payload]);
    }
    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    navigate("/restaurant/dashboard");
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>{editId ? "Edit" : "Setup"} Restaurant Profile</h2>
      {error && <div style={{ color: "#e74c3c", marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Restaurant Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Address</label>
          <textarea name="location_address" value={form.location_address} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Latitude</label>
          <input type="number" name="location_latitude" value={form.location_latitude} onChange={handleChange} step="any" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Longitude</label>
          <input type="number" name="location_longitude" value={form.location_longitude} onChange={handleChange} step="any" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Open Hours</label>
          <input type="text" name="open_hours" value={form.open_hours} onChange={handleChange} placeholder="e.g. 10:00 AM - 10:00 PM" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Cuisines</label>
          <select name="cuisines" multiple value={form.cuisines} onChange={handleCuisinesChange} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", height: 80 }}>
            {CUISINE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Restaurant Type *</label>
          <select name="categories" value={form.categories} onChange={handleChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}>
            <option value="">Select type</option>
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Logo</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: "block", marginTop: 8 }} />
          {form.logo_url && (
            <img src={form.logo_url} alt="Logo" style={{ width: 64, height: 64, borderRadius: 8, marginTop: 8, objectFit: "cover" }} />
          )}
        </div>
        <button type="submit" disabled={saving} style={{ width: "100%", padding: 12, borderRadius: 8, background: "#e74c3c", color: "#fff", fontWeight: 600, border: "none" }}>
          {saving ? "Saving..." : (editId ? "Update Profile" : "Create Profile")}
        </button>
      </form>
    </div>
  );
};

export default RestaurantSetup;
