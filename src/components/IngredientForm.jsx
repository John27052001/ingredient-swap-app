import { useState } from "react";
import { FaCarrot } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function IngredientForm({ ingredients, onIngredientsChange }) {
  const [ingredient, setIngredient] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (ingredient.trim() === '') return;
    if (ingredients.includes(ingredient.trim().toLowerCase())) return;
    onIngredientsChange([...ingredients, ingredient.trim().toLowerCase()]);
    setIngredient('');
  };

  const handleRemove = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    onIngredientsChange(newIngredients);
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "0 auto 28px auto",
      background: "#f8fbfd",
      padding: "28px 24px",
      borderRadius: "24px",
      boxShadow: "0 2px 16px rgba(59,195,195,0.10)"
    }}>
      <h2 style={{ fontSize: "1.22em", marginBottom: 14, color: "#3a506b", textAlign: "left" }}>
        What ingredients do you have?
      </h2>
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="e.g. eggs"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1.5px solid #59c3c3",
            borderRadius: "7px",
            fontSize: "1.05em"
          }}
        />
        <button type="submit" style={{
          padding: "10px 18px",
          background: "#ea526f",
          color: "#fff",
          border: "none",
          borderRadius: "7px",
          fontSize: "1em",
          fontWeight: 600,
          cursor: "pointer"
        }}>Add</button>
      </form>
      <ul style={{
        listStyle: "none", padding: 0, margin: "18px 0 0 0",
        display: "flex", flexWrap: "wrap", gap: "10px"
      }}>
        <AnimatePresence>
          {ingredients.map((ing, idx) => (
            <motion.li
              key={ing + idx}
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 24, duration: 0.23 }}
              style={{
                display: "flex", alignItems: "center",
                background: "#e7f9f9", borderRadius: "18px", padding: "7px 14px"
              }}
            >
              <FaCarrot style={{ color: "#59c3c3", marginRight: "8px" }} />
              {ing}
              <button
                onClick={() => handleRemove(idx)}
                style={{ background: "none", border: "none", color: "#ea526f", marginLeft: 8, fontWeight: "bold", cursor: "pointer", fontSize: "1.09em" }}
                title="Remove"
              >×</button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default IngredientForm;
