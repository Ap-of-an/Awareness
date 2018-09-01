class Spark {
  constructor() {
    this.x = getRand(canvas.width * 0.1, canvas.width * 0.83);
    this.y = -10;
    this.length = getRand(6, 15);
    this.rotate_deg0 = getRand(-40, 40);
    let temp = get_dx_dy(this.length, this.rotate_deg0, this.x, this.y);
    this.x1 = () => {
      return this.x + temp.dx
    };
    this.y1 = () => {
      return this.y + temp.dy
    };
    this.v_angle = getRand(-5, 5) / 10;
    this.vy = getRand(2, 4);
    this.vx = 1;
    this.lw = 0.7;
    this.temp = canvas.width * 0.5;
    this.temp1 = this.temp - this.x;
    this.flag_middle = true;
  }

  create() {
    context.beginPath();
    context.lineWidth = this.lw;
    context.save();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x1(), this.y1());
    context.stroke();
    context.strokeStyle = 'blue';
    context.lineWidth = this.lw * 1.2;
    context.globalAlpha = 0.2;
    context.moveTo(this.x1() - 1.1, this.y1() - 1.1);
    context.lineTo(this.x - 1.1, this.y - 1.1);
    context.stroke();
    context.restore();
    context.closePath();
  }
}

class Sparks {

