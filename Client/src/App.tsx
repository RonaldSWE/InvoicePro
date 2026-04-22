import React from "react"
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import CreateInvoice from "./Pages/CreateInvoice";
import InvoiceDetails from "./Pages/InvoiceDetails";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-invoice" element={<CreateInvoice />} />
      <Route path="/invoice/:id" element={<InvoiceDetails />} />
    </Routes>
  )
}

export default App;
