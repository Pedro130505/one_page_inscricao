/**
 * UFMG HUB • SCRIPT PRINCIPAL
 * Palestra BNDES Garagem na Escola de Engenharia da UFMG
 * Interações, Tabs, Validações, Contador de Caracteres, QR Code e Inscrições
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initTabs();
  initSpecialtyChips();
  initCharCounter();
  initPhoneMasks();
  initForms();
  initFaqAccordion();
  initHeaderAndFloatingCta();
  initAdminExporter();
});

/* ==========================================================================
   1. COUNTDOWN TIMER (29 DE OUTUBRO ÀS 11:00)
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  if (!daysEl) return;

  const currentYear = new Date().getFullYear();
  let targetDate = new Date(currentYear, 9, 29, 11, 0, 0); // Mês 9 = Outubro (base 0)

  if (targetDate.getTime() - new Date().getTime() < 0) {
    targetDate = new Date(currentYear + 1, 9, 29, 11, 0, 0);
  }

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      const badge = document.querySelector('.countdown-header-tag');
      if (badge) badge.textContent = '🔴 Evento Iniciado / Em Andamento';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. TABS DE SELEÇÃO: PROFESSOR VS LABORATÓRIO
   ========================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const formPanels = document.querySelectorAll('.form-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabButtons.forEach(b => b.classList.remove('active'));
      formPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. SUGESTÕES DE ESPECIALIDADES EM 1 CLIQUE (CHIPS)
   Preenche a próxima caixa de especialidade vazia das 5 caixas
   ========================================================================== */
function initSpecialtyChips() {
  const chipButtons = document.querySelectorAll('.chip-btn');
  const specialtyInputs = [
    document.getElementById('prof-esp-1'),
    document.getElementById('prof-esp-2'),
    document.getElementById('prof-esp-3'),
    document.getElementById('prof-esp-4'),
    document.getElementById('prof-esp-5'),
  ].filter(Boolean);

  const countBadge = document.getElementById('esp-filled-count');

  function updateCount() {
    const filled = specialtyInputs.filter(inp => inp.value.trim().length > 0).length;
    if (countBadge) {
      countBadge.textContent = `${filled} de 5 preenchidas`;
    }
  }

  specialtyInputs.forEach(input => {
    input.addEventListener('input', updateCount);
  });

  chipButtons.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const val = chip.getAttribute('data-val') || chip.textContent.trim();

      // Encontra a primeira caixa vazia
      let emptyInput = specialtyInputs.find(inp => inp.value.trim() === '');

      // Se todas estiverem preenchidas, substitui na última
      if (!emptyInput) {
        emptyInput = specialtyInputs[specialtyInputs.length - 1];
      }

      if (emptyInput) {
        emptyInput.value = val;
        emptyInput.classList.add('highlight-chip-input');
        setTimeout(() => emptyInput.classList.remove('highlight-chip-input'), 600);
        updateCount();
      }
    });
  });

  updateCount();
}

/* ==========================================================================
   4. CONTADOR DE CARACTERES PARA O LABORATÓRIO (~100-150 CARACTERES)
   ========================================================================== */
function initCharCounter() {
  const textarea = document.getElementById('lab-oferta');
  const counterText = document.getElementById('lab-char-count');
  const progressFill = document.getElementById('lab-char-progress');

  if (!textarea || !counterText || !progressFill) return;

  const MAX_RECOMMENDED = 150;

  function update() {
    const len = textarea.value.length;
    counterText.textContent = `${len} / ${MAX_RECOMMENDED} caracteres`;

    const pct = Math.min((len / MAX_RECOMMENDED) * 100, 100);
    progressFill.style.width = `${pct}%`;

    if (len > MAX_RECOMMENDED) {
      progressFill.classList.add('danger');
      progressFill.classList.remove('warning');
      counterText.style.color = '#CD181E';
    } else if (len >= 120) {
      progressFill.classList.add('warning');
      progressFill.classList.remove('danger');
      counterText.style.color = '#d97706';
    } else {
      progressFill.classList.remove('warning', 'danger');
      counterText.style.color = '#64748b';
    }
  }

  textarea.addEventListener('input', update);
  update();
}

