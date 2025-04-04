// Sistema de ajuda ao utilizador
document.addEventListener('DOMContentLoaded', function() {
    // Elementos que vamos animar
    const leftArrow = document.querySelector('#prev-button');
    const rightArrow = document.querySelector('#next-button');
    let modelSelected = false;
    
    // Função para iniciar animação das setas
    function startArrowsAnimation() {
        console.log('Iniciando animação das setas');
        if (leftArrow) {
            leftArrow.classList.add('pulse-arrow');
            console.log('Seta esquerda encontrada e animada');
        }
        if (rightArrow) {
            rightArrow.classList.add('pulse-arrow');
            console.log('Seta direita encontrada e animada');
        }
    }

    // Função para parar animação das setas
    function stopArrowsAnimation() {
        console.log('Parando animação das setas');
        if (leftArrow) leftArrow.classList.remove('pulse-arrow');
        if (rightArrow) rightArrow.classList.remove('pulse-arrow');
    }

    // Função para iniciar animação do botão personalizar
    function startCustomizeButtonAnimation() {
        console.log('Iniciando animação do botão personalizar');
        const visiblePanel = document.querySelector('.model-info[style*="display: block"], .model-info[style*="display: flex"]');
        if (visiblePanel) {
            const button = visiblePanel.querySelector('button');
            if (button) {
                button.classList.add('pulse-button');
                console.log('Botão personalizar encontrado e animado:', button);
            }
        }
    }

    // Função para parar animação do botão personalizar
    function stopCustomizeButtonAnimation() {
        console.log('Parando animação do botão personalizar');
        document.querySelectorAll('.model-info button').forEach(button => {
            button.classList.remove('pulse-button');
        });
    }

    // Função para verificar se algum painel de informações está visível
    function checkVisibleInfoPanel() {
        const visiblePanel = document.querySelector('.model-info[style*="display: block"], .model-info[style*="display: flex"]');
        return visiblePanel !== null;
    }

    // Verificar estado inicial
    function checkInitialState() {
        if (localStorage.getItem('tutorialComplete') === 'true') {
            stopArrowsAnimation();
            stopCustomizeButtonAnimation();
            return;
        }

        // Verificar se já há um modelo selecionado
        if (checkVisibleInfoPanel()) {
            modelSelected = true;
            stopArrowsAnimation();
            startCustomizeButtonAnimation();
        } else {
            // Iniciar com as setas pulsando após um pequeno delay
            setTimeout(startArrowsAnimation, 1000);
        }
    }

    // Quando uma máquina é selecionada
    document.addEventListener('click', function(event) {
        if (localStorage.getItem('tutorialComplete') === 'true') return;

        // Se clicou em um modelo 3D ou seu container
        if (event.target.closest('.model-container') || 
            event.target.closest('#modelo3d-1') ||
            event.target.closest('#modelo3d-2') ||
            event.target.closest('#modelo3d-3')) {
            console.log('Modelo clicado - parando animação das setas');
            modelSelected = true;
            stopArrowsAnimation();
            
            // Pequeno delay para garantir que o painel de informações esteja visível
            setTimeout(() => {
                if (checkVisibleInfoPanel()) {
                    startCustomizeButtonAnimation();
                }
            }, 300);
        }
        
        // Se clicou no botão personalizar
        if (event.target.closest('.model-info button')) {
            console.log('Botão personalizar clicado - parando animação');
            stopCustomizeButtonAnimation();
            localStorage.setItem('tutorialComplete', 'true');
        }
    });

    // Observar mudanças na visibilidade dos painéis de informação
    const observer = new MutationObserver((mutations) => {
        if (localStorage.getItem('tutorialComplete') === 'true') return;

        mutations.forEach((mutation) => {
            if (mutation.target.style.display !== 'none' && modelSelected) {
                setTimeout(() => {
                    startCustomizeButtonAnimation();
                }, 100);
            }
        });
    });

    // Observar mudanças em todos os painéis de informação
    document.querySelectorAll('.model-info').forEach(info => {
        observer.observe(info, { 
            attributes: true, 
            attributeFilter: ['style'],
            subtree: false
        });
    });

    // Inicializar o estado
    checkInitialState();

    // Log para debug
    console.log('Tutorial helper carregado');
    console.log('Seta esquerda:', leftArrow);
    console.log('Seta direita:', rightArrow);
    console.log('Estado do modelo:', modelSelected);
}); 