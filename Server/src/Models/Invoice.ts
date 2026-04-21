import mongoose, { Document } from "mongoose";

interface IInvoice extends Document {
  invoiceID: string;
  date: Date;
  customerName: string;
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}

const InvoiceSchema = new mongoose.Schema<IInvoice>({
  invoiceID: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true }
});

const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;
