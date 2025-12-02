// ================= LÓGICA DE MARCAR COMO FEITO =================
const cards = document.querySelectorAll('.exercise-card');

cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('completed');
        if (navigator.vibrate) navigator.vibrate(50);
        atualizarProgresso();
    });
});

function atualizarProgresso() {
    const total = cards.length;
    const concluidos = document.querySelectorAll('.exercise-card.completed').length;
    const porcentagem = Math.round((concluidos / total) * 100);
    const subtitle = document.querySelector('.subtitle');
    
    if (concluidos === total) {
        subtitle.innerText = "Parabéns! Treino finalizado! 🎉";
        subtitle.style.color = "#00ffc3";
    } else if (concluidos > 0) {
        subtitle.innerText = `${porcentagem}% concluído. Continue assim!`;
        subtitle.style.color = "#fff";
    } else {
        subtitle.innerText = "Foco total hoje!";
        subtitle.style.color = "#888";
    }
}

// ================= NOVA LÓGICA DO VÍDEO (MODAL) =================

// 1. Selecionar os elementos
const playBtns = document.querySelectorAll('.video-btn');
const modal = document.getElementById('video-modal');
const closeBtn = document.querySelector('.close-btn');
const videoFrame = document.getElementById('video-frame');

// Link de exemplo (Um vídeo genérico de treino do YouTube)
// No futuro, isso virá do banco de dados para cada exercício.
const videoDemoLink = "https://www.youtube.com/embed/IODxDxX7oi4?si=br8Y7b4y7s9p4Xp7"; 

// 2. Adicionar ação aos botões de Play
playBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // O PULO DO GATO: Impede que o clique "vaze" e marque o exercício como feito
        e.stopPropagation(); 

        // Coloca o link no iframe e mostra o modal
        videoFrame.src = videoDemoLink;
        modal.classList.add('show');
    });
});

// 3. Função para fechar o modal
function fecharModal() {
    modal.classList.remove('show');
    // Importante: Limpa o src para o vídeo parar de tocar no fundo
    videoFrame.src = ""; 
}

// Fecha clicando no X
closeBtn.addEventListener('click', fecharModal);

// Fecha clicando no fundo escuro (fora do vídeo)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});