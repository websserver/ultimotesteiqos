AFRAME.registerComponent('model-handler', {
  init: function() {
    const el = this.el;
    const index = parseInt(el.id.split('-')[1]) - 1;
    
    // Adicionar todos os tipos de eventos de interação
    const events = ['click', 'touchstart', 'mousedown'];
    
    events.forEach(eventName => {
      el.addEventListener(eventName, (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        console.log(`Evento ${eventName} detectado no modelo ${index}`);
        console.log('Elemento clicado:', el.id);
        console.log('Posição do clique:', evt.detail.intersection ? evt.detail.intersection.point : 'N/A');
        handleModelClick(index);
      });
    });
  }
});

// Constants and variables
const BASE_SCALE = 4.0; // Escala reduzida para metade (era 8.0)
const MODEL_NAMES = {
  0: "IQOS ILUMA",
  1: "IQOS ILUMA PRIME",
  2: "IQOS ILUMA ONE"
};

let currentModel = 1;
let isModelClicked = false;
let initialRotationDone = false; // Flag para controlar se a rotação inicial já foi feita
let touchStartX = 0;
let touchEndX = 0;
const SWIPE_THRESHOLD = 50; // Distância mínima para considerar um swipe
const ROTATION_DURATION = 200; // Duração da rotação em ms

// DOM Elements
const loading = document.querySelector('.loading');
const modelos = [
  document.querySelector("#modelo3d-1"),
  document.querySelector("#modelo3d-2"),
  document.querySelector("#modelo3d-3")
];
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const personalizeBtn = document.querySelector(".model-info button");
const modelInfo = document.querySelector('#model-info');
const modelName = document.querySelector('#model-name');
const zoomInBtn = document.querySelector('#zoom-in');
const zoomOutBtn = document.querySelector('#zoom-out');

// Variables
let currentIndex = 0;
const models = document.querySelectorAll('.model-container');
const carousel = document.querySelector('.carousel-container');

// Configuração do carrossel
const RADIUS = 0.8; // Raio do círculo
const ANGLE_STEP = 360; // Ângulo entre cada modelo
const TRANSITION_DURATION = 1000; // Duração da transição em ms

// Posições dos modelos no carrossel
const positions = {
    left: { x: -RADIUS, y: 0, z: -RADIUS * 0.5, rotation: -ANGLE_STEP, scale: BASE_SCALE, opacity: 0.7 },
    center: { x: 0, y: 0, z: 0, rotation: 0, scale: BASE_SCALE, opacity: 1 },
    right: { x: RADIUS, y: 0, z: -RADIUS * 0.5, rotation: ANGLE_STEP, scale: BASE_SCALE, opacity: 0.7 }
};

// Configuração dos modelos com suas informações
const modelConfigs = {
    'modelo3d-1': {
        name: 'ILUMA i ONE',
        buttonText: 'Personalizar ILUMA i ONE',
        link: 'ilumaone.html'
    },
    'modelo3d-2': {
        name: 'ILUMA i',
        buttonText: 'Personalizar ILUMA i',
        link: 'ilumai.html'
    },
    'modelo3d-3': {
        name: 'ILUMA i PRIME',
        buttonText: 'Personalizar ILUMA i PRIME',
        link: 'ilumaprime.html'
    }
};

// Função para obter os índices dos modelos visíveis
function getVisibleModels() {
    const prev = (currentIndex - 1 + models.length) % models.length;
    const next = (currentIndex + 1) % models.length;
    return { prev, current: currentIndex, next };
}

// Função para obter a posição do slide
function getSlidePosition(index) {
    const { prev, current, next } = getVisibleModels();
    
    if (index === prev) return 'left';
    if (index === current) return 'center';
    if (index === next) return 'right';
    
    return 'center';
}

// Função para mostrar informações do modelo
function showModelInfo(modelId) {
    const modelConfig = modelConfigs[modelId];
    if (!modelConfig) return;

    const modelInfo = document.querySelector('.model-info');
    if (!modelInfo) return;

    modelInfo.innerHTML = `
        <h2>${modelConfig.name}</h2>
        <button onclick="window.location.href='${modelConfig.link}'">Personalizar</button>
    `;
    modelInfo.style.display = 'flex';
}

