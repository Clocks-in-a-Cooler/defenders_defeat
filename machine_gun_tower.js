class Machine_gun_tower extends Tower {
    constructor(position, map) {
        super(position, map);
        this.size   = new Vector(2, 2);
        this.sprite = sprites.machine_gun_tower;
        this.base   = sprites.medium_tower_base;
        this.damage = 1;
    }
}

Machine_gun_tower.prototype.cooldown = 75;
Machine_gun_tower.prototype.range    = 5;