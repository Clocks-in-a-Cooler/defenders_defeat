class Vector {
    constructor(x, y) {
        this.x = x; this.y = y;
        
        this.string   = "(" + x + ", " + y + ")";
        this.length   = Math.hypot(this.x, this.y);
        this.angle    = (function(x, y) {
            var hyp   = Math.hypot(x, y);
            var angle = Math.asin(y / hyp);
            
            if (x < 0) {
                angle = Math.PI - angle;
            }
            
            return angle;
        })(this.x, this.y);
    }
    
    plus(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
    
    minus(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }
    
    times(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
    
    apply(func) {
        return new Vector(func(this.x), func(this.y));
    }
    
    matches(other) {
        return this.x == other.x && this.y == other.y;
    }
    
    rescale(new_length) {
        return this.times(new_length / this.length);
    }
    
    hypot(other) {
        return Math.hypot(this.x - other.x, this.y - other.y);
    }
}

function get_rotate_dir(start, end) {
    // find the direction from start to end
    // -1 for counterclockwise, 1 for clockwise
    start = reduce_angle(start), end = reduce_angle(end);
    
    return (end - start) > Math.PI ? -1 : 1;
}

function reduce_angle(angle) {
    // returns the same angle, but now between 2PI and 0
    while (angle > Math.PI * 2) {
        angle -= Math.PI * 2;
    }
    while (angle < 0) {
        angle += Math.PI * 2;
    }
    
    return angle;
}

function round(number) {
    return Math.floor(number * 10) / 10;
}