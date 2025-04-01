AFRAME.registerComponent('circular-slider', {
  init: function() {
    this.models = [
      this.el.querySelector('#modelo3d-2'),
      this.el.querySelector('#modelo3d-3'),
      this.el.querySelector('#modelo3d-1')
    ];
    
    this.radius = 1.2;
    this.currentAngle = 0;
    this.angleStep = (2 * Math.PI) / this.models.length;
    
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
        const angle = this.currentAngle + ((index - 1) * this.angleStep);
        const x = this.radius * Math.cos(angle);
        const z = this.radius * Math.sin(angle) - 0.3;
        model.setAttribute('position', `${x} 0 ${z}`);
        
        const rotationY = (angle * 180 / Math.PI) + 90;
        model.setAttribute('rotation', `0 ${rotationY} 0`);
        model.setAttribute('scale', '3 3 3');
        
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
    const step = direction === 'next' ? -this.angleStep : this.angleStep;
    this.currentAngle += step;
    
    if (direction === 'next') {
      this.models.push(this.models.shift());
    } else {
      this.models.unshift(this.models.pop());
    }
    
    this.updatePositions();
  }
}); 