// Atualizar posições do carrossel
function updateCarousel(newIndex) {
    const { prev, current, next } = getVisibleModels();
    
    // Se for a primeira vez, fazer uma rotação completa de 360°
    if (!initialRotationDone) {
        // Adicionar animação de rotação suave
        carousel.setAttribute('animation', {
            property: 'rotation',
            to: '0 360 0',
            dur: ROTATION_DURATION,
            easing: 'easeInOutQuad',
            loop: false
        });
        
        initialRotationDone = true;
        
        // Após a rotação inicial, posicionar os modelos corretamente
        setTimeout(() => {
            positionModels(newIndex);
        }, ROTATION_DURATION + 100); // Esperar a rotação inicial terminar
    } else {
        // Para navegações subsequentes, apenas posicionar os modelos sem rotação
        positionModels(newIndex);
    }
}

// Função para posicionar os modelos sem rotação
function positionModels(newIndex) {
    // Atualizar posições dos modelos
    models.forEach((model, index) => {
        const position = getSlidePosition(index);
        const targetPos = positions[position];
        
        // Adicionar animações suaves para todas as propriedades
        model.setAttribute('animation__position', {
            property: 'position',
            to: `${targetPos.x} ${targetPos.y} ${targetPos.z}`,
            dur: TRANSITION_DURATION,
            easing: 'easeInOutQuad'
        });
        
        model.setAttribute('animation__rotation', {
            property: 'rotation',
            to: `0 ${targetPos.rotation} 0`,
            dur: TRANSITION_DURATION,
            easing: 'easeInOutQuad'
        });
        
        model.setAttribute('animation__scale', {
            property: 'scale',
            to: `${targetPos.scale} ${targetPos.scale} ${targetPos.scale}`,
            dur: TRANSITION_DURATION,
            easing: 'easeInOutQuad'
        });
        
        model.setAttribute('animation__opacity', {
            property: 'opacity',
            to: targetPos.opacity,
            dur: TRANSITION_DURATION,
            easing: 'easeInOutQuad'
        });

        // Se este é o modelo central, mostrar suas informações e atualizar o modelo 3D
        if (position === 'center') {
            const modelId = model.getAttribute('id');
            showModelInfo(modelId);
            
            // Atualizar o modelo 3D correspondente
            currentModel = index;
            
            // Salvar o índice do modelo selecionado
            localStorage.setItem('selectedModelIndex', index.toString());
        }
    });
    
    // Atualizar índice atual
    currentIndex = newIndex;
}

// Função para mover para o próximo modelo
function nextModel() {
    console.log("Próximo modelo");
    const nextIndex = (currentIndex + 1) % models.length;
    updateCarousel(nextIndex);
}

// Função para mover para o modelo anterior
function prevModel() {
    console.log("Modelo anterior");
    const prevIndex = (currentIndex - 1 + models.length) % models.length;
    updateCarousel(prevIndex);
}

function hideModelInfo() {
  const modelInfo = document.getElementById('model-info');
  modelInfo.style.display = 'none';
}

function changeModel(direction) {
  hideModelInfo();
  isModelClicked = false;
  
  if (direction === 'next' && currentModel < 2) {
    currentModel++;
  } else if (direction === 'prev' && currentModel > 0) {
    currentModel--;
  }
}

// Event Listeners
window.addEventListener('load', function() {
  // Inicializar com o modelo 2 visível
  modelos.forEach((modelo, i) => {
    if (i === 1) {
      modelo.setAttribute('visible', 'true');
      modelo.setAttribute('scale', `${BASE_SCALE} ${BASE_SCALE} ${BASE_SCALE}`);
    } else {
      modelo.setAttribute('visible', 'false');
      modelo.setAttribute('scale', `${BASE_SCALE} ${BASE_SCALE} ${BASE_SCALE}`);
    }
  });
  
  // Inicializar o carrossel
  initializeCarousel();
  
  // Adicionar eventos de toque para detectar swipes
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('touchend', handleTouchEnd);
});

