export const GAME_WIDTH = 450;
export const GAME_HEIGHT = 800;

export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 40;
export const PLAYER_SPEED = 8;
export const PLAYER_Y_OFFSET = 50;
export const PLAYER_SMOOTHING_FACTOR = 0.1;

export const ENEMY_WIDTH = 35;
export const ENEMY_HEIGHT = 35;
export const ENEMY_SPEED = 2;
export const SWOOPER_AMPLITUDE = 60;
export const SWOOPER_FREQUENCY = 0.0135;
export const DASHER_PAUSE_Y = 200;
export const DASHER_PAUSE_DURATION = 500; // ms
export const DASHER_DASH_SPEED = 12;
export const INITIAL_ENEMY_SPAWN_RATE = 1200; // ms
export const MIN_ENEMY_SPAWN_RATE = 250; // ms
export const TIME_TO_MAX_DIFFICULTY = 60000; // ms (1 minute)

export const TURRET_STOP_Y = 150;
export const TURRET_FIRE_RATE = 2000; // ms
export const TURRET_HORIZONTAL_SPEED = 1;

export const SPLITTER_HP_MULTIPLIER = 3;
export const SPLITTER_VALUE_MULTIPLIER = 2.5;
export const SPLINTER_COUNT = 4;
export const SPLINTER_INITIAL_SPEED = 3;
export const SPLINTER_HP = 1;
export const SPLINTER_VALUE = 50;
export const SPLINTER_WIDTH = 20;
export const SPLINTER_HEIGHT = 20;
export const SPLINTER_DRAG = 0.98;
export const SPLINTER_GRAVITY = 0.05;

// --- New Enemy Type Constants ---
export const CHARGER_STOP_Y = 100;
export const CHARGER_CHARGE_DURATION = 750; // ms
export const CHARGER_RUSH_SPEED = 15;

export const WEAVER_AMPLITUDE = 120;
export const WEAVER_FREQUENCY = 0.008;
export const WEAVER_MINE_RATE = 1500; // ms
export const WEAVER_MINE_SPEED = 1.5;
export const WEAVER_MINE_WIDTH = 12;
export const WEAVER_MINE_HEIGHT = 12;

export const GUARDIAN_STOP_Y = 250;
export const GUARDIAN_BASE_SHIELD_HP = 5;
export const GUARDIAN_DEATH_BURST_COUNT = 8;
// --- End New Enemy Type Constants ---

export const BASE_ENEMY_HP = 1;
export const BASE_ENEMY_VALUE = 100;
export const MAX_ADDITIONAL_HP = 5; // Max HP will be BASE_ENEMY_HP + MAX_ADDITIONAL_HP
export const MAX_ADDITIONAL_VALUE = 900; // Max value will be BASE_ENEMY_VALUE + MAX_ADDITIONAL_VALUE
export const ENEMY_COLORS = ['#f0f', '#ff0000', '#ff8c00', '#ffff00', '#adff2f']; // Magenta -> Red -> Orange -> Yellow -> GreenYellow

export const PROJECTILE_WIDTH = 6;
export const PROJECTILE_HEIGHT = 16;
export const PROJECTILE_SPEED = 10;

export const ENEMY_PROJECTILE_WIDTH = 10;
export const ENEMY_PROJECTILE_HEIGHT = 10;
export const ENEMY_PROJECTILE_SPEED = 4;

export const HOMING_MISSILE_WIDTH = 8;
export const HOMING_MISSILE_HEIGHT = 16;
export const HOMING_MISSILE_SPEED = 8;
export const HOMING_MISSILE_TURN_RATE = 0.1; // radians per tick
export const HOMING_MISSILE_INITIAL_TARGET_Y_FACTOR = 2/3;
export const HOMING_MISSILE_PARTICLE_LIFESPAN = 400; // ms
export const HOMING_MISSILE_PARTICLE_SPAWN_RATE = 25; // ms
export const HOMING_MISSILE_PARTICLE_SIZE = 4;
export const HOMING_MISSILE_PARTICLE_SPEED = 1;

export const STAR_COUNT = 100;
export const STAR_SPEED_MIN = 0.5;
export const STAR_SPEED_MAX = 2;

// --- WAVES & BOSS ---
export const KILLS_PER_WAVE = 25;
export const WAVE_FOR_BOSS = 3;
export const BOSS_WIDTH = 150;
export const BOSS_HEIGHT = 100;
export const BOSS_BASE_HP = 500;
export const BOSS_HP_PER_LOOP = 250;
export const BOSS_VALUE = 25000;
export const BOSS_ENTER_Y = 100;
export const BOSS_HORIZONTAL_SPEED = 2;
export const BOSS_WARNING_DURATION = 3000; // ms
export const BOSS_DEFEATED_DURATION = 3000; // ms

// --- UPGRADES ---
export const UPGRADE_BAR_HEIGHT = 112; // h-24 (96px) + p-2 (8px top/bottom = 16px)
export const HOMING_DRONE_SCALE = 0.3;
export const BASE_PROJECTILE_FIRE_RATE = 1000; // ms (1 per second)
export const FIRE_RATE_DECREASE_PER_LEVEL = 75; // ms reduction per level
export const MIN_PROJECTILE_FIRE_RATE = 100; // cap
export const INITIAL_BULLET_RATE_COST = 500;

export const BASE_BULLET_POWER = 1;
export const BULLET_POWER_INCREASE_PER_LEVEL = 1;
export const INITIAL_BULLET_POWER_COST = 700;

export const INITIAL_INTEREST_COST = 1000;
export const INTEREST_RATE_PER_LEVEL = 0.05; // 5%
export const INITIAL_SHIELD_COST = 1500;
export const INITIAL_SHIP_LEVEL_COST = 2000;
export const INITIAL_CASH_BOOST_COST = 1200;
export const CASH_BOOST_PER_LEVEL = 0.01; // 1%

export const UPGRADE_COST_MULTIPLIER = 1.5;
export const MAX_SHIP_LEVEL = 12;

// Drone Beam Upgrades
export const BASE_BEAM_DAMAGE_PER_TICK = 0.05; // Base damage per frame
export const BEAM_DAMAGE_INCREASE_PER_LEVEL = 0.05; // Additional damage per frame per upgrade level
export const BEAM_FIRING_DURATION = 1000; // ms
export const BEAM_COOLDOWN_DURATION = 1000; // ms

// --- EFFECTS ---
export const FLOATING_TEXT_DURATION = 800; // ms
// FIX: Corrected constant casing to UPPER_SNAKE_CASE for consistency.
export const FLOATING_TEXT_LIFT = 40; // pixels to float up
export const ENEMY_RECOIL_AMOUNT = 8; // pixels of upward knockback
export const ENEMY_DEATH_FADE_DURATION = 300; // ms
export const PLAYER_HIT_EFFECT_DURATION = 400; // ms
export const BREACH_EFFECT_DURATION = 500; // ms

// --- PERSISTENCE ---
export const LOCAL_STORAGE_KEY = 'ares_save_game';