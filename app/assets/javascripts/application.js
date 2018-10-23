//= require rails-ujs
//= require_tree .
//= require jquery

const btn = document.querySelector('button');
let ctx;


html2canvas(btn).then(canvas => {
   ctx = canvas.getContext('2d');

   createParticleCanvas();

   let reductionFactor = 17;
   btn.addEventListener('click', e => {
      // Get color data
      let width = btn.offsetWidth;
      let height = btn.offsetHeight;
      let colorData = ctx.getImageData(0, 0, width, height).data;

      // Keep track of iterations to reduce number of created particles
      let count = 0;

      // Create a particle in every button location
      for(let localX = 0; localX < width; localX++) {
         for(let localY = 0; localY < height; localY++) {
            if(count % reductionFactor === 0) {
               let index = (localY * width + localX) * 4;
               let rgbaColorArr = colorData.slice(index, index + 4);

               let bcr = btn.getBoundingClientRect();
               let globalX = bcr.left + localX;
               let globalY = bcr.top + localY;

               createParticleAtPoint(globalX, globalY, rgbaColorArr);
            }
            count++;
         }
      }
   });
});

// Create an exploding particle effect
const ExplodingParticle = function() {
   // Particle animation duration
   this.animationDuration = 1000;

   // Particle speed
   this.speed = {
      x: -5 + Math.random() * 10,
      y: -5 + Math.random() * 10
   }

   // Particle size
   this.radius = 5 + Math.random() * 5;

   // Particle lifespan
   this.life = 30 + Math.random() * 10;
   this.remainingLife = this.life;

   // Called by animation logic
   this.draw = ctx => {
      let p = this;

      if(this.remainingLife > 0 && this.radius > 0) {
         // Draw a circle at the current location
         ctx.beginPath();
         ctx.arc(p.startX, p.startY, p.radius, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, 1)`;
         ctx.fill();

         // Update the particle's location and life
         p.remainingLife--;
         p.radius -= 0.25;
         p.startX += p.speed.x;
         p.startY += p.speed.y;
      }
   }
};


let particles = [];
// Create a particle factory
function createParticleAtPoint(x, y, colorData) {
   let particle = new ExplodingParticle();

   particle.rgbArray = colorData;
   particle.startX = x;
   particle.startY = y;
   particle.startTime = Date.now();

   particles.push(particle);
}


let particleCanvas, particleCtx;
function createParticleCanvas() {
   // Create canvas
   particleCanvas = document.createElement('canvas');
   particleCtx = particleCanvas.getContext("2d");

   // Size canvas
   particleCanvas.width = window.innerWidth;
   particleCanvas.height = window.innerHeight;

   // Position canvas
   particleCanvas.style.position = 'absolute';
   particleCanvas.style.top = '0';
   particleCanvas.style.left = '0';

   // Move canvas on top of other elements
   particleCanvas.style.zIndex = '1001';

   // Make elements under canvas clickable
   particleCanvas.style.pointerEvents = 'none';

   // Add canvas to page
   document.body.appendChild(particleCanvas);
}

// Add animation logic
function update() {
   // Clear old particles
   if(typeof particleCtx !== 'undefined') {
      particleCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
   }

   // Draw particles in new location
   for(let i = 0; i < particles.length; i++) {
      particles[i].draw(particleCtx);

      // Clean up if the last particle has finished animating
      if(i === particles.length - 1) {
         let percent = (Date.now() - particles[i].startTime) / particles.animationDuration;

         if(percent > 1) particles = [];
      }
   }

   // Animate performantly
   window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
