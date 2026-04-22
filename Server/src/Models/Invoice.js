import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  invoiceID: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  senderStreetAddress: { type: String, required: true },
  senderCity: { type: String, required: true },
  senderPostalCode: { type: Number, required: true },
  senderCountry: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  receiverStreetAddress: { type: String, required: true },
  receiverCity: { type: String, required: true },
  receiverPostalCode: { type: Number, required: true },
  receiverCountry: { type: String, required: true },
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
