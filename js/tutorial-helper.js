// Sistema de ajuda ao utilizador
document.addEventListener('DOMContentLoaded', function() {
    // Elementos que vamos animar
    const leftArrow = document.querySelector('#prev-button');
    const rightArrow = document.querySelector('#next-button');
    const customizeButtons = document.querySelectorAll('.model-info button');
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
        customizeButtons.forEach(button => {
            if (button && button.closest('.model-info').style.display !== 'none') {
                button.classList.add('pulse-button');
                console.log('Botão personalizar encontrado e animado');
            }
        });
    }

    // Função para parar animação do botão personalizar
    function stopCustomizeButtonAnimation() {
        console.log('Parando animação do botão personalizar');
        customizeButtons.forEach(button => {
            button.classList.remove('pulse-button');
        });
    }

    // Iniciar com as setas pulsando após um pequeno delay
    setTimeout(startArrowsAnimation, 2000);

    // Observar mudanças na visibilidade dos botões personalizar
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.style.display === 'block' && modelSelected) {
                setTimeout(() => {
                    startCustomizeButtonAnimation();
                }, 500); // Pequeno delay para garantir que a transição seja suave
            }
        });
    });

    // Observar mudanças na visibilidade dos painéis de informação
    document.querySelectorAll('.model-info').forEach(info => {
        observer.observe(info, { attributes: true, attributeFilter: ['style'] });
    });

    // Quando uma máquina é selecionada (clique em qualquer parte da página)
    document.addEventListener('click', function(event) {
        // Se clicou em um modelo 3D ou seu container
        if (event.target.closest('.model-container') || 
            event.target.closest('#modelo3d-1') ||
            event.target.closest('#modelo3d-2') ||
            event.target.closest('#modelo3d-3')) {
            console.log('Modelo clicado - parando animação das setas');
            modelSelected = true;
            stopArrowsAnimation();
            // A animação do botão personalizar será iniciada pelo observer
        }
        
        // Se clicou no botão personalizar
        if (event.target.closest('.model-info button')) {
            console.log('Botão personalizar clicado - parando animação');
            stopCustomizeButtonAnimation();
            localStorage.setItem('tutorialComplete', 'true');
        }
    });

    // Armazenar estado no localStorage
    function checkTutorialState() {
        if (localStorage.getItem('tutorialComplete') === 'true') {
            stopArrowsAnimation();
            stopCustomizeButtonAnimation();
        }
    }

    // Verificar estado do tutorial ao carregar
    checkTutorialState();

    // Log para debug
    console.log('Tutorial helper carregado');
    console.log('Seta esquerda:', leftArrow);
    console.log('Seta direita:', rightArrow);
    console.log('Botões personalizar:', customizeButtons);
}); 