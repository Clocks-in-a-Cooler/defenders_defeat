function create_asset(type, path) {
    var elt = document.createElement(type);
    elt.src = path;
    
    return elt;
}

var sprites = {
    // towers
    tower_base:  create_asset("img", "sprites/tower_base.svg"),
    basic_tower: create_asset("img", "sprites/basic_tower.svg"),
    
    // bullets
    basic_bullet: create_asset("img", "sprites/basic_bullet.svg"),
};