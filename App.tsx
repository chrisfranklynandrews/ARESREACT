import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { GameStatus, Player, Enemy, Projectile, Star, FloatingText, EnemyType, ProjectileType, EnemyProjectile } from './types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_Y_OFFSET,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_SPEED,
  SWOOPER_AMPLITUDE,
  SWOOPER_FREQUENCY,
  DASHER_PAUSE_Y,
  DASHER_PAUSE_DURATION,
  DASHER_DASH_SPEED,
  INITIAL_ENEMY_SPAWN_RATE,
  MIN_ENEMY_SPAWN_RATE,
  TIME_TO_MAX_DIFFICULTY,
  PROJECTILE_WIDTH,
  PROJECTILE_HEIGHT,
  PROJECTILE_SPEED,
  STAR_COUNT,
  STAR_SPEED_MIN,
  STAR_SPEED_MAX,
  PLAYER_SMOOTHING_FACTOR,
  BASE_ENEMY_HP,
  MAX_ADDITIONAL_HP,
  BASE_ENEMY_VALUE,
  MAX_ADDITIONAL_VALUE,
  ENEMY_COLORS,
  BASE_PROJECTILE_FIRE_RATE,
  FIRE_RATE_DECREASE_PER_LEVEL,
  MIN_PROJECTILE_FIRE_RATE,
  INITIAL_BULLET_RATE_COST,
  BASE_BULLET_POWER,
  BULLET_POWER_INCREASE_PER_LEVEL,
  INITIAL_BULLET_POWER_COST,
  UPGRADE_COST_MULTIPLIER,
  INITIAL_INTEREST_COST,
  FLOATING_TEXT_DURATION,
  FLOATING_TEXT_LIFT,
  INITIAL_SHIELD_COST,
  ENEMY_RECOIL_AMOUNT,
  ENEMY_DEATH_FADE_DURATION,
  UPGRADE_BAR_HEIGHT,
  PLAYER_HIT_EFFECT_DURATION,
  INITIAL_SHIP_LEVEL_COST,
  MAX_SHIP_LEVEL,
  HOMING_MISSILE_WIDTH,
  HOMING_MISSILE_HEIGHT,
  HOMING_MISSILE_SPEED,
  HOMING_MISSILE_TURN_RATE,
  HOMING_DRONE_SCALE,
  BASE_BEAM_DAMAGE_PER_TICK,
  BEAM_DAMAGE_INCREASE_PER_LEVEL,
  BEAM_FIRING_DURATION,
  BEAM_COOLDOWN_DURATION,
  TURRET_STOP_Y,
  TURRET_HORIZONTAL_SPEED,
  TURRET_FIRE_RATE,
  ENEMY_PROJECTILE_WIDTH,
  ENEMY_PROJECTILE_HEIGHT,
  ENEMY_PROJECTILE_SPEED,
  SPLITTER_HP_MULTIPLIER,
  SPLITTER_VALUE_MULTIPLIER,
  SPLINTER_COUNT,
  SPLINTER_INITIAL_SPEED,
  SPLINTER_HP,
  SPLINTER_VALUE,
  SPLINTER_WIDTH,
  SPLINTER_HEIGHT,
  SPLINTER_DRAG,
  SPLINTER_GRAVITY,
} from './constants';

// --- VISUAL COMPONENTS ---

const PlayerShip: React.FC = React.memo(() => (
  <svg width={PLAYER_WIDTH} height={PLAYER_HEIGHT} viewBox="0 0 100 100" className="filter drop-shadow-[0_0_8px_rgba(0,255,255,0.9)] drop-shadow-[0_0_12px_rgba(0,255,255,0.5)]">
    <polygon points="50,10 90,90 10,90" stroke="#0ff" strokeWidth="8" fill="none" strokeLinejoin="round" />
  </svg>
));

const HomingDroneShape: React.FC = React.memo(() => (
    <svg width={PLAYER_WIDTH * HOMING_DRONE_SCALE} height={PLAYER_WIDTH * HOMING_DRONE_SCALE} viewBox="0 0 100 100" className="filter drop-shadow-[0_0_8px_rgba(0,255,255,0.9)] drop-shadow-[0_0_12px_rgba(0,255,255,0.5)]">
      <circle cx="50" cy="50" r="45" stroke="#0ff" strokeWidth="8" fill="none" />
    </svg>
  ));

const createDropShadowStyle = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return {
    filter: `drop-shadow(0 0 8px rgba(${r},${g},${b},0.9)) drop-shadow(0 0 12px rgba(${r},${g},${b},0.5))`
  };
};

const StandardEnemyShip: React.FC<{ color: string; style: React.CSSProperties }> = React.memo(({ color, style }) => (
  <svg width={ENEMY_WIDTH} height={ENEMY_HEIGHT} viewBox="0 0 100 100" style={style}>
    <polygon points="50,90 15,20 85,20" stroke={color} strokeWidth="8" fill="none" strokeLinejoin="round" />
  </svg>
));

const SwooperEnemyShip: React.FC<{ color: string; style: React.CSSProperties }> = React.memo(({ color, style }) => (
  <svg width={ENEMY_WIDTH} height={ENEMY_HEIGHT} viewBox="0 0 100 100" style={style}>
      <polygon points="50,10 90,50 50,90 10,50" stroke={color} strokeWidth="8" fill="none" strokeLinejoin="round" />
  </svg>
));

const DasherEnemyShip: React.FC<{ color: string; style: React.CSSProperties }> = React.memo(({ color, style }) => (
  <svg width={ENEMY_WIDTH} height={ENEMY_HEIGHT} viewBox="0 0 100 100" style={style}>
      <polygon points="50,90 20,20 50,40 80,20" stroke={color} strokeWidth="8" fill="none" strokeLinejoin="round" />
  </svg>
));

const TurretEnemyShip: React.FC<{ color: string; style: React.CSSProperties }> = React.memo(({ color, style }) => (
    <svg width={ENEMY_WIDTH} height={ENEMY_HEIGHT} viewBox="0 0 100 100" style={style}>
        <polygon points="50,10 93,30 93,70 50,90 7,70 7,30" stroke={color} strokeWidth="8" fill="none" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="10" fill={color} />
    </svg>
));

const SplitterEnemyShip: React.FC<{ color: string; style: React.CSSProperties }> = React.memo(({ color, style }) => (
    <svg width={ENEMY_WIDTH * 1.2} height={ENEMY_HEIGHT * 1.2} viewBox="0 0 100 100" style={style}>
        <polygon points="50,10 95,45 80,95 20,95 5,45" stroke={color} strokeWidth="8" fill="none" strokeLinejoin="round" />
    </svg>
));

