import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import ScrollToTop from './components/ScrollToTop';
import Chatbot from './components/Chatbot';

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Chatbot />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="listings" element={<Listings />} />
            <Route path="property/:id" element={<PropertyDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;