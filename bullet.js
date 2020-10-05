class Bullet extends Entity {
    // to make a new type of bullet, just subclass this one!
    constructor(pos, angle, map, targetable, colour = "darkorange", damage = 4) {
        super(pos, new Vector(0.25, 0.25), angle, map);
        
        this.colour = colour;
        this.motion = new Vector(Math.cos(angle), Math.sin(angle));
        
        // for towers, set targetable as Unit
        this.targetable = targetable;
        
        this.sprite = sprites.basic_bullet;
    }

    update(lapse) {
        this.pos = this.pos.plus(this.motion.times(lapse * this.speed));

        // check for collisions
        this.check_collisions((entity) => {
            return entity instanceof this.targetable && entity.active;
        });
    }

    // no need to override Entity.collision(other)

    draw(camera) {
        super.draw(camera);
    }
}

Bullet.prototype.damage = 4;
Bullet.prototype.speed  = 0.005;
