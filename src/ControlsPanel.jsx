import React from "react";

const tileSize = 64;

function ControlsPanel({
  player,
  setPlayer,
  projectileGroups,
  setProjectileGroups,
  selectedGroup,
  setSelectedGroup,
}) {
  const handlePlayerChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPlayer((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parseFloat(value),
    }));
  };

  const handleGroupChange = (index, key, value) => {
    const updated = [...projectileGroups];
    updated[index][key] = value;
    setProjectileGroups(updated);
  };

  const addGroup = () => {
    const id = Date.now();
    setProjectileGroups((prev) => [
      ...prev,
      {
        id,
        tileSpeed: 8,
        rangeTiles: 5,
        lifetime: 2000,
        color: "lime",
        rateOfFire: 100,
        numShots: 1,
        angle: 9,
        defaultAngle: 0,
        randomArc: 0,
        amplitude: 0,
        frequency: 0,
        delay: 0,
      },
    ]);
    setSelectedGroup(projectileGroups.length); // Switch to new tab
  };

  const removeGroup = (index) => {
    const updated = [...projectileGroups];
    updated.splice(index, 1);
    setProjectileGroups(updated);
    setSelectedGroup((prev) => Math.max(0, prev - 1));
  };

  const aps = (6.5 * (player.dexterity + 17.3)) / 75;
  const finalAPS = player.berserk ? aps * 1.25 : aps;

  return (
    <div className="controls">
      <h2>Player Settings</h2>

      <label>
        Dexterity:
        <input
          type="number"
          name="dexterity"
          value={player.dexterity}
          onChange={handlePlayerChange}
        />
      </label>

      <div
        class="player-div"
        style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
      >
        <button
          className={`toggle-button ${player.berserk ? "active" : ""}`}
          title="Berserk"
          onClick={() =>
            setPlayer((prev) => ({ ...prev, berserk: !prev.berserk }))
          }
        >
          <img src="/icons/berserk.png" alt="Berserk" />
        </button>

        <button
          title="Show Bullet Path"
          className={`toggle-button ${player.showBulletPath ? "active" : ""}`}
          onClick={() =>
            setPlayer((prev) => ({
              ...prev,
              showBulletPath: !prev.showBulletPath,
            }))
          }
        >
          <img
            src="/icons/bullet-path.png"
            alt="Bullet Path"
            width="24"
            height="24"
          />
        </button>

        <button
          title="Show Bullet Range"
          className={`toggle-button ${player.showBulletRange ? "active" : ""}`}
          onClick={() =>
            setPlayer((prev) => ({
              ...prev,
              showBulletRange: !prev.showBulletRange,
            }))
          }
        >
          <img
            src="/icons/bullet-range.png"
            alt="Bullet Range"
            width="24"
            height="24"
          />
        </button>

        <button
          title="Show Player"
          className={`toggle-button ${player.showPlayer ? "active" : ""}`}
          onClick={() =>
            setPlayer((prev) => ({ ...prev, showPlayer: !prev.showPlayer }))
          }
        >
          <img src="/icons/player.png" alt="Player" width="24" height="24" />
        </button>
      </div>

      <h3 style={{ marginTop: "1rem" }}>Info</h3>
      <div style={{ fontSize: "0.9rem", opacity: 0.85 }}>
        <div>
          <strong>Attacks/sec:</strong> {finalAPS.toFixed(3)}
        </div>
        <div>
          <strong>Interval:</strong> {(1000 / finalAPS).toFixed(1)} ms
        </div>
      </div>

      <h2 style={{ marginTop: "2rem" }}>Projectile Groups</h2>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {projectileGroups.map((group, i) => (
          <button
            key={group.id}
            onClick={() => setSelectedGroup(i)}
            style={{
              padding: "0.3rem 0.6rem",
              background: selectedGroup === i ? "#444" : "#222",
              color: "white",
              border: "1px solid #666",
              cursor: "pointer",
            }}
          >
            Group {i + 1}
          </button>
        ))}
      </div>

      {/* Selected Group Settings */}
      {projectileGroups[selectedGroup] && (
        <div
          style={{
            borderTop: "1px solid #444",
            paddingTop: "1rem",
            marginTop: "1rem",
          }}
        >
          {(() => {
            const group = projectileGroups[selectedGroup];
            const expectedLifetime =
              (group.rangeTiles / group.tileSpeed) * 1000;
            const rangePx =
              group.tileSpeed * tileSize * (group.lifetime / 1000);

            return (
              <>
                <label>
                  Speed (tiles/s):
                  <input
                    type="number"
                    value={group.tileSpeed}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "tileSpeed",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Range (tiles):
                  <input
                    type="number"
                    value={group.rangeTiles}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "rangeTiles",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Lifetime (ms):
                  <input
                    type="number"
                    value={group.lifetime}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "lifetime",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Rate of Fire (%):
                  <input
                    type="number"
                    value={group.rateOfFire}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "rateOfFire",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Num Shots:
                  <input
                    type="number"
                    value={group.numShots}
                    min="1"
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "numShots",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Default Angle (°):
                  <input
                    type="number"
                    value={group.defaultAngle}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "defaultAngle",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Angle Between Shots (°):
                  <input
                    type="number"
                    value={group.angle}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "angle",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Random Arc:
                  <input
                    type="number"
                    value={group.randomArc}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "randomArc",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Amplitude (tiles):
                  <input
                    type="number"
                    value={group.amplitude ?? 0}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "amplitude",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Frequency (waves):
                  <input
                    type="number"
                    value={group.frequency ?? 0}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "frequency",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </label>

                <label>
                  Color:
                  <input
                    type="text"
                    value={group.color}
                    onChange={(e) =>
                      handleGroupChange(selectedGroup, "color", e.target.value)
                    }
                  />
                </label>

                <label>
                  Delay:
                  <input
                    type="text"
                    value={group.delay}
                    onChange={(e) =>
                      handleGroupChange(
                        selectedGroup,
                        "delay",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </label>

                <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                  <div>
                    <strong>Expected Lifetime:</strong>{" "}
                    {expectedLifetime.toFixed(0)} ms
                  </div>
                  <div>
                    <strong>True Range:</strong> {rangePx.toFixed(1)} px (
                    {(rangePx / tileSize).toFixed(2)} tiles)
                  </div>
                </div>

                <button
                  onClick={() => removeGroup(selectedGroup)}
                  style={{ marginTop: "0.5rem" }}
                >
                  Remove Group
                </button>
              </>
            );
          })()}
        </div>
      )}

      <button onClick={addGroup} style={{ marginTop: "1rem" }}>
        Add Projectile Group
      </button>
    </div>
  );
}

export default ControlsPanel;
