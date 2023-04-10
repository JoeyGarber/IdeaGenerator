import "tailwindcss/tailwind.css"
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GiftGenerator from './pages/giftGenerator';
import { Analytics } from '@vercel/analytics/react';


function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GiftGenerator />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </main>
  );
}

export default App;
