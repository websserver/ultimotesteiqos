AFRAME.registerComponent('circular-slider', {
  init: function() {
    this.models = [
      this.el.querySelector('#modelo3d-2'),
      this.el.querySelector('#modelo3d-3'),
      this.el.querySelector('#modelo3d-1')
    ];
    
    this.totalModels = this.models.length;
    this.currentIndex = 0;
    this.radius = 3; // Aumentado para maior efeito de profundidade
    this.rotationY = 0;
    this.rotationStep = 360 / this.totalModels;
    this.isAnimating = false;
    
    // Container para girar todos os modelos como uma unidade
    this.container = document.createElement('a-entity');
    this.el.appendChild(this.container);
    this.models.forEach(model => this.container.appendChild(model));
    
    // Configurar materiais e posições iniciais
    this.models.forEach((model, index) => {
      model.addEventListener('model-loaded', () => {
        const obj = model.getObject3D('mesh');
        if (obj) {
          obj.traverse((node) => {
            if (node.isMesh) {
              node.material = node.material.clone();
              node.material.transparent = true;
              node.material.needsUpdate = true;
            }
          });
        }
      });
      
      // Posicionar cada modelo em seu ângulo inicial
      this.updateModelPosition(model, index);
    });
    
    this.updatePositions();
    
    document.getElementById('prev-button').addEventListener('click', () => {
      if (!this.isAnimating) this.rotate('prev');
    });
    document.getElementById('next-button').addEventListener('click', () => {
      if (!this.isAnimating) this.rotate('next');
    });
  },

  updateModelPosition: function(model, index) {
    const angle = (index * 2 * Math.PI) / this.totalModels;
    const x = this.radius * Math.sin(angle);
    const z = this.radius * Math.cos(angle);
    
    // Adicionar um pequeno deslocamento em Y para criar efeito de arco
    const y = -0.5 * Math.sin(angle * 2);
    
    model.setAttribute('position', `${x} ${y} ${z}`);
    
    // Rotação suave para sempre apontar ligeiramente para cima
    const rotationY = (angle * 180 / Math.PI) + 180;
    const rotationX = -15; // Inclinar ligeiramente para cima
    model.setAttribute('rotation', `${rotationX} ${rotationY} 0`);
  },
  
  updatePositions: function() {
    // Atualizar a rotação do container com efeito de inclinação
    const tiltAngle = 5 * Math.sin(this.rotationY * Math.PI / 180);
    this.container.setAttribute('rotation', `${tiltAngle} ${this.rotationY} 0`);
    
    // Atualizar aparência dos modelos baseado em suas posições
    this.models.forEach((model, index) => {
      const baseAngle = (index * 360) / this.totalModels;
      const currentAngle = (baseAngle + this.rotationY) % 360;
      
      // Calcular a distância angular do centro (180 graus é a frente)
      const angleFromCenter = Math.abs(((currentAngle - 180 + 540) % 360) - 180);
      const normalizedDistance = angleFromCenter / 180;
      
      // Efeito de profundidade mais pronunciado
      const zOffset = -normalizedDistance * 0.5;
      const currentPos = model.getAttribute('position');
      model.setAttribute('position', `${currentPos.x} ${currentPos.y} ${currentPos.z + zOffset}`);
      
      if (angleFromCenter < 45) { // Zona frontal mais ampla
        // Escala maior para o modelo frontal
        model.setAttribute('scale', '7 7 7');
        const obj = model.getObject3D('mesh');
        if (obj) {
          obj.traverse((node) => {
            if (node.isMesh) {
              node.material.opacity = 1;
              node.material.transparent = false;
              node.renderOrder = 2;
            }
          });
        }
      } else {
        // Transição mais suave para modelos laterais
        const scale = 2.5 + (1 - normalizedDistance) * 3;
        const opacity = 0.4 + (1 - normalizedDistance) * 0.6;
        
        model.setAttribute('scale', `${scale} ${scale} ${scale}`);
        const obj = model.getObject3D('mesh');
        if (obj) {
          obj.traverse((node) => {
            if (node.isMesh) {
              node.material.opacity = opacity;
              node.material.transparent = true;
              node.renderOrder = 1;
            }
          });
        }
      }
    });
  },
  
  rotate: function(direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    // Calcular nova rotação
    const step = direction === 'next' ? -this.rotationStep : this.rotationStep;
    const targetRotation = (this.rotationY + step + 360) % 360;
    
    // Criar animação de rotação com efeito de mola
    const animation = {
      property: 'rotation.y',
      from: this.container.getAttribute('rotation').y,
      to: targetRotation,
      dur: 1000,
      easing: 'easeOutElastic', // Efeito de mola
      elasticity: 800 // Controle do efeito de mola
    };
    
    this.container.setAttribute('animation__rotate', animation);
    
    // Atualizar rotação atual
    this.rotationY = targetRotation;
    
    // Atualizar índice atual
    this.currentIndex = (this.currentIndex + (direction === 'next' ? 1 : -1) + this.totalModels) % this.totalModels;
    
    // Atualizar aparência dos modelos durante a animação
    const updateInterval = setInterval(() => {
      this.updatePositions();
    }, 16);
    
    // Limpar intervalo e estado de animação
    setTimeout(() => {
      clearInterval(updateInterval);
      this.updatePositions();
      this.isAnimating = false;
    }, 1200);
  }
}); 