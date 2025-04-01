// Configuração do slider circular
const SLIDER_CONFIG = {
    radius: 0.8, // Aumentei o raio para melhor visualização
    angleStep: 120, // Ângulo entre cada modelo (360° / 3 modelos)
    rotationSpeed: 0.5, // Velocidade da rotação
    currentAngle: 0, // Ângulo atual do slider
    isAnimating: false // Flag para controlar animação
};

// Inicialização do slider
function initCircularSlider() {
    const sliderContainer = document.querySelector('#slider-container');
    const models = document.querySelectorAll('.model-container');
    
    // Posicionar os modelos em um círculo
    models.forEach((model, index) => {
        const angle = (index * SLIDER_CONFIG.angleStep) * (Math.PI / 180);
        const x = SLIDER_CONFIG.radius * Math.cos(angle);
        const z = SLIDER_CONFIG.radius * Math.sin(angle);
        model.setAttribute('position', `${x} 0 ${z}`);
    });

    // Configurar os botões de navegação
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.addEventListener('click', () => rotateSlider('prev'));
    nextButton.addEventListener('click', () => rotateSlider('next'));

    // Adicionar eventos de touch para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                rotateSlider('next');
            } else {
                rotateSlider('prev');
            }
        }
    }
}

// Função para rotacionar o slider
function rotateSlider(direction) {
    if (SLIDER_CONFIG.isAnimating) return;
    
    const sliderContainer = document.querySelector('#slider-container');
    const currentRotation = sliderContainer.getAttribute('rotation');
    const currentY = parseFloat(currentRotation.y) || 0;
    
    // Calcular novo ângulo baseado na direção
    const newAngle = direction === 'next' 
        ? currentY + SLIDER_CONFIG.angleStep 
        : currentY - SLIDER_CONFIG.angleStep;
    
    SLIDER_CONFIG.isAnimating = true;
    
    // Aplicar a rotação com animação
    sliderContainer.setAttribute('animation', {
        property: 'rotation',
        to: `0 ${newAngle} 0`,
        dur: 500,
        easing: 'easeInOutQuad'
    });

    // Resetar flag de animação após a animação terminar
    setTimeout(() => {
        SLIDER_CONFIG.isAnimating = false;
    }, 500);
}

// Inicializar o slider quando a cena estiver pronta
window.addEventListener('load', () => {
    // Aguardar um momento para garantir que o A-Frame está pronto
    setTimeout(() => {
        initCircularSlider();
    }, 1000);
}); 