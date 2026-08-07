import './App.css'
import PaymentAdviceForm from './Pages/PaymentAdviceForm'
import PrintableInvoice from './Pages/PrintableInvoice'
import Dashboard from './Pages/Dashboard';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PaymentAdviceForm/>}/>
          <Route path="/reports" element={<Dashboard/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
