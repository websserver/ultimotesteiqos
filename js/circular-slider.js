AFRAME.registerComponent('circular-slider', {
  init: function() {
    // Reordenar os modelos para que modelo2 seja o primeiro (central)
    this.models = [
      this.el.querySelector('#modelo3d-2'),
      this.el.querySelector('#modelo3d-3'),
      this.el.querySelector('#modelo3d-1')
    ];
    
    this.radius = 1.2;
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
      if (index === 0) {
        // Modelo central (primeiro do array)
        model.setAttribute('position', '0 0 0');
        model.setAttribute('rotation', '0 0 0');
        model.setAttribute('scale', '8 8 8');
      } else {
        // Modelos laterais
        const angle = this.currentAngle + ((index - 1) * this.angleStep);
        const x = this.radius * Math.cos(angle);
        const z = this.radius * Math.sin(angle);
        model.setAttribute('position', `${x} 0 ${z}`);
        
        // Rotacionar o modelo para olhar para o centro
        const rotationY = (angle * 180 / Math.PI) + 90;
        model.setAttribute('rotation', `0 ${rotationY} 0`);
        model.setAttribute('scale', '4 4 4');
      }
    });
  },
  
  rotate: function(direction) {
    const step = direction === 'next' ? -this.angleStep : this.angleStep;
    this.currentAngle += step;
    
    // Rotacionar o array de modelos
    if (direction === 'next') {
      this.models.push(this.models.shift());
    } else {
      this.models.unshift(this.models.pop());
    }
    
    this.updatePositions();
  }
}); 