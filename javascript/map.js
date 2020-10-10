class Map {
    constructor(plan) {
        this.width  = plan[0].length;
        this.height = plan.length;
        this.grid   = [];
        
        this.entities = [];  // for your minions and the projectiles that will pummel your minions to death
        
        function is_path(x, y) {
            if (y < 0 || y >= plan.length) return false;
            switch (TILE_KEY[plan[y][x]]) {
                case "south":
                case "north":
                case "east":
                case "west":
                    return true;
                default:
                    return false;
            }
        }
        
        for (var y = 0; y < this.height; y++) {
            var gridline = [];
            var line     = plan[y];
            for (var x = 0; x < this.width; x++) {
                gridline.push(TILE_KEY[line[x]]);
                
                if (TILE_KEY[line[x]] == "entrance") {
                    // determine the direction that the units need to face
                    // use is_path()
                    if (is_path(x, y + 1)) {
                        this.start_direction = "south";
                    }
                    if (is_path(x, y - 1)) {
                        this.start_direction = "north";
                    }
                    if (is_path(x - 1, y)) {
                        this.start_direction = "east";
                    }
                    if (is_path(x + 1, y)) {
                        this.start_direction = "west";
                    }
                    
                    this.start_pos = new Vector(x, y);
                }
            }
            this.grid.push(gridline);
        }
    }
    
    update(lapse) {
        this.entities = this.entities.filter(e => e.active);
        this.entities.forEach(e => e.update(lapse));
    }
    
    entity_at(pos) {
        var entities = this.entities.filter(entity => {
            return entity.collides(new Entity(pos, new Vector(1, 1), 0, this)) && !(entity instanceof Bullet);
        });
        
        if (entities.length > 0) {
            return entities[0];
        }
        
        return null;
    }
    
    add_tower(tower) {
        /*
            fail to add tower if:
            - (tower.pos) is outside of the map
            - there is another entity at (tower.pos)
            - the tile at (tower.pos) is not blank
        */
        for (var x = tower.pos.x; x < tower.pos.x + tower.size.x; x++) {
            for (var y = tower.pos.y; y < tower.pos.y + tower.size.y; y++) {
                if (
                    x < 0 || x >= this.width || y < 0 || y >= this.height ||
                    this.entity_at(new Vector(x, y)) || this.tile_at(new Vector(x, y)) != undefined
                ) {
                    throw ("cannot add tower at " + tower.pos.string);
                }
            }
        }
        
        this.entities.push(tower);
    }
    
    tile_at(pos) {
        pos = pos.apply(Math.floor);
        
        if (this.grid[pos.y] == undefined) return;
        
        return this.grid[pos.y][pos.x];
    }
}

// tradition: using ASCII to represent the map
const TILE_KEY = {
    ">": "west",
    "<": "east",
    "^": "north",
    "v": "south",
    "%": "entrance",
    "#": "exit",
};

const TEST_MAP = [ // debian in random places
    "                                                  ",
    "                                                  ",
    "    v<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<         ",
    "    v                                   ^         ",
    "    v                                   ^         ",
    "    v       v<<<<<<<<<<<<<<<<<<<<<      ^         ",
    "    v       v                    ^      ^         ",
    "    v       v                    ^      ^         ",
    "    v       v                    ^      ^         ",
    "    v       v                    ^      ^         ",
    "    v       v                    ^      ^         ",
    "    v       v                    ^      ^         ",
    "    v       v            #       ^      ^         ",
    "    v       v            ^       ^      ^         ",
    "    v       v            ^       ^      ^         ",
    "    v       v            ^       ^      ^         ",
    "    v       v            ^       ^      ^         ",
    "    v       v            ^       ^      ^         ",
    "    v       v            ^       ^      ^         ",
    "    v       v            ^       ^      ^         ",
    "    v       >>>>>>>>>>>>>^       ^      ^         ",
    "    v                            ^      ^         ",
    "    v                            ^      ^         ",
    "    v                            ^      ^         ",
    "    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>^      ^         ",
    "                                        ^         ",
    "                                        ^         ",
    "                                        ^         ",
    "                                        ^         ",
    "                                        ^         ",
    "                                        %         ",
];