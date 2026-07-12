const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".project-card");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const active = filter.dataset.filter;
    filters.forEach((button) => button.classList.toggle("active", button === filter));
    cards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.classList.toggle("is-hidden", active !== "all" && !tags.includes(active));
    });
  });
});

const canvas = document.getElementById("scienceCanvas");
const ctx = canvas.getContext("2d");
const nodes = Array.from({ length: 54 }, (_, index) => ({
  angle: (Math.PI * 2 * index) / 54,
  radius: 82 + (index % 9) * 23,
  speed: 0.002 + (index % 7) * 0.0005,
  size: 2 + (index % 5) * 0.7,
}));

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function draw(time) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2 - 18;

  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#101815");
  gradient.addColorStop(0.48, "#17342d");
  gradient.addColorStop(1, "#1f4f55");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let ring = 1; ring < 6; ring += 1) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, ring * 48, ring * 28, -0.36, 0, Math.PI * 2);
    ctx.stroke();
  }

  const positions = nodes.map((node, index) => {
    const wobble = Math.sin(time * 0.001 + index) * 10;
    const angle = node.angle + time * node.speed;
    return {
      x: cx + Math.cos(angle) * (node.radius + wobble),
      y: cy + Math.sin(angle) * (node.radius * 0.58 + wobble * 0.35),
      size: node.size,
    };
  });

  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const dx = positions[i].x - positions[j].x;
      const dy = positions[i].y - positions[j].y;
      const distance = Math.hypot(dx, dy);
      if (distance < 92) {
        ctx.strokeStyle = `rgba(142, 216, 195, ${0.18 - distance / 720})`;
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[j].x, positions[j].y);
        ctx.stroke();
      }
    }
  }

  positions.forEach((point, index) => {
    ctx.fillStyle = index % 4 === 0 ? "#f5c66d" : index % 3 === 0 ? "#ea8f89" : "#8ed8c3";
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "800 13px Inter, sans-serif";
  ctx.fillText("Scientific data", 28, 42);
  ctx.fillText("ML surrogate", width - 138, 72);
  ctx.fillText("AI reasoning", width - 130, height - 108);

  requestAnimationFrame(draw);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(draw);
