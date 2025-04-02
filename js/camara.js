async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById('video');
    video.srcObject = stream;
  } catch (err) {
    console.error('Erro ao ativar câmara:', err);
    // podes redirecionar ou mostrar uma mensagem
  }
}

startCamera();