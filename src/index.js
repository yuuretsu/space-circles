import { Layer } from "./lib/layer";
import { distance, lineEnd, angle } from "./lib/math";
import { randChoice, randFloat, randInt } from "./lib/random";

const PI_2 = Math.PI * 2;

const WIDTH = 1;
const HEIGHT = 1;

const SCALE = 3000;

const { canvas, ctx } = new Layer(WIDTH * SCALE, HEIGHT * SCALE);
document.body.appendChild(canvas);
const { canvas: figuresCanvas, ctx: figCtx } = new Layer(WIDTH * SCALE, HEIGHT * SCALE);
figCtx.scale(SCALE, SCALE);


figCtx.globalCompositeOperation = 'screen';

const H = fxrand() * 360;
const MULT = randInt(fxrand, 10, 300);

const a = fxrand() * PI_2;

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {*} points 
 * @param {*} x 
 * @param {*} y 
 * @param {*} r 
 * @returns 
 */
function circle(ctx, x, y, r, d) {
  ctx.lineCap = 'round';
  ctx.globalCompositeOperation =  randChoice(fxrand, ['source-over' ,'destination-out', 'xor']);
  // ctx.globalCompositeOperation =  ['source-over' ,'destination-out'][(d) % 2];
  const S = Math.PI * r ** 2;
  if (r < 0.00005) return;
  ctx.beginPath();
  ctx.arc(x, y, r * fxrand() ** 2, 0, PI_2);
  ctx.closePath();

  // ctx.filter = d % 2 === 0 ? 'invert(1)' : 'none';
  
  // const color = `hsl(${d * MULT + H}, 100%, 50%)`;
  const grad = ctx.createLinearGradient(...lineEnd(x, y, a, r), ...lineEnd(x, y, a, -r));
  grad.addColorStop(0, `hsl(${d * MULT + H}, 100%, 100%)`);
  grad.addColorStop(1, `hsl(${d * MULT + H + 90}, 100%, 0%)`);
  ctx.fillStyle = grad;
  ctx.fill();
  // ctx.lineWidth = 0.001;
  ctx.lineWidth = r * fxrand() ** 2 * 2;
  const grad2 = ctx.createLinearGradient(...lineEnd(x, y, a, r), ...lineEnd(x, y, a, -r));
  grad2.addColorStop(0, `hsl(${d * MULT + H}, 100%, 100%)`);
  grad2.addColorStop(0.5, `hsl(${d * MULT + H + 45}, 10%, 50%)`);
  grad2.addColorStop(1, `hsl(${d * MULT + H + 90}, 100%, 0%)`);
  ctx.strokeStyle = grad2;
  // ctx.strokeStyle = grad
  ctx.stroke();

  const grad1 = ctx.createLinearGradient(...lineEnd(x, y, 0, r), ...lineEnd(x, y, 0, -r));
  grad1.addColorStop(0, `hsla(${d * MULT + H}, 0%, 50%, 0)`);
  grad1.addColorStop(1, `hsla(${d * MULT + H + 90}, 0%, 90%, 0.5)`);

  ctx.strokeStyle = grad1;
  // ctx.strokeStyle = grad
  ctx.stroke();


  const points = [];

  for (let i = 0; i < S * 50000; i++) {
    const newR = randFloat(fxrand, r * 0.05, r * 0.5) ** 1.9 * 5;
    const tor = Math.round(Math.sqrt(fxrand()) * r * 50) / 50;
    const toa = fxrand() * PI_2;
    const newPos = lineEnd(x, y, toa, tor);
    if (points.every(p => distance(...p.pos, ...newPos) > p.radius + newR + r * 0.01)) {
      points.push({ pos: newPos, radius: newR });
      ctx.beginPath();
      ctx.moveTo(...lineEnd(x, y, toa, tor * 0.5));
      ctx.lineTo(...newPos);
      ctx.lineWidth = newR * 0.03;
      ctx.stroke();
      circle(ctx, ...newPos, newR, d + 1);
    }
  }
}


circle(figCtx, ...lineEnd(0.5, 0.5, fxrand() * PI_2, 0), 0.4, 0);

figCtx.globalCompositeOperation = 'xor';
figCtx.strokeStyle = 'gray';
figCtx.lineWidth = 0.001;
const bw = 0.025;
figCtx.strokeRect(bw, bw, 1 - bw * 2, 1 - bw * 2);

const bw2 = 0.02;
figCtx.strokeRect(bw2, bw2, 1 - bw2 * 2, 1 - bw2 * 2);

// const data = figCtx.getImageData(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

// for (let y = 0; y < HEIGHT * SCALE; y++) {
//   for (let x = 0; x < WIDTH * SCALE; x++) {
//     if (fxrand() > 0.5) continue; 
//     const pointer = (x + y * WIDTH * SCALE) * 4;
//     const d = fxrand() * 2;
//     for (let i = 0; i < 3; i++) {
//       data.data[pointer + i] *= d;
//     }
//   }
// }

// figCtx.putImageData(data, 0, 0);

// ctx.fillStyle = `hsl(${H}, 100%, 5%)`;
const grad = ctx.createRadialGradient(0.5, 0.5, 0, 0.5, 0.5, 0.5);
grad.addColorStop(0, `hsl(${H}, 100%, 20%)`)
grad.addColorStop(1, `hsl(${H + 180}, 100%, 20%)`);
ctx.fillStyle = `hsl(${H}, ${50}%, ${5}%)`;
ctx.fillRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

for (let i = 0; i < 10; i++) {
  ctx.filter = `saturate(0) brightness(1) blur(${i ** 2}px) opacity(0.1)`;
  const [x, y] = lineEnd(0, 0, a, i * 5);
  ctx.drawImage(figuresCanvas, i * x, i * y);
}
ctx.filter = 'blur(100px) hue-rotate(0deg)';
ctx.drawImage(figuresCanvas, 0, 0);
ctx.filter = 'contrast(120%)';
ctx.drawImage(figuresCanvas, 0, 0);
// ctx.filter = 'saturate(0%) brightness(0.7) contrast(1000%) blur(200px)';
// ctx.globalCompositeOperation = 'screen';
// ctx.drawImage(figuresCanvas, 0, 0);

const data = ctx.getImageData(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

for (let y = 0; y < HEIGHT * SCALE; y++) {
  for (let x = 0; x < WIDTH * SCALE; x++) {
    if (fxrand() > 0.5) continue; 
    const pointer = (x + y * WIDTH * SCALE) * 4;
    const d = fxrand() * 50 - 25;
    for (let i = 0; i < 3; i++) {
      data.data[pointer + i] += d;
    }
  }
}

ctx.putImageData(data, 0, 0);