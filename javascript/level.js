class Level {
    constructor(plan, context, win_condition, contraints) {
        this.map           = new Map(plan);
        this.camera        = new Camera(context, map);
        this.win_condition = win_condition;
        
        this.data = {
            units_reached_exit: 0,
            towers_destroyed: 0,
        };
        
        this.unit_limit = constraints.unit_limit;
    }
    
    add_data(key) {
        // adds one to whatever data
        this.data[key] += 1;
        
        if (this.win_condition()) {
            // win the level
        }
        // the lose condition is if you run out of units or time or whatever, however the hell that works
    }
}