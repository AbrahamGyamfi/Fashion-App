import React from 'react';
import './Orders.css';

function Orders() {
  const mockOrders = [
    { id: 1, customer: 'John Doe', items: 3, total: 249.97, status: 'Pending', date: '2024-01-15' },
    { id: 2, customer: 'Jane Smith', items: 2, total: 159.98, status: 'Shipped', date: '2024-01-14' },
    { id: 3, customer: 'Bob Johnson', items: 5, total: 399.95, status: 'Delivered', date: '2024-01-13' },
    { id: 4, customer: 'Alice Brown', items: 1, total: 79.99, status: 'Processing', date: '2024-01-15' }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Processing': return 'processing';
      case 'Shipped': return 'shipped';
      case 'Delivered': return 'delivered';
      default: return '';
    }
  };

  return (
    <div className="orders-page">
      <h1 className="page-title">Orders Management</h1>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map(order => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td className="total">${order.total}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.date}</td>
                <td>
                  <button className="btn-view">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-box">
        <p>📦 Order management system coming soon. This is a preview of the orders interface.</p>
      </div>
    </div>
  );
}

export default Orders;
