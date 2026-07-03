import { useState } from 'react';
import { getEnvioPorSeguimiento } from '../services/api';
import EnvioInfo from '../components/EnvioInfo';

export default function Seguimiento() {
    const [numero, setNumero] = useState('');
    const [envio, setEnvio] = useState(null);
    const [estado, setEstado] = useState('inicial'); // inicial | buscando | encontrado | no-encontrado

    const buscar = async (e) => {
        e.preventDefault();
        const codigo = numero.trim();
        if (!codigo) return;
        setEstado('buscando');
        setEnvio(null);
        try {
            const data = await getEnvioPorSeguimiento(codigo);
            if (data && data.id) {
                setEnvio(data);
                setEstado('encontrado');
            } else {
                setEstado('no-encontrado');
            }
        } catch {
            setEstado('no-encontrado');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 620 }}>
            <h2 className="mb-1">🔎 Seguimiento de Envío</h2>
            <p className="text-muted">Ingresa tu número de seguimiento para conocer el estado de tu despacho.</p>

            <form className="d-flex gap-2 mb-4" onSubmit={buscar}>
                <input
                    className="form-control"
                    placeholder="Ej: SLX-1A2B3C4D"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                />
                <button className="btn btn-primary" type="submit" disabled={!numero.trim()}>
                    Buscar
                </button>
            </form>

            {estado === 'buscando' && <p className="text-muted text-center">Buscando…</p>}

            {estado === 'no-encontrado' && (
                <div className="alert alert-warning">
                    No encontramos ningún envío con ese número de seguimiento. Verifica el código e inténtalo de nuevo.
                </div>
            )}

            {estado === 'encontrado' && envio && <EnvioInfo envio={envio} />}
        </div>
    );
}