/* ==========================================================================
   5. MÁSCARA TELEFÔNICA (DDD + NÚMERO)
   ========================================================================== */
function initPhoneMasks() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);

      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      }
      e.target.value = v;
    });
  });
}

/* ==========================================================================
   6. SUBMISSÃO DE FORMULÁRIOS & GERAÇÃO DE TICKET
   ========================================================================== */
function initForms() {
  const formProf = document.getElementById('form-professor');
  const formLab = document.getElementById('form-laboratorio');

  if (formProf) {
    formProf.addEventListener('submit', (e) => {
      e.preventDefault();
      handleProfessorSubmit(formProf);
    });
  }

  if (formLab) {
    formLab.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLabSubmit(formLab);
    });
  }

  // Fechar Modal
  const modal = document.getElementById('ticket-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const anotherBtn = document.getElementById('btn-another-reg');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (anotherBtn && modal) {
    anotherBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      const inscricaoSec = document.getElementById('inscricao');
      if (inscricaoSec) inscricaoSec.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

function handleProfessorSubmit(form) {
  const nome = document.getElementById('prof-nome').value.trim();
  const email = document.getElementById('prof-email').value.trim();
  const tel = document.getElementById('prof-tel').value.trim();
  const depto = document.getElementById('prof-depto').value;
  const labs = document.getElementById('prof-labs').value.trim();
  const interesse = document.getElementById('prof-interesse').value;

  const esp1 = document.getElementById('prof-esp-1').value.trim();
  const esp2 = document.getElementById('prof-esp-2').value.trim();
  const esp3 = document.getElementById('prof-esp-3').value.trim();
  const esp4 = document.getElementById('prof-esp-4').value.trim();
  const esp5 = document.getElementById('prof-esp-5').value.trim();

  const especialidades = [esp1, esp2, esp3, esp4, esp5].filter(Boolean);

  if (!nome || !email || !tel || !depto || especialidades.length === 0) {
    alert('Por favor, preencha todos os campos obrigatórios e ao menos 1 especialidade.');
    return;
  }

  const regId = 'UFMG-PROF-' + Math.floor(1000 + Math.random() * 9000);
  const registrationData = {
    tipo: 'Professor(a) / Pesquisador(a)',
    id: regId,
    nome,
    email,
    telefone: tel,
    departamento: depto,
    laboratorios: labs || 'Não informado',
    especialidades: especialidades.join(', '),
    interesse,
    dataRegistro: new Date().toISOString()
  };

  saveRegistration(registrationData);
  showTicketModal(registrationData);
  form.reset();
}

function handleLabSubmit(form) {
  const nomeLab = document.getElementById('lab-nome').value.trim();
  const sigla = document.getElementById('lab-sigla').value.trim();
  const responsavel = document.getElementById('lab-resp').value.trim();
  const email = document.getElementById('lab-email').value.trim();
  const tel = document.getElementById('lab-tel').value.trim();
  const depto = document.getElementById('lab-depto').value;
  const especialidades = document.getElementById('lab-esp').value.trim();
  const oferta = document.getElementById('lab-oferta').value.trim();
  const site = document.getElementById('lab-site').value.trim();

  if (!nomeLab || !responsavel || !email || !tel || !depto || !especialidades || !oferta) {
    alert('Por favor, preencha todos os campos obrigatórios do laboratório.');
    return;
  }

  const regId = 'UFMG-LAB-' + Math.floor(1000 + Math.random() * 9000);
  const registrationData = {
    tipo: 'Laboratório / Núcleo de Pesquisa',
    id: regId,
    nome: `${nomeLab} ${sigla ? `(${sigla})` : ''}`,
    responsavel,
    email,
    telefone: tel,
    departamento: depto,
    especialidades,
    ofertaIndustria: oferta,
    site: site || 'Não informado',
    dataRegistro: new Date().toISOString()
  };

  saveRegistration(registrationData);
  showTicketModal(registrationData);
  form.reset();
}

function saveRegistration(data) {
  try {
    const list = JSON.parse(localStorage.getItem('ufmg_hub_bndes_inscricoes') || '[]');
    list.push(data);
    localStorage.setItem('ufmg_hub_bndes_inscricoes', JSON.stringify(list));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

/* ==========================================================================
   7. EXIBIÇÃO DO TICKET MODAL COM QR CODE (LOCAL OU FALLBACK)
   ========================================================================== */
function showTicketModal(data) {
  const modal = document.getElementById('ticket-modal');
  if (!modal) return;

  document.getElementById('ticket-display-type').textContent = data.tipo;
  document.getElementById('ticket-display-name').textContent = data.nome;
  document.getElementById('ticket-display-depto').textContent = `Departamento: ${data.departamento}`;
  document.getElementById('ticket-display-code').textContent = `CÓDIGO DE CREDENCIAMENTO: ${data.id}`;

  const infoSecondary = document.getElementById('ticket-display-sub');
  if (data.tipo.includes('Laboratório')) {
    infoSecondary.textContent = `Responsável: ${data.responsavel} | Oferta: "${data.ofertaIndustria}"`;
  } else {
    infoSecondary.textContent = `Especialidades: ${data.especialidades} ${data.laboratorios !== 'Não informado' ? `| Lab(s): ${data.laboratorios}` : ''}`;
  }

  // Geração do QR Code localmente (offline e instantâneo)
  const qrContainer = document.getElementById('ticket-qr-area');
  if (qrContainer) {
    qrContainer.innerHTML = ''; // limpa anterior
    const qrData = `BNDES_GARAGEM_UFMG|${data.id}|${data.nome}|${data.tipo}`;

    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, {
        text: qrData,
        width: 96,
        height: 96,
        colorDark: "#014B76",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      // Fallback SVG estilizado
      qrContainer.innerHTML = `
        <svg viewBox="0 0 100 100" width="96" height="96" fill="#014B76">
          <rect x="0" y="0" width="30" height="30" fill="#014B76"/>
          <rect x="6" y="6" width="18" height="18" fill="#ffffff"/>
          <rect x="10" y="10" width="10" height="10" fill="#014B76"/>
          <rect x="70" y="0" width="30" height="30" fill="#014B76"/>
          <rect x="76" y="6" width="18" height="18" fill="#ffffff"/>
          <rect x="80" y="10" width="10" height="10" fill="#014B76"/>
          <rect x="0" y="70" width="30" height="30" fill="#014B76"/>
          <rect x="6" y="76" width="18" height="18" fill="#ffffff"/>
          <rect x="10" y="80" width="10" height="10" fill="#014B76"/>
          <rect x="40" y="10" width="10" height="20" fill="#014B76"/>
          <rect x="40" y="40" width="20" height="20" fill="#CD181E"/>
          <rect x="70" y="40" width="20" height="10" fill="#014B76"/>
          <rect x="40" y="70" width="10" height="20" fill="#014B76"/>
          <rect x="60" y="70" width="30" height="10" fill="#014B76"/>
          <rect x="80" y="85" width="15" height="15" fill="#014B76"/>
        </svg>
      `;
    }
  }

  setupTicketActions(data);
  modal.classList.add('active');
}

function setupTicketActions(data) {
  const btnCalendar = document.getElementById('btn-ticket-calendar');
  const btnPrint = document.getElementById('btn-ticket-print');

  if (btnCalendar) {
    btnCalendar.onclick = () => {
      openGoogleCalendar();
    };
  }

  if (btnPrint) {
    btnPrint.onclick = () => {
      window.print();
    };
  }
}

function openGoogleCalendar() {
  const title = encodeURIComponent("BNDES Garagem na Escola de Engenharia da UFMG");
  const details = encodeURIComponent(
    "Palestra: BNDES Garagem: da engenharia ao impacto — transformando soluções em negócios.\n" +
    "Apresentação do funcionamento do programa e lançamento do edital de 100 vagas.\n\n" +
    "Realização: UFMG Hub, BNDES Garagem e Escola de Engenharia da UFMG."
  );
  const location = encodeURIComponent("Auditório da Escola de Engenharia da UFMG - Av. Pres. Antônio Carlos, 6627, Pampulha, Belo Horizonte - MG");
  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261029T140000Z/20261029T153000Z&details=${details}&location=${location}`;
  window.open(gCalUrl, '_blank');
}

function downloadIcsCalendar() {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UFMG Hub//BNDES Garagem//PT',
    'BEGIN:VEVENT',
    'UID:bndes-garagem-ufmg-2026@ufmghub.com.br',
    'DTSTAMP:20261020T120000Z',
    'DTSTART:20261029T140000Z',
    'DTEND:20261029T153000Z',
    'SUMMARY:BNDES Garagem na Escola de Engenharia da UFMG',
    'DESCRIPTION:Palestra BNDES Garagem: da engenharia ao impacto — transformando soluções em negócios. Apresentação do edital de 100 vagas.',
    'LOCATION:Auditório da Escola de Engenharia da UFMG, Av. Pres. Antônio Carlos 6627, Belo Horizonte - MG',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'bndes_garagem_ufmg.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==========================================================================
   8. FAQ ACCORDION INTERATIVO
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. SCROLL DO HEADER & BOTÃO FLUTUANTE MOBILE
   ========================================================================== */
function initHeaderAndFloatingCta() {
  const header = document.querySelector('.site-header');
  const floatingCta = document.querySelector('.floating-cta-mobile');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (floatingCta) {
      // Aparece após rolar 400px e esconde perto do próprio formulário
      const inscricaoSec = document.getElementById('inscricao');
      const rect = inscricaoSec ? inscricaoSec.getBoundingClientRect() : null;
      const isFormVisible = rect && rect.top < window.innerHeight && rect.bottom > 0;

      if (scrollY > 450 && !isFormVisible) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }
  });

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '80px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = '#ffffff';
      navLinks.style.padding = '20px';
      navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    });
  }
}

/* ==========================================================================
   10. ADMIN EXPORTER (ATALHO CTRL+SHIFT+H OU CLIQUE NO RODAPÉ)
   ========================================================================== */
function initAdminExporter() {
  const trigger = document.getElementById('admin-export-trigger');

  function exportData() {
    const data = JSON.parse(localStorage.getItem('ufmg_hub_bndes_inscricoes') || '[]');
    if (data.length === 0) {
      alert('Nenhuma inscrição salva localmente neste dispositivo até o momento.');
      return;
    }

    const format = confirm(`Há ${data.length} inscrições salvas.\n\nClique em [OK] para baixar em CSV (Excel) ou [Cancelar] para baixar em JSON.`);
    
    if (format) {
      const headers = ['Tipo', 'ID', 'Nome', 'Responsavel', 'Email', 'Telefone', 'Departamento', 'Laboratorios', 'Especialidades', 'OfertaIndustria', 'Data'];
      const rows = data.map(d => [
        `"${d.tipo || ''}"`,
        `"${d.id || ''}"`,
        `"${d.nome || ''}"`,
        `"${d.responsavel || ''}"`,
        `"${d.email || ''}"`,
        `"${d.telefone || ''}"`,
        `"${d.departamento || ''}"`,
        `"${d.laboratorios || ''}"`,
        `"${(d.especialidades || '').replace(/"/g, '""')}"`,
        `"${(d.ofertaIndustria || '').replace(/"/g, '""')}"`,
        `"${d.dataRegistro || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `inscricoes_bndes_garagem_ufmg_hub_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', jsonStr);
      link.setAttribute('download', `inscricoes_bndes_garagem_ufmg_hub_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      exportData();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'H' || e.key === 'h')) {
      e.preventDefault();
      exportData();
    }
  });
}
