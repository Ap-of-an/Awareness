let canvas = document.getElementById("tutorial");
let context = canvas.getContext("2d");
canvas.setAttribute("width", canvas.parentElement.offsetWidth);
canvas.setAttribute("height", canvas.parentElement.offsetHeight);
const RAD_ = Math.PI / 180;
const colors_spark = ["#135fbf", "#75a1ff", "#d6f0ff", "#2088bf"];
context.lineWidth=0.1;
context.lineCap='round';
context.lineJoin='round';
let time = 0;
class Spark {
  constructor() {
    this.x = getRand(10, canvas.offsetWidth*0.8)+0.5;
    this.y = getRand(0, 60)+0.5;
    this.rot_deg = getRand(-40, 40);
    this.length = getRand(7, 19);
    let a = getX1Y1(this.length, this.rot_deg, this.x, this.y);
    this.deltaX = a.x1;
    this.deltaY = a.y1;
    this.x1 = () => { return this.x + this.deltaX };
    this.y1 = () => { return this.y + this.deltaY };
    this.color = getColor();
    this.vx = 0;
    this.vy = 4;
    this.ay = 0.1;
  }
  render() {
    context.strokeStyle = this.color;
    context.moveTo(this.x, this.y);
    context.lineTo(this.x1(), this.y1());
    context.stroke();
    
    this.x += this.vx;
    this.y = this.vy*time - this.ay/2*(time)**2;
  }
}
const N = 25;
let arr_sparks = [];
for (let i = 0; i < N; i++) {
  arr_sparks.push(new Spark());
}


/* описание основных и вспомогательных функций */
function load_canvas() {
  if (canvas.getContext) {
    draw_Canvas();
  } else {
    console.log("Технология Canvas не поддерживается вашим браузером");
    document.querySelector("body").style.backgroundColor = "red";
  }
}
let i = 0;
function draw_Canvas() {
  time++;
  context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  context.beginPath();  
  for (const item of arr_sparks) {
    item.render();
  }
  window.requestAnimationFrame(draw_Canvas);
  // document.querySelector("#in").innerText = i++;
}
function getX1Y1(length, anlge, x, y) {
  let x1 = Math.abs(Math.sin(inRad(anlge))) * length;
  let y1 = Math.cos(inRad(anlge)) * length;
  if (anlge < 0) {
    x1 *= -1;
  }
  return {
    'x1': x1,
    'y1': y1
  };
}
function getColor() {
  return colors_spark[getRand(0, colors_spark.length - 1)];
}
function getRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function inRad(num) {
  return num * RAD_;
}

/* функции прослушки событий */
window.addEventListener("resize", function () {
  canvas.setAttribute("width", canvas.offsetParent.offsetWidth);
  canvas.setAttribute("height", canvas.offsetParent.offsetHeight);
  draw_Canvas();
})