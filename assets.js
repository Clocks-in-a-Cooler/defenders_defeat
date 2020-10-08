function create_asset(type, path) {
    var elt = document.createElement(type);
    elt.src = path;
    
    return elt;
}

var sprites = {
    // towers
    tower_base:          create_asset("img", "sprites/tower_base.svg"),
    medium_tower_base:   create_asset("img", "sprites/medium_tower_base.svg"),
    basic_tower:         create_asset("img", "sprites/basic_tower.svg"),
    homing_sniper_tower: create_asset("img", "sprites/homing_sniper_tower.svg"),
    machine_gun_tower:   create_asset("img", "sprites/rapid_fire_tower.svg"),
    
    // bullets
    basic_bullet:  create_asset("img", "sprites/basic_bullet.svg"),
    homing_bullet: create_asset("img", "sprites/homing_bullet.svg"),
};