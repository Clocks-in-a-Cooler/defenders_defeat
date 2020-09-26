class Map {
    constructor(plan) {
        this.width  = plan[0].length;
        this.height = plan.length;
        this.grid   = [];
        
        this.entities = [];  // for your minions and the projectiles that will pummel your minions to death
        
        for (var y = 0; y < this.height; y++) {
            var gridline = [];
            var line     = plan[y];
            for (var x = 0; x < this.width; x++) {
                gridline.push(TILE_KEY[line[x]]);
            }
            this.grid.push(gridline);
        }
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