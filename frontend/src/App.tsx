import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Header from './components/Header';

import Landing from './pages/Landing';
import Planner from './pages/Planner';
import Destination from './pages/Destination';
import Itinerary from './pages/Itinerary';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="flex flex-column min-h-screen">
      <Header />
      <Navbar />
      <main className="flex-grow-1 p-4 mt-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/destination/:id" element={<Destination />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
