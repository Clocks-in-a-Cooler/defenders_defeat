class Tower extends Entity {
    constructor(position, map) {
        // to recap: pos(ition), size, orientation, map
        // the tower should start off facing up, so -90 degrees or PI / 2 radians
        super(position.plus(new Vector(0.1, 0.1), new Vector(0.8, 0.8), -Math.PI / 2, map);
        
        this.last_fired = 0;
        this.target     = null;
    }
    
    update(lapse) {
        /*
            on each update:
            -[x] check if the target is dead (active == false)
            -[x] choose a target, if there isn't any
            -[x] fire, if last_fired > cooldown
        */
        if (this.target != null && !target.active) {
            this.target = null;
        }
        
        var possible_targets = this.search_for_targets();
        
        if (this.target == null && possible_targets.length > 0) {
            this.target = possible_targets[0];
        }
        
        this.last_fired += lapse;
        
        if (this.last_fired >= this.cooldown) {
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
        
        this.map.entities.push(new Bullet(
            this.get_center(), // pos
            this.orientation, // angle
            this.map, // map
            Unit, // targetable
            "firebrick" // colour
        ));
    }
    
    orient() {
        // turns toward its target, if there is one
        if (this.target == null) return;
        
        this.orientation = this.target.pos.minus(this.pos).angle;
    }
}

Tower.prototype.cooldown = 750;
Tower.prototype.range    = 7.5;