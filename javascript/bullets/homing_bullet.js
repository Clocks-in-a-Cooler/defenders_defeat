class Homing_bullet extends Bullet {
    constructor(pos, angle, map, target, damage) {
        super(pos.minus(new Vector(0.025, 0.025)), angle, map, target.constructor, damage);
        
        this.size   = new Vector(0.3, 0.3);
        this.target = target;
        this.sprite = sprites.homing_bullet; // for now, until i figure out inkscape
    }
    
    update(lapse) {
        if (this.target.active) {
            // target is alive, so adjust
            var angle = this.target.get_center().minus(this.get_center()).angle;
            
            this.orientation = angle;
            this.motion      = new Vector(Math.cos(angle), Math.sin(angle));
        }
        
        super.update(lapse);
    }
    
    draw(camera) {
        super.draw(camera);
    }
}

Homing_bullet.prototype.speed        = 0.008;
Homing_bullet.prototype.max_lifetime = 3000;
