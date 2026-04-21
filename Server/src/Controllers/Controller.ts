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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Invoice ID is required" });
    }

    const singleInvoice = await Invoice.findOne({ invoiceID: id });

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
    const invoiceData = req.body;

    const invoiceWithId = {
      ...invoiceData,
      invoiceID: uuidv7(),
    };

    const newInvoice = new Invoice(invoiceWithId);
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    console.log("Error while creating your invoice", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function updateInvoice(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Invoice ID is required" });
    }

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { invoiceID: id },
      { $set: req.body },
      { new: true },
    );

    if (!updatedInvoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.log("Error while updating your invoice", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function deleteInvoice(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Invoice ID is required" });
    }

    const deletedInvoice = await Invoice.findOneAndDelete({ invoiceID: id });

    if (!deletedInvoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    res
      .status(200)
      .json({ msg: "Invoice deleted successfully", deletedInvoice });
  } catch (error) {
    console.log("Error while deleting your invoice", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}
