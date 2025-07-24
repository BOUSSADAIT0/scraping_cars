import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Card, InputGroup } from 'react-bootstrap';

const CarPricePredictor = () => {
  // États pour stocker les valeurs du formulaire
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    annee: 2020,
    kilometrage: 0,
    carburant: 'essence',
    boite: 'manuelle',
    puissance: 100,
    nombrePortes: 5,
    couleur: '',
    etat: 'bon'
  });
  
  // État pour le résultat de la prédiction
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Liste des marques communes
  const marques = ['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'Toyota', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Opel'];
  
  // Liste des carburants
  const carburants = ['essence', 'diesel', 'électrique', 'hybride', 'GPL'];
  
  // Liste des états
  const etats = ['neuf', 'excellent', 'très bon', 'bon', 'moyen', 'à restaurer'];

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Conversion en nombre pour les champs numériques
    const processedValue = ['annee', 'kilometrage', 'puissance', 'nombrePortes'].includes(name)
      ? Number(value)
      : value;
      
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  // Fonction de prédiction de prix fictive
  const predictPrice = () => {
    setLoading(true);
    
    // Simulation d'un appel API avec un délai
    setTimeout(() => {
      // Formule simplifiée pour simuler une prédiction
      let basePrice = 10000;
      
      // Ajustement par marque
      const marqueFactors = {
        'BMW': 1.5,
        'Mercedes': 1.6,
        'Audi': 1.4,
        'Volkswagen': 1.2,
        'Toyota': 1.1,
        'Peugeot': 0.9,
        'Renault': 0.85,
        'Citroën': 0.8,
        'Ford': 0.9,
        'Opel': 0.85
      };
      
      const marqueFactor = marqueFactors[formData.marque] || 1;
      
      // Ajustement par année (prix diminue avec l'âge)
      const currentYear = new Date().getFullYear();
      const ageDiscount = (currentYear - formData.annee) * 0.05;
      
      // Ajustement par kilométrage
      const kmDiscount = formData.kilometrage / 20000 * 0.1;
      
      // Ajustement par carburant
      const fuelFactors = {
        'essence': 1,
        'diesel': 1.1,
        'électrique': 1.4,
        'hybride': 1.3,
        'GPL': 0.9
      };
      
      const fuelFactor = fuelFactors[formData.carburant] || 1;
      
      // Ajustement par état
      const stateFactors = {
        'neuf': 1.5,
        'excellent': 1.3,
        'très bon': 1.15,
        'bon': 1,
        'moyen': 0.8,
        'à restaurer': 0.6
      };
      
      const stateFactor = stateFactors[formData.etat] || 1;
      
      // Calcul final
      const estimatedPrice = basePrice * marqueFactor * (1 - ageDiscount) * (1 - kmDiscount) * fuelFactor * stateFactor * (formData.puissance / 100);
      
      // Arrondir à l'euro près
      const finalPrice = Math.round(estimatedPrice);
      
      setPrediction(finalPrice);
      setLoading(false);
    }, 1000);
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    predictPrice();
  };

  return (
    <Container fluid className="min-vh-100 d-flex flex-column justify-content-between bg-light">
      {/* Header modernisé avec logo */}
      <header className="d-flex flex-column align-items-center py-4">
        <div className="d-flex align-items-center mb-2">
          {/* Logo SVG voiture */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-3">
            <rect width="48" height="48" rx="12" fill="#2563eb"/>
            <path d="M12 32v-4.5a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3V32" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <rect x="14" y="22" width="20" height="6" rx="2" fill="#fff"/>
            <circle cx="16.5" cy="33.5" r="2.5" fill="#fff"/>
            <circle cx="31.5" cy="33.5" r="2.5" fill="#fff"/>
          </svg>
          <h1 className="h3 fw-bold text-primary mb-0">Prédiction du Prix des Voitures</h1>
        </div>
        <p className="text-secondary">Obtenez une estimation instantanée selon vos critères</p>
      </header>

      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        <Card className="w-100" style={{ maxWidth: 700, background: 'rgba(255,255,255,0.95)' }}>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                {/* Marque */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="marque">
                    <Form.Label><span className="me-1">🚗</span>Marque</Form.Label>
                    <Form.Select name="marque" value={formData.marque} onChange={handleChange} required>
                      <option value="">Sélectionnez une marque</option>
                      {marques.map(marque => (
                        <option key={marque} value={marque}>{marque}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                {/* Modèle */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="modele">
                    <Form.Label><span className="me-1">🚙</span>Modèle</Form.Label>
                    <Form.Control type="text" name="modele" value={formData.modele} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                {/* Année */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="annee">
                    <Form.Label><span className="me-1">📅</span>Année</Form.Label>
                    <Form.Control type="number" name="annee" min="1990" max="2025" value={formData.annee} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                {/* Kilométrage */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="kilometrage">
                    <Form.Label><span className="me-1">⏱️</span>Kilométrage</Form.Label>
                    <Form.Control type="number" name="kilometrage" min="0" max="500000" value={formData.kilometrage} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                {/* Carburant */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="carburant">
                    <Form.Label><span className="me-1">⛽</span>Carburant</Form.Label>
                    <Form.Select name="carburant" value={formData.carburant} onChange={handleChange} required>
                      {carburants.map(carburant => (
                        <option key={carburant} value={carburant}>{carburant.charAt(0).toUpperCase() + carburant.slice(1)}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                {/* Boîte de vitesse */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="boite">
                    <Form.Label><span className="me-1">⚙️</span>Boîte de vitesse</Form.Label>
                    <Form.Select name="boite" value={formData.boite} onChange={handleChange} required>
                      <option value="manuelle">Manuelle</option>
                      <option value="automatique">Automatique</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                {/* Puissance */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="puissance">
                    <Form.Label><span className="me-1">⚡</span>Puissance (ch)</Form.Label>
                    <Form.Control type="number" name="puissance" min="50" max="500" value={formData.puissance} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                {/* Nombre de portes */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="nombrePortes">
                    <Form.Label><span className="me-1">🚪</span>Nombre de portes</Form.Label>
                    <Form.Select name="nombrePortes" value={formData.nombrePortes} onChange={handleChange} required>
                      <option value={3}>3</option>
                      <option value={5}>5</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                {/* Couleur */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="couleur">
                    <Form.Label><span className="me-1">🎨</span>Couleur</Form.Label>
                    <Form.Control type="text" name="couleur" value={formData.couleur} onChange={handleChange} />
                  </Form.Group>
                </Col>
                {/* État */}
                <Col xs={12} md={6}>
                  <Form.Group controlId="etat">
                    <Form.Label><span className="me-1">⭐</span>État</Form.Label>
                    <Form.Select name="etat" value={formData.etat} onChange={handleChange} required>
                      {etats.map(etat => (
                        <option key={etat} value={etat}>{etat.charAt(0).toUpperCase() + etat.slice(1)}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-center mt-4">
                <Button type="submit" variant="primary" size="lg" disabled={loading} className="fw-bold px-5">
                  {loading ? <><Spinner animation="border" size="sm" className="me-2" />Calcul en cours...</> : <><span className="me-2">🔍</span>Prédire le prix</>}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Résultat animé */}
        {prediction !== null && (
          <Card className="mt-5 mx-auto text-center border-primary" style={{ maxWidth: 400, borderTop: '6px solid #2563eb' }}>
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center mb-2">
                <span className="fs-2 text-primary me-2">💶</span>
                <h2 className="h5 fw-bold mb-0">Estimation du prix</h2>
              </div>
              <div className="display-5 fw-bold text-primary mb-2">{Math.abs(prediction).toLocaleString('fr-FR')} €</div>
              <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold mb-2">Estimation</span>
              <p className="text-secondary small mt-2">
                Ce prix est une estimation basée sur les caractéristiques fournies et notre modèle de prédiction.
              </p>
            </Card.Body>
          </Card>
        )}
      </main>

      {/* Footer moderne */}
      <footer className="w-100 py-3 text-center text-secondary small mt-5">
        © {new Date().getFullYear()} Prédiction Prix Voiture — Projet personnel
      </footer>
    </Container>
  );
};

export default CarPricePredictor;