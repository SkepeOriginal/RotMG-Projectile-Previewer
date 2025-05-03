import React, { useRef, useEffect } from "react";

const tileSize = 64;
var internalProjectileID = 1;

function getProjectilePosition(
  centerX,
  centerY,
  angle,
  dist,
  amplitude,
  frequency,
  rangePx,
  projectileID,
  isWavy,
  isParametric,
  sineOffset,
  elapsedSeconds
) {
  const dirX = Math.cos(angle);
  const dirY = Math.sin(angle);
  const perpX = -dirY;
  const perpY = dirX;

  /*if (isWavy) {
    if (amplitude <= 0.0001) { amplitude = 0.5; }
    if (frequency <= 0.0001) { frequency = 1.75; }
    amplitude *= elapsedSeconds;
  }

  const travelPercent = dist / rangePx;
  const sineInput = travelPercent * frequency * 2 * Math.PI;
  var waveOffset = amplitude * Math.sin(sineInput);
  if (!isEven(projectileID)) {
    waveOffset = waveOffset * -1;
  }*/

  const travelPercent = dist / rangePx;

  let waveOffset = 0;

  if (isWavy) {
    if (amplitude <= 0.0001) { amplitude = 0.5; }
    if (frequency <= 0.0001) { frequency = 1.75; }
    // Pure wavy uses time-based sine and growing amplitude
    waveOffset =
      Math.sin(elapsedSeconds * 3 * 2 * Math.PI) * elapsedSeconds * tileSize;
  } else if (amplitude > 0.0001 && frequency > 0.0001) {
    // Normal sine wave motion
    waveOffset =
      Math.sin(travelPercent * frequency * 2 * Math.PI) *
      amplitude;
  }

  // Alternate offset for mirrored projectiles
  if (!isEven(projectileID)) {
    waveOffset *= -1;
  }

  return {
    x: centerX + dirX * dist + perpX * waveOffset,
    y: centerY + dirY * dist + perpY * waveOffset,
  };
}

