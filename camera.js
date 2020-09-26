class Camera {
    // i used to just have a viewport object. but let's try this approach...
    // handles drawing, zooming, panning and hovering
    constructor(cxt, map) {
        this.cxt   = cxt;
        this.scale = 40;
        this.map   = map;
        
        // set up some more stuff
        var canvas = cxt.canvas;
        this.size  = (new Vector(canvas.width, canvas.height).times(1 / this.scale));
        // put the camera in the center of the map
        this.top_left = new Vector((map.width - this.size.x) / 2, (map.height - this.size.y) / 2);
        
        // event handler stuff
        this.clicking       = false;
        this.event_handlers = {
            "mousedown": mouse_down.bind(this),
            "mouseup"  : mouse_up.bind(this),
            "mousemove": mouse_move.bind(this),
            "wheel"    : wheel.bind(this),
        };
        this.last_tile = new Vector(-1, -1);
    }
    
    rescale(factor, center) {
        if (center) {
            var screen_coords = this.get_screen_coords(center);
        }
        
        this.scale = this.scale * factor;
        this.size  = (new Vector(canvas.width, canvas.height).times(1 / this.scale));
        
        if (center) {
            this.top_left = center.minus(screen_coords.times(1 / this.scale));
        }
    }
    
    translate(dist) {
        this.top_left = this.top_left.plus(dist);
    }
    
    draw() {
        /*
            to draw:
            -[x] clear the screen
            -[x] get all the tiles that are in view, draw them
            -[ ] get all the entities in view, draw them
        */
        
        this.cxt.clearRect(0, 0, this.cxt.canvas.width, this.cxt.canvas.height);
        
        for (var x = Math.floor(this.top_left.x); x <= Math.ceil(this.top_left.x + this.size.x); x++) {
            for (var y = Math.floor(this.top_left.y); y <= Math.ceil(this.top_left.y + this.size.y); y++) {
                if (this.map.grid[y] == undefined) continue;
                var screen_coords = this.get_screen_coords(new Vector(x, y));
                switch (this.map.grid[y][x]) {
                    case "blank":
                        break;
                    case "west":
                    case "east":
                    case "north":
                    case "south":
                        this.cxt.fillStyle = "salmon";
                        this.cxt.fillRect(screen_coords.x, screen_coords.y, this.scale, this.scale);
                        break;
                    case "entrance":
                        this.cxt.fillStyle = "indianred";
                        this.cxt.fillRect(screen_coords.x, screen_coords.y, this.scale, this.scale);
                        break;
                    case "exit":
                        this.cxt.fillStyle = "hotpink";
                        this.cxt.fillRect(screen_coords.x, screen_coords.y, this.scale, this.scale);
                        break;
                }
            }
        }
        
        this.map.entities.forEach(entity => {
            if (entity.collides(new Entity(this.top_left, this.size, 0))) {
                // draw
            }
        });
    }
    
    get_screen_coords(pos) {
        return pos.minus(this.top_left).times(this.scale);
    }
    
    register_event_handlers() {
        Object.keys(this.event_handlers).forEach(evt => {
            this.cxt.canvas.addEventListener(evt, this.event_handlers[evt]);
        });
    }
    
    remove_event_handlers() {
        Object.keys(this.event_handlers).forEach(evt => {
            this.cxt.canvas.removeEventListener(evt, this.event_handlers[evt]);
        });
        
        // if the event handlers aren't registered in the first place, nothing happens.
        // no failsafe required
    }
    
    get_map_coords(screen_coords) {
        // undo get_screen_coords()
        return screen_coords.times(1 / this.scale).plus(this.top_left);
    }
}

// we bind these in the constructor
function mouse_down(evt) {
    this.clicking = true;
}

function mouse_up(evt) {
    this.clicking = false;
}

function mouse_move(evt) {
    if (this.clicking) {
        this.translate(new Vector(evt.movementX, evt.movementY).times(-1 / this.scale));
    } else {
        // update the information in the side panel, if the mouse has moved to another tile
        var new_tile = this.get_map_coords(new Vector(evt.offsetX, evt.offsetY)).apply(Math.floor);
        if (!new_tile.matches(this.last_tile)) {
            // display tile information, if there is any. for now, just display the coordinates.
            document.getElementById("side-panel").innerHTML = "hovering over (" + new_tile.x + ", " + new_tile.y + ")";
            this.last_tile = new_tile;
        }
    }
}

function wheel(evt) {
    //find scroll direction. thanks, Stack Overflow
    var direction = Math.sign(evt.wheelDelta || (-1 * evt.deltaY)) * -1;
    
    this.rescale(1 - (direction * 0.05), this.get_map_coords(new Vector(evt.offsetX, evt.offsetY)));
}