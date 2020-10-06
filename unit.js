class Unit extends Entity {
    // base class for all units. not actually supposed to be used
    constructor(map) {
        super(map.start_pos.plus(new Vector(0.25, 0.25)), new Vector(0.5, 0.5), 0, map);
        this.health = this.max_health;
        this.facing = map.start_direction; // possible values: "south", "north", "east", "west" (odd even odd even)
        
        this.orientation = this.get_orientation();
        
        this.colour = "dodgerblue"; // coloured for your convenience!
    }
    
    update(lapse) {
        var motion;
        switch (this.facing) {
            case "south":
                motion = new Vector(0, 1);
                break;
            case "north":
                motion = new Vector(0, -1);
                break;
            case "east":
                motion = new Vector(-1, 0);
                break;
            case "west":
                motion = new Vector(1, 0);
                break;
            default:
                motion = new Vector(0, 0);
        }
        
        this.pos = this.pos.plus(motion.times(lapse * this.speed));
        
        // small fix
        if (this.facing == "south" && this.pos.y % 1 < 0.25) {
            return;
        }
        
        if (this.facing == "north" && this.pos.y % 1 > 0.25) {
            return;
        }
        
        if (this.facing == "east" && this.pos.x % 1 > 0.25) {
            return;
        }
        
        if (this.facing == "west" && this.pos.x % 1 < 0.25) {
            return;
        }
        
        // check if the unit is on a new tile
        
        var new_direction = this.map.tile_at(this.pos);
        this.facing       = new_direction == "entrance" ? this.facing : new_direction;
        this.orientation  = this.get_orientation();
        
        if (this.facing == "exit") {
            // for now
            console.log("reached the exit!");
            // probably reward the player or something
            this.active = false;
        }
    }
    
    draw(camera) {
        super.draw(camera);
    }
    
    collision(other) {
        // we know for sure that it's going to be a bullet, so...
        this.health -= other.damage;
        this.active  = this.health > 0;
        
        other.active = false;
    }
    
    get_orientation() {
        switch (this.facing) {
            case "south":
                return Math.PI / 2;
            case "north":
                return 3 * Math.PI / 2;
            case "east":
                return 0;
            case "west":
                return Math.PI;
            default:
                return this.orientation;
        }
    }
    
    check_health() {
        // returns not the health, but the proportion of health. you know what, it'll be easier to just show you
        return this.health / this.max_health;
    }
}

Unit.prototype.speed      = 0.0015; // 1.5 tiles per second
Unit.prototype.max_health = 25; // not particular durable. should get the job done