const SplinterEnemyShip: React.FC<{ color: string; style: React.CSSProperties }> = React.memo(({ color, style }) => (
    <svg width={SPLINTER_WIDTH} height={SPLINTER_HEIGHT} viewBox="0 0 100 100" style={style}>
        <polygon points="50,90 15,20 85,20" stroke={color} strokeWidth="12" fill="none" strokeLinejoin="round" />
    </svg>
));

const EnemyShip: React.FC<{ enemy: Enemy }> = React.memo(({ enemy }) => {
  const style = createDropShadowStyle(enemy.color);
  switch(enemy.type) {
    case EnemyType.Swooper:
      return <SwooperEnemyShip color={enemy.color} style={style} />;
    case EnemyType.Dasher:
      return <DasherEnemyShip color={enemy.color} style={style} />;
    case EnemyType.Turret:
        return <TurretEnemyShip color={enemy.color} style={style} />;
    case EnemyType.Splitter:
        return <SplitterEnemyShip color={enemy.color} style={style} />;
    case EnemyType.Splinter:
        return <SplinterEnemyShip color={enemy.color} style={style} />;
    case EnemyType.Standard:
    default:
      return <StandardEnemyShip color={enemy.color} style={style} />;
  }
});

const ProjectileShape: React.FC = React.memo(() => (
  <div
    className="border-2 border-cyan-400 rounded-full"
    style={{ 
      width: `${PROJECTILE_WIDTH}px`, 
      height: `${PROJECTILE_HEIGHT}px`,
      boxShadow: '0 0 6px #0ff, 0 0 10px #0ff'
    }}
  />
));

const EnemyProjectileShape: React.FC = React.memo(() => (
    <div
      className="rounded-full bg-red-500"
      style={{ 
        width: `${ENEMY_PROJECTILE_WIDTH}px`, 
        height: `${ENEMY_PROJECTILE_HEIGHT}px`,
        boxShadow: '0 0 6px #f00, 0 0 10px #f00'
      }}
    />
  ));

const MissileShape: React.FC<{ angle: number }> = React.memo(({ angle }) => (
    <div
      style={{
        width: `${HOMING_MISSILE_WIDTH}px`,
        height: `${HOMING_MISSILE_HEIGHT}px`,
        transform: `rotate(${angle * (180 / Math.PI) + 90}deg)`, // Convert rad to deg, offset by 90
        willChange: 'transform',
      }}
    >
      <svg
        viewBox="0 0 10 20"
        className="filter drop-shadow-[0_0_4px_rgba(255,100,0,0.9)] drop-shadow-[0_0_8px_rgba(255,100,0,0.5)]"
      >
        <polygon points="5,0 10,20 0,20" fill="#ff8c00" />
      </svg>
    </div>
  ));
  

const PlayerHitExplosion: React.FC<{ player: Player; startTime: number }> = ({ player, startTime }) => {
    const elapsedTime = Date.now() - startTime;
    const progress = elapsedTime / PLAYER_HIT_EFFECT_DURATION;

    if (progress > 1) return null;

    const size = PLAYER_WIDTH * 3 * progress;
    const opacity = 1 - Math.pow(progress, 2);

    return (
        <div
            className="absolute rounded-full border-4 pointer-events-none"
            style={{
                left: player.x + player.width / 2 - size / 2,
                top: player.y + player.height / 2 - size / 2,
                width: size,
                height: size,
                opacity: opacity,
                borderColor: '#ffdd00',
                boxShadow: '0 0 15px #ffdd00, inset 0 0 10px #ffdd00',
                willChange: 'transform, opacity, width, height',
            }}
        />
    );
};

const LaserBeam: React.FC<{ from: { x: number; y: number }; to: { x: number; y: number } }> = React.memo(({ from, to }) => (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none filter drop-shadow-[0_0_4px_rgba(255,0,0,0.9)] drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="red" strokeWidth="3" />
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="white" strokeWidth="1" />
    </svg>
  ));
  
  const ElectricityArc: React.FC<{ from: { x: number; y: number }; to: { x: number; y: number } }> = ({ from, to }) => {
    const generateArcPath = () => {
      const segments = 15;
      const chaos = 10;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const segmentLength = len / segments;
  
      let path = `M ${from.x} ${from.y} `;
  
      for (let i = 1; i < segments; i++) {
        const posAlongLine = i * segmentLength;
        const perpOffset = (Math.random() - 0.5) * chaos;
        const nextX = from.x + Math.cos(angle) * posAlongLine - Math.sin(angle) * perpOffset;
        const nextY = from.y + Math.sin(angle) * posAlongLine + Math.cos(angle) * perpOffset;
        path += `L ${nextX} ${nextY} `;
      }
  
      path += `L ${to.x} ${to.y}`;
      return path;
    };
  
    const pathD = generateArcPath();
  
    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none filter drop-shadow-[0_0_5px_rgba(0,128,255,0.9)] drop-shadow-[0_0_10px_rgba(0,128,255,0.5)]">
        <path d={pathD} stroke="cyan" strokeWidth="3" fill="none" opacity={0.7} />
        <path d={pathD} stroke="white" strokeWidth="1" fill="none" />
      </svg>
    );
  };

// --- UPGRADE ICONS ---

const BulletRateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 11-3-3-3 3"/><path d="m15 17-3-3-3 3"/><path d="M12 20V4"/></svg>
);

const BulletPowerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const ShipLevelIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="m5 19 7-7 7 7"/></svg>
);

const InterestIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

const ShieldIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);


// --- GAME STATE & LOGIC ---

type GameState = {
  // In-run state
  status: GameStatus;
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  enemyProjectiles: EnemyProjectile[];
  stars: Star[];
  killCount: number;
  lastEnemySpawn: number;
  lastProjectileSpawn: number;
  lastMissileSpawn: number;
  gameStartTime: number;
  floatingTexts: FloatingText[];
  shields: number;
  playerHitTime: number;
  leftDrone: { x: number; y: number };
  rightDrone: { x: number; y: number };
  homingDrone: { x: number; y: number };
  leftDroneTargetId: number | null;
  rightDroneTargetId: number | null;
  leftDroneState: 'firing' | 'cooldown';
  rightDroneState: 'firing' | 'cooldown';
  leftDroneStateTime: number;
  rightDroneStateTime: number;

  // Persistent state
  money: number;
  bulletRateLevel: number;
  bulletPowerLevel: number;
  shipLevel: number;
  interestLevel: number;
  shieldLevel: number;
  bulletRateCost: number;
  bulletPowerCost: number;
  shipLevelCost: number;
  interestCost: number;
  shieldCost: number;
};

