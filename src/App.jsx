import React, { useState } from "react";
import ProjectileCanvas from "./ProjectileCanvas";
import ControlsPanel from "./ControlsPanel";
import GroupHUD from "./GroupHUD";
import "./App.css";

function App() {
  const [player, setPlayer] = useState({
    dexterity: 50,
    berserk: false,
    showBulletPath: true,
    showBulletRange: true,
    showPlayer: true,
  });

  const [projectileGroups, setProjectileGroups] = useState([
    {
      id: 1,
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
      sineOffset: 0,
      hoveredProjectileGroup: null
    },
  ]);

  const [selectedGroup, setSelectedGroup] = useState(0);

  return (
    <div className="app">
      <ProjectileCanvas
        player={player}
        projectileGroups={projectileGroups}
      />
      <ControlsPanel
        player={player}
        setPlayer={setPlayer}
        projectileGroups={projectileGroups}
        setProjectileGroups={setProjectileGroups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
      <GroupHUD
        projectileGroups={projectileGroups}
      />
    </div>
  );
}

export default App;
