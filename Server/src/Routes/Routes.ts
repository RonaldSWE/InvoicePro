import express from "express";
import {
  getInvoices,
  getSingleInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../Controllers/Controller.ts";

const router = express.Router();

router.get("/", getInvoices);
router.get("/:id", getSingleInvoice);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;
