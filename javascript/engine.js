// also has the menus (scroll down)

var canvas   = document.querySelector("canvas");
canvas.width = canvas.height = 575;
var context  = canvas.getContext("2d");

canvas.setAttribute("tabindex", 0);
canvas.focus();
addEventListener("keydown", function(evt) {
    // let's not deal with any "this" shenanigans
    Engine.key_pressed(evt);
});

var Engine = {
    // classic!
    
    current_level: null,
    
    // same old, same old
    last_time: null, paused: true,
    max_step: 20,
    animate: function(time) {
        var lapse        = Engine.last_time == null ? 0 : time - Engine.last_time;
        Engine.last_time = time;
        
        if (Engine.paused) return;
        
        while (lapse > 0) {
            var step = Math.min(Engine.max_step, lapse);
            lapse   -= step;
            
            Engine.current_level.map.update(step);
        }
        
        Engine.current_level.camera.draw();
        
        requestAnimationFrame(Engine.animate);
    },
    
    resume: function() {
        if (this.current_level != null) {
            this.paused = false;
            this.clear_menu();
            requestAnimationFrame(Engine.animate);
        } else {
            // this shouldn't run... but if it does
            console.log("attempted to start when there isn't a level!");
        }
    },
    
    key_pressed: function(evt) {
        if (evt.code == "Escape" || evt.code == "KeyP") {
            if (this.current_level == null) {
                console.log("pressed pause key while there isn't a level running. ignored.");
                return;
            }
            
            this.paused = !this.paused; // toggle
            // depends on what is going on...
            if (this.paused) {
                // show the pause menu
                this.show_menu(menus.pause);
            } else {
                this.clear_menu();
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
    },
    
    clear_menu() {
        var wrapper = document.getElementById("wrapper");
        if (document.getElementsByClassName("menu").length > 0) {
            // there is a menu present, remove it
            wrapper.removeChild(wrapper.lastChild);
        }
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
                Engine.show_menu(menus.level_select);
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
        contents: [
            { "h1": "Level select" },
        ],
        buttons: {
            "level 1": {
                class_name: "level-select-button",
                id: "",
                disabled: true,
                onclick: function() {
                    console.log("selected level 1.");
                },
            },
            "level 2": {
                class_name: "level-select-button",
                id: "",
                disabled: true,
                onclick: function() {
                    console.log("selected level 2.");
                }
            },
            "level 3": {
                class_name: "level-select-button",
                id: "",
                disabled: true,
                onclick: function() {
                    console.log("selected level 3.");
                }
            },
            "test level": {
                class_name: "level-select-button",
                id: "",
                onclick: function() {
                    // load the demo level i've always had
                    // for now, the win condition and constraints are blank
                    Engine.current_level = new Level(TEST_MAP, context, () => {}, {});
                    Engine.resume();
                }
            },
            "back": function() {
                Engine.show_menu(menus.main);
            }
        },
    },
    
    pause: {
        id: "pause-menu",
        buttons: {
            "resume": function() {
                console.log("unpausing...");
                Engine.resume();
            },
            "back to menu": function() {
                console.log("selected to go to main menu.");
                Engine.current_level.quit();
                Engine.current_level = null;
                Engine.show_menu(menus.main);
            }
        }
    },
    
    win_level: {
        id: "win-menu",
        buttons: {
            "level select": {
                class_name: "inline-button",
                id: "",
                onclick: function() {
                    console.log("selected to go to level select.");
                }
            },
            
            "back to menu": {
                class_name: "inline-button",
                id: "",
                onclick: function() {
                    console.log("selected to go to main menu.");
                }
            },
            
            "next": {
                class_name: "inline-button",
                id: "",
                onclick: function() {
                    console.log("selected to go to next level.");
                }
            },
        },
    },
    
    lose_level: {
        id: "lose-menu",
        buttons: {
            "level select": {
                class_name: "inline-button",
                id: "",
                onclick: function() {
                    console.log("selected to go to level select.");
                }
            },
            
            "back to menu": {
                class_name: "inline-button",
                id: "",
                onclick: function() {
                    console.log("selected to go to main menu.");
                }
            },
            
            "retry": {
                class_name: "inline-button",
                id: "",
                onclick: function() {
                    console.log("selected to go to retry level.");
                }
            },
        },
    }
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
            
            if (button.disabled) {
                button_elt.disabled = true;
            }
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