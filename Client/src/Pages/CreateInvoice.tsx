import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
// import "../Styles/CreateInvoiceStyle.css"

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface FormData {
  clientName: string;
  invoiceDate: string;
  items: InvoiceItem[];
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    items: [
      { description: '', quantity: 1, price: 0, total: 0 }
    ]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'description' ? value : Number(value)
    };
    
    // Recalculate total
    updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const invoiceData = {
        customerName: formData.clientName,
        date: formData.invoiceDate,
        items: formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: formData.items.reduce((sum, item) => sum + item.total, 0)
      };

      // Make API call to backend using axios
      const response = await axios.post('https://invoicepro-server-side.onrender.com/api/invoices', invoiceData);

      // Only increment count after successful backend creation
      const currentCount = JSON.parse(localStorage.getItem('invoicePro-invoiceCount') || '0');
      localStorage.setItem('invoicePro-invoiceCount', JSON.stringify(currentCount + 1));

      // Navigate back to home
      navigate('/');
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to create invoice');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create invoice');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-invoice-container">
      <div className="create-invoice-header">
        <button className="back-btn" onClick={() => navigate('/')}>Go Back</button>
        <h1>Create Invoice</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-section">
          <h2>Client Information</h2>
          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Invoice Date</label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Items</h2>
          {formData.items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
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
              <div className="form-group">
                <label>Total</label>
                <input
                  type="number"
                  value={item.total.toFixed(2)}
                  readOnly
                />
              </div>
              {formData.items.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => removeItem(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-item-btn" onClick={addItem}>
            + Add Item
          </button>
        </div>

        <div className="form-footer">
          <div className="total-amount">
            Total: ${formData.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Creating invoice...</div>
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