type Action =
  | { type: 'START_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART' }
  | { type: 'RESET_GAME' }
  | { type: 'TICK' }
  | { type: 'UPGRADE_BULLET_RATE' }
  | { type: 'UPGRADE_BULLET_POWER' }
  | { type: 'UPGRADE_SHIP_LEVEL' }
  | { type: 'UPGRADE_INTEREST' }
  | { type: 'UPGRADE_SHIELD' };
  
const createInitialRunState = () => {
  const initialPlayer = {
    x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: GAME_HEIGHT - UPGRADE_BAR_HEIGHT - PLAYER_HEIGHT - PLAYER_Y_OFFSET,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  };

  const droneScale = 0.5;
  const sideDroneWidth = PLAYER_WIDTH * droneScale;
  const x_spacing = 10;
  const sideDroneY = initialPlayer.y + (PLAYER_HEIGHT / 2) - ((PLAYER_HEIGHT * droneScale) / 2);
  
  const homingDroneSize = PLAYER_WIDTH * HOMING_DRONE_SCALE;

  return {
    player: initialPlayer,
    enemies: [],
    projectiles: [],
    enemyProjectiles: [],
    killCount: 0,
    lastEnemySpawn: 0,
    lastProjectileSpawn: 0,
    lastMissileSpawn: 0,
    gameStartTime: 0,
    floatingTexts: [],
    playerHitTime: 0,
    leftDrone: {
      x: initialPlayer.x - sideDroneWidth - x_spacing,
      y: sideDroneY,
    },
    rightDrone: {
      x: initialPlayer.x + PLAYER_WIDTH + x_spacing,
      y: sideDroneY,
    },
    homingDrone: {
        x: initialPlayer.x + PLAYER_WIDTH / 2 - homingDroneSize / 2,
        y: initialPlayer.y + PLAYER_HEIGHT + 15,
    },
    leftDroneTargetId: null,
    rightDroneTargetId: null,
    leftDroneState: 'firing' as const,
    rightDroneState: 'firing' as const,
    leftDroneStateTime: 0,
    rightDroneStateTime: 0,
  };
};


const createInitialState = (): GameState => {
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    size: Math.random() * 2 + 1,
    speed: Math.random() * (STAR_SPEED_MAX - STAR_SPEED_MIN) + STAR_SPEED_MIN,
  }));

  return {
    status: GameStatus.Start,
    ...createInitialRunState(),
    stars,
    shields: 1,
    money: 0,
    bulletRateLevel: 1,
    bulletPowerLevel: 1,
    shipLevel: 1,
    interestLevel: 1,
    shieldLevel: 1,
    bulletRateCost: INITIAL_BULLET_RATE_COST,
    bulletPowerCost: INITIAL_BULLET_POWER_COST,
    shipLevelCost: INITIAL_SHIP_LEVEL_COST,
    interestCost: INITIAL_INTEREST_COST,
    shieldCost: INITIAL_SHIELD_COST,
  };
};

