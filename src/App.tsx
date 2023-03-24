import "tailwindcss/tailwind.css"
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/homepage';


function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
