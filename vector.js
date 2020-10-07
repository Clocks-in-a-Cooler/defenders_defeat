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