function ProjectileCanvas({ player, projectileGroups }) {
  const canvasRef = useRef(null);
  const projectilesRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const mouseIsDownRef = useRef(false);
  const lastFireTimeRef = useRef([]);
  const patternRef = useRef(null);

  const getCenter = (canvas) => {
    return {
      x: Math.floor(canvas.width / (2 * tileSize)) * tileSize + tileSize / 2,
      y: Math.floor(canvas.height / (2 * tileSize)) * tileSize + tileSize / 2,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const tileImage = new Image();
    tileImage.src = "/tiles/tiles64.png";
    tileImage.onload = () => {
      patternRef.current = ctx.createPattern(tileImage, "repeat");
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mousePosRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (patternRef.current) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = patternRef.current;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const { x: centerX, y: centerY } = getCenter(canvas);

      if (player.showBulletPath) {
        let index = 0;
        for (const group of projectileGroups) {
          const totalShots = group.numShots ?? 1;
          const angleBetween = (group.angle ?? 9) * (Math.PI / 180);
          const offsetAngle = (group.defaultAngle ?? 0) * (Math.PI / 180);
          const baseAngle = Math.atan2(
            mousePosRef.current.y - centerY,
            mousePosRef.current.x - centerX
          );

          // const rangePx = group.tileSpeed * tileSize * (group.lifetime / 1000);
          var rangePx = group.tileSpeed * tileSize * (group.lifetime / 1000);
          if (rangePx > tileSize * group.rangeTiles) {
            rangePx = tileSize * group.rangeTiles;
          }
          const amplitudePx = (group.amplitude ?? 0) * tileSize;
          const frequency = group.frequency ?? 0;
          var color = "gray";
          if (index === group.hoveredProjectileGroup) {
            color = "aqua";
          }
          index++;

          for (let s = 0; s < totalShots; s++) {
            const spreadOffset = angleBetween * (s - (totalShots - 1) / 2);
            const angle = baseAngle + offsetAngle + spreadOffset;
            
            ctx.beginPath();
            const steps = 30;
            
            for (let i = 0; i <= steps; i++) {
              const dist = (i / steps) * rangePx;
              const elapsed = (dist / (group.tileSpeed * tileSize));
              const { x, y } = getProjectilePosition(
                centerX,
                centerY,
                angle,
                dist,
                amplitudePx,
                frequency,
                rangePx,
                1,
                group.isWavy,
                group.isParametric,
                group.sineOffset,
                elapsed
              );
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }

            ctx.strokeStyle = color;
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2;
            ctx.stroke();

            if (group.amplitude > 0) {
              ctx.beginPath();
              const steps = 30;

              for (let i = 0; i <= steps; i++) {
                const dist = (i / steps) * rangePx;
                const elapsed = (dist / (group.tileSpeed * tileSize));
                const { x, y } = getProjectilePosition(
                  centerX,
                  centerY,
                  angle,
                  dist,
                  amplitudePx,
                  frequency,
                  rangePx,
                  2,
                  group.isWavy,
                  group.isParametric,
                  group.sineOffset,
                  elapsed
                );
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }

              ctx.strokeStyle = color;
              ctx.globalAlpha = 1;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        }
        index = 0;
        ctx.globalAlpha = 1;
      }

      if (player.showBulletRange) {
        projectileGroups.forEach((group) => {
          const range = group.tileSpeed * (group.lifetime / 1000) * tileSize;

          // Draw range ring
          ctx.beginPath();
          ctx.arc(centerX, centerY, range, 0, Math.PI * 2);
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }

      if (player.showPlayer) {
        // Draw Player Ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const nowMs = performance.now();
      if (mouseIsDownRef.current) {
        projectileGroups.forEach((group, index) => {
          if (!lastFireTimeRef.current[index])
            lastFireTimeRef.current[index] = 0;

          const rateOfFire = (group.rateOfFire ?? 100) / 100;
          const aps = (6.5 * (player.dexterity + 17.3)) / 75;
          const berserkMultiplier = player.berserk ? 3.25 : 1.0;
          var effectiveAPS = aps * berserkMultiplier * (rateOfFire ?? 1);
          if (group.delay > 0) {
            effectiveAPS = 100 / group.delay / 100;
          }
          const fireInterval = 1000 / effectiveAPS;

          if (nowMs - lastFireTimeRef.current[index] >= fireInterval) {
            lastFireTimeRef.current[index] = nowMs;

            const baseAngle = Math.atan2(
              mousePosRef.current.y - centerY,
              mousePosRef.current.x - centerX
            );
            const offsetAngle = (group.defaultAngle ?? 0) * (Math.PI / 180);
            const angleBetween = (group.angle ?? 9) * (Math.PI / 180);
            const totalShots = group.numShots ?? 1;

            for (let s = 0; s < totalShots; s++) {
              const spreadOffset = angleBetween * (s - (totalShots - 1) / 2);
              const finalAngle = baseAngle + offsetAngle + spreadOffset;
              internalProjectileID++;

              projectilesRef.current.push({
                angle: finalAngle,
                spawnTime: nowMs,
                tileSpeed: group.tileSpeed,
                lifetime: group.lifetime,
                amplitude: group.amplitude ?? 0,
                frequency: group.frequency ?? 0,
                color: group.color || "lime",
                delay: group.delat ?? 0,
                internalProjectileID: internalProjectileID,
                isWavy: group.isWavy,
                isParametric: group.isParametric,
                sineOffset: group.sineOffset
              });
            }
          }
        });
      }

      projectilesRef.current = projectilesRef.current.filter(
        (p) => now - p.spawnTime < p.lifetime
      );

      if (projectilesRef.current.length > 1000) {
        projectilesRef.current.splice(0, projectilesRef.current.length - 1000);
      }      

      for (const p of projectilesRef.current) {
        let x, y;
      
        if (p.isParametric) {
          const timeAlive = now - p.spawnTime;
          const fRatio = 360 / p.lifetime;
          const offset =
            (p.lifetime - timeAlive +
              p.lifetime / 4);
      
          const amp = tileSize * 3; // Adjust this if needed
          const px =
            Math.cos(1 * offset * fRatio * Math.PI / 180) * amp;
          const py =
            Math.sin(2 * offset * fRatio * Math.PI / 180) * amp;
      
          const rot = p.angle; // already in radians
          const rotX = px * Math.cos(rot) - py * Math.sin(rot);
          const rotY = px * Math.sin(rot) + py * Math.cos(rot);
      
          x = centerX + rotX;
          y = centerY + rotY;
        } else {
          const elapsed = (now - p.spawnTime) / 1000;
          const dist = Math.min(
            p.tileSpeed * tileSize * elapsed,
            (p.tileSpeed * p.lifetime / 1000) * tileSize
          );
          const rangePx = (p.tileSpeed) * (p.lifetime / 1000) * tileSize;        
          ({ x, y } = getProjectilePosition(
            centerX,
            centerY,
            p.angle,
            dist,
            p.amplitude * tileSize,
            p.frequency,
            rangePx,
            p.internalProjectileID,
            p.isWavy,
            p.isParametric,
            p.sineOffset,
            elapsed
          ));
        }
      
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = p.color || "lime";
        ctx.fill();
      }      

      requestAnimationFrame(render);
    };

    render();
    return () => window.removeEventListener("resize", resize);
  }, [player, projectileGroups]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas"
      onMouseDown={() => {
        mouseIsDownRef.current = true;
        lastFireTimeRef.current = projectileGroups.map(() => 0);
      }}
      onMouseUp={() => (mouseIsDownRef.current = false)}
      onMouseLeave={() => (mouseIsDownRef.current = false)}
      onMouseMove={(e) => {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
      }}
    />
  );
}

function isEven(n) {
  return n % 2 === 0;
}

export default ProjectileCanvas;
