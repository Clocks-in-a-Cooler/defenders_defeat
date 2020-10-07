// also has the menus (scroll down)

var canvas   = document.querySelector("canvas");
canvas.width = canvas.height = 575;
var context  = canvas.getContext("2d");

canvas.setAttribute("tabindex", 0);
canvas.focus();
canvas.onkeydown = function(evt) {
    // let's not deal with any "this" shenanigans
    Engine.key_pressed(evt);
};

var Engine = {
    // classic!
    
    current_level: null,
    
    // same old, same old
    last_time: null, paused: true,
    max_step: 20,
    animate: function(time) {
        if (this.last_time == null) {
            var lapse = 0;
        } else {
            lapse = time - this.last_time;
        }
        this.last_time = time;
        
        while (lapse > 0) {
            var step = Math.min(this.max_step, lapse);
            lapse   -= step;
            
            current_level.map.update(step);
        }
        
        current_level.camera.draw();
        
        if (!this.paused) {
            requestAnimationFrame(Engine.animate);
        }
    },
    
    key_pressed: function(evt) {
        if (evt.code == "Escape" || evt.code == "KeyP") {
            if (this.current_level == null) {
                console.log("pressed pause key while there isn't a level running. ignored.");
                return;
            }
        }
    },
    
    show_menu: function(menu) {
        var menu_elt = create_menu(menu);
        var wrapper  = document.getElementById("wrapper");
        if (document.getElementsByClassName("menu").length > 0) {
            // there are other menus!
            wrapper.removeChild(wrapper.lastChild);
        }
        wrapper.appendChild(menu_elt);
    }
};

var menus = {
    main: {
        id: "main-menu",
        contents: [
            { "h1": "Defender's Defeat" },
        ],
        buttons: {
            play: function() {
                // show level select
                console.log("playing game...");
            },
            credits: function() {
                // show credits menu
                Engine.show_menu(menus.credits);
            },
        },
    },
    
    credits: {
        id: "credits",
        contents: [
            // credits
            { "p": "programmming by Clocks-in-a-cooler" },
        ],
        buttons: {
            back: function() {
                // show main menu
                Engine.show_menu(menus.main);
            }
        },
    },
    
    level_select: {
        id: "level-select",
        buttons: {
            
        },
    },
};

function create_menu(data) {
    var menu = create_element("div", "menu", data.id);
    
    // add content, if any
    if (data.contents) {
        data.contents.forEach(c => {
            var tag = Object.keys(c)[0];
            menu.appendChild(create_element(tag, "", "", c[tag]));
        });
    }
    
    var button_names = Object.keys(data.buttons);
    button_names.forEach(name => {
        var button = data.buttons[name], button_elt;
        if (typeof button == "function") {
            // just create a button that has the function as its event handler
            button_elt = create_element("button", "menu-button", "", name);
            button_elt.addEventListener("click", button);
        } else {
            // the button object also contains the class name
            button_elt = create_element("button", button.class_name, button.id, name);
            button_elt.addEventListener("click", button.onclick);
        }
        menu.appendChild(button_elt);
    });
    
    var menu_wrapper_elt = create_element("div", "menu-wrapper");
    var overlay_elt      = create_element("div", "overlay");
    
    menu_wrapper_elt.appendChild(overlay_elt);
    menu_wrapper_elt.appendChild(menu);
    return menu_wrapper_elt;
}

function create_element(tag, class_name = "", id = "", inner_html = "") {
    var elt       = document.createElement(tag);
    elt.className = class_name;
    elt.id        = id;
    elt.innerHTML = inner_html;
    return elt;
}