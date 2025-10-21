import { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Compte créé avec succès !");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Connexion réussie !");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Connecté avec Google !");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>{isSignup ? "Inscription" : "Connexion"}</h2>

      <button onClick={handleGoogleLogin}>Continuer avec Google</button>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 10, padding: 5, width: 250 }}
        />
        <br />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 10, padding: 5, width: 250 }}
        />
        <br />
        <button type="submit">
          {isSignup ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>

      <p
        onClick={() => setIsSignup(!isSignup)}
        style={{ cursor: "pointer", marginTop: 10 }}
      >
        {isSignup ? "Déjà un compte ? Se connecter" : "Pas de compte ? S’inscrire"}
      </p>
    </div>
  );
}
