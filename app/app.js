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


// ================= FUNÇÃO 3: DESENHAR O TREINO NA TELA =================
function renderizarTreino(treino) {
    // Atualiza Título e Descrição no Card Roxo
    document.querySelector('.card-text h2').innerText = treino.titulo;
    document.querySelector('.card-text p').innerText = treino.descricao;

    // Limpa a lista antiga (os exemplos hardcoded)
    const lista = document.querySelector('.exercise-list');
    
    // Remove os exercícios velhos, MANTENDO o título <h3>
    const tituloLista = lista.querySelector('h3');
    lista.innerHTML = ''; 
    lista.appendChild(tituloLista);

    // O campo 'exercicios' no banco é um texto JSON. Precisamos converter.
    const exerciciosReais = JSON.parse(treino.exercicios);

    // Cria o HTML para cada exercício do banco
    exerciciosReais.forEach(ex => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.innerHTML = `
            <div class="check-circle"><i class="ri-check-line"></i></div>
            <div class="exercise-info">
                <h4>${ex.nome}</h4>
                <p>${ex.series} séries • ${ex.reps} repetições</p>
            </div>
            <div class="video-btn"><i class="ri-play-circle-line"></i></div>
        `;
        
        // Adiciona na tela
        lista.appendChild(card);
    });

    // Reativa os cliques (Check e Vídeo) nos novos cards criados
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