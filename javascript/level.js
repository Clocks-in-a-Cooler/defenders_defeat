class Level {
    constructor(plan, context, win_condition, constraints) {
        this.map           = new Map(plan);
        this.camera        = new Camera(context, this.map);
        this.win_condition = win_condition;
        
        this.data = {
            units_reached_exit: 0,
            towers_destroyed: 0,
        };
        
        this.unit_limit = constraints.unit_limit;
        this.budget     = constraints.budget;
        this.costs      = constraints.costs;
        
        this.camera.register_event_handlers();
    }
    
    add_data(key) {
        // adds one to whatever data
        this.data[key] += 1;
        
        if (this.win_condition()) {
            // win the level
        }
        // the lose condition is if you run out of units or time or whatever, however the hell that works
    }
    
    end() {
        
    }
}