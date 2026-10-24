import { Routes, Route } from "react-router-dom";
import Orders from "./pages/order";
import OrderDetails from "./pages/orderdetails";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Orders />} />
      <Route path="/orders" element={<OrderDetails />} />
    </Routes>
  );
}

export default App;