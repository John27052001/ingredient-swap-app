import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import confetti from "canvas-confetti";

const recipes = [
  {
    id: 1,
    name: "Scrambled Eggs",
    ingredients: ["eggs", "milk", "salt", "pepper"],
    instructions: "Beat eggs with milk, season, and cook in a pan.",
    emoji: "🍳",
    tags: ["Non Vegetarian"]
  },
  {
    id: 2,
    name: "Tomato Sandwich",
    ingredients: ["bread", "tomato", "mayonnaise", "salt"],
    instructions: "Spread mayo on bread, add sliced tomato and a sprinkle of salt.",
    emoji: "🥪",
    tags: ["Vegetarian"]
  },
  {
    id: 3,
    name: "Veggie Stir Fry",
    ingredients: ["carrot", "broccoli", "soy sauce", "oil"],
    instructions: "Stir fry chopped veggies in oil, add soy sauce, and serve.",
    emoji: "🥦",
    tags: ["Vegan", "Gluten-Free"]
  },
  {
    id: 4,
    name: "Banana Oat Pancakes",
    ingredients: ["banana", "oats", "milk", "eggs"],
    instructions: "Mash banana, mix in oats, milk, eggs. Cook in a pan.",
    emoji: "🥞",
    tags: ["Vegetarian", "Gluten-Free"]
  },
  {
    id: 5,
    name: "Simple Fruit Salad",
    ingredients: ["apple", "banana", "orange"],
    instructions: "Chop all fruits, toss together, serve cold.",
    emoji: "🍎",
    tags: ["Vegan", "Vegetarian", "Gluten-Free"]
  },
  {
    id: 6,
    name: "Chickpea Hummus",
    ingredients: ["chickpeas", "oil", "salt", "lemon"],
    instructions: "Blend all ingredients until smooth. Serve with bread.",
    emoji: "🥙",
    tags: ["Vegan", "Gluten-Free"]
  },
  {
    id: 7,
    name: "Rice & Beans",
    ingredients: ["rice", "beans", "oil", "salt"],
    instructions: "Cook rice and beans, stir fry together with oil and salt.",
    emoji: "🍚",
    tags: ["Vegan", "Gluten-Free"]
  }
];

const SUBSTITUTES = {
  eggs: ["applesauce", "mashed banana", "chia seeds"],
  milk: ["soy milk", "almond milk", "oat milk"],
  bread: ["lettuce leaves", "rice cakes"],
  mayonnaise: ["hummus", "greek yogurt"],
  carrot: ["zucchini", "sweet potato"],
  broccoli: ["cauliflower", "brussels sprouts"],
  "soy sauce": ["tamari", "coconut aminos"],
  oil: ["butter", "ghee", "applesauce"],
  tomato: ["roasted peppers", "zucchini"],
  salt: ["herb mix", "soy sauce"],
  pepper: ["cayenne", "paprika"],
};

