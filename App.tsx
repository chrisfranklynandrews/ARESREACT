import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { GameStatus, Player, Enemy, Projectile, Star, FloatingText, EnemyType, ProjectileType, EnemyProjectile, Particle, BreachExplosion, EnemyProjectileType } from './types';
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
  INTEREST_RATE_PER_LEVEL,
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
  KILLS_PER_WAVE,
  WAVE_FOR_BOSS,
  BOSS_WARNING_DURATION,
  BOSS_WIDTH,
  BOSS_HEIGHT,
  BOSS_BASE_HP,
  BOSS_VALUE,
  BOSS_ENTER_Y,
  BOSS_HORIZONTAL_SPEED,
  BOSS_DEFEATED_DURATION,
  BOSS_HP_PER_LOOP,
  HOMING_MISSILE_INITIAL_TARGET_Y_FACTOR,
  // FIX: Corrected constant casing to UPPER_SNAKE_CASE.
  HOMING_MISSILE_PARTICLE_SPAWN_RATE,
  HOMING_MISSILE_PARTICLE_LIFESPAN,
  HOMING_MISSILE_PARTICLE_SPEED,
  HOMING_MISSILE_PARTICLE_SIZE,
  BREACH_EFFECT_DURATION,
  INITIAL_CASH_BOOST_COST,
  CASH_BOOST_PER_LEVEL,
  LOCAL_STORAGE_KEY,
  CHARGER_STOP_Y,
  CHARGER_CHARGE_DURATION,
  CHARGER_RUSH_SPEED,
  WEAVER_AMPLITUDE,
  WEAVER_FREQUENCY,
  WEAVER_MINE_RATE,
  WEAVER_MINE_SPEED,
  WEAVER_MINE_WIDTH,
  WEAVER_MINE_HEIGHT,
  GUARDIAN_STOP_Y,
  GUARDIAN_BASE_SHIELD_HP,
  GUARDIAN_DEATH_BURST_COUNT,
} from './constants';

// --- VISUAL COMPONENTS ---

const PlayerShip: React.FC = React.memo(() => {
    const shipPath = "50,5 65,20 80,50 85,85 85,100 70,100 70,85 55,90 50,95 45,90 30,85 30,100 15,100 15,85 20,50 35,20";

    return (
        <svg width={PLAYER_WIDTH} height={PLAYER_HEIGHT} viewBox="0 0 100 100" className="overflow-visible">
            {/* Layer 1: Red Thruster Glows (Bottom) */}
            <g className="filter drop-shadow-[0_0_6px_rgba(255,50,50,1)] drop-shadow-[0_0_10px_rgba(255,0,0,0.7)] animate-pulse">
                <polygon points="46,94 50,102 54,94" fill="#ef4444" />
                <rect x="18" y="95" width="10" height="7" fill="#ef4444" rx="2" />
                <rect x="72" y="95" width="10" height="7" fill="#ef4444" rx="2" />
            </g>

            {/* Layer 2: Cyan Glowing Outline (Middle) */}
            <g className="filter drop-shadow-[0_0_8px_rgba(0,255,255,0.9)] drop-shadow-[0_0_12px_rgba(0,255,255,0.5)]">
                <polygon points={shipPath} stroke="#0ff" strokeWidth="8" fill="none" strokeLinejoin="round" />
            </g>

            {/* Layer 3: Black Ship Body Fill (Top) */}
            <polygon points={shipPath} fill="black" stroke="none" />
        </svg>
    );
});

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

const ChargerEnemyShip: React.FC<{ color: string; style: React.CSSProperties; phase?: string }> = React.memo(({ color, style, phase }) => {
    const isCharging = phase === 'charging';
    return (
        <svg width={ENEMY_WIDTH} height={ENEMY_HEIGHT * 1.2} viewBox="0 0 100 120" style={style}>
            <polygon points="50,120 10,10 90,10" stroke={color} strokeWidth="8" fill="none" strokeLinejoin="round" />
            {isCharging && <circle cx="50" cy="50" r="15" fill={color} className="animate-pulse" />}
        </svg>
    );
});

const WeaverEnemyShip: React.FC<{ color: string; style: React.CSSProperties }> = React.memo(({ color, style }) => (
    <svg width={ENEMY_WIDTH * 1.2} height={ENEMY_HEIGHT} viewBox="0 0 120 100" style={style}>
        <polygon points="10,50 40,15 80,85 110,50 80,15 40,85" stroke={color} strokeWidth="8" fill="none" strokeLinejoin="round" />
    </svg>
));

const GuardianEnemyShip: React.FC<{ color: string; style: React.CSSProperties }> = React.memo(({ color, style }) => (
    <svg width={ENEMY_WIDTH * 1.3} height={ENEMY_HEIGHT * 1.3} viewBox="0 0 130 130" style={style}>
        <polygon points="65,10 120,35 120,95 65,120 10,95 10,35" stroke={color} strokeWidth="8" fill="none" strokeLinejoin="round" />
        <polygon points="65,30 100,47 100,83 65,100 30,83 30,47" stroke={color} strokeWidth="5" fill="none" strokeLinejoin="round" />
    </svg>
));


const BossShip: React.FC<{ color: string; style: React.CSSProperties }> = React.memo(({ color, style }) => (
    <svg width={BOSS_WIDTH} height={BOSS_HEIGHT} viewBox="0 0 150 100" style={style}>
      <polygon points="75,10 140,40 120,95 30,95 10,40" stroke={color} strokeWidth="6" fill="none" strokeLinejoin="round" />
      <polygon points="75,25 110,45 95,80 55,80 40,45" stroke={color} strokeWidth="4" fill="none" strokeLinejoin="round" />
      <circle cx="75" cy="55" r="12" fill={color} />
      <line x1="15" y1="60" x2="135" y2="60" stroke={color} strokeWidth="4" />
    </svg>
));
  
const GuardianShieldStandalone: React.FC<{ enemy: Enemy }> = React.memo(({ enemy }) => {
    if (!enemy.shieldHp || enemy.shieldHp <= 0) return null;
    const opacity = (enemy.shieldHp / (enemy.maxShieldHp ?? 1)) * 0.5 + 0.2;
    const shieldWidth = enemy.width * 1.5;
    const shieldHeight = enemy.height * 1.5;
    return (
        <div className="absolute" style={{
            left: (enemy.width - shieldWidth) / 2,
            top: (enemy.height - shieldHeight) / 2,
            width: shieldWidth,
            height: shieldHeight,
        }}>
            <svg viewBox="0 0 100 100" className="filter drop-shadow-[0_0_8px_rgba(100,200,255,0.9)] w-full h-full">
                <polygon
                    points="50,0 100,25 100,75 50,100 0,75 0,25"
                    fill={`rgba(100, 200, 255, ${opacity})`}
                    stroke="#87CEFA"
                    strokeWidth="4"
                />
            </svg>
        </div>
    );
});


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
    case EnemyType.Charger:
        return <ChargerEnemyShip color={enemy.color} style={style} phase={enemy.phase} />;
    case EnemyType.Weaver:
        return <WeaverEnemyShip color={enemy.color} style={style} />;
    case EnemyType.Guardian:
        return <GuardianEnemyShip color={enemy.color} style={style} />;
    case EnemyType.Boss:
        return <BossShip color={enemy.color} style={style} />;
    case EnemyType.Standard:
    default:
      return <StandardEnemyShip color={enemy.color} style={style} />;
  }
});

