export enum GameStatus {
  Start,
  Playing,
  Paused,
  GameOver,
}

export enum EnemyType {
  Standard,
  Swooper,
  Dasher,
  Turret,
  Splitter,
  Splinter,
  Boss,
}

export enum ProjectileType {
  Standard,
  Homing,
}

// A generic object with position and dimensions
interface PositionedObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends PositionedObject {}

export interface Enemy extends PositionedObject {
  id: number;
  hp: number;
  maxHp?: number; // For bosses
  value: number;
  color: string;
  type: EnemyType;
  isClearing?: boolean;
  recoil?: number;
  deathTime?: number;

  // Swooper-specific
  initialX?: number;
  swoopDirection?: 1 | -1;

  // Dasher & Turret & Boss-specific
  phase?: 'descending' | 'pausing' | 'dashing' | 'active' | 'entering' | 'phase1' | 'phase2' | 'dying';
  dashTargetX?: number;
  pauseTime?: number;

  // Turret & Boss-specific
  lastFired?: number;
  horizontalDirection?: 1 | -1;
  attackCooldown?: number;
  attackTimer?: number;
  attackPhase?: number;

  // Splinter-specific
  vx?: number;
  vy?: number;
}

export interface Projectile extends PositionedObject {
  id: number;
  power: number;
  type: ProjectileType;
  targetId?: number;
  angle?: number;
  color?: string;
  
  // Homing missile specific
  phase?: 'initialBoost' | 'homing';
  initialTargetX?: number;
  initialTargetY?: number;
  lastParticleSpawn?: number;
}

export interface EnemyProjectile extends PositionedObject {
  id: number;
  vx?: number;
  vy?: number;
}

export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  startTime: number;
  color?: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  startTime: number;
  lifespan: number;
  color: string;
}

export interface BreachExplosion {
    id: number;
    x: number;
    startTime: number;
}