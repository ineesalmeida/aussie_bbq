let STATE = {
    IDLE: 'IDLE',
    CHASING: 'CHASING',
    JUMPING: 'JUMPING',
}

let kangaroo_previous_state = STATE.IDLE;
let kangaroo_state = STATE.IDLE;

let kangaroo = document.getElementsByClassName('kangaroo')[0];
let chase = null;

let kangaroo_target = {
    x: get_left_value(kangaroo),
    y: 0
};
let container = document.getElementById('container');
let idle = true;

setInterval(function () {
    behaviourReducer()
}, 200);

// On mouse move, set state to Chasing the mouse
window.addEventListener('mousemove', e => {
    idle = false;
    kangaroo_target.x = e.clientX;
    kangaroo_target.y = e.clientY;
});

container.addEventListener('mouseleave', e => {
    idle = true;
});

function changeState(new_state) {
    kangaroo_previous_state = kangaroo_state;
    kangaroo_state = new_state;
}

function selectState() {
    const rect = kangaroo.getBoundingClientRect();
    if (Math.abs(rect.left - kangaroo_target.x) > 100) {
        changeState(STATE.CHASING);
    } else if (!idle) {
        changeState(STATE.JUMPING);
    } else {
        changeState(STATE.IDLE);
    }
}

function behaviourReducer() {
    selectState();

    if (kangaroo_previous_state == kangaroo_state) return null;
    switch (kangaroo_state) {
        case STATE.CHASING:
            change_image_source(STATE.CHASING);
            stop_jumping();
            go_to_mouse();
            break;
        case STATE.JUMPING:
            if (chase) break_chase();
            change_image_source(STATE.JUMPING);
            start_jumping();
            break;
        default:
            if (chase) break_chase();
            stop_jumping();
            change_image_source(STATE.IDLE);
            break;
    }
}

function go_to_mouse() {
    let left = get_left_value(kangaroo);
    let increment = 45;

    chase = setInterval(function () {
        if (left < kangaroo_target.x - 30) {
            left += increment;
            kangaroo.style.left = left + 'px';
            kangaroo.classList.remove("flip");
        } else if (left > kangaroo_target.x + 30) {
            left -= increment;
            kangaroo.style.left = left + 'px';
            kangaroo.classList.add("flip");
        }
    }, 100);
}

function get_left_value(element) {
    return parseInt(element.style.left.split('px')[0] || 0);
}

function break_chase() {
    clearInterval(chase);
    chase = null;
}

function start_jumping() {
    kangaroo.classList.add("jump");
}

function stop_jumping() {
    kangaroo.classList.remove("jump");
}

function change_image_source() {
    switch (kangaroo_state) {
        case STATE.CHASING:
            src = "./assets/img/kangaroo_chasing.gif";
            break;
        case STATE.JUMPING:
            src = "./assets/img/kangaroo_jumping.gif";
            break;
        default:
            src = "./assets/img/kangaroo_idle.gif";
            break;
    }
    kangaroo_sprite = kangaroo.getElementsByClassName('kangaroo_sprite')[0];
    kangaroo_sprite.src = src;
}