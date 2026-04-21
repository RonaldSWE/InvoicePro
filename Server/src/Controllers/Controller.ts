import { type Request, type Response } from "express";
import { v7 as uuidv7 } from "uuid";
import Invoice from "../Models/Invoice.ts";

export async function getInvoices(req: Request, res: Response) {
  try {
    const invoice = await Invoice.find();
    res.status(200).json(invoice);
  } catch (error) {
    console.log("Error while fetching your todo", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function getSingleInvoice(req: Request, res: Response) {
  try {
    const singleInvoice = await Invoice.findOne({ id: req.params.id });

    if (!singleInvoice) {
      return res.status(404).json({
        status: "error",
        message: "Invoice not found",
      });
    }

    res.status(200).json(singleInvoice);
  } catch (error) {
    console.log("Error while fetching your todo", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function createInvoice(req: Request, res: Response) {
  try {
    const { invoice } = req.body;
    const newInvoice = new Invoice({ invoice });
    await newInvoice.save(); // The save() add info to the DataBase
    res.status(201).json(newInvoice);
  } catch (error) {
    console.log("Error while creating your invoice", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}
export async function updateInvoice(req: Request, res: Response) {
  try {
    const { invoice } = req.body;
    const UpdatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, {
      invoice,
    });

    if (!UpdatedInvoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    res.status(200).json(UpdatedInvoice);
  } catch (error) {
    console.log("Error while updating your invoice", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}
export async function deleteInvoice(req: Request, res: Response) {
  try {
    const { invoice } = req.body;
    const DeletedInvoice = await Invoice.findByIdAndDelete(req.params.id, {
      invoice,
    });

    if (!DeletedInvoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    res.status(200).json(DeletedInvoice);
  } catch (error) {
    console.log("Error while updating your invoice", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}
