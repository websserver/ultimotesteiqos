// Sistema de ajuda ao utilizador
document.addEventListener('DOMContentLoaded', function() {
    // Elementos que vamos animar
    const leftArrow = document.querySelector('#prev-button');
    const rightArrow = document.querySelector('#next-button');
    const customizeButtons = document.querySelectorAll('.model-info button');
    
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
            button.classList.add('pulse-button');
            console.log('Botão personalizar encontrado e animado');
        });
    }

    // Função para parar animação do botão personalizar
    function stopCustomizeButtonAnimation() {
        console.log('Parando animação do botão personalizar');
        customizeButtons.forEach(button => {
            button.classList.remove('pulse-button');
        });
    }

    // Iniciar com as setas pulsando
    setTimeout(startArrowsAnimation, 2000); // Dar tempo para os elementos carregarem

    // Quando uma máquina é selecionada (clique em qualquer parte da página)
    document.addEventListener('click', function(event) {
        // Se clicou em um modelo 3D
        if (event.target.closest('.model-container') || 
            event.target.closest('#modelo3d-1') ||
            event.target.closest('#modelo3d-2') ||
            event.target.closest('#modelo3d-3')) {
            console.log('Modelo clicado - parando animação das setas');
            stopArrowsAnimation();
            startCustomizeButtonAnimation();
        }
        
        // Se clicou no botão personalizar
        if (event.target.closest('.model-info button')) {
            console.log('Botão personalizar clicado - parando animação');
            stopCustomizeButtonAnimation();
        }
    });

    // Armazenar estado no localStorage
    function checkTutorialState() {
        if (localStorage.getItem('tutorialComplete') === 'true') {
            stopArrowsAnimation();
            stopCustomizeButtonAnimation();
        }
    }

    // Marcar tutorial como completo quando clicar no botão personalizar
    customizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            localStorage.setItem('tutorialComplete', 'true');
        });
    });

    // Verificar estado do tutorial ao carregar
    checkTutorialState();

    // Log para debug
    console.log('Tutorial helper carregado');
    console.log('Seta esquerda:', leftArrow);
    console.log('Seta direita:', rightArrow);
    console.log('Botões personalizar:', customizeButtons);
}); 