const ProjectileShape: React.FC<{ color?: string }> = React.memo(({ color = '#0ff' }) => (
    <div
      className="border-2 rounded-full"
      style={{
        width: `${PROJECTILE_WIDTH}px`,
        height: `${PROJECTILE_HEIGHT}px`,
        borderColor: color,
        boxShadow: `0 0 6px ${color}, 0 0 10px ${color}`,
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

const WeaverMineShape: React.FC = React.memo(() => (
    <div
      className="rounded-full bg-purple-500 animate-pulse"
      style={{ 
        width: `${WEAVER_MINE_WIDTH}px`, 
        height: `${WEAVER_MINE_HEIGHT}px`,
        boxShadow: '0 0 6px #a855f7, 0 0 10px #a855f7' // tailwind purple-500
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

const BreachExplosion: React.FC<{ x: number; startTime: number }> = React.memo(({ x, startTime }) => {
    const elapsedTime = Date.now() - startTime;
    const progress = elapsedTime / BREACH_EFFECT_DURATION;

    if (progress > 1) return null;

    const size = PLAYER_WIDTH * 2.5 * progress;
    const opacity = 1 - Math.pow(progress, 2);

    return (
        <div
            className="absolute rounded-full border-4 pointer-events-none"
            style={{
                left: x - size / 2,
                top: (GAME_HEIGHT - UPGRADE_BAR_HEIGHT) - size / 2,
                width: size,
                height: size,
                opacity: opacity,
                borderColor: '#ff6600',
                boxShadow: '0 0 15px #ff6600, inset 0 0 10px #ff6600',
                willChange: 'transform, opacity, width, height',
                zIndex: 20,
            }}
        />
    );
});

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

const BossHealthBar: React.FC<{ boss: Enemy }> = ({ boss }) => {
    const healthPercentage = (boss.hp / (boss.maxHp ?? boss.hp)) * 100;
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/50 border-2 border-red-500 rounded-md p-1 z-20">
        <div
          className="h-full bg-red-500 rounded-sm transition-all duration-200"
          style={{ width: `${healthPercentage}%`, boxShadow: '0 0 8px #f00' }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm tracking-widest">
            BOSS
        </div>
      </div>
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

const CashBoostIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" y2="22"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        <path d="M19 15h-4"/>
        <path d="M17 13v4"/>
    </svg>
);

const ShieldIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const PauseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="4" x2="6" y2="20"></line><line x1="18" y1="4" x2="18" y2="20"></line></svg>
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
  particles: Particle[];
  breachExplosions: BreachExplosion[];
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
  wave: number;
  bossState: 'none' | 'warning' | 'fighting' | 'defeated';
  bossWarningTime: number;
  bossDefeatedTime: number;
  pauseStartTime?: number;
  tutorialStep: number;

  // Persistent state
  money: number;
  moneyGlowTime: number;
  bulletRateLevel: number;
  bulletPowerLevel: number;
  shipLevel: number;
  interestLevel: number;
  cashBoostLevel: number;
  shieldLevel: number;
  bulletRateCost: number;
  bulletPowerCost: number;
  shipLevelCost: number;
  interestCost: number;
  cashBoostCost: number;
  shieldCost: number;
};

type Action =
  | { type: 'START_TUTORIAL' }
  | { type: 'ADVANCE_TUTORIAL' }
  | { type: 'START_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART' }
  | { type: 'RESET_GAME' }
  | { type: 'TICK' }
  | { type: 'UPGRADE_BULLET_RATE' }
  | { type: 'UPGRADE_BULLET_POWER' }
  | { type: 'UPGRADE_SHIP_LEVEL' }
  | { type: 'UPGRADE_INTEREST' }
  | { type: 'UPGRADE_CASH_BOOST' }
  | { type: 'UPGRADE_SHIELD' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'MANUAL_FIRE' }
  | { type: 'CONTINUE_FROM_SAVE' };

type PersistentState = Pick<GameState,
  'money' | 'bulletRateLevel' | 'bulletPowerLevel' | 'shipLevel' | 'interestLevel' |
  'cashBoostLevel' | 'shieldLevel' | 'bulletRateCost' | 'bulletPowerCost' |
  'shipLevelCost' | 'interestCost' | 'cashBoostCost' | 'shieldCost'
>;

const saveGame = (state: PersistentState) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save game state:", e);
    }
};
  
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
    particles: [],
    breachExplosions: [],
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
    wave: 1,
    bossState: 'none' as const,
    bossWarningTime: 0,
    bossDefeatedTime: 0,
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

  const baseState: GameState = {
    status: GameStatus.Start,
    ...createInitialRunState(),
    stars,
    shields: 1,
    money: 0,
    moneyGlowTime: 0,
    bulletRateLevel: 1,
    bulletPowerLevel: 1,
    shipLevel: 1,
    interestLevel: 1,
    cashBoostLevel: 1,
    shieldLevel: 1,
    bulletRateCost: INITIAL_BULLET_RATE_COST,
    bulletPowerCost: INITIAL_BULLET_POWER_COST,
    shipLevelCost: INITIAL_SHIP_LEVEL_COST,
    interestCost: INITIAL_INTEREST_COST,
    cashBoostCost: INITIAL_CASH_BOOST_COST,
    shieldCost: INITIAL_SHIELD_COST,
    tutorialStep: 0,
  };

  try {
    const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedStateJSON) {
      const savedState: PersistentState = JSON.parse(savedStateJSON);
      return {
        ...baseState,
        ...savedState,
        status: GameStatus.WelcomeBack,
      };
    }
  } catch (e) {
    console.error("Failed to load saved game:", e);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return baseState;
};

const intersects = (a: {x:number, y:number, width:number, height:number}, b: {x:number, y:number, width:number, height:number}) => {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'START_TUTORIAL':
      return {
        ...state,
        status: GameStatus.Tutorial,
        tutorialStep: 0,
      };
    case 'ADVANCE_TUTORIAL': {
      const nextStep = state.tutorialStep + 1;
      let newState = { ...state, tutorialStep: nextStep };
      if (nextStep === 2) {
        // Spawn tutorial enemy
        const tutorialEnemy: Enemy = {
          id: Date.now(),
          x: GAME_WIDTH / 2 - ENEMY_WIDTH / 2,
          y: 200,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          hp: 3,
          value: 500,
          color: ENEMY_COLORS[0],
          type: EnemyType.Standard,
          isTutorial: true,
        };
        newState.enemies = [tutorialEnemy];
      }
      return newState;
    }
    case 'START_GAME': {
      const now = Date.now();
      return {
        ...state,
        status: GameStatus.Playing,
        enemies: [], // Clear tutorial enemies
        tutorialStep: 999, // Ensure tutorial doesn't trigger again
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
      
      const persistentState = {
        stars: state.stars,
        money: state.money,
        moneyGlowTime: state.moneyGlowTime,
        bulletRateLevel: state.bulletRateLevel,
        bulletPowerLevel: state.bulletPowerLevel,
        shipLevel: state.shipLevel,
        interestLevel: state.interestLevel,
        cashBoostLevel: state.cashBoostLevel,
        shieldLevel: state.shieldLevel,
        bulletRateCost: state.bulletRateCost,
        bulletPowerCost: state.bulletPowerCost,
        shipLevelCost: state.shipLevelCost,
        interestCost: state.interestCost,
        cashBoostCost: state.cashBoostCost,
        shieldCost: state.shieldCost,
      };

      return {
        ...persistentState,
        ...createInitialRunState(),
        status: GameStatus.Playing,
        tutorialStep: 999,
        gameStartTime: now,
        lastEnemySpawn: now,
        lastProjectileSpawn: now,
        lastMissileSpawn: now,
        shields: state.shieldLevel,
        leftDroneStateTime: now,
        rightDroneStateTime: now,
      };
    }
    case 'RESET_GAME':
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return createInitialState();
    case 'CONTINUE_FROM_SAVE': {
        const now = Date.now();
        return {
          ...state,
          status: GameStatus.Playing,
          tutorialStep: 999,
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
    case 'UPGRADE_BULLET_RATE': {
      if (state.money < state.bulletRateCost) return state;
      const tutorialAdvancing = state.status === GameStatus.Tutorial && state.tutorialStep === 4;
      return {
        ...state,
        money: state.money - state.bulletRateCost,
        bulletRateLevel: state.bulletRateLevel + 1,
        bulletRateCost: Math.floor(state.bulletRateCost * UPGRADE_COST_MULTIPLIER),
        tutorialStep: tutorialAdvancing ? state.tutorialStep + 1 : state.tutorialStep,
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
    case 'UPGRADE_CASH_BOOST': {
        if (state.money < state.cashBoostCost) return state;
        return {
          ...state,
          money: state.money - state.cashBoostCost,
          cashBoostLevel: state.cashBoostLevel + 1,
          cashBoostCost: Math.floor(state.cashBoostCost * UPGRADE_COST_MULTIPLIER),
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
    case 'PAUSE_GAME':
        if (state.status !== GameStatus.Playing) return state;
        return { ...state, status: GameStatus.Paused, pauseStartTime: Date.now() };
    case 'RESUME_GAME': {
        if (state.status !== GameStatus.Paused || !state.pauseStartTime) return state;
        const now = Date.now();
        const pausedDuration = now - state.pauseStartTime;

        return {
            ...state,
            status: GameStatus.Playing,
            pauseStartTime: undefined,
            // Adjust all relevant timestamps
            lastEnemySpawn: state.lastEnemySpawn + pausedDuration,
            lastProjectileSpawn: state.lastProjectileSpawn + pausedDuration,
            lastMissileSpawn: state.lastMissileSpawn + pausedDuration,
            gameStartTime: state.gameStartTime + pausedDuration,
            playerHitTime: state.playerHitTime > 0 ? state.playerHitTime + pausedDuration : 0,
            leftDroneStateTime: state.leftDroneStateTime + pausedDuration,
            rightDroneStateTime: state.rightDroneStateTime + pausedDuration,
            bossWarningTime: state.bossWarningTime > 0 ? state.bossWarningTime + pausedDuration : 0,
            bossDefeatedTime: state.bossDefeatedTime > 0 ? state.bossDefeatedTime + pausedDuration : 0,
            
            floatingTexts: state.floatingTexts.map(item => ({...item, startTime: item.startTime + pausedDuration})),
            particles: state.particles.map(item => ({...item, startTime: item.startTime + pausedDuration})),
            breachExplosions: state.breachExplosions.map(item => ({...item, startTime: item.startTime + pausedDuration})),
            
            enemies: state.enemies.map(e => ({
                ...e,
                deathTime: e.deathTime ? e.deathTime + pausedDuration : undefined,
                pauseTime: e.pauseTime ? e.pauseTime + pausedDuration : undefined,
                lastFired: e.lastFired ? e.lastFired + pausedDuration : undefined,
                attackTimer: e.attackTimer ? e.attackTimer + pausedDuration : undefined,
            })),

            projectiles: state.projectiles.map(p => ({
                ...p,
                lastParticleSpawn: p.lastParticleSpawn ? p.lastParticleSpawn + pausedDuration : undefined,
            }))
        };
    }
    case 'MANUAL_FIRE': {
        if (state.status !== GameStatus.Playing && state.status !== GameStatus.Tutorial) return state;

        const now = Date.now();
        const newProjectiles: Projectile[] = [];
        const bulletPower = (BASE_BULLET_POWER + ((state.bulletPowerLevel - 1) * BULLET_POWER_INCREASE_PER_LEVEL));
        
        const createProjectile = (x: number, y: number, angle: number): Projectile => ({
            id: now + Math.random(), 
            x: x - PROJECTILE_WIDTH / 2, 
            y: y, 
            width: PROJECTILE_WIDTH, 
            height: PROJECTILE_HEIGHT,
            power: bulletPower, 
            type: ProjectileType.Standard, 
            angle,
            color: '#44aaff', // Blue color for manual shot
        });
        
        const centerX = state.player.x + state.player.width / 2;
        
        if (state.shipLevel === 1) {
            newProjectiles.push(createProjectile(centerX, state.player.y, -Math.PI / 2));
        } else if (state.shipLevel === 2) {
            newProjectiles.push(createProjectile(centerX - PLAYER_WIDTH / 3, state.player.y, -Math.PI / 2));
            newProjectiles.push(createProjectile(centerX + PLAYER_WIDTH / 3, state.player.y, -Math.PI / 2));
        } else if (state.shipLevel >= 3) {
            newProjectiles.push(createProjectile(centerX, state.player.y, -Math.PI / 2));
            newProjectiles.push(createProjectile(centerX - PLAYER_WIDTH / 2.5, state.player.y, -Math.PI / 2));
            newProjectiles.push(createProjectile(centerX + PLAYER_WIDTH / 2.5, state.player.y, -Math.PI / 2));
        }
        
        return {
            ...state,
            projectiles: [...state.projectiles, ...newProjectiles],
        };
    }
    case 'TICK': {
      if (state.status !== GameStatus.Playing && state.status !== GameStatus.Tutorial) return state;

      const now = Date.now();
      let { player, enemies, projectiles, enemyProjectiles, stars, particles, breachExplosions, killCount, money, lastEnemySpawn, lastProjectileSpawn, lastMissileSpawn, floatingTexts, shields, leftDrone, rightDrone, homingDrone, leftDroneTargetId, rightDroneTargetId, leftDroneState, rightDroneState, leftDroneStateTime, rightDroneStateTime, wave, bossState, bossWarningTime, bossDefeatedTime, moneyGlowTime } = { ...state };
      let playerHitTime = state.playerHitTime;
      const newFloatingTexts: FloatingText[] = [];

      // --- TUTORIAL LOGIC ---
      if (state.status === GameStatus.Tutorial) {
        if (state.tutorialStep === 2) {
            const tutorialEnemy = enemies.find(e => e.isTutorial);
            if (tutorialEnemy && tutorialEnemy.hp <= 0) {
                // Enemy killed, advance tutorial
                return { ...state, tutorialStep: 3, money: state.money + tutorialEnemy.value };
            }
        }
      }

      // --- BOSS STATE MACHINE ---
      if (bossState === 'warning' && now - bossWarningTime > BOSS_WARNING_DURATION) {
        bossState = 'fighting';
        const loopCount = Math.floor((wave - 1) / WAVE_FOR_BOSS);
        const bossHp = BOSS_BASE_HP + (loopCount * BOSS_HP_PER_LOOP);
        enemies.push({
            id: now, x: GAME_WIDTH / 2 - BOSS_WIDTH / 2, y: -BOSS_HEIGHT,
            width: BOSS_WIDTH, height: BOSS_HEIGHT, hp: bossHp, maxHp: bossHp,
            value: BOSS_VALUE, color: '#ff0055', type: EnemyType.Boss,
            phase: 'entering', horizontalDirection: 1, attackTimer: 0, attackPhase: 0,
        });
      }
      if (bossState === 'defeated' && now - bossDefeatedTime > BOSS_DEFEATED_DURATION) {
        bossState = 'none';
        wave += 1;
      }

      if (playerHitTime > 0 && now - playerHitTime > PLAYER_HIT_EFFECT_DURATION) {
        playerHitTime = 0;
      }

      const activeEnemies = enemies.filter(e => !e.isClearing && e.hp > 0);
      const visibleEnemies = activeEnemies.filter(e => e.y >= 0);

      // --- PLAYER & DRONE MOVEMENT ---
      let playerTargetX: number;
      if (visibleEnemies.length > 0 && state.status !== GameStatus.Tutorial) {
        const targetEnemy = visibleEnemies.reduce((lowest, current) => (current.y > lowest.y ? current : lowest));
        playerTargetX = targetEnemy.x + targetEnemy.width / 2 - player.width / 2;
      } else {
        playerTargetX = GAME_WIDTH / 2 - player.width / 2;
      }
      player.x += (playerTargetX - player.x) * PLAYER_SMOOTHING_FACTOR;
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
      leftDrone.x += (player.x - sideDroneWidth - side_x_spacing - leftDrone.x) * DRONE_SMOOTHING_FACTOR;
      leftDrone.y += (targetSideDroneY - leftDrone.y) * DRONE_SMOOTHING_FACTOR;
      rightDrone.x += (player.x + PLAYER_WIDTH + side_x_spacing - rightDrone.x) * DRONE_SMOOTHING_FACTOR;
      rightDrone.y += (targetSideDroneY - rightDrone.y) * DRONE_SMOOTHING_FACTOR;
      homingDrone.x += (targetHomingDroneX - homingDrone.x) * DRONE_SMOOTHING_FACTOR;
      homingDrone.y += (targetHomingDroneY - homingDrone.y) * DRONE_SMOOTHING_FACTOR;

      // --- STAR MOVEMENT ---
      const isBossFighting = bossState === 'fighting';
      stars = stars.map(star => {
        const speed = isBossFighting ? star.speed / 2 : star.speed;
        const newY = isBossFighting ? star.y - speed : star.y + speed;
        if (isBossFighting) {
            return newY < 0 ? { ...star, y: GAME_HEIGHT, x: Math.random() * GAME_WIDTH } : { ...star, y: newY };
        } else {
            return newY > GAME_HEIGHT ? { ...star, y: 0, x: Math.random() * GAME_WIDTH } : { ...star, y: newY };
        }
      });

      // --- PROJECTILE MOVEMENT & PARTICLE SPAWNING ---
      projectiles = projectiles.map(p => {
        if (p.type === ProjectileType.Homing) {
            let newAngle = p.angle ?? -Math.PI / 2;
            let newX = p.x;
            let newY = p.y;
            let phase = p.phase;
            let targetId = p.targetId;

            if (phase === 'initialBoost') {
                const targetX = p.initialTargetX ?? GAME_WIDTH / 2;
                const targetY = p.initialTargetY ?? GAME_HEIGHT / 2;
                const targetAngle = Math.atan2(targetY - p.y, targetX - p.x);

                newX = p.x + Math.cos(targetAngle) * HOMING_MISSILE_SPEED;
                newY = p.y + Math.sin(targetAngle) * HOMING_MISSILE_SPEED;
                newAngle = targetAngle; 

                if (Math.hypot(newX - targetX, newY - targetY) < 20) {
                    phase = 'homing';
                }
            } else { // 'homing' phase
                let target = visibleEnemies.find(e => e.id === p.targetId);
                if (!target) target = visibleEnemies.length > 0 ? visibleEnemies.reduce((lowest, current) => (current.y > lowest.y ? current : lowest)) : undefined;
                
                if (target) {
                    const targetAngle = Math.atan2(target.y + target.height / 2 - p.y, target.x + target.width / 2 - p.x);
                    let angleDiff = targetAngle - newAngle;
                    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                    newAngle += Math.min(HOMING_MISSILE_TURN_RATE, Math.abs(angleDiff)) * Math.sign(angleDiff);
                }
                newX = p.x + Math.cos(newAngle) * HOMING_MISSILE_SPEED;
                newY = p.y + Math.sin(newAngle) * HOMING_MISSILE_SPEED;
                targetId = target?.id;
            }

            if (now - (p.lastParticleSpawn ?? 0) > HOMING_MISSILE_PARTICLE_SPAWN_RATE) {
                const trailAngle = newAngle + Math.PI + (Math.random() - 0.5) * 0.5;
                particles.push({
                    id: now + Math.random(),
                    x: newX + p.width / 2, y: newY + p.height / 2,
                    vx: Math.cos(trailAngle) * HOMING_MISSILE_PARTICLE_SPEED * Math.random(),
                    vy: Math.sin(trailAngle) * HOMING_MISSILE_PARTICLE_SPEED * Math.random(),
                    size: Math.random() * HOMING_MISSILE_PARTICLE_SIZE,
                    startTime: now, lifespan: HOMING_MISSILE_PARTICLE_LIFESPAN, color: '#ff8c00',
                });
                p.lastParticleSpawn = now;
            }

            return { ...p, x: newX, y: newY, angle: newAngle, phase, targetId };
        }
        return { ...p, x: p.x + Math.cos(p.angle ?? 0) * PROJECTILE_SPEED, y: p.y + Math.sin(p.angle ?? -Math.PI / 2) * PROJECTILE_SPEED };
      }).filter(p => p.y + p.height > 0 && p.y < GAME_HEIGHT && p.x + p.width > 0 && p.x < GAME_WIDTH);
      
      // --- ENEMY MOVEMENT & ATTACKS ---
      const newEnemyProjectiles: EnemyProjectile[] = [];
      enemies = enemies.map((enemy) => {
        if (enemy.isClearing) {
          return { ...enemy, y: enemy.y - ENEMY_SPEED * 2.5, recoil: undefined };
        }
        if (enemy.hp <= 0) {
          return enemy;
        }
      
        const updatedEnemy = { ...enemy };
      
        // 1. Apply recoil first
        if (updatedEnemy.recoil) {
          updatedEnemy.y -= updatedEnemy.recoil;
          updatedEnemy.recoil *= 0.9;
          if (updatedEnemy.recoil < 0.5) {
            updatedEnemy.recoil = undefined;
          }
        }
      
        if (state.status === GameStatus.Playing) {
          // 2. Then apply movement based on type
          switch (updatedEnemy.type) {
            case EnemyType.Swooper: {
              const newY = updatedEnemy.y + ENEMY_SPEED;
              let newX = (updatedEnemy.initialX ?? updatedEnemy.x) + Math.sin(newY * SWOOPER_FREQUENCY) * SWOOPER_AMPLITUDE * (updatedEnemy.swoopDirection ?? 1);

              if (newX <= 0 || newX + updatedEnemy.width >= GAME_WIDTH) {
                updatedEnemy.swoopDirection = ((updatedEnemy.swoopDirection ?? 1) * -1) as 1 | -1;
                newX = Math.max(0, Math.min(newX, GAME_WIDTH - updatedEnemy.width));
                const sineOffset = Math.sin(newY * SWOOPER_FREQUENCY) * SWOOPER_AMPLITUDE * updatedEnemy.swoopDirection;
                updatedEnemy.initialX = newX - sineOffset;
              }

              updatedEnemy.x = newX;
              updatedEnemy.y = newY;
              break;
            }
            case EnemyType.Dasher: {
              if (updatedEnemy.phase === 'descending') {
                updatedEnemy.y += ENEMY_SPEED;
                if (updatedEnemy.y >= DASHER_PAUSE_Y) {
                  updatedEnemy.y = DASHER_PAUSE_Y;
                  updatedEnemy.phase = 'pausing';
                  updatedEnemy.pauseTime = now;
                }
              } else if (updatedEnemy.phase === 'pausing') {
                if (now - (updatedEnemy.pauseTime ?? 0) > DASHER_PAUSE_DURATION) {
                  updatedEnemy.phase = 'dashing';
                  updatedEnemy.dashTargetX = player.x;
                }
              } else if (updatedEnemy.phase === 'dashing') {
                const angle = Math.atan2(GAME_HEIGHT - updatedEnemy.y, (updatedEnemy.dashTargetX ?? updatedEnemy.x) - updatedEnemy.x);
                updatedEnemy.x += Math.cos(angle) * DASHER_DASH_SPEED;
                updatedEnemy.y += Math.sin(angle) * DASHER_DASH_SPEED;
              }
              break;
            }
            case EnemyType.Turret: {
              if (updatedEnemy.phase === 'descending') {
                updatedEnemy.y += ENEMY_SPEED / 2;
                if (updatedEnemy.y >= TURRET_STOP_Y) {
                  updatedEnemy.y = TURRET_STOP_Y;
                  updatedEnemy.phase = 'active';
                  updatedEnemy.lastFired = now;
                }
              } else if (updatedEnemy.phase === 'active') {
                updatedEnemy.horizontalDirection = updatedEnemy.horizontalDirection ?? 1;
                updatedEnemy.x += TURRET_HORIZONTAL_SPEED * updatedEnemy.horizontalDirection;
                if (updatedEnemy.x <= 0 || updatedEnemy.x >= GAME_WIDTH - updatedEnemy.width) {
                  updatedEnemy.horizontalDirection *= -1;
                }
                if (now - (updatedEnemy.lastFired ?? 0) > TURRET_FIRE_RATE) {
                  updatedEnemy.lastFired = now;
                  newEnemyProjectiles.push({
                    id: now + Math.random(),
                    x: updatedEnemy.x + updatedEnemy.width / 2 - ENEMY_PROJECTILE_WIDTH / 2,
                    y: updatedEnemy.y + updatedEnemy.height,
                    width: ENEMY_PROJECTILE_WIDTH,
                    height: ENEMY_PROJECTILE_HEIGHT,
                    vx: 0,
                    vy: ENEMY_PROJECTILE_SPEED,
                    projectileType: EnemyProjectileType.Standard,
                  });
                }
              }
              break;
            }
            case EnemyType.Splinter: {
              let vx = (updatedEnemy.vx ?? 0) * SPLINTER_DRAG;
              const vy = ((updatedEnemy.vy ?? 0) * SPLINTER_DRAG) + SPLINTER_GRAVITY;
              
              const nextX = updatedEnemy.x + vx;
              if (nextX <= 0 || nextX + updatedEnemy.width >= GAME_WIDTH) {
                vx *= -1;
              }

              updatedEnemy.x += vx;
              updatedEnemy.y += vy;
              updatedEnemy.vx = vx;
              updatedEnemy.vy = vy;
              break;
            }
            case EnemyType.Charger: {
              if (updatedEnemy.phase === 'descending') {
                  updatedEnemy.y += ENEMY_SPEED;
                  if (updatedEnemy.y >= CHARGER_STOP_Y) {
                      updatedEnemy.y = CHARGER_STOP_Y;
                      updatedEnemy.phase = 'charging';
                      updatedEnemy.pauseTime = now;
                  }
              } else if (updatedEnemy.phase === 'charging') {
                  if (now - (updatedEnemy.pauseTime ?? 0) > CHARGER_CHARGE_DURATION) {
                      updatedEnemy.phase = 'rushing';
                  }
              } else if (updatedEnemy.phase === 'rushing') {
                  updatedEnemy.y += CHARGER_RUSH_SPEED;
              }
              break;
            }
            case EnemyType.Weaver: {
                const newY = updatedEnemy.y + ENEMY_SPEED / 2;
                let newX = (updatedEnemy.initialX ?? updatedEnemy.x) + Math.sin(newY * WEAVER_FREQUENCY) * WEAVER_AMPLITUDE * (updatedEnemy.swoopDirection ?? 1);
                
                if (newX <= 0 || newX + updatedEnemy.width >= GAME_WIDTH) {
                    updatedEnemy.swoopDirection = ((updatedEnemy.swoopDirection ?? 1) * -1) as 1 | -1;
                    newX = Math.max(0, Math.min(newX, GAME_WIDTH - updatedEnemy.width));
                    const sineOffset = Math.sin(newY * WEAVER_FREQUENCY) * WEAVER_AMPLITUDE * updatedEnemy.swoopDirection;
                    updatedEnemy.initialX = newX - sineOffset;
                }
                
                updatedEnemy.x = newX;
                updatedEnemy.y = newY;
                
                if (now - (updatedEnemy.lastFired ?? 0) > WEAVER_MINE_RATE) {
                    updatedEnemy.lastFired = now;
                    newEnemyProjectiles.push({
                        id: now + Math.random(),
                        x: updatedEnemy.x + updatedEnemy.width / 2 - WEAVER_MINE_WIDTH / 2,
                        y: updatedEnemy.y + updatedEnemy.height / 2,
                        width: WEAVER_MINE_WIDTH,
                        height: WEAVER_MINE_HEIGHT,
                        vx: 0,
                        vy: WEAVER_MINE_SPEED,
                        projectileType: EnemyProjectileType.Mine,
                    });
                }
                break;
            }
            case EnemyType.Guardian: {
                if (updatedEnemy.phase === 'descending') {
                    updatedEnemy.y += ENEMY_SPEED / 3;
                    if (updatedEnemy.y >= GUARDIAN_STOP_Y) {
                        updatedEnemy.y = GUARDIAN_STOP_Y;
                        updatedEnemy.phase = 'active';
                    }
                }
                break;
            }
            case EnemyType.Boss: {
              if (updatedEnemy.phase === 'entering') {
                updatedEnemy.y += ENEMY_SPEED / 2;
                if (updatedEnemy.y >= BOSS_ENTER_Y) {
                  updatedEnemy.y = BOSS_ENTER_Y;
                  updatedEnemy.phase = 'phase1';
                  updatedEnemy.attackTimer = now;
                }
              } else if (updatedEnemy.phase === 'phase1' || updatedEnemy.phase === 'phase2') {
                updatedEnemy.horizontalDirection = updatedEnemy.horizontalDirection ?? 1;
                updatedEnemy.x += BOSS_HORIZONTAL_SPEED * updatedEnemy.horizontalDirection;
                if (updatedEnemy.x <= 0 || updatedEnemy.x >= GAME_WIDTH - updatedEnemy.width) {
                  updatedEnemy.horizontalDirection *= -1;
                }
                if (updatedEnemy.hp < (updatedEnemy.maxHp ?? 0) / 2 && updatedEnemy.phase === 'phase1') {
                  updatedEnemy.phase = 'phase2';
                }
        
                const cooldown = updatedEnemy.phase === 'phase2' ? 800 : 1500;
                if (now - (updatedEnemy.attackTimer ?? 0) > cooldown) {
                  updatedEnemy.attackTimer = now;
                  updatedEnemy.attackPhase = ((updatedEnemy.attackPhase ?? 0) + 1) % 4;
                  const centerX = updatedEnemy.x + updatedEnemy.width / 2;
                  if (updatedEnemy.attackPhase === 0) {
                    for (let i = -3; i <= 3; i++) {
                      newEnemyProjectiles.push({ projectileType: EnemyProjectileType.Standard, id: now + i + Math.random(), x: centerX, y: updatedEnemy.y + updatedEnemy.height - 20, width: ENEMY_PROJECTILE_WIDTH, height: ENEMY_PROJECTILE_HEIGHT, vx: Math.cos(Math.PI / 2 + (i * Math.PI / 12)) * ENEMY_PROJECTILE_SPEED, vy: Math.sin(Math.PI / 2 + (i * Math.PI / 12)) * ENEMY_PROJECTILE_SPEED });
                    }
                  } else if (updatedEnemy.attackPhase === 1 || updatedEnemy.attackPhase === 3) {
                    for (let i = 0; i < (updatedEnemy.phase === 'phase2' ? 5 : 3); i++) {
                      newEnemyProjectiles.push({ projectileType: EnemyProjectileType.Standard, id: now + i * 100 + 100 + Math.random(), x: updatedEnemy.x + 20, y: updatedEnemy.y + updatedEnemy.height - 40, width: ENEMY_PROJECTILE_WIDTH, height: ENEMY_PROJECTILE_HEIGHT, vx: 0, vy: ENEMY_PROJECTILE_SPEED * 1.2 });
                      newEnemyProjectiles.push({ projectileType: EnemyProjectileType.Standard, id: now + i * 100 + 200 + Math.random(), x: updatedEnemy.x + updatedEnemy.width - 20, y: updatedEnemy.y + updatedEnemy.height - 40, width: ENEMY_PROJECTILE_WIDTH, height: ENEMY_PROJECTILE_HEIGHT, vx: 0, vy: ENEMY_PROJECTILE_SPEED * 1.2 });
                    }
                  } else {
                    const angleToPlayer = Math.atan2(player.y - (updatedEnemy.y + updatedEnemy.height), player.x - centerX);
                    for (let i = -1; i <= 1; i++) {
                      newEnemyProjectiles.push({ projectileType: EnemyProjectileType.Standard, id: now + 300 + i + Math.random(), x: centerX, y: updatedEnemy.y + updatedEnemy.height / 2, width: ENEMY_PROJECTILE_WIDTH, height: ENEMY_PROJECTILE_HEIGHT, vx: Math.cos(angleToPlayer + (i * Math.PI / 18)) * ENEMY_PROJECTILE_SPEED * 1.5, vy: Math.sin(angleToPlayer + (i * Math.PI / 18)) * ENEMY_PROJECTILE_SPEED * 1.5 });
                    }
                  }
                }
              }
              break;
            }
            default: // Standard, Splitter
              if (!updatedEnemy.recoil) {
                  updatedEnemy.y += ENEMY_SPEED;
              }
              break;
          }
        }
      
        return updatedEnemy;
      });
      enemyProjectiles = [...enemyProjectiles, ...newEnemyProjectiles]
        .map(p => ({ ...p, y: p.y + (p.vy ?? ENEMY_PROJECTILE_SPEED), x: p.x + (p.vx ?? 0) }))
        .filter(p => p.y < GAME_HEIGHT && p.y + p.height > 0 && p.x < GAME_WIDTH && p.x + p.width > 0);


      // --- DAMAGE APPLICATION ---
      const hitProjectileIds = new Set<number>();
      projectiles.forEach(projectile => {
          for (const enemy of enemies) {
              if (enemy.hp <= 0 || enemy.isClearing) continue;
              if (intersects(projectile, enemy)) {
                if (enemy.type === EnemyType.Guardian && (enemy.shieldHp ?? 0) > 0) {
                    enemy.shieldHp = (enemy.shieldHp ?? 0) - projectile.power;
                } else {
                  enemy.hp -= projectile.power;
                  if (enemy.type !== EnemyType.Boss) {
                    enemy.recoil = ENEMY_RECOIL_AMOUNT;
                  }
                }
                hitProjectileIds.add(projectile.id);
                break;
              }
          }
      });
      projectiles = projectiles.filter(p => !hitProjectileIds.has(p.id));

      const handleBeamDamage = (targetId: number | null, damage: number) => {
        if (targetId === null) return;
        const target = enemies.find(e => e.id === targetId);
        if (target && target.hp > 0 && !target.isClearing) {
            if (target.type === EnemyType.Guardian && (target.shieldHp ?? 0) > 0) {
                target.shieldHp = (target.shieldHp ?? 0) - damage;
            } else {
                target.hp -= damage;
            }
        }
      };

      if (leftDroneState === 'firing' && now - leftDroneStateTime > BEAM_FIRING_DURATION) { leftDroneState = 'cooldown'; leftDroneStateTime = now; } 
      else if (leftDroneState === 'cooldown' && now - leftDroneStateTime > BEAM_COOLDOWN_DURATION) { leftDroneState = 'firing'; leftDroneStateTime = now; }
      if (rightDroneState === 'firing' && now - rightDroneStateTime > BEAM_FIRING_DURATION) { rightDroneState = 'cooldown'; rightDroneStateTime = now; } 
      else if (rightDroneState === 'cooldown' && now - rightDroneStateTime > BEAM_COOLDOWN_DURATION) { rightDroneState = 'firing'; rightDroneStateTime = now; }

      let potentialLeftTarget: Enemy | undefined, potentialRightTarget: Enemy | undefined;
      if (visibleEnemies.length > 0) {
          potentialLeftTarget = visibleEnemies.reduce((lowest, current) => (current.y > lowest.y ? current : lowest));
          const enemiesSorted = [...visibleEnemies].sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y));
          potentialRightTarget = enemiesSorted[0].id !== potentialLeftTarget.id ? enemiesSorted[0] : enemiesSorted[1] ?? enemiesSorted[0];
      }

      if (state.shipLevel >= 4) {
        leftDroneTargetId = leftDroneState === 'firing' && potentialLeftTarget ? potentialLeftTarget.id : null;
        if (leftDroneTargetId) {
            const damage = (BASE_BEAM_DAMAGE_PER_TICK + ((state.shipLevel >= 10 ? 2 : state.shipLevel >= 7 ? 1 : 0) * BEAM_DAMAGE_INCREASE_PER_LEVEL)) * state.bulletPowerLevel;
            handleBeamDamage(leftDroneTargetId, damage);
        }
      }
      if (state.shipLevel >= 5) {
        rightDroneTargetId = rightDroneState === 'firing' && potentialRightTarget ? potentialRightTarget.id : null;
        if (rightDroneTargetId) {
            const damage = (BASE_BEAM_DAMAGE_PER_TICK + ((state.shipLevel >= 11 ? 2 : state.shipLevel >= 8 ? 1 : 0) * BEAM_DAMAGE_INCREASE_PER_LEVEL)) * state.bulletPowerLevel;
            handleBeamDamage(rightDroneTargetId, damage);
        }
      }

      // --- UNIFIED DEATH PROCESSING ---
      const spawnedSplinters: Enemy[] = [];
      let shouldSave = false;
      const deathBurstProjectiles: EnemyProjectile[] = [];

      enemies.forEach(enemy => {
        if (enemy.hp <= 0 && !enemy.deathTime) {
            enemy.deathTime = now;
            if (enemy.isTutorial) return; // Tutorial enemy gives no money/kills
            const cashBoostMultiplier = 1 + (state.cashBoostLevel - 1) * CASH_BOOST_PER_LEVEL;
            const earnedValue = Math.round(enemy.value * cashBoostMultiplier);
            money += earnedValue;
            newFloatingTexts.push({ id: now + Math.random(), x: enemy.x + enemy.width / 2, y: enemy.y, text: `+$${earnedValue}`, startTime: now });

            if (enemy.type === EnemyType.Boss) {
                bossState = 'defeated';
                bossDefeatedTime = now;
                enemyProjectiles = []; // Clear boss projectiles on death
                shouldSave = true;
            } else {
                if (enemy.type !== EnemyType.Splinter) {
                    killCount += 1;
                    const primaryKillCount = killCount;
                    const currentWave = Math.floor(primaryKillCount / KILLS_PER_WAVE) + 1;

                    if (currentWave > wave && bossState === 'none') {
                        // End of wave interest bonus
                        const interestRate = state.interestLevel * INTEREST_RATE_PER_LEVEL;
                        const earnedInterest = Math.round(money * interestRate);
                        if (earnedInterest > 0) {
                            money += earnedInterest;
                            newFloatingTexts.push({
                                id: now + Math.random(),
                                x: GAME_WIDTH - 80,
                                y: 50,
                                text: `+$${earnedInterest} Interest!`,
                                startTime: now,
                                color: '#66ff66',
                            });
                            moneyGlowTime = now;
                        }
                        
                        shouldSave = true;

                        if (wave % WAVE_FOR_BOSS === 0) {
                            bossState = 'warning';
                            bossWarningTime = now;
                        }
                        wave = currentWave;
                    }
                }
            }
            if (enemy.type === EnemyType.Splitter) {
                for (let i = 0; i < SPLINTER_COUNT; i++) {
                    const angle = (i / SPLINTER_COUNT) * (2 * Math.PI);
                    spawnedSplinters.push({
                        id: now + Math.random() + i, x: enemy.x + enemy.width / 2 - SPLINTER_WIDTH / 2, y: enemy.y + enemy.height / 2 - SPLINTER_HEIGHT / 2,
                        width: SPLINTER_WIDTH, height: SPLINTER_HEIGHT, hp: SPLINTER_HP, value: SPLINTER_VALUE, color: ENEMY_COLORS[1],
                        type: EnemyType.Splinter, vx: Math.cos(angle) * SPLINTER_INITIAL_SPEED, vy: Math.sin(angle) * SPLINTER_INITIAL_SPEED,
                    });
                }
            }
            if (enemy.type === EnemyType.Guardian) {
                for (let i = 0; i < GUARDIAN_DEATH_BURST_COUNT; i++) {
                    const angle = (i / GUARDIAN_DEATH_BURST_COUNT) * 2 * Math.PI;
                    deathBurstProjectiles.push({
                        id: now + Math.random() + i,
                        x: enemy.x + enemy.width / 2 - ENEMY_PROJECTILE_WIDTH / 2,
                        y: enemy.y + enemy.height / 2 - ENEMY_PROJECTILE_HEIGHT / 2,
                        width: ENEMY_PROJECTILE_WIDTH,
                        height: ENEMY_PROJECTILE_HEIGHT,
                        vx: Math.cos(angle) * ENEMY_PROJECTILE_SPEED,
                        vy: Math.sin(angle) * ENEMY_PROJECTILE_SPEED,
                        projectileType: EnemyProjectileType.Burst,
                    });
                }
            }
        }
      });

      if (deathBurstProjectiles.length > 0) {
        enemyProjectiles = [...enemyProjectiles, ...deathBurstProjectiles];
      }

      if (shouldSave) {
        saveGame({
          money,
          bulletRateLevel: state.bulletRateLevel,
          bulletPowerLevel: state.bulletPowerLevel,
          shipLevel: state.shipLevel,
          interestLevel: state.interestLevel,
          cashBoostLevel: state.cashBoostLevel,
          shieldLevel: state.shieldLevel,
          bulletRateCost: state.bulletRateCost,
          bulletPowerCost: state.bulletPowerCost,
          shipLevelCost: state.shipLevelCost,
          interestCost: state.interestCost,
          cashBoostCost: state.cashBoostCost,
          shieldCost: state.shieldCost,
        });
      }

      if (spawnedSplinters.length > 0) enemies = [...enemies, ...spawnedSplinters];
      floatingTexts = [...floatingTexts, ...newFloatingTexts];

      // --- PLAYER COLLISION & BREACH DETECTION ---
      if (state.status === GameStatus.Playing) {
        const breachedEnemyIds = new Set<number>();
        const newBreachExplosions: BreachExplosion[] = [];
        let shieldsLost = 0;
  
        const activeGameEnemies = enemies.filter(e => !e.isClearing && e.hp > 0);
  
        activeGameEnemies.forEach(enemy => {
          // Check for breach
          if (enemy.y + enemy.height > (GAME_HEIGHT - UPGRADE_BAR_HEIGHT)) {
              breachedEnemyIds.add(enemy.id);
              shieldsLost++;
              newBreachExplosions.push({
                  id: now + Math.random(),
                  x: enemy.x + enemy.width / 2,
                  startTime: now,
              });
          }
        });
        
        let playerWasHitByCollision = false;
        for (const enemy of activeGameEnemies) {
          if (intersects(enemy, player)) {
              playerWasHitByCollision = true;
              break; 
          }
        }
  
        const hitEnemyProjectiles = new Set<number>();
        let playerWasHitByProjectile = false;
        for (const projectile of enemyProjectiles) {
          if (intersects(projectile, player)) {
              playerWasHitByProjectile = true;
              hitEnemyProjectiles.add(projectile.id);
              break;
          }
        }
         if (playerWasHitByProjectile) {
          enemyProjectiles = enemyProjectiles.filter(p => !hitEnemyProjectiles.has(p.id));
         }
  
        if (shieldsLost > 0) {
          shields -= shieldsLost;
          breachExplosions = [...breachExplosions, ...newBreachExplosions];
          enemies = enemies.filter(e => !breachedEnemyIds.has(e.id));
        }
  
        if (playerWasHitByCollision || playerWasHitByProjectile) {
          shields -= 1;
          if (shields >= 0) {
              playerHitTime = now;
              enemies = enemies.map(e => e.type === EnemyType.Boss ? e : ({ ...e, isClearing: true, phase: undefined }));
              enemyProjectiles = [];
          }
        }
  
        if (shields < 0) {
          return {
              ...state, player, enemies, projectiles, enemyProjectiles, stars, particles, breachExplosions,
              killCount, money, lastEnemySpawn, lastProjectileSpawn, lastMissileSpawn, floatingTexts,
              shields: 0, playerHitTime, leftDrone, rightDrone, homingDrone, leftDroneTargetId,
              rightDroneTargetId, leftDroneState, rightDroneState, leftDroneStateTime, rightDroneStateTime,
              wave, bossState, bossWarningTime, bossDefeatedTime, moneyGlowTime,
              status: GameStatus.GameOver,
          };
        }
      }
    
      // --- PLAYER FIRING ---
      if (state.status === GameStatus.Playing) {
        const bulletPower = BASE_BULLET_POWER + ((state.bulletPowerLevel -1) * BULLET_POWER_INCREASE_PER_LEVEL);
        const currentFireRate = Math.max(MIN_PROJECTILE_FIRE_RATE, BASE_PROJECTILE_FIRE_RATE - ((state.bulletRateLevel - 1) * FIRE_RATE_DECREASE_PER_LEVEL));
        if (now - lastProjectileSpawn > currentFireRate) {
          lastProjectileSpawn = now;
          const createProjectile = (x: number, y: number, angle: number): Projectile => ({
              id: now + Math.random(), x: x - PROJECTILE_WIDTH / 2, y: y, width: PROJECTILE_WIDTH, height: PROJECTILE_HEIGHT,
              power: bulletPower, type: ProjectileType.Standard, angle,
          });
          const centerX = player.x + player.width / 2;
          if (state.shipLevel === 1) projectiles.push(createProjectile(centerX, player.y, -Math.PI / 2));
          else if (state.shipLevel === 2) { projectiles.push(createProjectile(centerX - PLAYER_WIDTH / 3, player.y, -Math.PI / 2)); projectiles.push(createProjectile(centerX + PLAYER_WIDTH / 3, player.y, -Math.PI / 2)); } 
          else if (state.shipLevel >= 3) { projectiles.push(createProjectile(centerX, player.y, -Math.PI / 2)); projectiles.push(createProjectile(centerX - PLAYER_WIDTH / 2.5, player.y, -Math.PI / 2)); projectiles.push(createProjectile(centerX + PLAYER_WIDTH / 2.5, player.y, -Math.PI / 2)); }
        }
  
        // --- SPAWN HOMING MISSILES ---
        if (state.shipLevel >= 6) {
          const numMissiles = state.shipLevel >= 12 ? 3 : state.shipLevel >= 9 ? 2 : 1;
          if (now - lastMissileSpawn > (currentFireRate * 3) / numMissiles && visibleEnemies.length > 0) {
              lastMissileSpawn = now;
              const initialTargetY = GAME_HEIGHT * (1 - HOMING_MISSILE_INITIAL_TARGET_Y_FACTOR);
              const initialTargetX = Math.random() * GAME_WIDTH;
              const homingDroneSize = PLAYER_WIDTH * HOMING_DRONE_SCALE;
  
              projectiles.push({
                  id: now + 500 + Math.random(), x: homingDrone.x + homingDroneSize / 2 - HOMING_MISSILE_WIDTH / 2, y: homingDrone.y,
                  width: HOMING_MISSILE_WIDTH, height: HOMING_MISSILE_HEIGHT, power: bulletPower, type: ProjectileType.Homing,
                  targetId: visibleEnemies.reduce((lowest, current) => (current.y > lowest.y ? current : lowest)).id, angle: -Math.PI / 2,
                  phase: 'initialBoost', initialTargetX, initialTargetY, lastParticleSpawn: now,
              });
          }
        }
      }
      
      // --- ENEMY SPAWNING ---
      if (state.status === GameStatus.Playing) {
        const difficultyProgress = Math.min(1, (now - state.gameStartTime) / TIME_TO_MAX_DIFFICULTY);
        const currentEnemySpawnRate = INITIAL_ENEMY_SPAWN_RATE - (INITIAL_ENEMY_SPAWN_RATE - MIN_ENEMY_SPAWN_RATE) * difficultyProgress;
        if (now - lastEnemySpawn > currentEnemySpawnRate && bossState === 'none') {
          lastEnemySpawn = now;
          
          const rawHpLevel = difficultyProgress * MAX_ADDITIONAL_HP;
          const baseHpLevel = Math.floor(rawHpLevel);
          const transitionProgress = rawHpLevel - baseHpLevel;
          
          let chosenHpLevel = baseHpLevel;
          if (Math.random() < transitionProgress) {
              chosenHpLevel = Math.min(baseHpLevel + 1, MAX_ADDITIONAL_HP);
          }
  
          const hp = BASE_ENEMY_HP + chosenHpLevel;
          const color = ENEMY_COLORS[Math.min(chosenHpLevel, ENEMY_COLORS.length - 1)];
          const value = BASE_ENEMY_VALUE + Math.floor(difficultyProgress * MAX_ADDITIONAL_VALUE);
  
          let type: EnemyType; 
          const random = Math.random();
          const d = difficultyProgress;
          
          if (d > 0.7 && random < 0.15) type = EnemyType.Guardian;
          else if (d > 0.5 && random < 0.30) type = EnemyType.Weaver;
          else if (d > 0.3 && random < 0.45) type = EnemyType.Charger;
          else if (d > 0.6 && random < 0.55) type = EnemyType.Splitter;
          else if (d > 0.4 && random < 0.70) type = EnemyType.Turret;
          else if (d > 0.5 && random < 0.85) type = EnemyType.Dasher;
          else if (d > 0.2 && random < 0.95) type = EnemyType.Swooper;
          else type = EnemyType.Standard;
          
          let width = ENEMY_WIDTH;
          let height = ENEMY_HEIGHT;
          let newEnemy: Enemy;
          
          const baseEnemy = { id: now + Math.random(), y: -ENEMY_HEIGHT, hp, value, color, type };

          // Refactored to set width/height based on type before calculating spawn position
          switch (type) {
            case EnemyType.Splitter:
                width *= 1.2; height *= 1.2;
                break;
            case EnemyType.Charger:
                height *= 1.2;
                break;
            case EnemyType.Weaver:
                width *= 1.2;
                break;
            case EnemyType.Guardian:
                width *= 1.3; height *= 1.3;
                break;
          }
          newEnemy = { ...baseEnemy, width, height, x: Math.random() * (GAME_WIDTH - width), y: -height };
          
          if (type === EnemyType.Swooper) { newEnemy.initialX = newEnemy.x; newEnemy.swoopDirection = 1; }
          if (type === EnemyType.Dasher) { newEnemy.phase = 'descending'; }
          if (type === EnemyType.Turret) { newEnemy.phase = 'descending'; newEnemy.hp *= 2; newEnemy.value *= 2; newEnemy.horizontalDirection = Math.random() < 0.5 ? 1 : -1; }
          if (type === EnemyType.Splitter) { newEnemy.hp *= SPLITTER_HP_MULTIPLIER; newEnemy.value = Math.floor(newEnemy.value * SPLITTER_VALUE_MULTIPLIER); }
          if (type === EnemyType.Charger) { newEnemy.phase = 'descending'; newEnemy.hp *= 1.5; }
          if (type === EnemyType.Weaver) { newEnemy.initialX = newEnemy.x; newEnemy.swoopDirection = Math.random() < 0.5 ? 1 : -1; newEnemy.lastFired = now; }
          if (type === EnemyType.Guardian) { 
              const shieldHp = GUARDIAN_BASE_SHIELD_HP + chosenHpLevel;
              newEnemy.phase = 'descending'; 
              newEnemy.hp *= 4; 
              newEnemy.value *= 3;
              newEnemy.shieldHp = shieldHp;
              newEnemy.maxShieldHp = shieldHp;
          }
  
          enemies.push(newEnemy);
        }
      }
      
      // --- CLEANUP ---
      floatingTexts = floatingTexts.filter(ft => now - ft.startTime < FLOATING_TEXT_DURATION);
      enemies = enemies.filter(e => e.deathTime ? now - e.deathTime < ENEMY_DEATH_FADE_DURATION : e.isClearing ? e.y + e.height > 0 : true);
      particles = particles
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy }))
        .filter(p => now - p.startTime < p.lifespan);
      breachExplosions = breachExplosions.filter(be => now - be.startTime < BREACH_EFFECT_DURATION);

      return { ...state, player, enemies, projectiles, enemyProjectiles, stars, particles, breachExplosions, killCount, money, lastEnemySpawn, lastProjectileSpawn, lastMissileSpawn, floatingTexts, shields, playerHitTime, leftDrone, rightDrone, homingDrone, leftDroneTargetId, rightDroneTargetId, leftDroneState, rightDroneState, leftDroneStateTime, rightDroneStateTime, wave, bossState, bossWarningTime, bossDefeatedTime, moneyGlowTime };
    }
    default:
      return state;
  }
};

const TutorialOverlay: React.FC<{ state: GameState; dispatch: React.Dispatch<Action> }> = ({ state, dispatch }) => {
    const { tutorialStep, bulletRateCost } = state;

    const tutorialSteps = [
        {
            text: "Welcome to ARES! This short tutorial will guide you through the basics.",
            button: "Next",
            action: () => dispatch({ type: 'ADVANCE_TUTORIAL' }),
        },
        {
            text: "Your ship moves and targets enemies automatically. Your job is to shoot and manage upgrades.",
            button: "Next",
            action: () => dispatch({ type: 'ADVANCE_TUTORIAL' }),
        },
        {
            text: "An enemy has appeared! Click or tap anywhere on the screen to fire your lasers and destroy it.",
        },
        {
            text: "Great shot! Destroying enemies earns you cash. You can see your total at the top right.",
            button: "Next",
            action: () => dispatch({ type: 'ADVANCE_TUTORIAL' }),
            highlight: "money",
        },
        {
            text: `Use cash to buy upgrades from the bar below. Try upgrading your FIRE RATE now. It costs $${bulletRateCost}.`,
            highlight: "firerate",
        },
        {
            text: "Excellent! Other upgrades increase bullet POWER, improve your SHIP (more guns, drones), boost your economy (INTEREST, CASH), or add SHIELDS (lives).",
            button: "Got It",
            action: () => dispatch({ type: 'ADVANCE_TUTORIAL' }),
        },
        {
            text: "You're now ready to fight. Upgrades get more expensive, so choose wisely! Good luck!",
            button: "Start Game",
            action: () => dispatch({ type: 'START_GAME' }),
        },
    ];

    const currentStep = tutorialSteps[tutorialStep];
    if (!currentStep) return null;

    return (
        <div className="absolute inset-0 bg-black/50 z-40 flex flex-col items-center justify-center p-4 pointer-events-none">
            {/* Highlighter for Money */}
            {currentStep.highlight === 'money' && (
                <div className="absolute top-2 right-2 w-[130px] h-[62px] border-4 border-cyan-400 rounded-lg animate-pulse" />
            )}
            {/* Highlighter for Fire Rate Upgrade */}
            {currentStep.highlight === 'firerate' && (
                <div 
                    className="absolute bottom-1 border-4 border-cyan-400 rounded-lg animate-pulse"
                    style={{
                        width: '72px', // w-16 + border
                        height: '104px', // h-24 + border
                        left: '8px', 
                    }}
                />
            )}
            
            <div className="bg-black/80 border-2 border-cyan-400 shadow-[0_0_15px_#0ff] p-6 rounded-lg text-center max-w-sm">
                <p className="text-lg mb-4">{currentStep.text}</p>
                {currentStep.button && (
                    <button onClick={currentStep.action} className="text-lg px-5 py-2 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_8px_#0ff] pointer-events-auto">
                        {currentStep.button}
                    </button>
                )}
            </div>
            <button onClick={() => dispatch({ type: 'START_GAME' })} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-400 hover:text-white underline pointer-events-auto transition-colors">
                Skip Tutorial
            </button>
        </div>
    );
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const animationFrameId = useRef<number | null>(null);

  const gameLoop = useCallback(() => {
    dispatch({ type: 'TICK' });
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (state.status === GameStatus.Playing || state.status === GameStatus.Tutorial) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [state.status, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'p' || e.key === 'Escape') {
            if (state.status === GameStatus.Playing) {
                dispatch({ type: 'PAUSE_GAME' });
            } else if (state.status === GameStatus.Paused) {
                dispatch({ type: 'RESUME_GAME' });
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.status]);

  const handleManualFire = useCallback((event: React.PointerEvent) => {
    // Fire only if the click is on the background, not UI elements.
    if (event.target !== event.currentTarget) {
        return;
    }
    event.preventDefault();
    if (state.status === GameStatus.Playing || (state.status === GameStatus.Tutorial && state.tutorialStep === 2)) {
      dispatch({ type: 'MANUAL_FIRE' });
    }
  }, [state.status, state.tutorialStep]);

  const startTutorial = () => dispatch({ type: 'START_TUTORIAL' });
  const startGame = () => dispatch({ type: 'START_GAME' });
  const restartGame = () => dispatch({ type: 'RESTART' });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });
  const continueGame = () => dispatch({ type: 'CONTINUE_FROM_SAVE' });
  const upgradeBulletRate = () => dispatch({ type: 'UPGRADE_BULLET_RATE' });
  const upgradeBulletPower = () => dispatch({ type: 'UPGRADE_BULLET_POWER' });
  const upgradeShipLevel = () => dispatch({ type: 'UPGRADE_SHIP_LEVEL' });
  const upgradeInterest = () => dispatch({ type: 'UPGRADE_INTEREST' });
  const upgradeCashBoost = () => dispatch({ type: 'UPGRADE_CASH_BOOST' });
  const upgradeShield = () => dispatch({ type: 'UPGRADE_SHIELD' });
  const pauseGame = () => dispatch({ type: 'PAUSE_GAME' });
  const resumeGame = () => dispatch({ type: 'RESUME_GAME' });

  const inGameUpgradeButtonClasses = "flex flex-col items-center justify-center gap-1 w-16 h-24 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_8px_#0ff] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-cyan-400 text-xs p-1";

  // Drone rendering calculations
  const sideDroneScale = 0.5;
  const sideDroneWidth = PLAYER_WIDTH * sideDroneScale;
  const leftDroneCenter = { x: state.leftDrone.x + sideDroneWidth / 2, y: state.leftDrone.y };
  const rightDroneCenter = { x: state.rightDrone.x + sideDroneWidth / 2, y: state.rightDrone.y };
  
  const leftTarget = state.enemies.find(e => e.id === state.leftDroneTargetId);
  const rightTarget = state.enemies.find(e => e.id === state.rightDroneTargetId);

  const boss = state.enemies.find(e => e.type === EnemyType.Boss);
  
  // Money glow effect calculation
  const moneyGlowDuration = 500; // ms
  const moneyGlowProgress = state.moneyGlowTime > 0 ? (Date.now() - state.moneyGlowTime) / moneyGlowDuration : 1;
  let moneyStyle: React.CSSProperties = { transition: 'transform 200ms ease-out, color 200ms, text-shadow 200ms' };
  if (moneyGlowProgress < 1) {
      const scale = 1 + 0.5 * Math.sin(moneyGlowProgress * Math.PI); // Grow and shrink
      moneyStyle = {
          ...moneyStyle,
          transform: `scale(${scale})`,
          color: '#66ff66',
          textShadow: '0 0 8px #6f6, 0 0 12px #6f6',
      };
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black font-mono text-cyan-400 p-4">
      <div
        className="relative bg-black overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_20px_#0ff] cursor-pointer"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onPointerDown={handleManualFire}
      >
        {/* Stars */}
        {state.stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: (star.size / 3) + (state.bossState === 'fighting' ? 0.1 : 0),
              backgroundColor: state.bossState === 'fighting' ? '#ffaaaa' : 'white',
              transition: 'background-color 2s ease',
            }}
          />
        ))}

        {/* Particles */}
        {state.particles.map(p => {
            const elapsedTime = Date.now() - p.startTime;
            const life = Math.min(1, elapsedTime / p.lifespan);
            const opacity = 1 - life;
            const size = p.size * (1 - life);
            return (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: p.x - size / 2, top: p.y - size / 2,
                  width: size, height: size,
                  backgroundColor: p.color,
                  opacity: opacity,
                  boxShadow: `0 0 4px ${p.color}`,
                  willChange: 'transform, opacity, width, height',
                }}
              />
            );
        })}

        {/* Floating Text */}
        {state.floatingTexts.map(ft => {
            const elapsedTime = Date.now() - ft.startTime;
            const progress = Math.min(1, elapsedTime / FLOATING_TEXT_DURATION);
            const opacity = 1 - progress;
            const currentY = ft.y - (progress * FLOATING_TEXT_LIFT);

            return (
              <div
                key={ft.id}
                className="absolute font-bold text-lg pointer-events-none"
                style={{
                  left: ft.x,
                  top: currentY,
                  opacity: opacity,
                  transform: 'translateX(-50%)',
                  color: ft.color || '#facc15', // tailwind yellow-400
                  textShadow: '0 0 5px black, 0 0 8px black',
                  willChange: 'transform, opacity',
                }}
              >
                {ft.text}
              </div>
            );
          })}


        {(state.status === GameStatus.Playing || state.status === GameStatus.Tutorial) && (
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
            
            {/* Breach Effects */}
            {state.breachExplosions.map(be => (
                <BreachExplosion key={be.id} x={be.x} startTime={be.startTime} />
            ))}

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
                if (enemy.type === EnemyType.Boss) {
                    const scale = 1 + (timeSinceDeath / ENEMY_DEATH_FADE_DURATION) * 0.5;
                    style.transform = `scale(${scale})`;
                    style.filter = `blur(${timeSinceDeath / 100}px)`;
                }
              }
              style.opacity = opacity;

              return (
                <div key={enemy.id} className="absolute" style={style}>
                  {enemy.type === EnemyType.Guardian && <GuardianShieldStandalone enemy={enemy} />}
                  <EnemyShip enemy={enemy} />
                </div>
              );
            })}

            {/* Projectiles */}
            {state.projectiles.map(p => (
              <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
                 {p.type === ProjectileType.Homing ? <MissileShape angle={p.angle ?? 0} /> : <ProjectileShape color={p.color} />}
              </div>
            ))}
            
            {/* Enemy Projectiles */}
            {state.enemyProjectiles.map(p => (
              <div key={p.id} className="absolute" style={{ left: p.x, top: p.y }}>
                 {p.projectileType === EnemyProjectileType.Mine ? <WeaverMineShape /> : <EnemyProjectileShape />}
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
                      <span>Lvl {state.interestLevel} ({state.interestLevel * 5}%)</span>
                      <span className="text-yellow-400">${state.interestCost}</span>
                </button>
                <button onClick={upgradeCashBoost} disabled={state.money < state.cashBoostCost} className={inGameUpgradeButtonClasses}>
                    <CashBoostIcon />
                    <span className="font-bold">CASH</span>
                    <span>Lvl {state.cashBoostLevel} ({(state.cashBoostLevel - 1)}%)</span>
                    <span className="text-yellow-400">${state.cashBoostCost}</span>
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
        <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
          {state.status === GameStatus.WelcomeBack && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-6 z-30 pointer-events-auto">
                <h1 className="text-6xl font-bold text-cyan-400 filter drop-shadow-[0_0_8px_#0ff]">Welcome Back</h1>
                <p className="text-2xl mt-2 text-cyan-300">Continue your progress?</p>
                <button onClick={continueGame} className="mt-4 text-2xl px-6 py-3 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_10px_#0ff]">
                  CONTINUE GAME
                </button>
                <button onClick={resetGame} className="mt-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
                  Start New Game
                </button>
            </div>
          )}

          {state.status === GameStatus.Start && (
            <div className="flex flex-col items-center gap-6 pointer-events-auto">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-cyan-400 filter drop-shadow-[0_0_8px_#0ff]">ARES</h1>
                <p className="text-2xl mt-2 text-cyan-300">A Really Easy Shooter</p>
                <p className="text-lg mt-1 text-cyan-400/80">by Chris Franklyn</p>
              </div>
              <button onClick={startTutorial} className="text-2xl px-6 py-3 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_10px_#0ff]">
                START GAME
              </button>
            </div>
          )}

          {state.status === GameStatus.GameOver && (
            <div className="flex flex-col items-center gap-4 bg-black/80 p-6 rounded-lg w-full max-w-sm pointer-events-auto">
              <h2 className="text-5xl font-bold text-red-500 filter drop-shadow-[0_0_8px_#f00]">GAME OVER</h2>
              <p className="text-2xl">KILLS: {state.killCount}</p>
              <div>
                <p className="text-3xl font-bold">Total Cash: ${state.money}</p>
              </div>
              
              <button onClick={restartGame} className="mt-4 text-2xl px-6 py-3 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_10px_#0ff]">
                Fight!
              </button>
              <button onClick={resetGame} className="mt-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
                Reset Progress
              </button>
            </div>
          )}

            {state.status === GameStatus.Playing && state.bossState === 'warning' && (
                <div className="z-20">
                    <h2 className="text-6xl font-bold text-red-500 filter drop-shadow-[0_0_8px_#f00] animate-pulse">WARNING</h2>
                </div>
            )}
        </div>
        
        {state.status === GameStatus.Tutorial && <TutorialOverlay state={state} dispatch={dispatch} />}

        {/* Pause Menu */}
        {state.status === GameStatus.Paused && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-30 pointer-events-auto">
                <h2 className="text-6xl font-bold text-cyan-400 filter drop-shadow-[0_0_8px_#0ff]">PAUSED</h2>
                <div className="flex flex-col gap-4">
                    <button onClick={resumeGame} className="text-2xl px-6 py-3 border-2 border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_10px_#0ff]">
                        RESUME
                    </button>
                    <button onClick={resetGame} className="text-lg px-4 py-2 text-gray-400 hover:text-red-500 transition-colors">
                        Reset Game
                    </button>
                </div>
            </div>
        )}

        {/* Score Display */}
        {(state.status === GameStatus.Playing || state.status === GameStatus.Tutorial) && (
          <>
            <div className="absolute top-4 left-4 text-left z-20">
                <div className="text-2xl font-bold">KILLS: {state.killCount}</div>
                <div className="text-xl">SHIELDS: {state.shields}</div>
            </div>
            <div className="absolute top-4 right-4 text-right z-20 flex items-center gap-4">
                <div>
                    <div className="text-2xl font-bold" style={moneyStyle}>${state.money}</div>
                    <div className="text-xl">WAVE: {state.bossState === 'defeated' ? state.wave + 1 : state.wave}</div>
                </div>
                {state.status === GameStatus.Playing && (
                    <button onClick={pauseGame} className="p-2 text-white hover:text-cyan-400 transition-colors pointer-events-auto" aria-label="Pause Game">
                        <PauseIcon />
                    </button>
                )}
            </div>
            {boss && state.bossState === 'fighting' && <BossHealthBar boss={boss} />}
          </>
        )}
      </div>
    </div>
  );
};

export default App;