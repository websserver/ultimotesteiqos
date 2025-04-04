// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const loading = document.querySelector('.loading');
  const target = document.querySelector('a-entity[mindar-image-target]');
  const models = {
    navy: document.querySelector("#modelo-navy-3d"),
    olive: document.querySelector("#modelo-olive-3d"),
    jacaranda: document.querySelector("#modelo-jacaranda-3d"),
    rooibos: document.querySelector("#modelo-rooibos-3d"),
    turquoise: document.querySelector("#modelo-turquoise-3d")
  };

  // Função para esconder loading
  function hideLoading() {
    if (loading) {
      loading.style.display = 'none';
    }
  }

  // Eventos de detecção do marcador
  if (target) {
    target.addEventListener("targetFound", () => {
      // Mostrar o modelo navy por padrão
      Object.values(models).forEach(model => {
        if (model) {
          model.setAttribute('visible', model.id === 'modelo-navy-3d' ? 'true' : 'false');
        }
      });
      hideLoading();
    });

    target.addEventListener("targetLost", () => {
      Object.values(models).forEach(model => {
        if (model) {
          model.setAttribute('visible', 'false');
        }
      });
    });
  }

  // Esconder loading após 5 segundos (fallback)
  setTimeout(hideLoading, 5000);
});

