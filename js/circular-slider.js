AFRAME.registerComponent('circular-slider', {
  init: function() {
    this.models = [
      this.el.querySelector('#modelo3d-2'),
      this.el.querySelector('#modelo3d-3'),
      this.el.querySelector('#modelo3d-1')
    ];
    
    this.radius = 0.8; // Reduzido para manter o círculo mais compacto
    this.positions = []; // Array para armazenar posições fixas
    this.currentIndex = 0;
    
    // Calcular posições fixas do círculo
    for (let i = 0; i < this.models.length; i++) {
      const angle = (i * 2 * Math.PI) / this.models.length;
      this.positions.push({
        x: this.radius * Math.cos(angle),
        z: this.radius * Math.sin(angle) - 0.2
      });
    }
    
    // Configurar materiais iniciais
    this.models.forEach(model => {
      model.addEventListener('model-loaded', () => {
        const obj = model.getObject3D('mesh');
        if (obj) {
          obj.traverse((node) => {
            if (node.isMesh) {
              node.material = node.material.clone();
              node.material.transparent = true;
              node.material.opacity = 0.5;
              node.material.depthWrite = false;
              node.material.depthTest = true;
              node.material.needsUpdate = true;
            }
          });
        }
      });
    });
    
    this.updatePositions();
    
    document.getElementById('prev-button').addEventListener('click', () => this.rotate('prev'));
    document.getElementById('next-button').addEventListener('click', () => this.rotate('next'));
  },
  
  updatePositions: function() {
    this.models.forEach((model, index) => {
      if (index === 0) {
        // Modelo central
        model.setAttribute('position', '0 0 0');
        model.setAttribute('rotation', '0 0 0');
        model.setAttribute('scale', '6 6 6');
        
        const obj = model.getObject3D('mesh');
        if (obj) {
          obj.traverse((node) => {
            if (node.isMesh) {
              node.material.transparent = false;
              node.material.opacity = 1;
              node.material.depthWrite = true;
              node.material.depthTest = true;
              node.material.roughness = 0.5;
              node.material.metalness = 0.5;
              node.renderOrder = 2;
              node.material.needsUpdate = true;
            }
          });
        }
      } else {
        // Modelos laterais em círculo
        const posIndex = (index + this.currentIndex) % this.positions.length;
        const pos = this.positions[posIndex];
        
        model.setAttribute('position', `${pos.x} 0 ${pos.z}`);
        const angle = Math.atan2(pos.z, pos.x);
        model.setAttribute('rotation', `0 ${(angle * 180 / Math.PI) + 90} 0`);
        model.setAttribute('scale', '2 2 2'); // Reduzido de 3 para 2
        
        const obj = model.getObject3D('mesh');
        if (obj) {
          obj.traverse((node) => {
            if (node.isMesh) {
              node.material.transparent = true;
              node.material.opacity = 0.4;
              node.material.depthWrite = false;
              node.material.depthTest = true;
              node.material.roughness = 1;
              node.material.metalness = 0;
              node.material.fog = true;
              node.renderOrder = 0;
              node.material.needsUpdate = true;
            }
          });
        }
      }
    });
  },
  
  rotate: function(direction) {
    if (direction === 'next') {
      this.currentIndex = (this.currentIndex + 1) % this.models.length;
      this.models.push(this.models.shift());
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.models.length) % this.models.length;
      this.models.unshift(this.models.pop());
    }
    
    this.updatePositions();
  }
}); 