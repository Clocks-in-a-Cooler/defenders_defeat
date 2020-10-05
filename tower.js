class Tower extends Entity {
    constructor(position, map) {
        // to recap: pos(ition), size, orientation, map
        // the tower should start off facing up, so -90 degrees or PI / 2 radians
        super(position, new Vector(1, 1), -Math.PI / 2, map);
        
        this.last_fired = 0;
        this.target     = null;
        this.sprite     = sprites.basic_tower;
        this.damage     = 3;
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
        
        if (this.target != null) {
            this.orient();
        }
        
        if (this.last_fired >= this.cooldown && this.target != null) {
            this.fire();
            this.last_fired = 0;
        }
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
        
        this.map.entities.unshift(new Bullet(
            this.get_center(), // pos
            this.orientation, // angle
            this.map, // map
            Unit, // targetable
            "firebrick", // colour
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
        camera.cxt.drawImage(sprites.tower_base, screen_coords.x, screen_coords.y, camera.scale, camera.scale);
        
        super.draw(camera);
    }
}

Tower.prototype.cooldown = 750;
Tower.prototype.range    = 7.5;