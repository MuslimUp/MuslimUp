import React, { useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage("Connecté avec Google ✅");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Compte créé ✅");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Connexion réussie ✅");
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>Test Firebase Auth</h2>
      <button onClick={handleGoogle}>Connexion Google</button>
      <form onSubmit={handleEmailAuth} style={{ marginTop: 20 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">{isSignup ? "S'inscrire" : "Se connecter"}</button>
      </form>
      <p
        onClick={() => setIsSignup(!isSignup)}
        style={{ cursor: "pointer", color: "teal" }}
      >
        {isSignup ? "Déjà un compte ? Se connecter" : "Pas encore inscrit ? Créer un compte"}
      </p>
      <p>{message}</p>
    </div>
  );
}
