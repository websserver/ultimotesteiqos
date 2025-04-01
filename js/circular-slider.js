AFRAME.registerComponent('circular-slider', {
  init: function() {
    this.models = [
      this.el.querySelector('#modelo3d-1'),
      this.el.querySelector('#modelo3d-2'),
      this.el.querySelector('#modelo3d-3')
    ];
    
    this.radius = 0.5; // Raio do círculo
    this.currentAngle = 0;
    this.angleStep = (2 * Math.PI) / this.models.length;
    
    // Posicionar os modelos inicialmente
    this.updatePositions();
    
    // Adicionar listeners para os botões
    document.getElementById('prev-button').addEventListener('click', () => this.rotate('prev'));
    document.getElementById('next-button').addEventListener('click', () => this.rotate('next'));
  },
  
  updatePositions: function() {
    this.models.forEach((model, index) => {
      const angle = this.currentAngle + (index * this.angleStep);
      const x = this.radius * Math.cos(angle);
      const z = this.radius * Math.sin(angle);
      model.setAttribute('position', `${x} 0 ${z}`);
      
      // Rotacionar o modelo para olhar para o centro
      const rotationY = (angle * 180 / Math.PI) + 90;
      model.setAttribute('rotation', `0 ${rotationY} 0`);
    });
  },
  
  rotate: function(direction) {
    const step = direction === 'next' ? -this.angleStep : this.angleStep;
    this.currentAngle += step;
    this.updatePositions();
  }
}); 