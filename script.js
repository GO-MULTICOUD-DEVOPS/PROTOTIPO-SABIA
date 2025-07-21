// --- Lógica da Splash Screen ---
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    const appContent = document.getElementById('app-content');

    // Simula um tempo de carregamento
    setTimeout(() => {
        if (splash) {
            splash.classList.add('hidden');
        }
        if (appContent) {
            appContent.classList.remove('invisible');
            appContent.classList.add('visible');
        }
        document.body.style.overflow = 'auto';
    }, 1500); // 1.5 segundos
});


// --- State and Initial Data ---
let turmas = [
    { id: 1, nome: 'Turma 6º Ano A', alunos: [{nome: 'Ana Silva'}, {nome: 'Bruno Costa', tag: 'TDAH'}, {nome: 'Carla Dias'}] },
    { id: 2, nome: 'Turma 7º Ano C', alunos: [{nome: 'Daniel Alves'}, {nome: 'Eduarda Lima', tag: 'TEA'}, {nome: 'Felipe Souza', tag: 'Dislexia'}] }
];

// --- Render Functions ---
function renderTurmas() {
    const turmasList = document.getElementById('turmasList');
    if (!turmasList) return;
    turmasList.innerHTML = '';
    turmas.forEach((turma, index) => {
        const alunosHTML = turma.alunos.map(aluno => {
            const tagHTML = aluno.tag ? `<span class="text-xs font-bold bg-${getTagColor(aluno.tag)}-500 text-white px-2 py-1 rounded-full">${aluno.tag}</span>` : '';
            return `<li class="flex justify-between items-center p-3 bg-slate-100 rounded-lg"><span>${aluno.nome}</span> ${tagHTML}</li>`;
        }).join('');

        const animationDelay = index * 100;
        turmasList.innerHTML += `
            <div class="bg-white p-6 rounded-2xl border border-slate-200 animate-fade-in-up" style="animation-delay: ${animationDelay}ms" id="turma-${turma.id}">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-slate-800">${turma.nome}</h2>
                    <button onclick="openAddStudentModal(${turma.id})" class="text-sm bg-teal-100 text-teal-700 font-semibold py-1 px-3 rounded-lg hover:bg-teal-200">+ Adicionar Aluno</button>
                </div>
                <ul class="space-y-3">${alunosHTML}</ul>
            </div>`;
    });
    updateCounts();
}

function getTagColor(tag) {
    switch(tag) {
        case 'TDAH': return 'blue';
        case 'TEA': return 'teal';
        case 'Dislexia': return 'amber';
        default: return 'slate';
    }
}

function updateCounts() {
    const turmaCountEl = document.getElementById('turmaCount');
    const studentCountEl = document.getElementById('studentCount');
    if(turmaCountEl) turmaCountEl.textContent = turmas.length;
    const totalAlunos = turmas.reduce((sum, turma) => sum + turma.alunos.length, 0);
    if(studentCountEl) studentCountEl.textContent = totalAlunos;
}

// --- Modal Logic ---
function openDiscoveryCard(cardId) {
    document.querySelectorAll('.discovery-card').forEach(card => card.style.display = 'none');
    const cardElement = document.getElementById(cardId);
    if (cardElement) cardElement.style.display = 'block';
    openModal('discoveryCardModal');
}

function completeStep(stepId) {
    const step = document.getElementById(stepId);
    if (step) {
        step.classList.add('completed');
    }
    closeModal('discoveryCardModal');
    showToast('Selo Conquistado!');
}

function openAddStudentModal(turmaId) {
    const turmaIdInput = document.getElementById('turmaIdInput');
    if(turmaIdInput) turmaIdInput.value = turmaId;
    openModal('addStudentModal');
}

function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}
function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

// --- Page Navigation & Tabs ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick') === `showPage('${pageId}')`) {
            item.classList.add('active');
        }
    });
}

function showActivityPage() {
    showPage('activityResult');
    showTab('original', document.querySelector('.tab'));
}

function showTab(tabId, element) {
    document.querySelectorAll('.activity-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabId)?.classList.add('active');
    
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    element?.classList.add('active');
}

// --- Toast Notification ---
function showToast(message) {
    const toast = document.getElementById('successToast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.transform = 'translateY(5rem)';
        toast.style.opacity = '0';
    }, 3000);
}

// --- Event Listeners ---
function setupEventListeners() {
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const turmaId = parseInt(document.getElementById('turmaIdInput').value);
            const studentName = document.getElementById('studentName').value;
            const studentTag = document.getElementById('studentTag').value;
            if (!studentName) return;

            const turma = turmas.find(t => t.id === turmaId);
            if (turma) {
                const newStudent = { nome: studentName };
                if (studentTag) newStudent.tag = studentTag;
                turma.alunos.push(newStudent);
                renderTurmas();
            }

            closeModal('addStudentModal');
            this.reset();
            showToast('Aluno adicionado com sucesso!');
        });
    }
    
    const turmaForm = document.getElementById('turmaForm');
    if (turmaForm) {
         turmaForm.addEventListener('submit', function(e) {
             e.preventDefault();
             const turmaNome = document.getElementById('turmaNome').value;
             if (!turmaNome) return;
             
             const newTurma = {
                 id: Date.now(),
                 nome: turmaNome,
                 alunos: []
             };
             turmas.push(newTurma);
             renderTurmas();
             
             closeModal('turmaModal');
             this.reset();
             showPage('turmas');
             showToast('Turma criada com sucesso!');
        });
    }

    const activityForm = document.getElementById('activityForm');
    if (activityForm) {
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            closeModal('activityModal');
            showActivityPage();
            showToast('Atividade gerada com sucesso!');
        });
    }
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    renderTurmas();
    showPage('dashboard');
    setupEventListeners();
});