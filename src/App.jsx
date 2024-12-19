import React, { useState } from "react";

function App() {
  const [number, setNumber] = useState("");
  const [sequence, setSequence] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const N = parseInt(number, 10);
    if (N < 1 || N > 1000) {
      alert("Veuillez entrer un nombre entre 1 et 1000.");
      return;
    }

    setLoading(true);
    setSequence([]);
    for (let i = 1; i <= N; i++) {
      try {
        const response = await fetch("https://api.prod.jcloudify.com/whoami");
        if (response.status === 200) {
          setSequence((prev) => [...prev, `${i}. Forbidden`]);
        } else if (response.status === 403) {
          alert(`Captcha requis à l'étape ${i}. Veuillez le résoudre.`);
          await handleCaptcha();
          i--; // Réessayer après le captcha
        }
      } catch (error) {
        console.error(error);
        setSequence((prev) => [...prev, `${i}. Une erreur est survenue.`]);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Pause de 1 seconde
    }
    setLoading(false);
  };

  const handleCaptcha = async () => {
    alert("Résolvez le captcha pour continuer.");
    // Attendez que l'utilisateur résolve le captcha
  };

  return (
    <div>
      <h1>API Sequence Generator</h1>
      {loading ? (
        <p>Génération en cours...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Entrez un nombre (1 à 1000) :
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              min="1"
              max="1000"
              required
            />
          </label>
          <button type="submit">Générer la séquence</button>
        </form>
      )}
      <div>
        {sequence.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default App;

