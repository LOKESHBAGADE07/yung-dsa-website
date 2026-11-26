/* An original portrait poster. Retailer and artist photography stay on their source pages. */
window.renderFitCard = function renderFitCard({ frames, lowers, total, budget, date }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  const money = amount => '₹' + amount.toLocaleString('en-IN');
  const inks = { coal: '#313632', blue: '#315471', cream: '#a47943', ice: '#557888' };
  function text(value, x, y, font, color) {
    ctx.font = font; ctx.fillStyle = color; ctx.fillText(value, x, y);
  }
  function piece(product, category, y) {
    ctx.fillStyle = inks[product.tone] || '#3c5148';
    ctx.fillRect(64, y, 20, 148);
    text(category.toUpperCase(), 112, y + 33, '600 24px sans-serif', '#4e574c');
    let fontSize = 48;
    while (fontSize > 24) {
      ctx.font = 'bold ' + fontSize + 'px sans-serif';
      if (ctx.measureText(product.name).width < 835) break;
      fontSize -= 2;
    }
    text(product.name, 112, y + 91, ctx.font, '#18271d');
    text(product.merchant + '  /  ' + money(product.price), 112, y + 136, '30px sans-serif', '#37463c');
  }
  ctx.fillStyle = '#f4f1e8'; ctx.fillRect(0, 0, 1080, 1350);
  ctx.fillStyle = '#203d2c'; ctx.fillRect(0, 0, 1080, 435);
  ctx.save(); ctx.strokeStyle = '#34533c'; ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath(); ctx.ellipse(990, 94, 108 + i * 22, 240 + i * 15, -.51, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
  text('YUNGDSA.COM', 64, 80, 'bold 30px sans-serif', '#e1e8cd');
  text('06', 55, 332, 'bold 275px sans-serif', '#f4f1e8');
  text('Fit Check', 376, 328, 'italic 145px Georgia, serif', '#dce8ba');
  text('SUNGLASSES + LOWERS', 65, 398, '26px sans-serif', '#e1e8cd');
  piece(frames, 'Sunglasses', 508);
  piece(lowers, 'Lowers', 715);
  ctx.fillStyle = '#acb1a1'; ctx.fillRect(64, 922, 952, 2);
  text('PAIR TOTAL', 64, 1002, 'bold 26px sans-serif', '#485647');
  text(money(total), 57, 1133, 'bold 126px sans-serif', '#203d2c');
  const difference = budget - total;
  const balance = difference === 0 ? 'On budget' : money(Math.abs(difference)) + (difference < 0 ? ' over budget' : ' under budget');
  text(balance + '  ·  ' + money(budget) + ' budget', 65, 1194, '35px sans-serif', '#354535');
  text('Similar styles  ·  Prices checked ' + date, 65, 1288, '27px sans-serif', '#4e574c');
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG encoding failed')), 'image/png'));
};
