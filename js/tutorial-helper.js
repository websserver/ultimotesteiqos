// Sistema de ajuda ao utilizador
document.addEventListener('DOMContentLoaded', function() {
    // Elementos que vamos animar
    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');
    const customizeButtons = document.querySelectorAll('.btn-personalizar');
    
    // Função para iniciar animação das setas
    function startArrowsAnimation() {
        console.log('Iniciando animação das setas');
        if (leftArrow) leftArrow.classList.add('pulse-arrow');
        if (rightArrow) rightArrow.classList.add('pulse-arrow');
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
    startArrowsAnimation();

    // Quando uma máquina é selecionada (clique em qualquer parte da página)
    document.addEventListener('click', function(event) {
        // Se clicou em uma máquina ou em algo dentro dela
        if (event.target.closest('.machine-option') || 
            event.target.closest('.product-card')) {
            stopArrowsAnimation();
            startCustomizeButtonAnimation();
        }
        
        // Se clicou no botão personalizar
        if (event.target.closest('.btn-personalizar')) {
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
}); 