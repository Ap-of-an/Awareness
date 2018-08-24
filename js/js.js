class Spark {
  constructor() {
    this.x = getRand(canvas.width*0.1, canvas.width*0.8);
    this.y = 0;
    this.length = getRand(6, 15);
    this.rotate_deg0 = getRand(-40, 40);
    let temp = get_dx_dy(this.length, this.rotate_deg0, this.x, this.y);
    this.x1 = () => { return this.x + temp.dx};
    this.y1 = () => { return this.y + temp.dy};
    this.v_angle = getRand(1,10) / 10;
    this.vy = 2;
    this.vx = 0;//() => { return this.vy*this.v_angle };
    this.lw = 0.7;
  }

  func_moving() {}

  create() {
    context.beginPath();
    context.lineWidth = this.lw;
    context.moveTo(this.x, this.y);
    context.lineTo(this.x1(), this.y1());
    context.stroke();
    context.closePath();
    this.func_moving();    
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
      el.func_moving = function() {
        el.y += el.vy;
      }
    });
  }

  render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.movingDown();
    this.array.forEach(el => {
      el.create();
      if(el.y > canvas.parentElement.offsetHeight*0.4 && el.lw > 0.05) {
        el.lw -= 0.005;        
      }
    }); 
    
    // window.requestAnimationFrame(this.render); 
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
context.lineCap = 'round';
context.lineJoin = 'round';
context.strokeStyle='#75a1ff';
let bg_anim = new Sparks(1);
document.body.onload = function() {
  setInterval(()=> {
    bg_anim.render();
  }, 50);
  setInterval(() => {
    bg_anim.array.push(new Spark());
    if(bg_anim.array.length > 66) {
      bg_anim.array.shift();
    }
  }, 200)
}