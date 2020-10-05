class Entity {
    constructor(pos, size, orientation, map) {
        this.pos         = pos;
        this.size        = size;
        this.orientation = orientation; // used for drawing
        this.active      = true;
        this.map         = map;
        this.colour      = "black";
    }

    update(lapse) {
        // override in child classes
    }

    check_collisions(test = () => true) {
        this.map.entities.forEach(other => {
            if (other === this) return;
            if (this.collides(other) && test(other)) {
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

    get_center() {
        return this.pos.plus(this.size.times(0.5));
    }

    draw(camera) {
        // override in child classes
        
        if (!this.sprite) {
            // draw a rectangle. yeah, boring. i know... i know...
            // hopefully this can be removed soon
            var screen_coords = camera.get_screen_coords(this.pos);

            camera.cxt.fillStyle = this.colour;
            camera.cxt.fillRect(screen_coords.x, screen_coords.y, this.size.x * camera.scale, this.size.y * camera.scale);
        } else {
            var screen_coords = camera.get_screen_coords(this.get_center());
            camera.cxt.save();
            camera.cxt.translate(screen_coords.x, screen_coords.y);
            camera.cxt.rotate(this.orientation);
            camera.cxt.drawImage(this.sprite,
                -this.size.x / 2 * camera.scale, -this.size.y / 2 * camera.scale,
                this.size.x * camera.scale, this.size.y * camera.scale
            );
            
            camera.cxt.restore();
        }
    }
}
