import { Layer } from "./lib/layer";
import { distance, lineEnd, angle } from "./lib/math";
import { randChoice, randFloat, randInt } from "./lib/random";

const PI_2 = Math.PI * 2;

const WIDTH = 1;
const HEIGHT = 1;

const SCALE = 5000;
// const SCALE = 14000;

const { canvas, ctx } = new Layer(WIDTH * SCALE, HEIGHT * SCALE);
document.body.appendChild(canvas);
const { canvas: figuresCanvas, ctx: figCtx } = new Layer(WIDTH * SCALE, HEIGHT * SCALE);
figCtx.scale(SCALE, SCALE);


figCtx.globalCompositeOperation = 'screen';

const H = fxrand() * 360;
const MULT = randInt(fxrand, 10, 300);

const a = fxrand() * PI_2;

const as = fxrand() * 100;
const al = fxrand() ** 1 * 100;

const bs = fxrand() * 100;
const bl = 100 - al;

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
  ctx.globalCompositeOperation =  randChoice(fxrand, ['source-over', 'destination-out', 'xor']);
  // ctx.globalCompositeOperation =  ['source-over' ,'destination-out'][(d) % 2];
  const S = Math.PI * r ** 2;
  if (r < 0.000000001) return;
  ctx.beginPath();
  ctx.arc(x, y, r * fxrand() ** 2 + r * 0.1, 0, PI_2);
  ctx.closePath();

  // ctx.filter = d % 2 === 0 ? 'invert(1)' : 'none';
  
  // const color = `hsl(${d * MULT + H}, 100%, 50%)`;
  const grad = ctx.createLinearGradient(...lineEnd(x, y, a, r), ...lineEnd(x, y, a, -r));
  grad.addColorStop(0, `hsl(${d * MULT + H}, ${as}%, ${al}%)`);
  grad.addColorStop(1, `hsl(${d * MULT + H + 90}, ${bs}%, ${bl}%)`);
  ctx.fillStyle = grad;
  ctx.fill();
  // ctx.lineWidth = 0.001;
  ctx.lineWidth = r * fxrand() ** 2 * 2;
  const grad2 = ctx.createLinearGradient(...lineEnd(x, y, a, r), ...lineEnd(x, y, a, -r));
  grad2.addColorStop(0, `hsla(${d * MULT + H}, ${as}%, ${al}%)`);
  grad2.addColorStop(0.5, `hsl(${d * MULT + H + 45}, 10%, 50%)`);
  grad2.addColorStop(1, `hsl(${d * MULT + H + 90}, ${bs}%, ${bl}%)`);
  ctx.strokeStyle = grad2;
  // ctx.strokeStyle = grad
  ctx.stroke();

  for (let i = 0; i < fxrand() * 10; i++) {
    ctx.beginPath();
    ctx.arc(x, y, r * fxrand() ** 2 + r * 0.1, 0, PI_2);
    ctx.closePath();
  
    // ctx.filter = d % 2 === 0 ? 'invert(1)' : 'none';
    
    // const color = `hsl(${d * MULT + H}, 100%, 50%)`;
    const grad = ctx.createLinearGradient(...lineEnd(x, y, a, r), ...lineEnd(x, y, a, -r));
    grad.addColorStop(0, `hsl(${d * MULT + H}, ${as}%, ${al}%)`);
    grad.addColorStop(1, `hsl(${d * MULT + H + 90 + fxrand() * 180}, ${bs}%, ${bl}%)`);
    ctx.globalCompositeOperation =  'xor';
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // if (['destination-out', 'xor'].includes(ctx.globalCompositeOperation)) {
  if (r > 0.01) {
    ctx.globalCompositeOperation = 'source-over';
    // ctx.strokeStyle = 'rgb(127 127 127)';

    const grad2 = ctx.createLinearGradient(...lineEnd(x, y, a, r), ...lineEnd(x, y, a, -r));
    grad2.addColorStop(0, `hsla(${d * MULT + H}, ${as}%, ${al}%)`);
    grad2.addColorStop(0.5, `hsl(${d * MULT + H + 90}, 5%, 50%)`);
    grad2.addColorStop(1, `hsl(${d * MULT + H + 180}, ${bs}%, ${bl}%)`);
    ctx.strokeStyle = grad2;

    ctx.beginPath();
    ctx.arc(x, y, r * fxrand() ** 2 + ctx.lineWidth / 2, 0, PI_2);
    ctx.closePath();
    ctx.lineWidth = 0.002;
    ctx.stroke();
  }

  // const grad1 = ctx.createLinearGradient(...lineEnd(x, y, 0, r), ...lineEnd(x, y, 0, -r));
  // grad1.addColorStop(0, `hsla(${d * MULT + H * 2}, 100%, 50%, 0)`);
  // grad1.addColorStop(1, `hsla(${d * MULT + H * 2 + 45}, 0%, 90%, 0.1)`);

  // ctx.strokeStyle = grad1;
  // // ctx.strokeStyle = grad
  // ctx.stroke();


  const points = [];

  const rings = Math.round(fxrand() * 20 + 30);
  for (let i = 0; i < S * 50000; i++) {
    const newR = randFloat(fxrand, r * 0.05, r * 0.5) ** 2.1 * 5;
    const tor = Math.round(Math.sqrt(fxrand()) * r * rings) / rings;
    const toa = fxrand() * PI_2;
    const newPos = lineEnd(x, y, toa, tor);
    if (points.every(p => distance(...p.pos, ...newPos) > p.radius + newR + r * 0.02)) {
      points.push({ pos: newPos, radius: newR });
      ctx.beginPath();
      const from = lineEnd(x, y, toa, tor * 0.5);
      ctx.moveTo(...from);
      ctx.lineTo(...newPos);
      ctx.lineWidth = newR * 0.03;
      const grad = ctx.createLinearGradient(...from, ...newPos);
      grad.addColorStop(0, `hsla(${d * MULT + H}, ${as}%, ${al}%, 0)`);
      grad.addColorStop(1, `hsl(${d * MULT + H + 180}, ${bs}%, ${bl}%)`);
      ctx.strokeStyle = grad;
      ctx.globalCompositeOperation = 'source-over';
      ctx.stroke();
      circle(ctx, ...newPos, newR, d + 1);
    }
  }
}

