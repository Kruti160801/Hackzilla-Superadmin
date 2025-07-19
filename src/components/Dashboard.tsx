import React, { useState } from 'react';
import './Dashboard.css';

const initialRestaurants = [
  {
    name: 'The Cozy Corner',
    email: 'cozycorner@email.com',
    status: 'Completed',
    dateJoined: '2023-08-15',
  },
  {
    name: 'Spice Route',
    email: 'spiceroute@email.com',
    status: 'In Progress',
    dateJoined: '2023-09-22',
  },
  {
    name: 'Pasta Paradise',
    email: 'pastaparadise@email.com',
    status: 'Pending',
    dateJoined: '2023-10-10',
  },
  {
    name: 'Burger Barn',
    email: 'burgerbarn@email.com',
    status: 'Completed',
    dateJoined: '2023-11-05',
  },
];

const statusColors: Record<string, string> = {
  Completed: '#22c55e',
  'In Progress': '#fde68a',
  Pending: '#f87171',
};

function InviteRestaurantForm() {
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="dashboard-card">
      <h2>Invite Restaurant</h2>
      <div className="dashboard-form-row">
        <input
          type="text"
          placeholder="Enter restaurant name"
          value={restaurantName}
          onChange={e => setRestaurantName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <textarea
        placeholder="Add a personalized message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="dashboard-textarea"
      />
      <div className="dashboard-btn-row">
        <button className="dashboard-btn-primary">Send Invitation</button>
        <button className="dashboard-btn-secondary">Resend</button>
        <button className="dashboard-btn-danger">Revoke</button>
      </div>
    </div>
  );
}

function RestaurantList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Statuses');
  const [restaurants] = useState(initialRestaurants);

  const filtered = restaurants.filter(r =>
    (status === 'All Statuses' || r.status === status) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dashboard-card">
      <div className="dashboard-list-header">
        <h2>Restaurant List</h2>
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="dashboard-search"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="dashboard-select"
        >
          <option>All Statuses</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Pending</option>
        </select>
      </div>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>RESTAURANT NAME</th>
            <th>EMAIL</th>
            <th>ONBOARDING STATUS</th>
            <th>DATE JOINED</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td style={{ color: '#6366f1' }}>{r.email}</td>
              <td>
                <span
                  style={{
                    background: statusColors[r.status],
                    color: r.status === 'In Progress' ? '#92400e' : '#fff',
                    borderRadius: 8,
                    padding: '2px 12px',
                    fontWeight: 500,
                    fontSize: 14,
                    display: 'inline-block',
                  }}
                >
                  {r.status}
                </span>
              </td>
              <td>{r.dateJoined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Dashboard: React.FC = () => (
  <div className="dashboard-main">
    <InviteRestaurantForm />
    <RestaurantList />
  </div>
);

export default Dashboard;
