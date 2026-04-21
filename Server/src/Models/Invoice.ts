import mongoose, { Document } from "mongoose";

interface IInvoice extends Document {
  invoiceID: string;
  date: Date;
  customerName: string;
  customerEmail?: string; // For validation
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "draft" | "pending" | "paid"; // Add this
  isDraft: boolean; // Or just use status === "draft"
}

const InvoiceSchema = new mongoose.Schema<IInvoice>({
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

const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;
