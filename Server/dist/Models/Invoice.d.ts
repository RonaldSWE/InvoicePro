import mongoose, { Document } from "mongoose";
interface IInvoice extends Document {
    invoiceID: string;
    date: Date;
    customerName: string;
    customerEmail?: string;
    items: {
        description: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: "draft" | "pending" | "paid";
    isDraft: boolean;
}
declare const Invoice: mongoose.Model<IInvoice, {}, {}, {}, mongoose.Document<unknown, {}, IInvoice, {}, mongoose.DefaultSchemaOptions> & IInvoice & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IInvoice>;
export default Invoice;
//# sourceMappingURL=Invoice.d.ts.map