const intersects = (a: {x:number, y:number, width:number, height:number}, b: {x:number, y:number, width:number, height:number}) => {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const now = Date.now();
      return {
        ...state,
        status: GameStatus.Playing,
        lastEnemySpawn: now,
        lastProjectileSpawn: now,
        lastMissileSpawn: now,
        gameStartTime: now,
        shields: state.shieldLevel,
        leftDroneState: 'firing',
        rightDroneState: 'firing',
        leftDroneStateTime: now,
        rightDroneStateTime: now,
      };
    }
    case 'GAME_OVER':
      return { ...state, status: GameStatus.GameOver };
    case 'RESTART': {
      const now = Date.now();
      const interestRate = (state.interestLevel) * 0.01;
      const earnedInterest = Math.round(state.money * interestRate);
      const newMoney = state.money + earnedInterest;

      return { 
        ...state, 
        ...createInitialRunState(),
        money: newMoney,
        status: GameStatus.Playing,
        lastEnemySpawn: now,
        lastProjectileSpawn: now,
        lastMissileSpawn: now,
        gameStartTime: now,
        shields: state.shieldLevel,
        leftDroneState: 'firing',
        rightDroneState: 'firing',
        leftDroneStateTime: now,
        rightDroneStateTime: now,
      };
    }
    case 'RESET_GAME':
      return createInitialState();
    case 'UPGRADE_BULLET_RATE': {
      if (state.money < state.bulletRateCost) return state;
      return {
        ...state,
        money: state.money - state.bulletRateCost,
        bulletRateLevel: state.bulletRateLevel + 1,
        bulletRateCost: Math.floor(state.bulletRateCost * UPGRADE_COST_MULTIPLIER),
      };
    }
    case 'UPGRADE_BULLET_POWER': {
      if (state.money < state.bulletPowerCost) return state;
      return {
        ...state,
        money: state.money - state.bulletPowerCost,
        bulletPowerLevel: state.bulletPowerLevel + 1,
        bulletPowerCost: Math.floor(state.bulletPowerCost * UPGRADE_COST_MULTIPLIER),
      };
    }
    case 'UPGRADE_SHIP_LEVEL': {
        if (state.money < state.shipLevelCost || state.shipLevel >= MAX_SHIP_LEVEL) return state;
        return {
          ...state,
          money: state.money - state.shipLevelCost,
          shipLevel: state.shipLevel + 1,
          shipLevelCost: Math.floor(state.shipLevelCost * UPGRADE_COST_MULTIPLIER),
        };
      }
    case 'UPGRADE_INTEREST': {
      if (state.money < state.interestCost) return state;
      return {
        ...state,
        money: state.money - state.interestCost,
        interestLevel: state.interestLevel + 1,
        interestCost: Math.floor(state.interestCost * UPGRADE_COST_MULTIPLIER),
      };
    }
    case 'UPGRADE_SHIELD': {
        if (state.money < state.shieldCost) return state;
        return {
          ...state,
          money: state.money - state.shieldCost,
          shieldLevel: state.shieldLevel + 1,
          shieldCost: Math.floor(state.shieldCost * UPGRADE_COST_MULTIPLIER),
        };
      }
    case 'TICK': {
      if (state.status !== GameStatus.Playing) return state;

      const now = Date.now();
      let { player, enemies, projectiles, enemyProjectiles, stars, killCount, money, lastEnemySpawn, lastProjectileSpawn, lastMissileSpawn, floatingTexts, shields, leftDrone, rightDrone, homingDrone, leftDroneTargetId, rightDroneTargetId, leftDroneState, rightDroneState, leftDroneStateTime, rightDroneStateTime } = { ...state };
      let playerHitTime = state.playerHitTime;

      if (playerHitTime > 0 && now - playerHitTime > PLAYER_HIT_EFFECT_DURATION) {
        playerHitTime = 0;
      }

      let playerTargetX: number;
      const activeEnemies = enemies.filter(e => !e.isClearing && e.hp > 0);
      if (activeEnemies.length > 0) {
        const targetEnemy = activeEnemies.reduce((lowest, current) => (current.y > lowest.y ? current : lowest));
        playerTargetX = targetEnemy.x + targetEnemy.width / 2 - player.width / 2;
      } else {
        playerTargetX = GAME_WIDTH / 2 - player.width / 2;
      }
      
      const dx = playerTargetX - player.x;
      player.x += dx * PLAYER_SMOOTHING_FACTOR;
      player.x = Math.max(0, Math.min(GAME_WIDTH - player.width, player.x));
      
      const DRONE_SMOOTHING_FACTOR = 0.2;
      const sideDroneScale = 0.5;
      const sideDroneWidth = PLAYER_WIDTH * sideDroneScale;
      const sideDroneHeight = PLAYER_HEIGHT * sideDroneScale;
      const side_x_spacing = 10;
      const targetSideDroneY = player.y + (PLAYER_HEIGHT / 2) - (sideDroneHeight / 2);
      
      const homingDroneSize = PLAYER_WIDTH * HOMING_DRONE_SCALE;
      const homing_y_spacing = 15;
      const targetHomingDroneX = player.x + PLAYER_WIDTH / 2 - homingDroneSize / 2;
      const targetHomingDroneY = player.y + PLAYER_HEIGHT + homing_y_spacing;

      const targetLeftDroneX = player.x - sideDroneWidth - side_x_spacing;
      leftDrone.x += (targetLeftDroneX - leftDrone.x) * DRONE_SMOOTHING_FACTOR;
      leftDrone.y += (targetSideDroneY - leftDrone.y) * DRONE_SMOOTHING_FACTOR;

      const targetRightDroneX = player.x + PLAYER_WIDTH + side_x_spacing;
      rightDrone.x += (targetRightDroneX - rightDrone.x) * DRONE_SMOOTHING_FACTOR;
      rightDrone.y += (targetSideDroneY - rightDrone.y) * DRONE_SMOOTHING_FACTOR;

      homingDrone.x += (targetHomingDroneX - homingDrone.x) * DRONE_SMOOTHING_FACTOR;
      homingDrone.y += (targetHomingDroneY - homingDrone.y) * DRONE_SMOOTHING_FACTOR;

      stars = stars.map(star => {
        const newY = star.y + star.speed;
        if (newY > GAME_HEIGHT) {
          return { ...star, y: 0, x: Math.random() * GAME_WIDTH };
        }
        return { ...star, y: newY };
      });

      projectiles = projectiles.map(p => {
        if (p.type === ProjectileType.Homing) {
            let target: Enemy | undefined = undefined;
            if (p.targetId) {
                target = enemies.find(e => e.id === p.targetId && e.hp > 0 && !e.isClearing);
            }
            if (!target && activeEnemies.length > 0) {
                target = activeEnemies.reduce((lowest, current) => (current.y > lowest.y ? current : lowest));
            }

            let newAngle = p.angle ?? -Math.PI / 2;
            if (target) {
                const targetAngle = Math.atan2(target.y + target.height / 2 - p.y, target.x + target.width / 2 - p.x);
                let angleDiff = targetAngle - newAngle;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;

                const turnAmount = Math.min(HOMING_MISSILE_TURN_RATE, Math.abs(angleDiff));
                newAngle += turnAmount * Math.sign(angleDiff);
            }
            const vx = Math.cos(newAngle) * HOMING_MISSILE_SPEED;
            const vy = Math.sin(newAngle) * HOMING_MISSILE_SPEED;
            return { ...p, x: p.x + vx, y: p.y + vy, angle: newAngle, targetId: target ? target.id : undefined };
        }
        
        const angle = p.angle ?? -Math.PI / 2;
        const vx = Math.cos(angle) * PROJECTILE_SPEED;
        const vy = Math.sin(angle) * PROJECTILE_SPEED;
        return { ...p, x: p.x + vx, y: p.y + vy };
      }).filter(p => p.y + p.height > 0 && p.y < GAME_HEIGHT && p.x + p.width > 0 && p.x < GAME_WIDTH);
      
      const newEnemyProjectiles: EnemyProjectile[] = [];
      enemies = enemies.map((e) => {
        if (e.isClearing) {
            return { ...e, y: e.y - ENEMY_SPEED * 2.5, recoil: undefined };
        }
        let newX = e.x; let newY = e.y; let newPhase = e.phase; let newRecoil = e.recoil;
        if (newRecoil && newRecoil > 0) { newY -= newRecoil; newRecoil *= 0.9; if (newRecoil < 0.5) newRecoil = undefined; }
        if (e.hp > 0) {
            switch (e.type) {
                case EnemyType.Swooper: {
                    newY += ENEMY_SPEED; let newSwoopDirection = e.swoopDirection ?? 1; let newInitialX = e.initialX ?? e.x;
                    const xOffset = Math.sin(newY * SWOOPER_FREQUENCY) * SWOOPER_AMPLITUDE; let proposedX = newInitialX + (xOffset * newSwoopDirection);
                    const wallRightX = GAME_WIDTH - e.width; const isMovingRightward = (Math.cos(newY * SWOOPER_FREQUENCY) * newSwoopDirection) > 0;
                    if (proposedX < 0 && !isMovingRightward) { newSwoopDirection *= -1; newInitialX = -newInitialX; } else if (proposedX > wallRightX && isMovingRightward) { newSwoopDirection *= -1; newInitialX = 2 * wallRightX - newInitialX; }
                    newX = newInitialX + (Math.sin(newY * SWOOPER_FREQUENCY) * SWOOPER_AMPLITUDE * newSwoopDirection); newX = Math.max(0, Math.min(wallRightX, newX));
                    return { ...e, x: newX, y: newY, initialX: newInitialX, swoopDirection: newSwoopDirection, recoil: newRecoil };
                }
                case EnemyType.Dasher:
                    if (e.phase === 'descending') { newY += ENEMY_SPEED * 1.5; if (newY >= DASHER_PAUSE_Y) { newY = DASHER_PAUSE_Y; return { ...e, y: newY, phase: 'pausing', pauseTime: now, dashTargetX: player.x, recoil: newRecoil }; }
                    } else if (e.phase === 'pausing') { if (now - (e.pauseTime ?? 0) > DASHER_PAUSE_DURATION) { newPhase = 'dashing'; }
                    } else if (e.phase === 'dashing') { const targetX = e.dashTargetX ?? player.x; const dx = targetX - e.x; const moveX = Math.sign(dx) * Math.min(Math.abs(dx), DASHER_DASH_SPEED * 0.75); newX += moveX; newY += DASHER_DASH_SPEED; }
                    break;
                case EnemyType.Turret:
                    if (e.phase === 'descending') {
                        newY += ENEMY_SPEED / 2;
                        if (newY >= TURRET_STOP_Y) {
                            return { ...e, y: TURRET_STOP_Y, phase: 'active', lastFired: now };
                        }
                    } else if (e.phase === 'active') {
                        let newDir = e.horizontalDirection ?? 1;
                        newX += TURRET_HORIZONTAL_SPEED * newDir;
                        if (newX <= 0 || newX >= GAME_WIDTH - e.width) {
                            newDir *= -1;
                        }
                        if (now - (e.lastFired ?? 0) > TURRET_FIRE_RATE) {
                            e.lastFired = now;
                            newEnemyProjectiles.push({
                                id: now + Math.random(),
                                x: e.x + e.width / 2 - ENEMY_PROJECTILE_WIDTH / 2,
                                y: e.y + e.height,
                                width: ENEMY_PROJECTILE_WIDTH,
                                height: ENEMY_PROJECTILE_HEIGHT,
                            });
                        }
                        return { ...e, x: newX, y: newY, horizontalDirection: newDir, recoil: newRecoil };
                    }
                    break;
                 case EnemyType.Splinter: {
                    const newVx = (e.vx ?? 0) * SPLINTER_DRAG;
                    const newVy = (e.vy ?? 0) + SPLINTER_GRAVITY;
                    newX += newVx;
                    newY += newVy;
                    return { ...e, x: newX, y: newY, recoil: newRecoil, vx: newVx, vy: newVy };
                 }
                case EnemyType.Splitter:
                case EnemyType.Standard: 
                default: 
                    newY += ENEMY_SPEED; 
                    break;
            }
        }
        return { ...e, x: newX, y: newY, phase: newPhase, recoil: newRecoil };
      });
      
      enemyProjectiles = [...enemyProjectiles, ...newEnemyProjectiles]
        .map(p => ({ ...p, y: p.y + ENEMY_PROJECTILE_SPEED }))
        .filter(p => p.y < GAME_HEIGHT);

      const hitProjectileIds = new Set<number>();
      const newFloatingTexts: FloatingText[] = [];
      const spawnedSplinters: Enemy[] = [];
      projectiles.forEach(projectile => {
          for (const enemy of enemies) {
              if (enemy.hp <= 0 || enemy.isClearing) continue;
              if (intersects(projectile, enemy)) {
                  enemy.hp -= projectile.power;
                  enemy.recoil = (enemy.recoil || 0) + ENEMY_RECOIL_AMOUNT;
                  hitProjectileIds.add(projectile.id);
                  if (enemy.hp <= 0) {
                      enemy.deathTime = now; money += enemy.value; killCount += 1;
                      newFloatingTexts.push({ id: now + Math.random(), x: enemy.x + enemy.width / 2, y: enemy.y, text: `+$${enemy.value}`, startTime: now });

                      if (enemy.type === EnemyType.Splitter) {
                        for (let i = 0; i < SPLINTER_COUNT; i++) {
                            const angle = (i / SPLINTER_COUNT) * (2 * Math.PI);
                            const initialVx = Math.cos(angle) * SPLINTER_INITIAL_SPEED;
                            const initialVy = Math.sin(angle) * SPLINTER_INITIAL_SPEED;
                            
                            spawnedSplinters.push({
                                id: now + Math.random() + i,
                                x: enemy.x + enemy.width / 2 - SPLINTER_WIDTH / 2,
                                y: enemy.y + enemy.height / 2 - SPLINTER_HEIGHT / 2,
                                width: SPLINTER_WIDTH,
                                height: SPLINTER_HEIGHT,
                                hp: SPLINTER_HP,
                                value: SPLINTER_VALUE,
                                color: ENEMY_COLORS[1], // Red
                                type: EnemyType.Splinter,
                                vx: initialVx,
                                vy: initialVy,
                            });
                        }
                      }
                  }
                  break;
              }
          }
      });
      projectiles = projectiles.filter(p => !hitProjectileIds.has(p.id));

      if (spawnedSplinters.length > 0) {
          enemies = [...enemies, ...spawnedSplinters];
      }
      
      // Drone Beam Logic
      const handleBeamDamage = (targetId: number | null, damage: number) => {
        if (targetId === null) return;
        const target = enemies.find(e => e.id === targetId);
        if (target && target.hp > 0 && !target.isClearing) {
            target.hp -= damage;
            if (target.hp <= 0) {
                target.deathTime = now; money += target.value; killCount += 1;
                newFloatingTexts.push({ id: now + Math.random(), x: target.x + target.width / 2, y: target.y, text: `+$${target.value}`, startTime: now });
            }
        }
      };

      // Drone Cooldown State Management
      if (leftDroneState === 'firing' && now - leftDroneStateTime > BEAM_FIRING_DURATION) {
        leftDroneState = 'cooldown';
        leftDroneStateTime = now;
      } else if (leftDroneState === 'cooldown' && now - leftDroneStateTime > BEAM_COOLDOWN_DURATION) {
        leftDroneState = 'firing';
        leftDroneStateTime = now;
      }
      
      if (rightDroneState === 'firing' && now - rightDroneStateTime > BEAM_FIRING_DURATION) {
        rightDroneState = 'cooldown';
        rightDroneStateTime = now;
      } else if (rightDroneState === 'cooldown' && now - rightDroneStateTime > BEAM_COOLDOWN_DURATION) {
        rightDroneState = 'firing';
        rightDroneStateTime = now;
      }

      // Drone Targeting Logic
      let potentialLeftTarget: Enemy | undefined = undefined;
      let potentialRightTarget: Enemy | undefined = undefined;
      
      if (activeEnemies.length > 0) {
          potentialLeftTarget = activeEnemies.reduce((lowest, current) => (current.y > lowest.y ? current : lowest));
      
          const enemiesSortedByDistance = [...activeEnemies].sort((a, b) => {
              const distA = Math.hypot(a.x - player.x, a.y - player.y);
              const distB = Math.hypot(b.x - player.x, b.y - player.y);
              return distA - distB;
          });
      
          if (enemiesSortedByDistance[0].id !== potentialLeftTarget.id) {
              potentialRightTarget = enemiesSortedByDistance[0];
          } else if (enemiesSortedByDistance.length > 1) {
              potentialRightTarget = enemiesSortedByDistance[1];
          } else {
              potentialRightTarget = enemiesSortedByDistance[0];
          }
      }

      // Left Drone (Laser)
      if (state.shipLevel >= 4) {
        if (leftDroneState === 'firing' && potentialLeftTarget) {
            leftDroneTargetId = potentialLeftTarget.id;
            const leftDroneUpgrades = state.shipLevel >= 10 ? 2 : state.shipLevel >= 7 ? 1 : 0;
            const laserDamage = (BASE_BEAM_DAMAGE_PER_TICK + (leftDroneUpgrades * BEAM_DAMAGE_INCREASE_PER_LEVEL)) * state.bulletPowerLevel;
            handleBeamDamage(leftDroneTargetId, laserDamage);
        } else {
            leftDroneTargetId = null;
        }
      }

      // Right Drone (Electricity)
      if (state.shipLevel >= 5) {
        if (rightDroneState === 'firing' && potentialRightTarget) {
            rightDroneTargetId = potentialRightTarget.id;
            const rightDroneUpgrades = state.shipLevel >= 11 ? 2 : state.shipLevel >= 8 ? 1 : 0;
            const electricityDamage = (BASE_BEAM_DAMAGE_PER_TICK + (rightDroneUpgrades * BEAM_DAMAGE_INCREASE_PER_LEVEL)) * state.bulletPowerLevel;
            handleBeamDamage(rightDroneTargetId, electricityDamage);
        } else {
            rightDroneTargetId = null;
        }
      }

      floatingTexts = [...floatingTexts, ...newFloatingTexts];

      for (const enemy of enemies) {
        if (enemy.isClearing || enemy.hp <= 0) continue;
        if (intersects(enemy, player) || enemy.y + enemy.height > (GAME_HEIGHT - UPGRADE_BAR_HEIGHT)) {
          if (shields > 0) {
            shields -= 1; playerHitTime = now;
            enemies = enemies.map(e => ({ ...e, isClearing: true, phase: undefined }));
            break;
          } else {
            return { ...state, money, shields: 0, status: GameStatus.GameOver };
          }
        }
      }
      
      for (const projectile of enemyProjectiles) {
        if (intersects(projectile, player)) {
            projectile.y = GAME_HEIGHT + 1; // Mark for removal
            if (shields > 0) {
                shields -= 1;
                playerHitTime = now;
                enemies = enemies.map(e => ({ ...e, isClearing: true, phase: undefined }));
            } else {
                return { ...state, money, shields: 0, status: GameStatus.GameOver };
            }
            break; 
        }
      }

      const bulletPower = BASE_BULLET_POWER + ((state.bulletPowerLevel -1) * BULLET_POWER_INCREASE_PER_LEVEL);
      
      const currentFireRate = Math.max(MIN_PROJECTILE_FIRE_RATE, BASE_PROJECTILE_FIRE_RATE - ((state.bulletRateLevel - 1) * FIRE_RATE_DECREASE_PER_LEVEL));
      if (now - lastProjectileSpawn > currentFireRate) {
        lastProjectileSpawn = now;
        
        const centerX = player.x + player.width / 2;
        const projectileY = player.y;

        const createProjectile = (x: number, y: number, idOffset: number = 0): Projectile => ({
            id: now + idOffset + Math.random(), x: x - PROJECTILE_WIDTH / 2, y: y, width: PROJECTILE_WIDTH, height: PROJECTILE_HEIGHT,
            power: bulletPower, type: ProjectileType.Standard, angle: -Math.PI / 2,
        });
        
        if (state.shipLevel === 1) {
            projectiles.push(createProjectile(centerX, projectileY, 0));
        } else if (state.shipLevel === 2) {
            const spread = PLAYER_WIDTH / 3;
            projectiles.push(createProjectile(centerX - spread, projectileY, 1));
            projectiles.push(createProjectile(centerX + spread, projectileY, 2));
        } else if (state.shipLevel >= 3) {
            const spread = PLAYER_WIDTH / 2.5;
            projectiles.push(createProjectile(centerX, projectileY, 3));
            projectiles.push(createProjectile(centerX - spread, projectileY, 4));
            projectiles.push(createProjectile(centerX + spread, projectileY, 5));
        }
      }

      // Spawn homing missiles
      if (state.shipLevel >= 6) {
        let numMissiles = 1;
        if (state.shipLevel >= 9) numMissiles = 2;
        if (state.shipLevel >= 12) numMissiles = 3;

        const baseMissileFireRate = currentFireRate * 3;
        const missileFireInterval = baseMissileFireRate / numMissiles;

        if (now - lastMissileSpawn > missileFireInterval) {
            lastMissileSpawn = now;
            const target = activeEnemies.length > 0 ? activeEnemies.reduce((lowest, current) => (current.y > lowest.y ? current : lowest)) : undefined;
            if (target) {
                const missile: Projectile = {
                    id: now + 500 + Math.random(), x: homingDrone.x + homingDroneSize / 2 - HOMING_MISSILE_WIDTH / 2, y: homingDrone.y,
                    width: HOMING_MISSILE_WIDTH, height: HOMING_MISSILE_HEIGHT, power: bulletPower, type: ProjectileType.Homing,
                    targetId: target.id, angle: -Math.PI / 2,
                };
                projectiles.push(missile);
            }
        }
      }

      const elapsedTime = now - state.gameStartTime;
      const difficultyProgress = Math.min(1, elapsedTime / TIME_TO_MAX_DIFFICULTY);
      const spawnRateReduction = (INITIAL_ENEMY_SPAWN_RATE - MIN_ENEMY_SPAWN_RATE) * difficultyProgress;
      const currentEnemySpawnRate = INITIAL_ENEMY_SPAWN_RATE - spawnRateReduction;

      if (now - lastEnemySpawn > currentEnemySpawnRate) {
        lastEnemySpawn = now;
        const additionalHp = Math.floor(difficultyProgress * MAX_ADDITIONAL_HP);
        const hp = BASE_ENEMY_HP + additionalHp;
        const value = BASE_ENEMY_VALUE + Math.floor(difficultyProgress * MAX_ADDITIONAL_VALUE);
        const color = ENEMY_COLORS[Math.min(additionalHp, ENEMY_COLORS.length - 1)];
        const x = Math.random() * (GAME_WIDTH - ENEMY_WIDTH);
      
        let type: EnemyType;
        const random = Math.random();
        if (difficultyProgress > 0.6 && random < 0.15) {
            type = EnemyType.Splitter;
        } else if (difficultyProgress > 0.4 && random < 0.40) {
            type = EnemyType.Turret;
        } else if (difficultyProgress > 0.5 && random < 0.65) {
            type = EnemyType.Dasher;
        } else if (difficultyProgress > 0.2 && random < 0.90) {
            type = EnemyType.Swooper;
        } else {
            type = EnemyType.Standard;
        }
        
        const newEnemy: Enemy = {
            id: now, x, y: -ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT,
            hp, value, color, type,
        };
        if (type === EnemyType.Swooper) { newEnemy.initialX = x; newEnemy.swoopDirection = 1; }
        if (type === EnemyType.Dasher) { newEnemy.phase = 'descending'; }
        if (type === EnemyType.Turret) {
            newEnemy.phase = 'descending';
            newEnemy.hp *= 2;
            newEnemy.value *= 2;
            newEnemy.horizontalDirection = Math.random() < 0.5 ? 1 : -1;
        }
        if (type === EnemyType.Splitter) {
            newEnemy.hp *= SPLITTER_HP_MULTIPLIER;
            newEnemy.value = Math.floor(newEnemy.value * SPLITTER_VALUE_MULTIPLIER);
            newEnemy.width *= 1.2;
            newEnemy.height *= 1.2;
        }
        enemies.push(newEnemy);
      }
      
      floatingTexts = floatingTexts.filter(ft => now - ft.startTime < FLOATING_TEXT_DURATION);
      enemies = enemies.filter(e => {
        if (e.deathTime) { return now - e.deathTime < ENEMY_DEATH_FADE_DURATION; }
        if (e.isClearing) { return e.y + e.height > 0; }
        return true;
      });

      return { ...state, player, enemies, projectiles, enemyProjectiles, stars, killCount, money, lastEnemySpawn, lastProjectileSpawn, lastMissileSpawn, floatingTexts, shields, playerHitTime, leftDrone, rightDrone, homingDrone, leftDroneTargetId, rightDroneTargetId, leftDroneState, rightDroneState, leftDroneStateTime, rightDroneStateTime };
    }
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const animationFrameId = useRef<number | null>(null);

  const gameLoop = useCallback(() => {
    dispatch({ type: 'TICK' });
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (state.status === GameStatus.Playing) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [state.status, gameLoop]);

  const startGame = () => dispatch({ type: 'START_GAME' });
  const restartGame = () => dispatch({ type: 'RESTART' });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });
  const upgradeBulletRate = () => dispatch({ type: 'UPGRADE_BULLET_RATE' });
  const upgradeBulletPower = () => dispatch({ type: 'UPGRADE_BULLET_POWER' });
  const upgradeShipLevel = () => dispatch({ type: 'UPGRADE_SHIP_LEVEL' });
  const upgradeInterest = () => dispatch({ type: 'UPGRADE_INTEREST' });
  const upgradeShield = () => dispatch({ type: 'UPGRADE_SHIELD' });

  const gameOverUpgradeButtonClasses = "text-xl px-4 py-2 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_10px_#0ff] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-cyan-400";
  const inGameUpgradeButtonClasses = "flex flex-col items-center justify-center gap-1 w-20 h-24 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_8px_#0ff] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-cyan-400 text-xs p-1";

  const interestGained = Math.round(state.money * (state.interestLevel * 0.01));

  // Drone rendering calculations
  const sideDroneScale = 0.5;
  const sideDroneWidth = PLAYER_WIDTH * sideDroneScale;
  const leftDroneCenter = { x: state.leftDrone.x + sideDroneWidth / 2, y: state.leftDrone.y };
  const rightDroneCenter = { x: state.rightDrone.x + sideDroneWidth / 2, y: state.rightDrone.y };
  
  const leftTarget = state.enemies.find(e => e.id === state.leftDroneTargetId);
  const rightTarget = state.enemies.find(e => e.id === state.rightDroneTargetId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black font-mono text-cyan-400 p-4">
      <div
        className="relative bg-black overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_20px_#0ff]"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Stars */}
        {state.stars.map(star => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.size / 3,
            }}
          />
        ))}

        {/* Floating Text */}
        {state.floatingTexts.map(ft => {
            const elapsedTime = Date.now() - ft.startTime;
            const progress = Math.min(1, elapsedTime / FLOATING_TEXT_DURATION);
            const opacity = 1 - progress;
            const currentY = ft.y - (progress * FLOATING_TEXT_LIFT);

            return (
              <div
                key={ft.id}
                className="absolute text-yellow-400 font-bold text-lg pointer-events-none"
                style={{
                  left: ft.x,
                  top: currentY,
                  opacity: opacity,
                  transform: 'translateX(-50%)',
                  textShadow: '0 0 5px black, 0 0 8px black',
                  willChange: 'transform, opacity',
                }}
              >
                {ft.text}
              </div>
            );
          })}


        {state.status === GameStatus.Playing && (
          <>
            {/* Player */}
            <div className="absolute" style={{ left: state.player.x, top: state.player.y }}>
              <PlayerShip />
            </div>

            {/* Drones */}
            {state.shipLevel >= 4 && (
              <div className="absolute" style={{ left: state.leftDrone.x, top: state.leftDrone.y }}>
                <div style={{ transform: `scale(${sideDroneScale})`, transformOrigin: 'top left' }}>
                  <PlayerShip />
                </div>
              </div>
            )}
            {state.shipLevel >= 5 && (
              <div className="absolute" style={{ left: state.rightDrone.x, top: state.rightDrone.y }}>
                <div style={{ transform: `scale(${sideDroneScale})`, transformOrigin: 'top left' }}>
                  <PlayerShip />
                </div>
              </div>
            )}
            {state.shipLevel >= 6 && (
                <div className="absolute" style={{ left: state.homingDrone.x, top: state.homingDrone.y }}>
                    <HomingDroneShape />
                </div>
            )}
            
            {/* Beams */}
            {leftTarget && <LaserBeam from={leftDroneCenter} to={{ x: leftTarget.x + leftTarget.width / 2, y: leftTarget.y + leftTarget.height / 2 }} />}
            {rightTarget && <ElectricityArc from={rightDroneCenter} to={{ x: rightTarget.x + rightTarget.width / 2, y: rightTarget.y + rightTarget.height / 2 }} />}

            {/* Player Hit Effect */}
            {state.playerHitTime > 0 && (
              <PlayerHitExplosion player={state.player} startTime={state.playerHitTime} />
            )}

            {/* Enemies */}
            {state.enemies.map(enemy => {
              const now = Date.now();
              const style: React.CSSProperties = {
                left: enemy.x,
                top: enemy.y,
                willChange: 'opacity, transform',
              };

              let opacity = 1;
              if (enemy.isClearing) {
                opacity = Math.max(0, (enemy.y / (GAME_HEIGHT * 0.75)));
              } else if (enemy.deathTime) {
                const timeSinceDeath = now - enemy.deathTime;
                opacity = 1 - Math.min(1, timeSinceDeath / ENEMY_DEATH_FADE_DURATION);
              }
              style.opacity = opacity;

              return (
                <div key={enemy.id} className="absolute" style={style}>
                  <EnemyShip enemy={enemy} />
                </div>
              );
            })}

            {/* Projectiles */}
            {state.projectiles.map(p => (
              <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
                 {p.type === ProjectileType.Homing ? <MissileShape angle={p.angle ?? 0} /> : <ProjectileShape />}
              </div>
            ))}
            
            {/* Enemy Projectiles */}
            {state.enemyProjectiles.map(p => (
              <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
                 <EnemyProjectileShape />
              </div>
            ))}

            {/* In-Game Upgrade Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-around items-center bg-black/60 backdrop-blur-sm z-10">
                <button onClick={upgradeBulletRate} disabled={state.money < state.bulletRateCost} className={inGameUpgradeButtonClasses}>
                    <BulletRateIcon />
                    <span className="font-bold">RATE</span>
                    <span>Lvl {state.bulletRateLevel}</span>
                    <span className="text-yellow-400">${state.bulletRateCost}</span>
                </button>
                <button onClick={upgradeBulletPower} disabled={state.money < state.bulletPowerCost} className={inGameUpgradeButtonClasses}>
                    <BulletPowerIcon />
                      <span className="font-bold">POWER</span>
                    <span>Lvl {state.bulletPowerLevel}</span>
                    <span className="text-yellow-400">${state.bulletPowerCost}</span>
                </button>
                <button onClick={upgradeShipLevel} disabled={state.money < state.shipLevelCost || state.shipLevel >= MAX_SHIP_LEVEL} className={inGameUpgradeButtonClasses}>
                    <ShipLevelIcon />
                    <span className="font-bold">SHIP</span>
                    <span>Lvl {state.shipLevel}</span>
                    {state.shipLevel >= MAX_SHIP_LEVEL ? (
                        <span className="text-green-400">MAX</span>
                    ) : (
                        <span className="text-yellow-400">${state.shipLevelCost}</span>
                    )}
                </button>
                <button onClick={upgradeInterest} disabled={state.money < state.interestCost} className={inGameUpgradeButtonClasses}>
                      <InterestIcon />
                      <span className="font-bold">INTEREST</span>
                    <span>Lvl {state.interestLevel}</span>
                      <span className="text-yellow-400">${state.interestCost}</span>
                </button>
                <button onClick={upgradeShield} disabled={state.money < state.shieldCost} className={inGameUpgradeButtonClasses}>
                      <ShieldIcon />
                      <span className="font-bold">SHIELD</span>
                    <span>Lvl {state.shieldLevel}</span>
                      <span className="text-yellow-400">${state.shieldCost}</span>
                </button>
            </div>
          </>
        )}

        {/* UI Overlays */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          {state.status === GameStatus.Start && (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-cyan-400 filter drop-shadow-[0_0_8px_#0ff]">ARES</h1>
                <p className="text-2xl mt-2 text-cyan-300">A Really Easy Shooter</p>
                <p className="text-lg mt-1 text-cyan-400/80">by Chris Franklyn</p>
              </div>
              <button onClick={startGame} className="text-2xl px-6 py-3 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_10px_#0ff]">
                START GAME
              </button>
            </div>
          )}

          {state.status === GameStatus.GameOver && (
            <div className="flex flex-col items-center gap-4 bg-black/80 p-6 rounded-lg w-full max-w-sm">
              <h2 className="text-5xl font-bold text-red-500 filter drop-shadow-[0_0_8px_#f00]">GAME OVER</h2>
              <p className="text-2xl">KILLS: {state.killCount}</p>
              <div>
                <p className="text-3xl font-bold">Total Cash: ${state.money}</p>
                <p className="text-xl text-green-400">+ ${interestGained} Interest ({state.interestLevel}%)</p>
              </div>
              
              <div className="w-full space-y-3 mt-2">
                  <button onClick={upgradeBulletRate} disabled={state.money < state.bulletRateCost} className={gameOverUpgradeButtonClasses}>
                      Bullet Rate Lvl {state.bulletRateLevel + 1} (${state.bulletRateCost})
                  </button>
                  <button onClick={upgradeBulletPower} disabled={state.money < state.bulletPowerCost} className={gameOverUpgradeButtonClasses}>
                      Bullet Power Lvl {state.bulletPowerLevel + 1} (${state.bulletPowerCost})
                  </button>
                  <button onClick={upgradeShipLevel} disabled={state.money < state.shipLevelCost || state.shipLevel >= MAX_SHIP_LEVEL} className={gameOverUpgradeButtonClasses}>
                    {state.shipLevel >= MAX_SHIP_LEVEL ? 'Ship Level MAX' : `Ship Level ${state.shipLevel + 1} ($${state.shipLevelCost})`}
                  </button>
                  <button onClick={upgradeInterest} disabled={state.money < state.interestCost} className={gameOverUpgradeButtonClasses}>
                      Interest Lvl {state.interestLevel + 1} (${state.interestCost})
                  </button>
                  <button onClick={upgradeShield} disabled={state.money < state.shieldCost} className={gameOverUpgradeButtonClasses}>
                      Shields Lvl {state.shieldLevel + 1} (${state.shieldCost})
                  </button>
              </div>

              <button onClick={restartGame} className="mt-4 text-2xl px-6 py-3 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_10px_#0ff]">
                Fight!
              </button>
              <button onClick={resetGame} className="mt-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
                Reset Progress
              </button>
            </div>
          )}
        </div>

        {/* Score Display */}
        {state.status === GameStatus.Playing && (
          <>
            <div className="absolute top-4 left-4 text-left">
                <div className="text-2xl font-bold">KILLS: {state.killCount}</div>
                <div className="text-xl">SHIELDS: {state.shields}</div>
            </div>
            <div className="absolute top-4 right-4 text-right">
                <div className="text-2xl font-bold">${state.money}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;