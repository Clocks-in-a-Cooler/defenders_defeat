class Homing_sniper_tower extends Tower {
    constructor(position, map) {
        super(position, map);
        this.size   = new Vector(2, 2);
        this.sprite = sprites.homing_sniper_tower;
        this.base   = sprites.medium_tower_base;
        this.damage = 15;
    }
    
    fire() {
        this.map.entities.unshift(new Homing_bullet(
            this.get_center(),
            this.orientation,
            this.map,
            this.target,
            this.damage
        ));
    }
}

Homing_sniper_tower.prototype.range    = 30;
Homing_sniper_tower.prototype.cooldown = 2250;