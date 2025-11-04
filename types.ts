export enum GameStatus {
  Start,
  Playing,
  GameOver,
}

export enum EnemyType {
  Standard,
  Swooper,
  Dasher,
  Turret,
  Splitter,
  Splinter,
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
  value: number;
  color: string;
  type: EnemyType;
  isClearing?: boolean;
  recoil?: number;
  deathTime?: number;

  // Swooper-specific
  initialX?: number;
  swoopDirection?: 1 | -1;

  // Dasher & Turret-specific
  phase?: 'descending' | 'pausing' | 'dashing' | 'active';
  dashTargetX?: number;
  pauseTime?: number;

  // Turret-specific
  lastFired?: number;
  horizontalDirection?: 1 | -1;

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
}

export interface EnemyProjectile extends PositionedObject {
  id: number;
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
}