class Tower extends Entity {
    constructor(position, map) {
        // to recap: pos(ition), size, orientation, map
        // the tower should start off facing up, so -90 degrees or PI / 2 radians
        super(position, new Vector(1, 1), -Math.PI / 2, map);
        
        this.base_pos     = position;
        this.last_fired   = this.cooldown;
        this.recoil_speed = Math.PI / this.cooldown;
        this.recoil       = 0;
        this.target       = null;
        this.sprite       = sprites.basic_tower;
        this.base         = sprites.tower_base;
        this.damage       = 3;
        this.inaccuracy   = Math.PI / 36; // 5 degrees of inaccuracy, in either direction
    }
    
    update(lapse) {
        /*
            on each update:
            -[x] check if the target is dead (active == false)
            -[x] choose a target, if there isn't any
            -[x] fire, if last_fired > cooldown
        */
        
        /*
            tower forgets target if:
            - target is dead OR
            - target is out of range
        */
        if (this.target != null && (
            !this.target.active || // dead, like me
            this.get_center().hypot(this.target.get_center()) > this.range // out of range, like my wifi router
        )) {
            this.target = null;
        }
        
        var possible_targets = this.search_for_targets();
        
        if (this.target == null && possible_targets.length > 0) {
            this.target = possible_targets[0];
        }
        
        this.last_fired += lapse;
        
        this.calculate_recoil();
        
        if (this.target != null) {
            this.orient();
        }
        
        if (this.last_fired >= this.cooldown && this.target != null) {
            this.fire();
            this.last_fired = 0;
        }
    }
    
    calculate_recoil() {
        var recoil_time = Math.min(this.last_fired * 1.5, this.cooldown);
        var recoil_dist = this.size.x / 8;
        this.recoil     = recoil_dist * (-Math.sin(this.recoil_speed * recoil_time));
    }
    
    collision(other) {
        // doesn't matter
        this.active = true;
    }
    
    // yes, you're not dreaming. a function declaration with three return statements that all run.
    search_for_targets(test = function() { return true; }) {
        return this.map.entities.filter(entity => {
            /*
                to be a target:
                -[x] be a unit
                -[x] pass the test (whatever it may be)
                -[x] be alive
                -[x] be in range
                
                // test can be used to filter enemies further -- so that the tower can shoot only air enemies, for instance
            */
            return (
                entity instanceof Unit &&
                test(entity) &&
                entity.active &&
                // use the center
                this.get_center().hypot(entity.get_center()) <= this.range
            );
        });
    }
    
    fire() {
        // probably overriden in child classes
        /*
            to fire:
            -[x] create a bullet and add it to the map's entities array
        */
        
        var angle = this.orientation + Math.random() * this.inaccuracy * (Math.random() > 0.5 ? 1 : -1);
        
        this.map.entities.unshift(new Bullet(
            this.get_center(), // pos
            angle, // angle
            this.map, // map
            Unit, // targetable
            this.damage // damage
        ));
    }
    
    orient() {
        // turns toward its target, if there is one
        if (this.target == null) return;
        
        this.orientation = this.target.pos.minus(this.pos).angle;
    }
    
    draw(camera) {
        // first draw the base, then draw the sprite itself
        var screen_coords = camera.get_screen_coords(this.pos);
        camera.cxt.drawImage(this.base, screen_coords.x, screen_coords.y, camera.scale * this.size.x, camera.scale * this.size.y);
        
        this.pos = this.base_pos.plus(new Vector(this.recoil * Math.cos(this.orientation), this.recoil * Math.sin(this.orientation)));
        
        super.draw(camera);
        
        this.pos = this.base_pos;
    }
}

Tower.prototype.cooldown = 750;
Tower.prototype.range    = 7.5;