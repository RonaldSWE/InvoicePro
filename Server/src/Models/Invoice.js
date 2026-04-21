import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  invoiceID: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["draft", "pending", "paid"],
    default: "pending",
  },
  isDraft: { type: Boolean, default: false },
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