  constructor(count_of_sparks) {
    this.array = [];
    for (let i = 0; i < count_of_sparks; i++) {
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
      if (el.x <= canvas.width * 0.1 || el.x >= canvas.width * 0.83) {
        el.v_angle *= -1; // меняем направление движения
      }
      el.x += el.vx * el.v_angle;
    });
  }

  render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    this.array.forEach(el => {
      if (el.y > canvas.height * 0.5) {
        if (el.flag_middle) {
          el.temp = canvas.width * 0.5;
          el.temp1 = el.temp - el.x;
          el.v_angle = el.v_angle >= 0 ? el.v_angle : el.v_angle *= -1;
          el.vx = el.temp1 / (canvas.height * 0.5 / el.vy);
          el.flag_middle = false;
        }
        if (el.lw >= 0.01) {
          el.lw -= 0.006;
        } else {
          el.y = -10;
          el.x = getRand(canvas.width * 0.1, canvas.width * 0.83);
          el.lw = 0.7;
          el.vx = 1;
          el.flag_middle = true;
        }
      }
      el.create();
    });
    this.movingAnglRand();
  }

  start() {
    setInterval(() => {
      this.render();
      if (this.array.length < MAX_SPARKS) {
        let n_rand = getRand(0, 1);
        for (let i = 0; i < n_rand; i++) {
          this.array.push(new Spark());
        }
      }
    }, 50);
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

function move_forward(el) {
  el.style.left = Math.round(el.x1) + "px";
  el.style.top = Math.round(el.y1) + "px";
}

function move_backward(el) {
  el.style.left = Math.round(el.x) + "px";
  el.style.top = Math.round(el.y) + "px";
}
class ModelCircle {
  /**
   * @param {HTMLElement} main главный круг
   */
  constructor(main) {
    let temp = main.offsetHeight / 2;
    this.x_center = temp;
    this.y_center = temp;
    this.radius = temp;
    this.main = main;
    this.sizeCircle = 110;
    this.initFirstChilds();
    for (const item of main.children) {
      this.initAllChildrenOfFirstChilds(item);
    }
  }
  /**
   * инициализания первоначальных кругов
   */
  initFirstChilds() {
    let children = this.main.children;
    let r = this.main.childElementCount ? children[0].offsetHeight / 2 : 0;
    let angleChange = 360 / children.length;
    for (let i = 0, j = 0; i < children.length; i++, j += angleChange) {
      /* располагаем первые круги по центру основного круга */
      children[i].x = this.radius - r;
      children[i].y = this.radius - r;
      move_backward(children[i]); // помещаем круги в центр главного круга
      let temp = this.posXY(j);
      children[i].x1 = temp[1];
      children[i].y1 = temp[2];
      children[i].angle = j;
    }
  }
  /**
   * инициализания координат всех вложенных кругов
   */
  initAllChildrenOfFirstChilds(circle) {
    let numberOfChild = circle.childElementCount;
    let delta_angle = Math.floor(360 / (numberOfChild + 1));
    let angle = 0;
    for (let i = 0; i < numberOfChild; i++) {
      let child = circle.children[i];
      angle = circle.angle + delta_angle * (i + 1);
      angle = angle > 360 ? angle - 360 : angle;
      let temp = this.posXY(angle);
      temp[1] -= circle.x1;
      temp[2] -= circle.y1;
      this.setParametrs(0, 0, temp[1], temp[2], angle, child);

      this.initAllChildrenOfFirstChilds(child);
    }
  }
  setParametrs(x, y, x1, y1, angle, obj) {
    obj.x = x;
    obj.y = y;
    obj.x1 = x1;
    obj.y1 = y1;
    obj.angle = angle;
  }
  /**
   * @param {number} anlge Угол в градусах, показывающий место для расположение окружности
   */
  circlePosXY(anlge) {
    return {
      'x': Math.cos(inRad(anlge)) * this.radius,
      'y': Math.sin(inRad(anlge)) * this.radius
    }
  }
  posXY(anlge) {
    let temp = this.circlePosXY(anlge);
    let xR = temp.x,
      yR = temp.y;
    let x_lt = Math.round(this.x_center + xR) - this.sizeCircle / 2;
    let y_lt = Math.round(this.y_center - yR) - this.sizeCircle / 2;
    return {
      1: x_lt,
      2: y_lt
    };
  }
  start() {
    let i = 0;
    let temp = setInterval(() => {
      this.main.children[i].classList.add("show");
      move_forward(this.main.children[i++]);
      if (i == this.main.childElementCount)
        clearInterval(temp);
    }, 100);
  }
  addStartButton() {
    let st_btn = document.createElement("div");
    st_btn.classList.add("pulsation");
    this.main.appendChild(st_btn);

    let start1 = () => {
      bg_anim.start();
      this.main.classList.add("grow");
      st_btn.removeEventListener("click", start1);

      setTimeout(() => {
        this.main.removeChild(st_btn);
      }, 2800); // 1000 + 8*100

      setTimeout(() => {
        st_btn.classList.add("lessening");
        this.start();
      }, 1000);
    }
    st_btn.addEventListener("click", start1);
  }
  /**
   * 
   * @param {HTMLElement} circle 
   */
  addEventClicks() {
    let temp = document.querySelectorAll(".circle");
    for (const item of temp) {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        if(!this.childElementCount) { 
          console.log(this);
          return;
        }        
        if (this.classList.contains("active")) { //если круг уже выбран, возвращаемся на уровень выше
          if(this.parentElement.classList.contains("opac")) {
            this.parentElement.classList.remove("opac");
            this.parentElement.classList.add("show");
          }
          this.classList.remove("active");
          for (const item of this.children) {
            item.classList.remove("show");
            move_backward(item);
          }
          for (const item of this.parentElement.children) {
            if (item != this) {
              item.classList.add("show");
            }
          }
        }
        else { // если нажимают на круг
          if(this.parentElement.classList.contains("active")) {
            this.parentElement.classList.remove("show");
            setTimeout(()=>{this.parentElement.classList.add("opac");}, 1000);
          }
          this.classList.add("active");
          for (const item of this.parentElement.children) {
            if (item != this) {
              item.classList.remove("show");
            }
          }
          for (const item of this.children) {
            item.classList.add("show");
            move_forward(item);
          }
        }
      }, false);
    }
  }
}



let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
canvas.setAttribute("width", canvas.parentElement.offsetWidth);
canvas.setAttribute("height", canvas.parentElement.offsetHeight);
context.strokeStyle = '#fff';

let bg_anim = new Sparks(1);
const MAX_SPARKS = 200;

document.body.onload = function () {


  let main_c = document.querySelector("#main_circle");
  let a = new ModelCircle(main_c);
  // console.log(main_c.children[0].firstChild.textContent.trim());

  a.addStartButton();
  a.addEventClicks();
}