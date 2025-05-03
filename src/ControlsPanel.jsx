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
        lifetime: 625,
        color: "lime",
        rateOfFire: 100,
        numShots: 1,
        angle: 9,
        defaultAngle: 0,
        randomArc: 0,
        amplitude: 0,
        frequency: 0,
        delay: 0,
        isWavy: false,
        isParametric: false,
        sineOffset: 0
      },
    ]);
  };

  const removeGroup = (index) => {
    console.log(index, selectedGroup, setSelectedGroup);
    const updated = [...projectileGroups];
    updated.splice(selectedGroup, 1);
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

      <div class="player-div">
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
            height="20"
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
            alt="Bullet Range"/>
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

      <h3>Info</h3>
      <div>
        <div>
          <strong>Attacks/sec:</strong> {finalAPS.toFixed(3)}
        </div>
        <div>
          <strong>Interval:</strong> {(1000 / finalAPS).toFixed(1)} ms
        </div>
      </div>

      <h2>Projectile Groups</h2>

      {/* Tabs */}
      <div class="projectile-group">
        {projectileGroups.map((group, i) => (
          <button
            className = {`group-button toggle-button ${selectedGroup === i ? "active" : ""}`}
            key={group.id}
            onClick={() => setSelectedGroup(i)}>
            {i + 1}
          </button>
        ))}
        <button onClick={addGroup} className="group-button">+</button>
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
            const calculatedRange = (group.tileSpeed * 0.1) * (group.lifetime / 1000);
            const calculatedRangeTiles = calculatedRange.toFixed(2) * 10;

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
                Wavy:
                <input
                  type="checkbox"
                  checked={group.isWavy ?? false}
                  onChange={(e) =>
                    handleGroupChange(selectedGroup, "isWavy", e.target.checked)
                  }
                />
              </label>

              <label>
                Parametric:
                <input
                  type="checkbox"
                  checked={group.isParametric ?? false}
                  onChange={(e) =>
                    handleGroupChange(selectedGroup, "isParametric", e.target.checked)
                  }
                />
              </label>

              <label>
                Sine Offset:
                <input
                  type="number"
                  value={group.sineOffset ?? 1}
                  onChange={(e) =>
                    handleGroupChange(
                      selectedGroup,
                      "sineOffset",
                      parseInt(e.target.value)
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
                  <div><strong>Range:</strong> {calculatedRangeTiles} tiles</div>
                </div>

                <button
                  onClick={() => removeGroup(selectedGroup)}
                  style={{ marginTop: "0.5rem" }}
                  className="group-delete-button"
                >
                  Delete Group
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default ControlsPanel;
