import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Catalogo from './pages/Catalogo';
import Gestion from './pages/Gestion';
import GestionPedidos from './pages/GestionPedidos'; 
import Boleta from './pages/Boleta';

function App() {
    return (
        <Router>
            {/* El Navbar siempre está visible arriba */}
            <Navbar />
            
            {/* Aquí es donde "cambia" el contenido según la URL */}
            <Routes>
                  <Route path="/" element={<Catalogo />} />
                  <Route path="/admin" element={<Gestion />} />
                  <Route path="/gestionpedido" element={<GestionPedidos />} />
                  {/* ¡Esta es la línea clave para la boleta! */}
                  <Route path="/boleta/:id" element={<Boleta />} /> 
            </Routes>
        </Router>
    );
}

export default App;