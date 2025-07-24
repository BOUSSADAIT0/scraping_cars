import React, { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col justify-between">
      {/* Header modernisé avec logo */}
      <header className="flex flex-col items-center py-8">
        <div className="flex items-center mb-2">
          {/* Logo SVG voiture */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
            <rect width="48" height="48" rx="12" fill="#2563eb"/>
            <path d="M12 32v-4.5a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3V32" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <rect x="14" y="22" width="20" height="6" rx="2" fill="#fff"/>
            <circle cx="16.5" cy="33.5" r="2.5" fill="#fff"/>
            <circle cx="31.5" cy="33.5" r="2.5" fill="#fff"/>
          </svg>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-tight">Prédiction du Prix des Voitures</h1>
        </div>
        <p className="text-gray-500 text-base md:text-lg">Obtenez une estimation instantanée selon vos critères</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Marque */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">directions_car</span>Marque
              </label>
              <select 
                name="marque" 
                value={formData.marque} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              >
                <option value="">Sélectionnez une marque</option>
                {marques.map(marque => (
                  <option key={marque} value={marque}>{marque}</option>
                ))}
              </select>
            </div>
            {/* Modèle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">drive_eta</span>Modèle
              </label>
              <input 
                type="text" 
                name="modele" 
                value={formData.modele} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
            {/* Année */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">event</span>Année
              </label>
              <input 
                type="number" 
                name="annee" 
                min="1990" 
                max="2025" 
                value={formData.annee} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
            {/* Kilométrage */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">speed</span>Kilométrage
              </label>
              <input 
                type="number" 
                name="kilometrage" 
                min="0" 
                max="500000" 
                value={formData.kilometrage} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
            {/* Carburant */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">local_gas_station</span>Carburant
              </label>
              <select 
                name="carburant" 
                value={formData.carburant} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              >
                {carburants.map(carburant => (
                  <option key={carburant} value={carburant}>{carburant.charAt(0).toUpperCase() + carburant.slice(1)}</option>
                ))}
              </select>
            </div>
            {/* Boîte de vitesse */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">settings</span>Boîte de vitesse
              </label>
              <select 
                name="boite" 
                value={formData.boite} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              >
                <option value="manuelle">Manuelle</option>
                <option value="automatique">Automatique</option>
              </select>
            </div>
            {/* Puissance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">bolt</span>Puissance (ch)
              </label>
              <input 
                type="number" 
                name="puissance" 
                min="50" 
                max="500" 
                value={formData.puissance} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
            {/* Nombre de portes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">meeting_room</span>Nombre de portes
              </label>
              <select 
                name="nombrePortes" 
                value={formData.nombrePortes} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              >
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
            </div>
            {/* Couleur */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">palette</span>Couleur
              </label>
              <input 
                type="text" 
                name="couleur" 
                value={formData.couleur} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              />
            </div>
            {/* État */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="material-icons text-blue-500 mr-1">star</span>État
              </label>
              <select 
                name="etat" 
                value={formData.etat} 
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                required
              >
                {etats.map(etat => (
                  <option key={etat} value={etat}>{etat.charAt(0).toUpperCase() + etat.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center"><span className="animate-spin mr-2 material-icons">autorenew</span>Calcul en cours...</span>
              ) : (
                <span className="flex items-center"><span className="material-icons mr-2">search</span>Prédire le prix</span>
              )}
            </button>
          </div>
        </form>

        {/* Résultat animé */}
        {prediction !== null && (
          <div className="mt-10 flex justify-center w-full animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-t-4 border-blue-500 text-center">
              <div className="flex justify-center mb-2">
                <span className="material-icons text-4xl text-blue-500 mr-2">attach_money</span>
                <h2 className="text-2xl font-bold text-gray-800">Estimation du prix</h2>
              </div>
              <p className="text-4xl font-extrabold text-blue-700 mb-2">{prediction.toLocaleString('fr-FR')} €</p>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">Estimation</span>
              <p className="text-sm text-gray-500 mt-2">
                Ce prix est une estimation basée sur les caractéristiques fournies et notre modèle de prédiction.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer moderne */}
      <footer className="w-full py-6 text-center text-gray-400 text-sm mt-12">
        © {new Date().getFullYear()} Prédiction Prix Voiture — Projet personnel
      </footer>
    </div>
  );
};

export default CarPricePredictor;