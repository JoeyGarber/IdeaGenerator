import "tailwindcss/tailwind.css"
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GiftGenerator from './pages/giftGenerator';


function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GiftGenerator />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
