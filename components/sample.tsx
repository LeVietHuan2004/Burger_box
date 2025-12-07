"use client";

import { useCurrentAccount } from "@iota/dapp-kit";
import { useContract } from "@/hooks/useContract";
import { Button, Container, Heading, Text, TextField } from "@radix-ui/themes";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";

const BurgerIntegration = () => {
  const currentAccount = useCurrentAccount();
  const { data, actions, state, burgerBoxId, flagId } = useContract();

  const [ingredients, setIngredients] = useState({
    buns: "5",
    beef: "10",
    cheese: "6",
    lettuce: "7",
    tomato: "5",
    sauce: "6",
    pickles: "8",
  });

  const isConnected = !!currentAccount;

  const handleIngredientChange = (field: string, value: string) => {
    setIngredients((prev) => ({ ...prev, [field]: value }));
  };

  if (!isConnected) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "3rem 2rem",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🍔</div>
          <Heading size="8" style={{ marginBottom: "1rem", color: "white" }}>
            Burger Box
          </Heading>
          <Text size="5" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            Connect your wallet to cook the perfect burger!
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2.5rem 1rem",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      }}
    >
      <Container style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🍔</div>
          <Heading size="9" style={{ color: "white", marginBottom: "0.5rem" }}>
            Burger Box Challenge
          </Heading>
          <Text size="4" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
            Cook with perfect ingredients to earn your flag
          </Text>
        </div>

        {/* Flag Success Message */}
        {flagId && (
          <div
            style={{
              marginBottom: "2rem",
              padding: "2.5rem",
              background: "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)",
              borderRadius: "20px",
              border: "2px solid #00d4ff",
              boxShadow: "0 8px 32px rgba(0, 212, 255, 0.3)",
              animation: "slideIn 0.5s ease-out",
            }}
          >
            <Heading
              size="6"
              style={{
                marginBottom: "1rem",
                color: "#fff",
                textAlign: "center",
              }}
            >
              🎉 Perfect Burger Cooked!
            </Heading>
            <Text
              style={{
                color: "#fff",
                display: "block",
                marginBottom: "1.5rem",
                textAlign: "center",
                fontSize: "1.1rem",
              }}
            >
              Congratulations! You've earned your flag!
            </Text>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                padding: "1rem",
                borderRadius: "12px",
                fontFamily: "monospace",
                wordBreak: "break-all",
                color: "#fff",
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              {flagId}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              burgerBoxId && data && !flagId ? "1fr 1.2fr" : "1fr",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Current Burger Display */}
          {burgerBoxId && data && (
            <div
              style={{
                padding: "2rem",
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Heading size="5" style={{ marginBottom: "1.5rem", color: "white" }}>
                📦 Your Current Burger
              </Heading>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                {[
                  { label: "🍞 Buns", value: data.buns },
                  { label: "🥩 Beef", value: data.beef },
                  { label: "🧀 Cheese", value: data.cheese },
                  { label: "🥬 Lettuce", value: data.lettuce },
                  { label: "🍅 Tomato", value: data.tomato },
                  { label: "🍯 Sauce", value: data.sauce },
                  { label: "🥒 Pickles", value: data.pickles },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      padding: "1.2rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      border: "1px solid rgba(0, 212, 255, 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <Text size="2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {label}
                    </Text>
                    <Heading
                      size="5"
                      style={{
                        color: "#00d4ff",
                        marginTop: "0.5rem",
                        fontSize: "1.8rem",
                      }}
                    >
                      {String(value ?? "0")}
                    </Heading>
                  </div>
                ))}
              </div>

              {!flagId && (
                <Button
                  size="3"
                  onClick={actions.getFlag}
                  disabled={state.isLoading || state.isPending}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #ff006e 0%, #8338ec 100%)",
                    border: "none",
                    cursor:
                      state.isLoading || state.isPending
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                    opacity:
                      state.isLoading || state.isPending ? 0.7 : 1,
                  }}
                >
                  {state.isLoading || state.isPending ? (
                    <>
                      <ClipLoader size={14} color="white" style={{ marginRight: "8px" }} />
                      Checking Recipe...
                    </>
                  ) : (
                    "🚩 Submit for Flag"
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Cook Burger Form */}
          <div
            style={{
              padding: "2rem",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Heading size="5" style={{ marginBottom: "1.5rem", color: "white" }}>
              👨‍🍳 Cook Your Burger
            </Heading>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {[
                { label: "🍞 Buns", key: "buns" },
                { label: "🥩 Beef", key: "beef" },
                { label: "🧀 Cheese", key: "cheese" },
                { label: "🥬 Lettuce", key: "lettuce" },
                { label: "🍅 Tomato", key: "tomato" },
                { label: "🍯 Sauce", key: "sauce" },
                { label: "🥒 Pickles", key: "pickles" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <Text
                    size="2"
                    style={{
                      display: "block",
                      marginBottom: "0.8rem",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontWeight: "600",
                      fontSize: "1rem",
                    }}
                  >
                    {label}
                  </Text>
                  <input
                    type="number"
                    value={ingredients[key as keyof typeof ingredients]}
                    onChange={(e) =>
                      handleIngredientChange(key, e.target.value)
                    }
                    min="0"
                    max="65535"
                    style={{
                      width: "100%",
                      background: "rgba(0, 212, 255, 0.15)",
                      border: "2px solid rgba(0, 212, 255, 0.5)",
                      borderRadius: "10px",
                      color: "#00d4ff",
                      padding: "1.2rem 0.8rem",
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      textAlign: "center",
                      boxShadow: "0 4px 12px rgba(0, 212, 255, 0.2), inset 0 0 8px rgba(0, 212, 255, 0.1)",
                      transition: "all 0.3s ease",
                      outline: "none",
                      caretColor: "#00d4ff",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = "rgba(0, 212, 255, 0.25)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 212, 255, 0.4), inset 0 0 12px rgba(0, 212, 255, 0.15)";
                      e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = "rgba(0, 212, 255, 0.15)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 212, 255, 0.2), inset 0 0 8px rgba(0, 212, 255, 0.1)";
                      e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.5)";
                    }}
                  />
                </div>
              ))}
            </div>

            <Button
              size="3"
              onClick={() =>
                actions.cookBurger(
                  parseInt(ingredients.buns),
                  parseInt(ingredients.beef),
                  parseInt(ingredients.cheese),
                  parseInt(ingredients.lettuce),
                  parseInt(ingredients.tomato),
                  parseInt(ingredients.sauce),
                  parseInt(ingredients.pickles)
                )
              }
              disabled={state.isPending || state.isLoading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                cursor:
                  state.isPending || state.isLoading ? "not-allowed" : "pointer",
                fontSize: "1.1rem",
                fontWeight: "600",
                padding: "1rem",
                opacity: state.isPending || state.isLoading ? 0.7 : 1,
              }}
            >
              {state.isLoading ? (
                <>
                  <ClipLoader size={16} color="white" style={{ marginRight: "8px" }} />
                  Cooking...
                </>
              ) : state.isPending ? (
                <>
                  <ClipLoader size={16} color="white" style={{ marginRight: "8px" }} />
                  Processing...
                </>
              ) : (
                "🔥 Cook Burger"
              )}
            </Button>
          </div>
        </div>

        {/* Transaction Hash Display */}
        {state.hash && (
          <div
            style={{
              marginBottom: "2rem",
              padding: "1.5rem",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Text
              size="1"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "rgba(255, 255, 255, 0.6)",
                fontWeight: "500",
              }}
            >
              Transaction Hash
            </Text>
            <Text
              size="2"
              style={{
                fontFamily: "monospace",
                wordBreak: "break-all",
                color: "#00d4ff",
                background: "rgba(0, 0, 0, 0.3)",
                padding: "0.8rem",
                borderRadius: "8px",
                marginBottom: "0.5rem",
              }}
            >
              {state.hash}
            </Text>
            {state.isConfirmed && (
              <Text
                size="2"
                style={{
                  color: "#00ff88",
                  display: "block",
                  fontWeight: "600",
                }}
              >
                ✅ Confirmed on blockchain
              </Text>
            )}
          </div>
        )}

        {/* Error Display */}
        {state.error && (
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(255, 0, 110, 0.15)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 0, 110, 0.4)",
            }}
          >
            <Text style={{ color: "#ff006e", fontWeight: "600" }}>
              ⚠️ Error: {(state.error as Error)?.message || String(state.error)}
            </Text>
          </div>
        )}
      </Container>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        input:focus {
          outline: none !important;
          border-color: rgba(0, 212, 255, 0.8) !important;
          box-shadow: 0 0 12px rgba(0, 212, 255, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default BurgerIntegration;