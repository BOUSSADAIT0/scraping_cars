import React, { useState } from 'react';

const CarPricePredictor = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    fuel: '',
    condition: '',
    gearbox: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const carModels = {
    Toyota: [
      "Yaris", "Corolla", "RAV4", "4-Runner", "Allion", "Alphard", "Altezza", "Aristo", "Auris", 
      "Avalon", "Avensis", "Avensis Verso", "Aygo", "Aygo X", "BB", "Belta", "bZ4X", "C-HR", 
      "Caldina", "Cami", "Camry", "Carina", "Celica", "Chaser", "Coaster", "Corolla Cross", 
      "Corolla Verso", "Corona", "Corsa", "Cressida", "Cresta", "Crown", "Duet", "Dyna", 
      "Estima", "FJ Cruiser", "FJ40", "Fortuner", "Fun Cruiser", "Funcargo", "Gaia", "GR86", 
      "GT86", "Harrier", "HDJ", "Hiace", "Highlander", "Hilux", "Ipsum", "iQ", "Ist", "KJ", 
      "Land Cruiser", "Land Cruiser Prado", "Lite-Ace", "Mark II", "Mark X", "Matrix", "Mirai", 
      "Model F", "MR 2", "Nadia", "Noah", "Opa", "Paseo", "Passo", "Pick up", "Picnic", "Platz", 
      "Premio", "Previa", "Prius", "Prius+", "Proace", "Proace City", "Proace Max", "Ractis", 
      "Raum", "Sequoia", "Sienna", "Solara", "Sprinter", "Starlet", "Supra", "Tacoma", "Tercel", 
      "Town Ace", "Tundra", "Urban Cruiser", "Venza", "Verossa", "Verso", "Verso-S", "Vista", 
      "Vitz", "Voxy", "Will", "Windom", "Wish", "Yaris Cross", "Autres"
    ],
    BMW: [
      "Série 1", "Série 3", "X5", "2002", "i3", "i4", "i5", "i7", "i8", "iX", "iX1", "iX2", 
      "iX3", "Série 1 (tous)", "114", "116", "118", "120", "123", "125", "128", "130", "135", 
      "140", "Série 2 (tous)", "214", "216", "218", "220", "223", "225", "228", "230", "235", 
      "240", "Série 3 (tous)", "315", "316", "318", "320", "323", "324", "325", "328", "330", 
      "335", "340", "Active Hybrid 3", "Série 4 (tous)", "418", "420", "425", "428", "430", 
      "435", "440", "Série 5 (tous)", "518", "520", "523", "524", "525", "528", "530", "535", 
      "540", "545", "550", "Active Hybrid 5", "Série 6 (tous)", "620", "628", "630", "633", 
      "635", "640", "645", "650", "Série 7 (tous)", "725", "728", "730", "732", "735", "740", 
      "745", "750", "760", "Active Hybrid 7", "Série 8 (tous)", "830", "840", "850", "Série M (tous)", 
      "1er M Coupé", "M1", "M2", "M3", "M4", "M5", "M550", "M6", "M8", "M850", "Série X (tous)", 
      "Active Hybrid X6", "X1", "X2", "X2 M", "X3", "X3 M", "X4", "X4 M", "X5 M", "X6", "X6 M", 
      "X7", "X7 M", "XM", "Série Z (tous)", "Z1", "Z3", "Z3 M", "Z4", "Z4 M", "Z8", "Autres"
    ],
    MercedesBenz:[
      "170",
      "180",
      "190",
      "200",
      "208",
      "210/310",
      "220",
      "230",
      "240",
      "250",
      "260",
      "270",
      "280",
      "300",
      "308",
      "320",
      "350",
      "380",
      "400",
      "416",
      "420",
      "450",
      "500",
      "560",
      "600",
      "Actros",
      "AMG GT",
      "AMG ONE",
      "Atego",
      "CE (tous)",
      "CE 200",
      "CE 220",
      "CE 230",
      "CE 280",
      "CE 300",
      "Citan",
      "CL (tous)",
      "CL",
      "CL 160",
      "CL 180",
      "CL 200",
      "CL 220",
      "CL 230",
      "CL 320",
      "CL 420",
      "CL 500",
      "CL 55 AMG",
      "CL 600",
      "CL 63 AMG",
      "CL 65 AMG",
      "CLA (tous)",
      "CLA 180",
      "CLA 200",
      "CLA 220",
      "CLA 250",
      "CLA 35 AMG",
      "CLA 350",
      "CLA 45 AMG",
      "Classe A (tous)",
      "A 140",
      "A 150",
      "A 160",
      "A 170",
      "A 180",
      "A 190",
      "A 200",
      "A 210",
      "A 220",
      "A 250",
      "A 35 AMG",
      "A 45 AMG",
      "Classe B (tous)",
      "B 150",
      "B 160",
      "B 170",
      "B 180",
      "B 200",
      "B 220",
      "B 250",
      "B Electric Drive",
      "Classe C (tous)",
      "C 160",
      "C 180",
      "C 200",
      "C 220",
      "C 230",
      "C 240",
      "C 250",
      "C 270",
      "C 280",
      "C 30 AMG",
      "C 300",
      "C 32 AMG",
      "C 320",
      "C 350",
      "C 36 AMG",
      "C 400",
      "C 43 AMG",
      "C 450",
      "C 55 AMG",
      "C 63 AMG",
      "Classe E (tous)",
      "E 200",
      "E 220",
      "E 230",
      "E 240",
      "E 250",
      "E 260",
      "E 270",
      "E 280",
      "E 290",
      "E 300",
      "E 320",
      "E 350",
      "E 36 AMG",
      "E 400",
      "E 420",
      "E 43 AMG",
      "E 430",
      "E 450",
      "E 50 AMG",
      "E 500",
      "E 53 AMG",
      "E 55 AMG",
      "E 550",
      "E 60 AMG",
      "E 63 AMG",
      "Classe EQ (tous)",
      "EQA",
      "EQA 250",
      "EQA 300",
      "EQA 350",
      "EQB 250",
      "EQB 300",
      "EQB 350",
      "EQC 400",
      "EQE 300",
      "EQE 350",
      "EQE 43",
      "EQE 500",
      "EQE 53",
      "EQE SUV",
      "EQS",
      "EQS SUV",
      "EQT",
      "EQV 250",
      "EQV 300",
      "Classe G (tous)",
      "G",
      "G 230",
      "G 240",
      "G 250",
      "G 270",
      "G 280",
      "G 290",
      "G 300",
      "G 320",
      "G 350",
      "G 400",
      "G 450",
      "G 500",
      "G 55 AMG",
      "G 580",
      "G 63 AMG",
      "G 65 AMG",
      "G 650",
      "Classe M (tous)",
      "ML 230",
      "ML 250",
      "ML 270",
      "ML 280",
      "ML 300",
      "ML 320",
      "ML 350",
      "ML 400",
      "ML 420",
      "ML 430",
      "ML 450",
      "ML 500",
      "ML 55 AMG",
      "ML 63 AMG",
      "Classe R (tous)",
      "R 280",
      "R 300",
      "R 320",
      "R 350",
      "R 500",
      "R 63 AMG",
      "Classe S (tous)",
      "S 250",
      "S 260",
      "S 280",
      "S 300",
      "S 320",
      "S 350",
      "S 380",
      "S 400",
      "S 420",
      "S 430",
      "S 450",
      "S 500",
      "S 55 AMG",
      "S 550",
      "S 560",
      "S 560 E",
      "S 580",
      "S 600",
      "S 63 AMG",
      "S 65 AMG",
      "S 650",
      "S 680",
      "Classe T",
      "Classe V (tous)",
      "V",
      "V 200",
      "V 220",
      "V 230",
      "V 250",
      "V 280",
      "V 300",
      "Classe X (tous)",
      "X 220",
      "X 250",
      "X 350",
      "CLC",
      "CLE",
      "CLE 180",
      "CLE 200",
      "CLE 220",
      "CLE 300",
      "CLE 450",
      "CLE 53 AMG",
      "CLE 63 AMG",
      "CLK (tous)",
      "CLK",
      "CLK 200",
      "CLK 220",
      "CLK 230",
      "CLK 240",
      "CLK 270",
      "CLK 280",
      "CLK 320",
      "CLK 350",
      "CLK 430",
      "CLK 500",
      "CLK 55 AMG",
      "CLK 63 AMG",
      "CLS (tous)",
      "CLS",
      "CLS 220",
      "CLS 250",
      "CLS 280",
      "CLS 300",
      "CLS 320",
      "CLS 350",
      "CLS 400",
      "CLS 450",
      "CLS 500",
      "CLS 53 AMG",
      "CLS 55 AMG",
      "CLS 63 AMG",
      "GL (tous)",
      "GL 320",
      "GL 350",
      "GL 400",
      "GL 420",
      "GL 450",
      "GL 500",
      "GL 55 AMG",
      "GL 63 AMG",
      "GLA (tous)",
      "GLA 180",
      "GLA 200",
      "GLA 220",
      "GLA 250",
      "GLA 35 AMG",
      "GLA 45 AMG",
      "GLB (tous)",
      "GLB 180",
      "GLB 200",
      "GLB 220",
      "GLB 250",
      "GLB 35 AMG",
      "GLC (tous)",
      "GLC 200",
      "GLC 220",
      "GLC 250",
      "GLC 300",
      "GLC 350",
      "GLC 400",
      "GLC 43 AMG",
      "GLC 450",
      "GLC 63 AMG",
      "GLE (tous)",
      "GLE 250",
      "GLE 300",
      "GLE 350",
      "GLE 400",
      "GLE 43 AMG",
      "GLE 450",
      "GLE 500",
      "GLE 53 AMG",
      "GLE 580",
      "GLE 63 AMG",
      "GLK (tous)",
      "GLK 200",
      "GLK 220",
      "GLK 250",
      "GLK 280",
      "GLK 300",
      "GLK 320",
      "GLK 350",
      "GLS (tous)",
      "GLS 350",
      "GLS 400",
      "GLS 450",
      "GLS 500",
      "GLS 580",
      "GLS 600",
      "GLS 63 AMG",
      "Marco Polo",
      "Maybach GLS",
      "Maybach S-Klasse",
      "MB 100",
      "SL (tous)",
      "SL 230",
      "SL 250",
      "SL 280",
      "SL 300",
      "SL 320",
      "SL 350",
      "SL 380",
      "SL 400",
      "SL 420",
      "SL 43 AMG",
      "SL 450",
      "SL 500",
      "SL 55 AMG",
      "SL 560",
      "SL 60 AMG",
      "SL 600",
      "SL 63 AMG",
      "SL 65 AMG",
      "SL 680",
      "SL 70 AMG",
      "SL 73 AMG",
      "SLC (tous)",
      "SLC 180",
      "SLC 200",
      "SLC 250",
      "SLC 280",
      "SLC 300",
      "SLC 350",
      "SLC 380",
      "SLC 43 AMG",
      "SLC 450",
      "SLC 500",
      "SLK (tous)",
      "SLK",
      "SLK 200",
      "SLK 230",
      "SLK 250",
      "SLK 280",
      "SLK 300",
      "SLK 32 AMG",
      "SLK 320",
      "SLK 350",
      "SLK 55 AMG",
      "SLR",
      "SLS",
      "Sprinter",
      "T1",
      "T2",
      "Vaneo",
      "Vario",
      "Viano",
      "Vito",
      "W 114/115 Strich-Acht",
      "Autres"
    ],

    Audi: [
      "100",
      "200",
      "50",
      "80",
      "90",
      "A1",
      "A2",
      "A3",
      "A4",
      "A4 allroad",
      "A5",
      "A6",
      "A6 allroad",
      "A7",
      "A8",
      "Allroad",
      "Cabriolet",
      "Coupe",
      "e-tron",
      "e-tron GT",
      "Q1",
      "Q2",
      "Q3",
      "Q4 e-tron",
      "Q5",
      "Q6",
      "Q7",
      "Q8",
      "Q8 e-tron",
      "QUATTRO",
      "R8",
      "RS",
      "RS e-tron GT",
      "RS Q3",
      "RS Q5",
      "RS Q8",
      "RS2",
      "RS3",
      "RS4",
      "RS5",
      "RS6",
      "RS7",
      "S1",
      "S2",
      "S3",
      "S4",
      "S5",
      "S6",
      "S7",
      "S8",
      "SQ2",
      "SQ3",
      "SQ5",
      "SQ6",
      "SQ7",
      "SQ8",
      "SQ8 e-tron",
      "TT",
      "TT RS",
      "TTS",
      "V8",
      "Autres"
    ],
  Volkswagen: [
      "181",
      "Amarok",
      "Anfibio",
      "Arteon",
      "Atlas",
      "Beetle",
      "Bora",
      "Buggy",
      "Bus",
      "Caddy",
      "CC",
      "Coccinelle",
      "Corrado",
      "Crafter",
      "Cross Touran",
      "Derby",
      "e-up!",
      "Eos",
      "Escarabajo",
      "Fox",
      "Golf (tous)",
      "Cross Golf",
      "e-Golf",
      "Golf",
      "Golf Cabriolet",
      "Golf GTD",
      "Golf GTE",
      "Golf GTI",
      "Golf Plus",
      "Golf R",
      "Golf Sportsvan",
      "Golf Variant",
      "Grand California",
      "ID. Buzz (tous)",
      "ID. Buzz",
      "ID. Buzz Cargo",
      "ID.3",
      "ID.4",
      "ID.5",
      "ID.6",
      "ID.7",
      "Iltis",
      "Jetta",
      "Käfer",
      "Karmann Ghia",
      "Kever",
      "L80",
      "LT",
      "Lupo",
      "Maggiolino",
      "New Beetle",
      "Passat (tous)",
      "Passat",
      "Passat Alltrack",
      "Passat CC",
      "Passat Variant",
      "Phaeton",
      "Pointer",
      "Polo (tous)",
      "Polo",
      "Polo Cross",
      "Polo GTI",
      "Polo Plus",
      "Polo R WRC",
      "Polo Sedan",
      "Polo Variant",
      "Routan",
      "Santana",
      "Scirocco",
      "Sharan",
      "T-Cross",
      "T-Roc",
      "T1",
      "T2",
      "T3 (tous)",
      "T3",
      "T3 Blue Star",
      "T3 California",
      "T3 Caravelle",
      "T3 Kombi",
      "T3 Multivan",
      "T3 White Star",
      "T4 (tous)",
      "T4",
      "T4 Allstar",
      "T4 California",
      "T4 Caravelle",
      "T4 Kombi",
      "T4 Multivan",
      "T5 (tous)",
      "T5",
      "T5 California",
      "T5 Caravelle",
      "T5 Kombi",
      "T5 Multivan",
      "T5 Shuttle",
      "T5 Transporter",
      "T6 (tous)",
      "T6 California",
      "T6 Caravelle",
      "T6 Kombi",
      "T6 Multivan",
      "T6 Transporter",
      "T6.1",
      "T6.1 California",
      "T6.1 Caravelle",
      "T6.1 Kombi",
      "T6.1 Multivan",
      "T6.1 Transporter",
      "T7",
      "T7 California",
      "T7 Caravelle",
      "T7 Kombi",
      "T7 Multivan",
      "T7 Transporter",
      "Taigo",
      "Taro",
      "Tayron",
      "Tiguan (tous)",
      "Tiguan",
      "Tiguan Allspace",
      "Touareg",
      "Touran",
      "Transporter",
      "up!",
      "Vento",
      "Viloran",
      "XL1",
      "Autres"
    ],
  Porsche: [
      "356",
      "550",
      "718 (tous)",
      "718",
      "718 Spyder",
      "911 (tous)",
      "911",
      "930",
      "964",
      "991",
      "992",
      "993",
      "996",
      "997",
      "912",
      "914",
      "918",
      "924",
      "928",
      "944",
      "959",
      "962",
      "968",
      "Boxster",
      "Carrera GT",
      "Cayenne",
      "Cayman",
      "Macan",
      "Panamera",
      "Targa",
      "Taycan",
      "Autres"
    ],
  "Toyota": [
      "4-Runner",
      "Allion",
      "Alphard",
      "Altezza",
      "Aristo",
      "Auris",
      "Avalon",
      "Avensis",
      "Avensis Verso",
      "Aygo",
      "Aygo X",
      "BB",
      "Belta",
      "bZ4X",
      "C-HR",
      "Caldina",
      "Cami",
      "Camry",
      "Carina",
      "Celica",
      "Chaser",
      "Coaster",
      "Corolla",
      "Corolla Cross",
      "Corolla Verso",
      "Corona",
      "Corsa",
      "Cressida",
      "Cresta",
      "Crown",
      "Duet",
      "Dyna",
      "Estima",
      "FJ Cruiser",
      "FJ40",
      "Fortuner",
      "Fun Cruiser",
      "Funcargo",
      "Gaia",
      "GR86",
      "GT86",
      "Harrier",
      "HDJ",
      "Hiace",
      "Highlander",
      "Hilux",
      "Ipsum",
      "iQ",
      "Ist",
      "KJ",
      "Land Cruiser",
      "Land Cruiser Prado",
      "Lite-Ace",
      "Mark II",
      "Mark X",
      "Matrix",
      "Mirai",
      "Model F",
      "MR 2",
      "Nadia",
      "Noah",
      "Opa",
      "Paseo",
      "Passo",
      "Pick up",
      "Picnic",
      "Platz",
      "Premio",
      "Previa",
      "Prius",
      "Prius+",
      "Proace",
      "Proace City",
      "Proace Max",
      "Ractis",
      "Raum",
      "RAV 4",
      "Sequoia",
      "Sienna",
      "Solara",
      "Sprinter",
      "Starlet",
      "Supra",
      "Tacoma",
      "Tercel",
      "Town Ace",
      "Tundra",
      "Urban Cruiser",
      "Venza",
      "Verossa",
      "Verso",
      "Verso-S",
      "Vista",
      "Vitz",
      "Voxy",
      "Will",
      "Windom",
      "Wish",
      "Yaris",
      "Yaris Cross",
      "Autres"
    ],
  Peugeot:  [
      "1007",
      "104",
      "106",
      "107",
      "108",
      "2008",
      "204",
      "205",
      "206",
      "207",
      "208",
      "3008",
      "301",
      "304",
      "305",
      "306",
      "307",
      "308",
      "309",
      "4007",
      "4008",
      "404",
      "405",
      "406",
      "407",
      "408",
      "5008",
      "504",
      "505",
      "508",
      "604",
      "605",
      "607",
      "806",
      "807",
      "Bipper",
      "Boxer",
      "Camper",
      "e-2008",
      "e-208",
      "e-Expert",
      "e-Rifter",
      "e-Traveller",
      "Expert",
      "iOn",
      "J5",
      "J9",
      "Partner",
      "Ranch",
      "RCZ",
      "Rifter",
      "Traveller",
      "Autres"
    ]
    // ... (autres marques avec leurs modèles)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const base = 20000;
      const age = new Date().getFullYear() - Number(formData.year);
      const mileagePenalty = formData.mileage / 10000 * 300;
      const fuelPenalty = formData.fuel === 'Diesel' ? 1000 : 0;
      const conditionFactor = formData.condition === 'Excellent' ? 1.1 : 
                            formData.condition === 'Bon' ? 1.0 : 0.8;
      const gearboxBonus = formData.gearbox === 'Automatique' ? 1200 : 0;

      const predictedPrice = (base - (age * 1000) - mileagePenalty - fuelPenalty + gearboxBonus) * conditionFactor;
      setPrediction(Math.max(predictedPrice, 1500));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Estimation de Prix de Voiture</h1>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Marque</label>
            <select 
              className="form-select" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
              required
            >
              <option value="">Choisir une marque</option>
              {Object.keys(carModels).map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Modèle</label>
            <select
              className="form-select"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              disabled={!formData.brand}
            >
              <option value="">Choisir un modèle</option>
              {formData.brand &&
                carModels[formData.brand].map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Année</label>
            <input
              type="number"
              className="form-control"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1990"
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Kilométrage</label>
            <input
              type="number"
              className="form-control"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Carburant</label>
            <select 
              className="form-select" 
              name="fuel" 
              value={formData.fuel} 
              onChange={handleChange} 
              required
            >
              <option value="">Sélectionner</option>
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybride">Hybride</option>
              <option value="Électrique">Électrique</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">État</label>
            <select 
              className="form-select" 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange} 
              required
            >
              <option value="">Sélectionner</option>
              <option value="Excellent">Excellent</option>
              <option value="Bon">Bon</option>
              <option value="Moyen">Moyen</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Boîte de vitesses</label>
            <select 
              className="form-select" 
              name="gearbox" 
              value={formData.gearbox} 
              onChange={handleChange} 
              required
            >
              <option value="">Sélectionner</option>
              <option value="Manuelle">Manuelle</option>
              <option value="Automatique">Automatique</option>
            </select>
          </div>

          <div className="col-12 d-grid mt-3">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Estimation en cours...
                </>
              ) : (
                "Estimer le prix"
              )}
            </button>
          </div>
        </div>
      </form>

      {prediction !== null && (
        <div className="alert alert-success mt-4 text-center">
          <h4 className="alert-heading">Prix estimé :</h4>
          <p className="display-5">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'EUR',
              maximumFractionDigits: 0
            }).format(prediction)}
          </p>
          <hr />
          <p className="mb-0 text-muted">Estimation indicative selon les critères fournis.</p>
        </div>
      )}

      <footer className="text-center mt-5 text-muted small">
        &copy; {new Date().getFullYear()} CarPredict AI – Simulation à titre indicatif
      </footer>
    </div>
  );
};

export default CarPricePredictor;