const sceneEl = document.querySelector('a-scene');
sceneEl.addEventListener('renderstart', () => {
  loading.style.display = 'none';
});

// Button events
prevButton.addEventListener('click', () => {
  prevModel();
});

nextButton.addEventListener('click', () => {
  nextModel();
});

// Target detection events
const target = document.querySelector('a-entity[mindar-image-target]');

target.addEventListener("targetFound", event => {
    // Mostrar todos os modelos
    modelos.forEach((modelo, i) => {
        modelo.setAttribute('visible', 'true');
        modelo.setAttribute('scale', `${BASE_SCALE} ${BASE_SCALE} ${BASE_SCALE}`);
        modelo.classList.remove('blurred');
    });
    
    // Restaurar a posição correta do modelo selecionado
    updateCarousel(currentIndex);
});

target.addEventListener("targetLost", event => {
    // Manter os modelos visíveis
    modelos.forEach((modelo, i) => {
        modelo.setAttribute('visible', 'true');
        modelo.setAttribute('scale', `${BASE_SCALE} ${BASE_SCALE} ${BASE_SCALE}`);
        modelo.classList.remove('blurred');
    });
    
    // Selecionar o modelo 2 por padrão
    currentIndex = 1;
    updateCarousel(currentIndex);
});

// Zoom controls
let currentZoom = 6;

zoomInBtn.addEventListener('click', () => {
  currentZoom = Math.min(currentZoom + 1, 10);
  updateZoom();
});

zoomOutBtn.addEventListener('click', () => {
  currentZoom = Math.max(currentZoom - 1, 3);
  updateZoom();
});

// Funções para lidar com eventos de toque
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX;
  
  // Calcular a distância do swipe em tempo real
  const swipeDistance = touchEndX - touchStartX;
  
  // Aplicar uma transformação suave ao carrossel durante o swipe
  if (Math.abs(swipeDistance) > 10) {
    const rotationFactor = swipeDistance / 500; // Ajuste este valor para controlar a sensibilidade
    const currentRotation = carousel.getAttribute('rotation').y || 0;
    carousel.setAttribute('rotation', `0 ${currentRotation + rotationFactor} 0`);
  }
}

function handleTouchEnd() {
  const swipeDistance = touchEndX - touchStartX;
  
  if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
    if (swipeDistance > 0) {
      // Swipe para a direita, ir para o modelo anterior
      prevModel();
    } else {
      // Swipe para a esquerda, ir para o próximo modelo
      nextModel();
    }
  } else {
    // Se o swipe não for suficiente, voltar à posição original
    updateCarousel(currentIndex);
  }
}

// Modificar a função initializeCarousel para remover a rotação automática
function initializeCarousel() {
  console.log("Inicializando carrossel");
  // Tentar recuperar o índice salvo, se não existir usar o modelo2 (ILUMA i) como padrão
  const savedIndex = localStorage.getItem('selectedModelIndex');
  currentIndex = savedIndex !== null ? parseInt(savedIndex) : 1;
  
  // Resetar a flag de rotação inicial
  initialRotationDone = false;
  
  // Iniciar a rotação inicial
  updateCarousel(currentIndex);
}

// Inicializar o carrossel quando a cena estiver carregada
sceneEl.addEventListener('loaded', () => {
    updateZoom();
});

// Remover eventos de zoom anteriores
models.forEach(model => {
    model.removeAttribute('event-set__mouseenter');
    model.removeAttribute('event-set__mouseleave');
});

function handleModelClick(index) {
  console.log('Modelo clicado:', index);
  
  // Atualizar o carrossel
  updateCarousel(index);
  
  // Atualizar o modelo atual
  currentModel = index;
  isModelClicked = true;
  
  // Mostrar informações do modelo
  const modelId = `modelo3d-${index + 1}`;
  showModelInfo(modelId);
} 