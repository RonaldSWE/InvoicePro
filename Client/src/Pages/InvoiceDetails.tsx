import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "../Styles/InvoiceDetails.css";

interface Item {
  description: string;
  quantity: number;
  price: number;
}

interface Invoice {
  _id: string;
  invoiceID: string;
  date: string;
  senderStreetAddress: string;
  senderCity: string;
  senderPostalCode: number;
  senderCountry: string;
  customerName: string;
  customerEmail: string;
  receiverStreetAddress: string;
  receiverCity: string;
  receiverPostalCode: number;
  receiverCountry: string;
  items: Item[];
  totalAmount: number;
  status: "draft" | "pending" | "paid";
  isDraft: boolean;
}

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("invoicePro-theme");
    return saved ? JSON.parse(saved) : false;
  });

  // Fetch invoice details
  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://invoicepro-server-side.onrender.com/api/invoices/${id}`
      );
      setInvoice(response.data);
      setEditedInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to load invoice");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  // Update total amount when items change
  const calculateTotal = (items: Item[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  // Handle field changes
  const handleFieldChange = (
    field: keyof Invoice,
    value: string | number | Item[]
  ) => {
    if (!editedInvoice) return;
    const updated = { ...editedInvoice, [field]: value };
    if (field === "items") {
      updated.totalAmount = calculateTotal(value as Item[]);
    }
    setEditedInvoice(updated);
  };

  // Handle item changes
  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    if (!editedInvoice) return;
    const newItems = [...editedInvoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedInvoice({
      ...editedInvoice,
      items: newItems,
      totalAmount: calculateTotal(newItems),
    });
  };

  // Add new item
  const addItem = () => {
    if (!editedInvoice) return;
    setEditedInvoice({
      ...editedInvoice,
      items: [...editedInvoice.items, { description: "", quantity: 1, price: 0 }],
    });
    toast.success("New item added");
  };

  // Remove item
  const removeItem = (index: number) => {
    if (!editedInvoice) return;
    const newItems = editedInvoice.items.filter((_, i) => i !== index);
    setEditedInvoice({
      ...editedInvoice,
      items: newItems,
      totalAmount: calculateTotal(newItems),
    });
    toast.success("Item removed");
  };

  // Save changes
  const handleSave = async () => {
    if (!editedInvoice) return;
    const savePromise = axios.put(
      `https://invoicepro-server-side.onrender.com/api/invoices/${editedInvoice.invoiceID}`,
      editedInvoice
    );

    toast.promise(savePromise, {
      loading: "Saving invoice...",
      success: "Invoice updated successfully! ✅",
      error: "Failed to save invoice ❌",
    });

    try {
      const response = await savePromise;
      setInvoice(response.data);
      setIsEditing(false);
      // Update count in localStorage
      const res = await axios.get("https://invoicepro-server-side.onrender.com/api/invoices");
      localStorage.setItem("invoicePro-invoiceCount", JSON.stringify(res.data.length));
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  // Delete invoice
  const handleDelete = async () => {
    if (!invoice) return;

    const deletePromise = axios.delete(
      `https://invoicepro-server-side.onrender.com/api/invoices/${invoice.invoiceID}`
    );

    toast.promise(deletePromise, {
      loading: "Deleting invoice...",
      success: "Invoice deleted successfully! 🗑️",
      error: "Failed to delete invoice ❌",
    });

    try {
      await deletePromise;
      const res = await axios.get("https://invoicepro-server-side.onrender.com/api/invoices");
      localStorage.setItem("invoicePro-invoiceCount", JSON.stringify(res.data.length));
      setShowDeleteModal(false);
      navigate("/");
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  // Update status
  const updateStatus = async (newStatus: "draft" | "pending" | "paid") => {
    if (!invoice) return;

    const statusPromise = axios.put(
      `https://invoicepro-server-side.onrender.com/api/invoices/${invoice.invoiceID}`,
      { ...invoice, status: newStatus, isDraft: newStatus === "draft" }
    );

    toast.promise(statusPromise, {
      loading: `Changing status to ${newStatus}...`,
      success: `Status changed to ${newStatus}! 🎉`,
      error: "Failed to update status ❌",
    });

    try {
      const response = await statusPromise;
      setInvoice(response.data);
      setEditedInvoice(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <div className={`loading ${isDark ? "dark" : ""}`}>Loading invoice...</div>;
  if (!invoice || !editedInvoice) return <div className={`loading ${isDark ? "dark" : ""}`}>Invoice not found</div>;

  return (
    <div className={`invoice-details-container ${isDark ? "dark" : ""}`}>
      <Toaster position="top-right" />

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Go Back
      </button>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="status-label">Status</span>
          <span className={`status-badge ${invoice.status}`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
        <div className="status-actions">
          {!isEditing && (
            <>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
                Delete
              </button>
              {invoice.status !== "paid" && (
                <button
                  className="mark-paid-btn"
                  onClick={() => updateStatus("paid")}
                >
                  Mark as Paid
                </button>
              )}
            </>
          )}
          {isEditing && (
            <>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Content */}
      <div className="invoice-content">
        {!isEditing ? (
          // View Mode
          <>
            <div className="invoice-header-section">
              <div>
                <h2>#{invoice.invoiceID.slice(0, 8)}</h2>
                <p className="description">{invoice.items[0]?.description || "No items"}</p>
              </div>
              <div className="address">
                <p>{invoice.senderStreetAddress}</p>
                <p>{invoice.senderCity}</p>
                <p>{invoice.senderPostalCode}</p>
                <p>{invoice.senderCountry}</p>
              </div>
            </div>

            <div className="invoice-details-section">
              <div>
                <p className="label">Invoice Date</p>
                <p className="value">{new Date(invoice.date).toLocaleDateString()}</p>
                <p className="label">Payment Due</p>
                <p className="value">{new Date(invoice.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="label">Bill To</p>
                <p className="value">{invoice.customerName}</p>
                <p>{invoice.receiverStreetAddress}</p>
                <p>{invoice.receiverCity}</p>
                <p>{invoice.receiverPostalCode}</p>
                <p>{invoice.receiverCountry}</p>
              </div>
              <div>
                <p className="label">Sent To</p>
                <p className="value">{invoice.customerEmail}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="items-table">
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>QTY</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>£{item.price.toLocaleString()}</td>
                      <td>£{(item.quantity * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="total-label">Grand Total</td>
                    <td className="total-amount">£{invoice.totalAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        ) : (
          // Edit Mode
          <div className="edit-mode">
            <h2>Edit Invoice</h2>

            <section>
              <h3>Sender Address</h3>
              <input
                type="text"
                value={editedInvoice.senderStreetAddress}
                onChange={(e) => handleFieldChange("senderStreetAddress", e.target.value)}
                placeholder="Street Address"
              />
              <input
                type="text"
                value={editedInvoice.senderCity}
                onChange={(e) => handleFieldChange("senderCity", e.target.value)}
                placeholder="City"
              />
              <input
                type="number"
                value={editedInvoice.senderPostalCode}
                onChange={(e) => handleFieldChange("senderPostalCode", parseInt(e.target.value))}
                placeholder="Postal Code"
              />
              <input
                type="text"
                value={editedInvoice.senderCountry}
                onChange={(e) => handleFieldChange("senderCountry", e.target.value)}
                placeholder="Country"
              />
            </section>

            <section>
              <h3>Customer</h3>
              <input
                type="text"
                value={editedInvoice.customerName}
                onChange={(e) => handleFieldChange("customerName", e.target.value)}
                placeholder="Customer Name"
              />
              <input
                type="email"
                value={editedInvoice.customerEmail}
                onChange={(e) => handleFieldChange("customerEmail", e.target.value)}
                placeholder="Email"
              />
            </section>

            <section>
              <h3>Receiver Address</h3>
              <input
                type="text"
                value={editedInvoice.receiverStreetAddress}
                onChange={(e) => handleFieldChange("receiverStreetAddress", e.target.value)}
                placeholder="Street Address"
              />
              <input
                type="text"
                value={editedInvoice.receiverCity}
                onChange={(e) => handleFieldChange("receiverCity", e.target.value)}
                placeholder="City"
              />
              <input
                type="number"
                value={editedInvoice.receiverPostalCode}
                onChange={(e) => handleFieldChange("receiverPostalCode", parseInt(e.target.value))}
                placeholder="Postal Code"
              />
              <input
                type="text"
                value={editedInvoice.receiverCountry}
                onChange={(e) => handleFieldChange("receiverCountry", e.target.value)}
                placeholder="Country"
              />
            </section>

            <section>
              <h3>Items</h3>
              {editedInvoice.items.map((item, idx) => (
                <div key={idx} className="edit-item-row">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", parseInt(e.target.value) || 0)}
                    placeholder="Qty"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(idx, "price", parseInt(e.target.value) || 0)}
                    placeholder="Price"
                  />
                  <button type="button" onClick={() => removeItem(idx)}>🗑️</button>
                </div>
              ))}
              <button type="button" className="add-item-btn" onClick={addItem}>
                + Add New Item
              </button>
            </section>

            <section>
              <h3>Status</h3>
              <select
                value={editedInvoice.status}
                onChange={(e) => handleFieldChange("status", e.target.value as any)}
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </section>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete invoice #{invoice.invoiceID.slice(0, 8)}? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;