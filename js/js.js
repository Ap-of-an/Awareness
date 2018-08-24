let canvas = document.getElementById("tutorial");
let context = canvas.getContext("2d");
canvas.setAttribute("width", canvas.parentElement.offsetWidth);
canvas.setAttribute("height", canvas.parentElement.offsetHeight);
const RAD_ = Math.PI / 180;
const colors_spark = ["#135fbf", "#75a1ff", "#d6f0ff", "#2088bf"];
context.lineWidth = 0.1;
context.lineCap = 'round';
context.lineJoin = 'round';
let time = 0;
const LT = 1000; //время жизни, за которое снежинка проходит путь от самого начала до конца
class Spark {
  constructor() {
    this.x = getRand(canvas.offsetWidth * 0.2, canvas.offsetWidth * 0.8);
    this.y = 0;
    this.y_0 = getRand(-1, -1);
    this.rot_deg = getRand(-40, 40);
    this.length = getRand(7, 11);
    let a = getX1Y1(this.length, this.rot_deg, this.x, this.y);
    this.deltaX = a.x1;
    this.deltaY = a.y1;
    this.x1 = () => {
      return this.x + this.deltaX
    };
    this.y1 = () => {
      return this.y + this.deltaY
    };
    this.color = getColor();
    // начальная скорость неизвестна - конечная равняется 0
    // vx vy -- начальные скорости
    this.vx = 0;
    this.vy = 2*(canvas.height/LT) - 0; // подразумевается vy пикселей в 1единицу времени ( 10 милисекунд)
    this.ay = (0 - this.vy) / LT;
    this.time = 0;
    }
  render() {
    this.time += 1;
    context.strokeStyle = this.color;
    context.moveTo(this.x, this.y);
    context.lineTo(this.x1(), this.y1());
    
    context.stroke();
    //this.x += this.vx;
    this.y = this.y_0 + this.vy * this.time + this.ay / 2 * this.time ** 2;
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
    /** аналог секундомера */
    (function () {
      let interval = 10;
      let id = setInterval(function () {
        time++;
        draw_Canvas();
      }, interval);
      setInterval(function() {
        time = 0;
        arr_sparks.forEach(el => {
          el.time = 0;
        });
      }, LT*10);
    })()
  } else {
    console.log("Технология Canvas не поддерживается вашим браузером");
    document.querySelector("body").style.backgroundColor = "red";
  }
}

setInterval(() => {
  arr_sparks.push(new Spark());  
}, 5000)

function draw_Canvas() {
  context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  context.beginPath();
  for (const item of arr_sparks) {
    item.render();
  }
  // window.requestAnimationFrame(draw_Canvas);
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
});