class Bullet extends Entity {
    // to make a new type of bullet, just subclass this one!
    constructor(pos, angle, map, targetable, damage = 4) {
        super(pos.minus(new Vector(0.125, 0.125)), new Vector(0.25, 0.25), angle, map);
        
        this.motion     = new Vector(Math.cos(angle), Math.sin(angle));
        this.damage     = damage;
        // for towers, set targetable as Unit
        this.targetable = targetable;
        this.sprite     = sprites.basic_bullet;
        this.lifetime   = this.max_lifetime;
    }

    update(lapse) {
        this.pos = this.pos.plus(this.motion.times(lapse * this.speed));
        
        this.lifetime -= lapse;
        this.active    = this.lifetime > 0;

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

Bullet.prototype.speed = 0.005;

Bullet.prototype.max_lifetime = 2000;
