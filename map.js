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
            return entity.collides(new Entity(pos, new Vector(0, 0), 0));
        });
        
        if (entities.length > 0) {
            return entities[0];
        }
        
        return null;
    }
    
    tile_at(pos) {
        pos = pos.apply(Math.floor);
        
        if (this.grid[pos.y] == undefined) return "blank";
        
        return this.grid[pos.y][pos.x] || "blank";
    }
    
    place_tower(pos, tower) {
        
    }
}

// tradition: using ASCII to represent the map
const TILE_KEY = {
    " ": "blank",
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