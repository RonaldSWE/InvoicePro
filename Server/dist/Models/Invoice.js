import mongoose, { Document } from "mongoose";
const InvoiceSchema = new mongoose.Schema({
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
const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
//# sourceMappingURL=Invoice.js.map