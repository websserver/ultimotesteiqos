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
let autoRotateInterval = null;
const AUTO_ROTATE_INTERVAL = 5000; // 5 segundos entre cada rotação

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
const RADIUS = 0.6; // Raio do círculo
const ANGLE_STEP = 360; // Ângulo entre cada modelo (já está em 360 graus)
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
    const rotation = (newIndex - currentIndex) * ANGLE_STEP;
    
    // Atualizar rotação do carrossel
    carousel.setAttribute('rotation', `0 ${rotation} 0`);
    
    // Atualizar posições dos modelos
    models.forEach((model, index) => {
        const position = getSlidePosition(index);
        const targetPos = positions[position];
        
        model.setAttribute('position', `${targetPos.x} ${targetPos.y} ${targetPos.z}`);
        model.setAttribute('rotation', `0 ${targetPos.rotation} 0`);
        model.setAttribute('scale', `${targetPos.scale} ${targetPos.scale} ${targetPos.scale}`);
        model.setAttribute('opacity', targetPos.opacity);

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
  
  // Inicializar o carrossel e começar a rotação automática
  initializeCarousel();
});

const sceneEl = document.querySelector('a-scene');
sceneEl.addEventListener('renderstart', () => {
  loading.style.display = 'none';
});

// Button events
prevButton.addEventListener('click', () => {
  stopAutoRotate();
  prevModel();
});

nextButton.addEventListener('click', () => {
  stopAutoRotate();
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

// Adicionar eventos de teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        prevModel();
    } else if (event.key === 'ArrowRight') {
        nextModel();
    }
});

// Função para iniciar a rotação automática
function startAutoRotate() {
  console.log("Iniciando rotação automática");
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
  }
  
  autoRotateInterval = setInterval(() => {
    console.log("Rotação automática: próximo modelo");
    nextModel();
  }, AUTO_ROTATE_INTERVAL);
}

// Função para parar a rotação automática
function stopAutoRotate() {
  console.log("Parando rotação automática");
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval);
    autoRotateInterval = null;
  }
}

// Modificar a função initializeCarousel para iniciar a rotação automática
function initializeCarousel() {
  console.log("Inicializando carrossel");
  // Tentar recuperar o índice salvo, se não existir usar o modelo2 (ILUMA i) como padrão
  const savedIndex = localStorage.getItem('selectedModelIndex');
  currentIndex = savedIndex !== null ? parseInt(savedIndex) : 1;
  updateCarousel(currentIndex);
  
  // Iniciar a rotação automática
  startAutoRotate();
  
  // Reiniciar a rotação automática após 10 segundos de inatividade
  let inactivityTimeout;
  const resetAutoRotate = () => {
    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
    }
    inactivityTimeout = setTimeout(() => {
      startAutoRotate();
    }, 10000);
  };
  
  // Adicionar listeners para interações do usuário
  document.addEventListener('click', resetAutoRotate);
  document.addEventListener('touchstart', resetAutoRotate);
  document.addEventListener('mousemove', resetAutoRotate);
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
  
  // Parar a rotação automática quando um modelo é clicado
  stopAutoRotate();
} 