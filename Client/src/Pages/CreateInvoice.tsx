import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import "../Styles/CreateInvoice.css";

interface Item {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  // Sender info (required)
  senderStreetAddress: string;
  senderCity: string;
  senderPostalCode: number;
  senderCountry: string;
  // Customer info
  customerName: string;
  customerEmail: string;
  // Receiver info (required)
  receiverStreetAddress: string;
  receiverCity: string;
  receiverPostalCode: number;
  receiverCountry: string;
  // Invoice info
  date: string;
  items: Item[];
  totalAmount: number;
  status: "draft" | "pending" | "paid";
  isDraft: boolean;
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme state
  const [isDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('invoicePro-theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Apply theme to body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const [formData, setFormData] = useState<InvoiceData>({
    // Sender info
    senderStreetAddress: '',
    senderCity: '',
    senderPostalCode: 0,
    senderCountry: '',
    // Customer info
    customerName: '',
    customerEmail: '',
    // Receiver info
    receiverStreetAddress: '',
    receiverCity: '',
    receiverPostalCode: 0,
    receiverCountry: '',
    // Invoice info
    date: new Date().toISOString(),
    items: [{ description: '', quantity: 1, price: 0 }],
    totalAmount: 0,
    status: "pending",
    isDraft: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('PostalCode') ? parseInt(value) || 0 : value
    }));
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'description' ? value : Number(value)
    };

    // Recalculate total amount
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: totalAmount
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      const totalAmount = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      setFormData(prev => ({
        ...prev,
        items: updatedItems,
        totalAmount: totalAmount
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send EXACTLY what your backend expects
      const invoiceData = {
        date: new Date(formData.date).toISOString(),
        senderStreetAddress: formData.senderStreetAddress,
        senderCity: formData.senderCity,
        senderPostalCode: formData.senderPostalCode,
        senderCountry: formData.senderCountry,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        receiverStreetAddress: formData.receiverStreetAddress,
        receiverCity: formData.receiverCity,
        receiverPostalCode: formData.receiverPostalCode,
        receiverCountry: formData.receiverCountry,
        items: formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: formData.totalAmount,
        status: formData.status,
        isDraft: formData.isDraft
      };

      console.log("Sending data:", invoiceData); // Debug log

      await axios.post('https://invoicepro-server-side.onrender.com/api/invoices', invoiceData);

      // Update localStorage count
      const response = await axios.get('https://invoicepro-server-side.onrender.com/api/invoices');
      localStorage.setItem('invoicePro-invoiceCount', JSON.stringify(response.data.length));

      toast.success('Invoice created successfully!');
      navigate('/');

    } catch (err) {
      console.error("Error:", err);
      if (axios.isAxiosError(err)) {
        console.error("Response data:", err.response?.data);
        setError(err.response?.data?.message || 'Failed to create invoice');
        toast.error(err.response?.data?.message || 'Failed to create invoice');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create invoice');
        toast.error('Failed to create invoice');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setLoading(true);
    setError(null);

    try {
      const invoiceData = {
        date: new Date(formData.date).toISOString(),
        senderStreetAddress: formData.senderStreetAddress,
        senderCity: formData.senderCity,
        senderPostalCode: formData.senderPostalCode,
        senderCountry: formData.senderCountry,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        receiverStreetAddress: formData.receiverStreetAddress,
        receiverCity: formData.receiverCity,
        receiverPostalCode: formData.receiverPostalCode,
        receiverCountry: formData.receiverCountry,
        items: formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: formData.totalAmount,
        status: "draft",
        isDraft: true
      };

      await axios.post('https://invoicepro-server-side.onrender.com/api/invoices', invoiceData);

      const response = await axios.get('https://invoicepro-server-side.onrender.com/api/invoices');
      localStorage.setItem('invoicePro-invoiceCount', JSON.stringify(response.data.length));

      toast.success('Invoice saved as draft!');
      navigate('/');

    } catch (err) {
      console.error("Error:", err);
      toast.error('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`create-invoice-container ${isDark ? 'dark' : ''}`}>
      <div className="create-invoice-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Go Back
        </button>
        <h1>Create Invoice</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="invoice-form">
          {/* Sender Section */}
          <div className="form-section">
            <h2>Sender Address</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="senderStreetAddress"
                  value={formData.senderStreetAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="senderCity"
                  value={formData.senderCity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code *</label>
                <input
                  type="number"
                  name="senderPostalCode"
                  value={formData.senderPostalCode || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="senderCountry"
                  value={formData.senderCountry}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Customer Section */}
          <div className="form-section">
            <h2>Customer Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Customer Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Receiver Section */}
          <div className="form-section">
            <h2>Receiver Address</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="receiverStreetAddress"
                  value={formData.receiverStreetAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="receiverCity"
                  value={formData.receiverCity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code *</label>
                <input
                  type="number"
                  name="receiverPostalCode"
                  value={formData.receiverPostalCode || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="receiverCountry"
                  value={formData.receiverCountry}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="form-section">
            <h2>Items</h2>
            {formData.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="form-group">
                  <label>Description *</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group small">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group small">
                  <label>Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group small">
                  <label>Total</label>
                  <input
                    type="text"
                    value={(item.quantity * item.price).toFixed(2)}
                    readOnly
                    className="readonly"
                  />
                </div>
                {formData.items.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeItem(index)}>
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-item-btn" onClick={addItem}>
              + Add New Item
            </button>
          </div>

          <div className="total-amount">
            <h3>Total Amount</h3>
            <p>${formData.totalAmount.toFixed(2)}</p>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="button" className="draft-btn" onClick={handleSaveAsDraft} disabled={loading}>
              Save as Draft
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>

      <Toaster />
    </div>
  );
};

export default CreateInvoice;