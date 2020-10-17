class Machine_gun_tower extends Tower {
    constructor(position, map) {
        super(position, map);
        this.size       = new Vector(2, 2);
        this.sprite     = sprites.machine_gun_tower;
        this.base       = sprites.medium_tower_base;
        this.damage     = 1;
        this.inaccuracy = Math.PI / 6; // 30 degress in either direction. you're spraying bullets, after all
    }
    
    calculate_recoil() {
        // a little shaky
        var recoil_time;
        if (this.last_fired < this.cooldown / 3) {
            // calculate recoil as normal
            recoil_time = this.last_fired * 1.5;
        } else if (this.last_fired < this.cooldown && this.last_fired > (this.cooldown / 3)) {
            recoil_time = this.cooldown / 2;
        } else {
            recoil_time = Math.min((this.last_fired - this.cooldown) * 1.5, this.cooldown);
        }
        
        var recoil_dist = this.size.x / 8;
        this.recoil     = recoil_dist * (-Math.sin(this.recoil_speed * recoil_time));
    }
}

Machine_gun_tower.prototype.cooldown = 75;
Machine_gun_tower.prototype.range    = 5;