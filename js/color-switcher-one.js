// Mapeamento de cores para modelos
const colorToModel = {
    'navy': 'modelo3d/modelo_IQOS ILUMA ONE/navy-blazer.glb',
    'olive': 'modelo3d/modelo_IQOS ILUMA ONE/olive-green.glb',
    'jacaranda': 'modelo3d/modelo_IQOS ILUMA ONE/jacaranda.glb',
    'rooibos': 'modelo3d/modelo_IQOS ILUMA ONE/rooibos-tea.glb',
    'turquoise': 'modelo3d/modelo_IQOS ILUMA ONE/pastel-turquoise.glb'
};

let currentColor = 'navy';
let isModelLoading = false;

// Função para trocar a cor do modelo
function changeColor(color) {
    console.log('Tentando mudar para cor:', color);
    
    // Obtém a cena A-Frame e elementos necessários
    const scene = document.querySelector('a-scene');
    const modelContainer = document.querySelector('#modelo3d-1');
    const target = document.querySelector('a-entity[mindar-image-target]');
    
    if (!scene || !modelContainer || !target) {
        console.error('Elementos necessários não encontrados');
        return;
    }

    // Verifica se o marcador está visível
    const isMarkerVisible = target.object3D.visible;
    
    // Cria um novo asset para o modelo
    const modelId = `model-${color}`;
    const modelUrl = colorToModel[color];
    
    // Remove o modelo atual
    modelContainer.removeAttribute('gltf-model');
    
    // Remove o asset anterior se existir
    const oldAsset = document.querySelector(`#${modelId}`);
    if (oldAsset) {
        oldAsset.parentNode.removeChild(oldAsset);
    }
    
    // Cria um novo asset
    const newAsset = document.createElement('a-asset-item');
    newAsset.setAttribute('id', modelId);
    newAsset.setAttribute('src', modelUrl);
    
    // Adiciona o novo asset à cena
    scene.querySelector('a-assets').appendChild(newAsset);
    
    // Atualiza a classe active nos botões de cor
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === color) {
            option.classList.add('active');
        }
    });
    
    // Adiciona listeners para monitorar o carregamento
    newAsset.addEventListener('loaded', () => {
        console.log('Novo modelo carregado:', color);
        
        // Atualiza o modelo após o carregamento
        modelContainer.setAttribute('gltf-model', `#${modelId}`);
        
        // Mantém a escala e rotação atuais
        const currentScale = modelContainer.getAttribute('scale') || '8 8 8';
        const currentRotation = modelContainer.getAttribute('rotation') || '0 0 0';
        
        // Reseta apenas a posição
        modelContainer.setAttribute('position', '0 -0.5 0.1');
        modelContainer.setAttribute('scale', currentScale);
        modelContainer.setAttribute('rotation', currentRotation);
        
        // Força a atualização da cena
        modelContainer.object3D.visible = isMarkerVisible;
        modelContainer.object3D.updateMatrixWorld(true);
        scene.object3D.updateMatrixWorld(true);
        
        currentColor = color;
        isModelLoading = false;
    });
    
    // Adiciona um listener para o evento de carregamento do modelo
    modelContainer.addEventListener('model-loaded', function onModelLoaded() {
        console.log('Modelo carregado com sucesso:', color);
        
        // Força atualização da visibilidade
        modelContainer.object3D.visible = isMarkerVisible;
        modelContainer.object3D.updateMatrixWorld(true);
        scene.object3D.updateMatrixWorld(true);
        
        // Remove o listener após o carregamento
        modelContainer.removeEventListener('model-loaded', onModelLoaded);
    });
}

// Adiciona listener para erros de carregamento de modelo
document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    if (scene) {
        scene.addEventListener('model-loaded', (e) => {
            console.log(`Modelo carregado: ${e.detail.model.src}`);
        });
        
        scene.addEventListener('model-error', (e) => {
            console.error(`ERRO ao carregar modelo: ${e.detail.model.src}`);
            console.error(`Detalhes do erro: ${e.detail.error}`);
            isModelLoading = false;
        });
    }
}); 