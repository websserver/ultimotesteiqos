AFRAME.registerComponent('circular-slider', {
  init: function() {
    this.models = [
      this.el.querySelector('#modelo3d-2'),
      this.el.querySelector('#modelo3d-3'),
      this.el.querySelector('#modelo3d-1')
    ];
    
    this.totalModels = this.models.length;
    this.currentIndex = 0;
    this.radius = 2.5;
    this.rotationY = 0;
    this.rotationStep = 360 / this.totalModels;
    
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
      const angle = (index * 2 * Math.PI) / this.totalModels;
      const x = this.radius * Math.sin(angle);
      const z = this.radius * Math.cos(angle);
      model.setAttribute('position', `${x} 0 ${z}`);
      
      // Sempre apontar para fora do círculo
      const rotationY = (angle * 180 / Math.PI) + 180;
      model.setAttribute('rotation', `0 ${rotationY} 0`);
    });
    
    this.updatePositions();
    
    document.getElementById('prev-button').addEventListener('click', () => this.rotate('prev'));
    document.getElementById('next-button').addEventListener('click', () => this.rotate('next'));
  },
  
  updatePositions: function() {
    // Atualizar a rotação do container
    this.container.setAttribute('rotation', `0 ${this.rotationY} 0`);
    
    // Atualizar aparência dos modelos baseado em suas posições
    this.models.forEach((model, index) => {
      const baseAngle = (index * 360) / this.totalModels;
      const currentAngle = (baseAngle + this.rotationY) % 360;
      
      // Calcular a distância angular do centro (180 graus é a frente)
      const angleFromCenter = Math.abs(((currentAngle - 180 + 540) % 360) - 180);
      const normalizedDistance = angleFromCenter / 180;
      
      if (angleFromCenter < 30) { // Modelo na frente
        model.setAttribute('scale', '6 6 6');
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
        // Escala e opacidade suaves baseadas na posição
        const scale = 3 + (1 - normalizedDistance) * 2;
        const opacity = 0.6 + (1 - normalizedDistance) * 0.4;
        
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
      
      // Manter a orientação correta durante a rotação
      const worldRotation = model.getAttribute('rotation').y;
      model.setAttribute('rotation', `0 ${worldRotation} 0`);
    });
  },
  
  rotate: function(direction) {
    // Calcular nova rotação
    const step = direction === 'next' ? -this.rotationStep : this.rotationStep;
    this.rotationY = (this.rotationY + step + 360) % 360;
    
    // Animar a rotação suavemente
    const startRotation = this.container.getAttribute('rotation').y;
    const endRotation = this.rotationY;
    
    // Criar animação de rotação
    this.container.setAttribute('animation__rotate', {
      property: 'rotation.y',
      from: startRotation,
      to: endRotation,
      dur: 800,
      easing: 'easeInOutQuad'
    });
    
    // Atualizar índice atual
    this.currentIndex = (this.currentIndex + (direction === 'next' ? 1 : -1) + this.totalModels) % this.totalModels;
    
    // Atualizar aparência dos modelos durante a animação
    const animation = setInterval(() => {
      this.updatePositions();
    }, 16);
    
    // Parar a atualização após a animação terminar
    setTimeout(() => {
      clearInterval(animation);
      this.updatePositions();
    }, 800);
  }
}); 