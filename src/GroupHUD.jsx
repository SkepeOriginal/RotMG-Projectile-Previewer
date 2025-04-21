import React from "react";

const tileSize = 64;

function GroupHUD({ projectileGroups }) {
  return (
    <div
      class="group-hud"
    >
      <h3 style={{ marginTop: 0 }}>Projectile Info</h3>
      {projectileGroups.map((group, i) => {
        const rangePx = group.tileSpeed * tileSize * (group.lifetime / 1000);
        const rangeTiles = (rangePx / tileSize).toFixed(2);

        return (
          <div key={group.id} style={{ marginBottom: "0.4rem" }}>
            <strong>Group {i + 1}</strong>
            <div>- Range: {rangeTiles}</div>
            <div>- RoF: {group.rateOfFire ?? 100}%</div>
            <div>- Shots: {group.numShots ?? 1}</div>
          </div>
        );
      })}
    </div>
  );
}

export default GroupHUD;
