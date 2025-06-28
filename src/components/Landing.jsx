function Landing({ onGetStarted }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)",
        padding: 0,
      }}
    >
      <div style={{
        background: "#fff",
        borderRadius: "36px",
        boxShadow: "0 16px 56px rgba(44,117,255,0.10)",
        padding: "54px 32px 44px 32px",
        minWidth: 330,
        maxWidth: 460,
        width: "94vw",
        textAlign: "center",
        margin: "0 auto"
      }}>
        <div style={{ fontSize: "4.7em", marginBottom: 16, filter: "drop-shadow(0 6px 22px #59c3c320)" }}>
          <span role="img" aria-label="chef">👨‍🍳</span>
        </div>
        <h1 style={{
          fontWeight: 900,
          fontSize: "2.15em",
          margin: 0,
          letterSpacing: ".01em",
          background: "linear-gradient(90deg,#59c3c3,#ea526f 85%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Ingredient Swap
        </h1>
        <p style={{
          fontSize: "1.13em",
          color: "#3a506b",
          margin: "21px 0 18px 0",
          fontWeight: 500,
          lineHeight: "1.6"
        }}>
          Find, swap, and discover recipes based on what’s already in your kitchen.<br />
          <span style={{ color: "#ea526f", fontWeight: 600 }}>
            No more wasted groceries—only tasty ideas!
          </span>
        </p>
        <button
          onClick={onGetStarted}
          style={{
            background: "linear-gradient(90deg, #59c3c3, #ea526f 85%)",
            color: "#fff",
            border: "none",
            borderRadius: "26px",
            padding: "17px 48px",
            fontSize: "1.15em",
            fontWeight: 700,
            boxShadow: "0 6px 18px rgba(90,150,140,0.11)",
            cursor: "pointer",
            marginTop: "19px",
            marginBottom: "-4px",
            transition: "transform 0.13s"
          }}
        >
          Get Started
        </button>
      </div>

      {/* Feature highlight row */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 26,
        marginTop: 40, flexWrap: "wrap"
      }}>
        <div style={{
          minWidth: 110, textAlign: "center", background: "#fff",
          borderRadius: "18px", boxShadow: "0 2px 10px #59c3c315", padding: "18px 12px", margin: "7px 0"
        }}>
          <div style={{ fontSize: "2em", marginBottom: 5 }}>🥕</div>
          <div style={{ fontWeight: 600, color: "#3a506b" }}>Add Ingredients</div>
          <div style={{ fontSize: "0.93em", color: "#666", marginTop: 2 }}>What's in your kitchen?</div>
        </div>
        <div style={{
          minWidth: 110, textAlign: "center", background: "#fff",
          borderRadius: "18px", boxShadow: "0 2px 10px #59c3c315", padding: "18px 12px", margin: "7px 0"
        }}>
          <div style={{ fontSize: "2em", marginBottom: 5 }}>🍽️</div>
          <div style={{ fontWeight: 600, color: "#3a506b" }}>Get Recipe Ideas</div>
          <div style={{ fontSize: "0.93em", color: "#666", marginTop: 2 }}>Personalized matches</div>
        </div>
        <div style={{
          minWidth: 110, textAlign: "center", background: "#fff",
          borderRadius: "18px", boxShadow: "0 2px 10px #59c3c315", padding: "18px 12px", margin: "7px 0"
        }}>
          <div style={{ fontSize: "2em", marginBottom: 5 }}>🔁</div>
          <div style={{ fontWeight: 600, color: "#3a506b" }}>Swap & Save</div>
          <div style={{ fontSize: "0.93em", color: "#666", marginTop: 2 }}>Substitute & favorite</div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