function RecipeList({ ingredients }) {
  const [swaps, setSwaps] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);

  // Dietary Filter State
  const [selectedTag, setSelectedTag] = useState("All");
  const TAGS = ["All", "Non Vegetarian", "Vegetarian", "Vegan", "Gluten-Free"];

  // Confetti trigger per card
  const confettiTriggered = useRef({});

  // Favorites
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const favs = localStorage.getItem("favorites");
    if (favs) setFavorites(JSON.parse(favs));
  }, []);
  const toggleFavorite = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Tabs & Search
  const [showFavorites, setShowFavorites] = useState(false);
  const [search, setSearch] = useState("");

  // Fuzzy recipe match
  const matchingRecipes = recipes
    .map((recipe) => {
      const userHas = recipe.ingredients.filter((ing) =>
        ingredients.map((i) => i.toLowerCase()).includes(ing.toLowerCase())
      );
      const missing = recipe.ingredients.filter(
        (ing) => !ingredients.map((i) => i.toLowerCase()).includes(ing.toLowerCase())
      );
      return {
        ...recipe,
        userHas,
        missing,
      };
    })
    .filter((recipe) => recipe.userHas.length >= recipe.ingredients.length - 2);

  // Filter by favorites and dietary tag
  let recipesToShow = showFavorites
    ? matchingRecipes.filter((r) => favorites.includes(r.id))
    : matchingRecipes;

  if (selectedTag !== "All") {
    recipesToShow = recipesToShow.filter(rec => (rec.tags || []).includes(selectedTag));
  }

  const filteredRecipes = recipesToShow.filter(rec => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return true;
    const nameMatch = rec.name.toLowerCase().includes(searchTerm);
    const ingredientMatch = rec.ingredients.some(ing =>
      ing.toLowerCase().includes(searchTerm)
    );
    const swappedMatch = Object.values(swaps).some(s =>
      s.toLowerCase().includes(searchTerm)
    );
    return nameMatch || ingredientMatch || swappedMatch;
  });

  const handleSwap = (recipeId, ingIdx, substitute) => {
    setSwaps({
      ...swaps,
      [`${recipeId}-${ingIdx}`]: substitute,
    });
    setShowDropdown(null);
  };

  // Print and Copy handlers
  const handleCopy = (missingList, recipeName) => {
    const text = `Shopping list for ${recipeName}:\n` + missingList.join(", ");
    navigator.clipboard.writeText(text);
    alert("Missing ingredients copied to clipboard!");
  };

  const handlePrint = (missingList, recipeName) => {
    const printWindow = window.open('', '', 'width=400,height=400');
    printWindow.document.write(`<h2>Shopping list for ${recipeName}</h2>`);
    printWindow.document.write(
      `<ul>${missingList.map((m) => `<li>${m}</li>`).join("")}</ul>`
    );
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div style={{
      marginTop: "32px",
      maxWidth: "700px",
      marginLeft: "auto",
      marginRight: "auto"
    }}>
      <h2 style={{
        textAlign: "center",
        fontWeight: 800,
        fontSize: "2.2em",
        letterSpacing: ".01em",
        marginBottom: "10px"
      }}>Suggested Recipes</h2>
      {recipesToShow.length > 0 && (
        <>
          {/* Search Input */}
          <div style={{ marginBottom: "18px" }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes or ingredients…"
              style={{
                padding: "13px 22px",
                border: "1.5px solid #e3e3e3",
                borderRadius: "22px",
                fontSize: "1.07em",
                width: "100%",
                maxWidth: "380px",
                margin: "0 auto 12px auto",
                display: "block",
                outline: "none",
                background: "#f8fbfd"
              }}
            />
          </div>
          {/* Dietary Filter */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 22 }}>
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  background: selectedTag === tag ? "#59c3c3" : "#fff",
                  color: selectedTag === tag ? "#fff" : "#59c3c3",
                  border: "1.4px solid #59c3c3",
                  borderRadius: 16,
                  padding: "7px 18px",
                  fontWeight: selectedTag === tag ? 700 : 500,
                  fontSize: "0.98em",
                  cursor: "pointer",
                  letterSpacing: ".01em"
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </>
      )}
      {/* Tabs */}
      <div style={{ marginBottom: "24px", display: "flex", gap: "8px", justifyContent: "center" }}>
        <button
          onClick={() => setShowFavorites(false)}
          style={{
            background: showFavorites ? "#fff" : "#59c3c3",
            color: showFavorites ? "#59c3c3" : "#fff",
            padding: "8px 22px",
            borderRadius: "18px 0 0 18px",
            border: "1.5px solid #59c3c3",
            fontWeight: showFavorites ? 400 : 700,
            cursor: "pointer",
            fontSize: "1.09em"
          }}
        >
          All
        </button>
        <button
          id="favorites-tab"
          onClick={() => setShowFavorites(true)}
          style={{
            background: showFavorites ? "#59c3c3" : "#fff",
            color: showFavorites ? "#fff" : "#59c3c3",
            padding: "8px 22px",
            borderRadius: "0 18px 18px 0",
            border: "1.5px solid #59c3c3",
            fontWeight: showFavorites ? 700 : 400,
            cursor: "pointer",
            fontSize: "1.09em"
          }}
        >
          Favorites <FaStar style={{ color: "#FFD700", marginLeft: "6px" }} />
        </button>
      </div>
      {filteredRecipes.length > 0 ? (
        <div>
          {filteredRecipes.map((rec, rIdx) => {
            const isComplete = rec.missing.length === 0;
            // Confetti!
            if (isComplete && !confettiTriggered.current[rec.id]) {
              confetti({
                particleCount: 70,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#59c3c3", "#ea526f", "#FFD700", "#3a506b"],
              });
              confettiTriggered.current[rec.id] = true;
            } else if (!isComplete) {
              confettiTriggered.current[rec.id] = false;
            }

            return (
              <div
                key={rec.id}
                style={{
                  margin: "28px auto",
                  maxWidth: 410,
                  borderRadius: "24px",
                  background: "#fff",
                  boxShadow: "0 6px 40px 0 rgba(44, 117, 255, 0.13)",
                  border: "1.5px solid #e7f9f9",
                  padding: "0 0 20px 0",
                  position: "relative"
                }}
              >
                {/* Congrats badge */}
                {isComplete && (
                  <div style={{
                    position: "absolute",
                    top: "8px", left: "18px",
                    background: "linear-gradient(90deg, #59c3c3, #FFD700)",
                    color: "#fff",
                    padding: "5px 16px",
                    borderRadius: "17px",
                    fontWeight: 700,
                    fontSize: "1em",
                    boxShadow: "0 2px 8px rgba(70,200,150,0.12)"
                  }}>
                    🎉 Congrats! All ingredients ready!
                  </div>
                )}
                {/* Emoji header */}
                <div style={{ textAlign: "center", margin: 0, marginTop: 0, paddingTop: "22px" }}>
                  <span style={{
                    fontSize: "2.7em",
                    display: "inline-block",
                    marginBottom: "3px",
                  }}>
                    {rec.emoji}
                  </span>
                </div>
                {/* Name, Favorite, and Tags */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0 28px", margin: "2px 0 0 0"
                }}>
                  <div>
                    <strong style={{
                      fontSize: "1.15em",
                      letterSpacing: ".01em",
                      color: "#22223b"
                    }}>{rec.name}</strong>
                    {/* Show tags */}
                    <div style={{ margin: "5px 0 5px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(rec.tags || []).map(tag => (
                        <span key={tag} style={{
                          background: "#e7f9f9",
                          color: "#59c3c3",
                          borderRadius: "10px",
                          padding: "3px 11px",
                          fontSize: "0.91em",
                          fontWeight: 600,
                          marginRight: 2
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(rec.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "1.45em", color: favorites.includes(rec.id) ? "#FFD700" : "#bdbdbd"
                    }}
                    aria-label={favorites.includes(rec.id) ? "Unfavorite" : "Favorite"}
                  >
                    <FaStar />
                  </button>
                </div>
                <div style={{
                  background: "#f8fbfd",
                  borderRadius: "14px",
                  padding: "16px 15px 10px 15px",
                  margin: "16px 14px 14px 14px"
                }}>
                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center"
                  }}>
                    {rec.ingredients.map((ing, iIdx) => {
                      const key = `${rec.id}-${iIdx}`;
                      const swapped = swaps[key] || ing;
                      const userHasIt = rec.userHas.includes(ing);
                      return (
                        <span
                          key={iIdx}
                          style={{
                            background: userHasIt ? "#e7f9f9" : "#ffeaea",
                            color: userHasIt ? "#3a506b" : "#ea526f",
                            borderRadius: "999px",
                            padding: "8px 13px",
                            fontSize: "1.05em",
                            margin: "0 6px 7px 0",
                            fontStyle: userHasIt ? "normal" : "italic",
                            border: userHasIt ? "none" : "1.3px dashed #ea526f",
                            boxShadow: userHasIt ? "0 1px 2px rgba(80,195,195,0.09)" : "none",
                            display: "inline-flex",
                            alignItems: "center"
                          }}
                        >
                          {swapped}
                          {SUBSTITUTES[ing] && (
                            <span style={{ position: "relative", marginLeft: "8px" }}>
                              <button
                                onClick={() => setShowDropdown(showDropdown === key ? null : key)}
                                style={{
                                  background: "#59c3c3",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "12px",
                                  padding: "3px 10px",
                                  marginLeft: "7px",
                                  fontSize: "0.98em",
                                  cursor: "pointer",
                                  fontWeight: 500,
                                  transition: "background 0.18s"
                                }}
                              >Swap</button>
                              {showDropdown === key && (
                                <div style={{
                                  position: "absolute", left: 0, top: "110%",
                                  background: "#fff", border: "1.2px solid #e7f9f9",
                                  borderRadius: "11px", boxShadow: "0 4px 18px rgba(90,150,140,0.09)",
                                  padding: "6px 10px", zIndex: 20
                                }}>
                                  {SUBSTITUTES[ing].map((sub) => (
                                    <div
                                      key={sub}
                                      onClick={() => handleSwap(rec.id, iIdx, sub)}
                                      style={{
                                        cursor: "pointer", padding: "4px 0",
                                        borderRadius: "5px",
                                        transition: "background 0.17s"
                                      }}
                                    >
                                      {sub}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {rec.missing.length > 0 && (
                  <div style={{
                    background: "#fff6f7",
                    borderRadius: "10px",
                    padding: "10px 13px 6px 13px",
                    margin: "10px 18px 7px 18px"
                  }}>
                    <span style={{
                      fontWeight: 600,
                      background: "#ea526f",
                      color: "#fff",
                      padding: "3px 12px",
                      borderRadius: "12px",
                      fontSize: "0.97em",
                      letterSpacing: "0.02em"
                    }}>
                      Missing: {rec.missing.join(", ")}
                    </span>
                    <div style={{ marginTop: "7px" }}>
                      <button
                        style={{
                          background: "#3a506b",
                          color: "#fff",
                          border: "none",
                          borderRadius: "11px",
                          padding: "5px 15px",
                          marginRight: "7px",
                          fontSize: "1em",
                          cursor: "pointer",
                        }}
                        onClick={() => handleCopy(rec.missing, rec.name)}
                      >Copy List</button>
                      <button
                        style={{
                          background: "#59c3c3",
                          color: "#fff",
                          border: "none",
                          borderRadius: "11px",
                          padding: "5px 15px",
                          fontSize: "1em",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePrint(rec.missing, rec.name)}
                      >Print List</button>
                    </div>
                  </div>
                )}
                <div style={{
                  margin: "14px 22px 0 22px",
                  color: "#5e5e7e",
                  fontStyle: "italic",
                  fontSize: "1.07em"
                }}>
                  {rec.instructions}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", margin: "48px auto 0 auto" }}>
          <div style={{
            fontSize: "3.5em",
            marginBottom: "10px",
            opacity: 0.7
          }}>👨‍🍳</div>
          <p style={{ color: "#889", fontSize: "1.12em", lineHeight: "1.7" }}>
            No recipes found with your current ingredients.<br />
            Try adding more ingredients above, or clear your search.
          </p>
        </div>
      )}
    </div>
  );
}

export default RecipeList;
