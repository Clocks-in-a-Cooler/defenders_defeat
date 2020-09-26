class Entity {
    constructor(pos, size, orientation) {
        this.pos         = pos;
        this.size        = size;
        this.orientation = orientation; // used for drawing
        this.active      = true;
    }
    
    update(lapse) {
        // override in child classes
    }
    
    check_collisions(map) {
        map.entities.forEach(other => {
            if (other === this) continue;
            if (this.collides(other)) {
                other.collision(this);
            }
        });
    }
    
    collides(other) {
        return (
            other.pos.x < this.pos.x + this.size.x &&
            other.pos.x + other.size.x > this.pos.x &&
            other.pos.y < this.pos.y + this.size.y &&
            other.pos.y + other.size.y > this.pos.y
        );
    }
    
    collision(other) {
        // don't call other.collision()
        
        // override in child classes, depending on what it is
        
        this.active = false;
    }
}