console.time('1');
circle(figCtx, ...lineEnd(0.5, 0.5, fxrand() * PI_2, 0), 0.4, 0);
console.timeEnd('1');

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

// for (let i = 0; i < 5; i++) {
//   ctx.filter = `saturate(0) brightness(1) blur(${i ** 2}px) opacity(0.1)`;
//   const [x, y] = lineEnd(0, 0, a, i * 5);
//   ctx.drawImage(figuresCanvas, i * x, i * y);
//   // const [x2, y2] = lineEnd(0, 0, a - Math.PI / 2, i * 5);
//   // ctx.drawImage(figuresCanvas, i * x2, i * y2);
// }
// ctx.filter = 'blur(100px) hue-rotate(0deg)';
// ctx.drawImage(figuresCanvas, 0, 0);
// ctx.filter = 'contrast(120%)';
// ctx.drawImage(figuresCanvas, 0, 0);
// ctx.filter = `saturate(0%) brightness(0.6) contrast(500%) blur(${SCALE / 20}px) brightness(2)`;
// ctx.globalCompositeOperation = 'screen';
ctx.drawImage(figuresCanvas, 0, 0);

// const data = ctx.getImageData(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

// for (let y = 0; y < HEIGHT * SCALE; y++) {
//   for (let x = 0; x < WIDTH * SCALE; x++) {
//     // if (fxrand() > 0.5) continue; 
//     const pointer = (x + y * WIDTH * SCALE) * 4;
//     const d = fxrand() * 30 - 15;
//     for (let i = 0; i < 3; i++) {
//       data.data[pointer + i] += d;
//     }
//   }
// }

// ctx.putImageData(data, 0, 0);