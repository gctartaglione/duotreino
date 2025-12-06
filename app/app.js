// ================= CONFIGURAÇÃO INICIAL =================
// Verifica se o usuário está logado. Se não, chuta pro login.
async function verificarLogin() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (!user) {
        window.location.href = "login.html";
    } else {
        // Se tem usuário, carrega os dados dele
        carregarPerfil(user.id);
        carregarTreino(user.id);
    }
}

// Chama a verificação assim que a tela abre
verificarLogin();


// ================= FUNÇÃO 1: CARREGAR PERFIL (NOME) =================
async function carregarPerfil(userId) {
    // Busca na tabela 'usuarios' onde o id é igual ao do logado
    const { data, error } = await _supabase
        .from('usuarios')
        .select('nome_completo')
        .eq('id', userId)
        .single();

    if (data) {
        // Atualiza o HTML com o nome vindo do banco
        document.querySelector('.greeting').innerText = `Bom dia, ${data.nome_completo.split(' ')[0]} 🚀`;
    }
}


// ================= FUNÇÃO 2: CARREGAR TREINO =================
async function carregarTreino(userId) {
    // 1. Primeiro descobre qual é o relacionamento desse aluno
    const { data: rel } = await _supabase
        .from('relacionamentos')
        .select('id')
        .eq('aluno_id', userId)
        .single();

    if (rel) {
        // 2. Agora busca o treino ligado a esse relacionamento
        const { data: treino } = await _supabase
            .from('treinos')
            .select('*')
            .eq('relacionamento_id', rel.id)
            .single(); // Pega só um treino por enquanto

        if (treino) {
            renderizarTreino(treino);
        }
    }
}


// ================= FUNÇÃO 3: DESENHAR O TREINO NA TELA (CORRIGIDA) =================
function renderizarTreino(treino) {
    // Atualiza Título e Descrição
    document.querySelector('.card-text h2').innerText = treino.titulo;
    document.querySelector('.card-text p').innerText = treino.descricao;

    const lista = document.querySelector('.exercise-list');
    lista.innerHTML = '<h3>Sua sequência</h3>';

    // --- CORREÇÃO DO ERRO ---
    let exerciciosReais = [];
    
    // Verifica: Se já é uma lista (Array), usa direto. Se for texto, converte.
    if (Array.isArray(treino.exercicios)) {
        exerciciosReais = treino.exercicios;
    } else if (typeof treino.exercicios === 'string') {
        try {
            exerciciosReais = JSON.parse(treino.exercicios);
        } catch (e) {
            console.error("Erro ao converter JSON:", e);
        }
    }

    // Se a lista estiver vazia ou nula
    if (!exerciciosReais || exerciciosReais.length === 0) {
        lista.innerHTML += '<p style="color: #666; padding: 1rem;">Sem exercícios cadastrados.</p>';
        return;
    }

    // Cria os cards na tela
    exerciciosReais.forEach(ex => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.innerHTML = `
            <div class="check-circle"><i class="ri-check-line"></i></div>
            <div class="exercise-info">
                <h4>${ex.nome || "Exercício"}</h4>
                <p>${ex.series} séries • ${ex.reps} repetições</p>
            </div>
            <div class="video-btn"><i class="ri-play-circle-line"></i></div>
        `;
        lista.appendChild(card);
    });

    ativarCliques();
}


// ================= FUNÇÃO 4: LÓGICA DE CLIQUES (Reciclada) =================
function ativarCliques() {
    const cards = document.querySelectorAll('.exercise-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('completed');
            if (navigator.vibrate) navigator.vibrate(50);
        });
    });

    // Reativa o Modal de Vídeo (Seu código antigo aqui)
    const playBtns = document.querySelectorAll('.video-btn');
    const modal = document.getElementById('video-modal');
    
    // ... (A lógica do modal pode continuar a mesma, simplifiquei aqui para caber)
    // Se quiser o modal completo, me avisa que mando o bloco!
}