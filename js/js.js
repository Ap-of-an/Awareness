class Spark {
  constructor() {
    this.x = getRand(canvas.width*0.1, canvas.width*0.83);
    this.y = -10;
    this.length = getRand(6, 15);
    this.rotate_deg0 = getRand(-40, 40);
    let temp = get_dx_dy(this.length, this.rotate_deg0, this.x, this.y);
    this.x1 = () => { return this.x + temp.dx};
    this.y1 = () => { return this.y + temp.dy};
    this.v_angle = getRand(-5,5) / 10;
    this.vy = getRand(2, 4);
    this.vx = 1;
    this.lw = 0.7;
    this.temp = canvas.width*0.5;
    this.temp1 = this.temp - this.x;
    this.flag_middle = true;
  }

  create() {
    context.beginPath();
    context.lineWidth= this.lw;
    context.save();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x1(), this.y1());
    context.stroke();
    context.strokeStyle = 'blue';
    context.lineWidth = this.lw*1.2;
    context.globalAlpha=0.2;
    context.moveTo(this.x1()-1.1, this.y1()-1.1);
    context.lineTo(this.x-1.1, this.y-1.1);
    context.stroke();
    context.restore();
    context.closePath();    
  }
}

class Sparks {

  constructor(count_of_sparks) {
    this.array = [];
    for(let i =0; i < count_of_sparks; i++) {
      this.array.push(new Spark());
    }
  }
  
  movingDown() {
    this.array.forEach(el => {
      el.y += el.vy;
    });
  }

  movingAnglRand() {
    this.array.forEach(el => {
      el.y += el.vy;
      if(el.x <= canvas.width*0.1 || el.x >= canvas.width*0.83) {
        el.v_angle *= -1; // меняем направление движения
      }
      el.x += el.vx*el.v_angle;
    });
  }

  render() {    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    this.array.forEach(el => {
      if(el.y > canvas.height*0.5 ) {
        if(el.flag_middle) {
          el.temp = canvas.width*0.5;
          el.temp1 = el.temp - el.x;
          el.v_angle = el.v_angle >= 0 ? el.v_angle : el.v_angle *= -1;
          el.vx = el.temp1 / (canvas.height*0.5 / el.vy);
          el.flag_middle = false;
        }
        if(el.lw >= 0.01) {
          el.lw -= 0.006;
        }
        else {
          el.y = -10;
          el.x = getRand(canvas.width*0.1, canvas.width*0.83);  
          el.lw = 0.7;
          el.vx = 1;
          el.flag_middle = true;
        }
      }
      el.create();      
    });
    this.movingAnglRand();
  }
}
function get_dx_dy(length, anlge, x, y) {
  let dx = Math.abs(Math.sin(inRad(anlge))) * length;
  let dy = Math.cos(inRad(anlge)) * length;
  if (anlge < 0) {
    dx *= -1;
  }
  return {
    dx: dx,
    dy: dy
  };
}

function getColor() {
  return colors_spark[getRand(0, colors_spark.length - 1)];
}

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const RAD_ = Math.PI / 180;
function inRad(num) {
  return num * RAD_;
}

let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
canvas.setAttribute("width", canvas.parentElement.offsetWidth);
canvas.setAttribute("height", canvas.parentElement.offsetHeight);
context.strokeStyle='#fff';

let bg_anim = new Sparks(1);
const MAX_SPARKS = 200;
let allCircles = document.getElementsByClassName("circle");
document.body.onload = function() {
  setInterval(()=> {
    bg_anim.render();
    if(bg_anim.array.length < MAX_SPARKS) {
      let n_rand = getRand(0, 1);
      for(let i = 0; i < n_rand; i++) {
        bg_anim.array.push(new Spark());
      }
    }
  }, 50);
  for (const item of allCircles) {
    item.style.width = item.offsetHeight + "px";
  }  
  setPosChildrenCircles(document.getElementById("main_circle"));
}

function offsetX_circle(a) {
  let r = a.offsetHeight/2;
  return r + Math.cos(Math.PI / 4) * r;
}
function offsetY_circle(a) {
  let r = a.offsetHeight/2;
  return Math.sin(Math.PI / 4) * r;
}

function indexInParent(el) {
  let i;
  for (i = 0; i < el.offsetParent.children.length; i++) {
    if(el == el.offsetParent.children[i]) {
      break;
    }
  }
  return i;
}
/**
 * 
 * @param {HTMLElement} parent - родительский элемент, внутри которого круги
 */
function setPosChildrenCircles(parent) {
  let childres = parent.children;
  let R = parseInt(parent.style.width) / 2;
  for(let i = 0; i < childres.length; i++) {
    childres[i].style.left = (R + Math.cos(Math.PI/4 * i) * R) - childres[i].offsetHeight/2 + "px";
    childres[i].style.top = (R - Math.sin(Math.PI/4 * i) * R) - childres[i].offsetHeight/2 + "px";
    childres[i].style.transform = "none";
  }
}

class Circle {
  constructor() {

  }
}

class MainCircle {
  /**
   * 
   * @param {HTMLElement} main Главная окружность
   */
  constructor(main) {
    let countOfChildren = main.childElementCount;
    for (let i = 0; i < countOfChildren; i++) {
      this[i] = new Circle();
    }
  }
}

let app = new MainCircle(document.getElementById("main_circle"));
console.log(app);
