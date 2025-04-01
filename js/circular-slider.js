AFRAME.registerComponent('circular-slider', {
  init: function() {
    this.models = [
      this.el.querySelector('#modelo3d-2'),
      this.el.querySelector('#modelo3d-3'),
      this.el.querySelector('#modelo3d-1')
    ];
    
    this.totalModels = this.models.length;
    this.currentIndex = 0;
    this.radius = 1;
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
      model.setAttribute('rotation', `0 ${-angle * 180 / Math.PI} 0`);
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
      const angle = ((index * 360) / this.totalModels + this.rotationY) % 360;
      const isCenter = Math.abs(angle % 360) < this.rotationStep / 2 || 
                      Math.abs(angle % 360 - 360) < this.rotationStep / 2;
      
      if (isCenter) {
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
        // Calcular escala e opacidade baseado na distância do centro
        const distanceFromCenter = Math.abs((angle % 360) - 180) / 180;
        const scale = 2 + (distanceFromCenter * 1);
        const opacity = 0.3 + (distanceFromCenter * 0.2);
        
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
      dur: 500,
      easing: 'easeOutQuad'
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
    }, 500);
  }
}); 