import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./components/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IngredientForm from "./components/IngredientForm";
import RecipeList from "./components/RecipeList";

function App() {
  // Possible views: "landing" | "login" | "register" | "app"
  const [view, setView] = useState("landing");
  const [showAbout, setShowAbout] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState(false);

  // -- Authentication handlers --
  const onLogin = () => setView("app");
  const onRegister = () => setView("login");
  const handleLogout = () => {
    localStorage.removeItem("token");
    setView("login");
    setIngredients([]);
    setFavorites([]);
  };

  // -- Reset app handler --
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all ingredients and favorites?")) {
      setIngredients([]);
      setFavorites([]);
      localStorage.removeItem('ingredients');
      localStorage.removeItem('favorites');
    }
  };

  // -- Ingredients & Favorites handlers --
  // Load user data after login
  useEffect(() => {
    if (view === "app") {
      const token = localStorage.getItem("token");
      async function load() {
        const res = await fetch("http://localhost:5000/api/ingredients", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIngredients(data.ingredients || []);
          setFavorites(data.favorites || []);
        }
      }
      if (token) load();
    }
  }, [view]);

  // Save to backend on change
  const handleIngredientsChange = async (newIngredients) => {
    setIngredients(newIngredients);
    const token = localStorage.getItem("token");
    if (!token) return;
    await fetch("http://localhost:5000/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ingredients: newIngredients, favorites })
    });
  };

  const handleFavoritesChange = async (newFavorites) => {
    setFavorites(newFavorites);
    const token = localStorage.getItem("token");
    if (!token) return;
    await fetch("http://localhost:5000/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ingredients, favorites: newFavorites })
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* --- Top-right App Bar --- */}
      <div style={{
        position: "fixed",
        top: 22,
        right: 32,
        zIndex: 9999,
        display: "flex",
        gap: 12
      }}>
        {/* About/Help "?" */}
        <button
          onClick={() => setShowAbout(true)}
          title="About Ingredient Swap"
          style={{
            fontSize: "1.4em",
            background: "linear-gradient(90deg, #59c3c3, #ea526f 85%)",
            color: "#fff",
            borderRadius: "50%",
            width: 46,
            height: 46,
            boxShadow: "0 4px 18px rgba(90,150,140,0.12)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #ea526f"
          }}
        >?</button>
        {/* Share Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setToast(true);
            setTimeout(() => setToast(false), 1600);
          }}
          title="Share this app"
          style={{
            fontSize: "1.4em",
            background: "linear-gradient(90deg, #59c3c3, #ea526f 85%)",
            color: "#fff",
            borderRadius: "50%",
            width: 46,
            height: 46,
            boxShadow: "0 4px 18px rgba(90,150,140,0.12)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #ea526f"
          }}
        >🔗</button>
        {/* Reset */}
        <button
          onClick={handleReset}
          title="Reset App"
          style={{
            fontSize: "1.4em",
            background: "linear-gradient(90deg, #59c3c3, #ea526f 85%)",
            color: "#fff",
            borderRadius: "50%",
            width: 46,
            height: 46,
            boxShadow: "0 4px 18px rgba(90,150,140,0.12)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #ea526f"
          }}
        >
          ♻️
        </button>
        {/* Logout */}
        {view === "app" && (
          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              fontSize: "1.4em",
              background: "linear-gradient(90deg, #59c3c3, #ea526f 85%)",
              color: "#fff",
              borderRadius: "50%",
              width: 46,
              height: 46,
              boxShadow: "0 4px 18px rgba(90,150,140,0.12)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #ea526f"
              }}
          >
            ⎋
          </button>
        )}
      </div>
      {/* --- Toast for Share --- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            style={{
              background: "#59c3c3",
              color: "#fff",
              borderRadius: 15,
              padding: "8px 26px",
              position: "fixed",
              top: 78,
              right: 50,
              fontSize: "1.02em",
              zIndex: 5000,
              boxShadow: "0 2px 8px rgba(60,160,160,0.13)"
            }}
          >
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- About Modal --- */}
      {showAbout && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(30,60,80,0.14)", zIndex: 9998,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "28px",
            maxWidth: 410,
            padding: "36px 30px 26px 30px",
            boxShadow: "0 12px 42px rgba(60,100,200,0.15)",
            textAlign: "center",
            position: "relative"
          }}>
            <button
              onClick={() => setShowAbout(false)}
              style={{
                position: "absolute", right: 12, top: 10,
                background: "none", border: "none", color: "#ea526f",
                fontSize: "1.4em", cursor: "pointer", fontWeight: 700
              }}
              title="Close"
            >×</button>
            <div style={{ fontSize: "2.1em", marginBottom: 4 }}>👨‍🍳</div>
            <h2 style={{
              color: "#3a506b", marginBottom: 13, fontWeight: 800, fontSize: "1.26em"
            }}>
              About Ingredient Swap
            </h2>
            <div style={{
              fontSize: "1.06em",
              color: "#454e5b",
              marginBottom: 10,
              lineHeight: 1.65
            }}>
              <p>
                <b>Ingredient Swap</b> helps you discover new recipes with what you already have at home.
              </p>
              <ul style={{ textAlign: "left", fontSize: "1em", color: "#3a506b", margin: "15px 0 10px 24px", lineHeight: "1.7" }}>
                <li><b>Add ingredients</b> in your kitchen</li>
                <li>See <b>suggested recipes</b> you can make (even if missing 1-2 items)</li>
                <li>Click <b>Swap</b> for instant substitutes</li>
                <li><b>Favorite</b> recipes for quick access</li>
                <li><b>Confetti</b> and “Congrats!” when you have everything for a recipe!</li>
                <li>Copy or print missing ingredient lists in a click</li>
              </ul>
              <p style={{ marginTop: 8, color: "#ea526f", fontWeight: 600 }}>
                No more wasted groceries—only tasty ideas!
              </p>
            </div>
            <div style={{ marginTop: 13, color: "#3a506b", fontSize: "0.97em", opacity: 0.7 }}>
              Created by Megha John Babu
            </div>
          </div>
        </div>
      )}

      {/* --- Animated View Switcher --- */}
      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <Landing onGetStarted={() => setView("login")} />
            </motion.div>
          )}
          {view === "login" && (
            <Login onLogin={onLogin} switchToRegister={() => setView("register")} />
          )}
          {view === "register" && (
            <Register onRegister={onRegister} switchToLogin={() => setView("login")} />
          )}
          {view === "app" && (
            <motion.div
              key="app"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              style={{
                minHeight: "100vh",
                minWidth: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                background: "linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: 600,
                  margin: "48px auto 0 auto",
                  padding: "0 8px",
                  position: "relative"
                }}
              >
                <IngredientForm
                  ingredients={ingredients}
                  onIngredientsChange={handleIngredientsChange}
                />
                <RecipeList
                  ingredients={ingredients}
                  favorites={favorites}
                  onFavoritesChange={handleFavoritesChange}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* --- Footer --- */}
      <footer style={{
        textAlign: "center",
        marginTop: 48,
        padding: "20px 0",
        background: "rgba(248,251,253,0.8)",
        borderTop: "2.5px solid #59c3c3",
        color: "#3a506b",
        fontSize: "1em",
        fontWeight: 500,
        width: "100%",
        letterSpacing: ".01em"
      }}>
        &copy; {new Date().getFullYear()} Ingredient Swap by Megha John Babu
        {" | "}
        <a href="https://github.com/John27052001" style={{ color: "#ea526f", marginLeft: 8, textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  );
}
export default App;
