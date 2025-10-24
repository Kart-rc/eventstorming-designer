import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Workshop from './pages/Workshop';
import { SessionProvider } from './context/SessionContext';

function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="min-h-screen">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workshop/:sessionId?" element={<Workshop />} />
          </Routes>
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;
