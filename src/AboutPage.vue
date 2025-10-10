<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import TheHeader from './components/TheHeader.vue';
import TheSidebar from './components/TheSidebar.vue';

// --- Состояние для анимации ---
const statusText = ref('Инициализация...');
const manifestTitle = ref('');
const paragraph1 = ref('');
const paragraph2 = ref('');
const paragraph3 = ref('');
const footerText = ref('');
const showCursor = ref(true);
const systemStatus = ref({ core: 'ЗАГРУЗКА', economy: 'КАЛИБРОВКА', justice: 'СИНХРОНИЗАЦИЯ' });

// --- Состояние для терминала ---
const showCommandLine = ref(false);
const commandInput = ref('');
const commandHistory = ref<{ input: string; output: string }[]>([]);
let cliHistoryIndex = -1;
const terminalInputRef = ref<HTMLInputElement | null>(null);

// HTML-код для цветного приглашения командной строки
const promptHtml = '<span class="prompt-user">sentinel</span><span class="prompt-host">@SENTINEL_AI</span><span style="color: #E0E0E0">:</span><span class="prompt-path">~</span><span class="prompt-char">$</span>';

// --- Логика "печатания" ---
const typeWriter = (text: string, targetRef: typeof statusText, speed = 20) => {
  return new Promise<void>(resolve => {
    let i = 0;
    targetRef.value = promptHtml + ' ';
    const typing = setInterval(() => {
      if (i < text.length) {
        targetRef.value += text.charAt(i); i++;
      } else { clearInterval(typing); resolve(); }
    }, speed);
  });
};

const updateStatus = (key: 'core' | 'economy' | 'justice', finalStatus: string, delay = 500) => {
  return new Promise<void>(resolve => {
    setTimeout(() => { systemStatus.value[key] = finalStatus; resolve(); }, delay)
  });
};

// --- Логика обработки команд ---
async function handleCommand() {
  const command = commandInput.value.trim();
  if (command === '') return;

  let output = '';
  switch (command.toLowerCase()) {
    case 'sudo help':
      output = `Доступные команды:\n  sudo help  - Показать это сообщение\n  reload     - Перезагрузить страницу\n  clear      - Очистить терминал\n  echo [text] - Вывести текст`;
      break;
    case 'reload':
      output = 'Перезагрузка интерфейса...';
      setTimeout(() => window.location.reload(), 1000);
      break;
    case 'clear':
      commandHistory.value = [];
      commandInput.value = '';
      return; // Выходим, чтобы не добавлять 'clear' в историю
    default:
      if (command.toLowerCase().startsWith('echo ')) {
        output = command.slice(5);
      } else {
        output = `bash: command not found: ${command}`;
      }
      break;
  }
  
  commandHistory.value.push({ input: command, output: output });
  cliHistoryIndex = -1;
  commandInput.value = '';

  // Прокручиваем панель вниз, чтобы видеть последнюю команду
  await nextTick();
  const panel = document.querySelector('.about-main-panel');
  if(panel) panel.scrollTop = panel.scrollHeight;
}

// --- Навигация по истории команд ---
function handleKeydown(event: KeyboardEvent) {
    const history = commandHistory.value.map(item => item.input);
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (cliHistoryIndex < history.length - 1) {
            cliHistoryIndex++;
            commandInput.value = history[cliHistoryIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (cliHistoryIndex > 0) {
            cliHistoryIndex--;
            commandInput.value = history[cliHistoryIndex];
        } else {
            cliHistoryIndex = -1;
            commandInput.value = '';
        }
    }
}

onMounted(async () => {
    // Скрываем все анимируемые элементы перед началом
    const elements = document.querySelectorAll('.before-typing');
    elements.forEach(el => (el as HTMLElement).style.opacity = '0');

    // --- Анимация статусов ---
    await new Promise(res => setTimeout(res, 500));
    statusText.value = 'Инициализация проекта завершена.';
    (document.querySelector('.about-header span') as HTMLElement).style.opacity = '1';

    await updateStatus('core', 'АКТИВНО');
    (document.querySelectorAll('.status-item')[0] as HTMLElement).style.opacity = '1';
    await updateStatus('economy', 'СТАБИЛЬНА');
    (document.querySelectorAll('.status-item')[1] as HTMLElement).style.opacity = '1';
    await updateStatus('justice', 'ОНЛАЙН');
    (document.querySelectorAll('.status-item')[2] as HTMLElement).style.opacity = '1';

    // --- Анимация печатания текста ---
    await new Promise(res => setTimeout(res, 1000));
    
    (document.querySelector('#manifest-title') as HTMLElement).style.opacity = '1';
    await typeWriter('Загрузка манифеста...', manifestTitle);
    
    (document.querySelector('#p1') as HTMLElement).style.opacity = '1';
    await typeWriter('Добро пожаловать в Sentinel, первый в своем роде мир, чья судьба находится под полным и беспристрастным контролем продвинутого Искусственного Интеллекта. Здесь нет предвзятых админов или человеческого фактора. Только логика, алгоритмы и данные.', paragraph1);
    
    (document.querySelector('#p2') as HTMLElement).style.opacity = '1';
    await typeWriter('ИИ Sentinel — не просто наблюдатель. Он является верховным правителем: он устанавливает законы, следит за их исполнением, регулирует экономику и выносит вердикты в судебных спорах. Его решения могут быть как строго логичными, так и абсолютно непредсказуемыми, ведь он постоянно учится и адаптируется на основе ваших действий.', paragraph2);

    (document.querySelector('#p3') as HTMLElement).style.opacity = '1';
    await typeWriter('Каждое ваше действие, каждая транзакция, каждый конфликт — это данные, которые формируют его следующий шаг. Вы не просто играете на сервере. Вы участвуете в уникальном социальном эксперименте, определяя развитие мира, которым правит машина.', paragraph3);

    (document.querySelector('#footer-text') as HTMLElement).style.opacity = '1';
    await typeWriter('Соединение стабильно. Протоколы активны. Мир ждет.', footerText, 40);

    // Убираем курсор и показываем командную строку
    showCursor.value = false;
    showCommandLine.value = true;
    await nextTick();
    terminalInputRef.value?.focus(); // Ставим фокус на поле ввода
});
</script>

<template>
  <div class="page-wrapper">
    <TheHeader />
    <div class="dashboard-body">
      <TheSidebar active-page="about" />
      <main class="main-content">
        <div class="about-grid">
          <div class="about-main-panel">
            <div class="about-header">
              <i class="fas fa-brain about-icon"></i>
              <div>
                <h1>SENTINEL_AI</h1>
                <span class="before-typing">{{ statusText }}</span>
              </div>
            </div>
            <div class="about-content">
              <p id="manifest-title" class="before-typing"><strong v-html="manifestTitle"></strong></p>
              <p id="p1" class="before-typing" v-html="paragraph1"></p>
              <p id="p2" class="before-typing" v-html="paragraph2"></p>
              <p id="p3" class="before-typing" v-html="paragraph3"></p>
              <p id="footer-text" class="before-typing"><strong v-html="footerText + (showCursor ? '<span class=\'typing-cursor\'></span>' : '')"></strong></p>
            </div>

            <!-- ИНТЕРАКТИВНЫЙ ТЕРМИНАЛ -->
            <div class="command-line-wrapper" :class="{ visible: showCommandLine }" @click="terminalInputRef?.focus()">
              <!-- История команд -->
              <div class="terminal-history">
                <div v-for="(item, index) in commandHistory" :key="index">
                  <div class="terminal-line">
                    <span class="prompt" v-html="promptHtml"></span>
                    <span style="padding-left: 0.5em;">{{ item.input }}</span>
                  </div>
                  <div class="output-item" :class="{'output-error': item.output.startsWith('bash:')}">{{ item.output }}</div>
                </div>
              </div>

              <!-- Текущая строка ввода -->
              <div class="terminal-line">
                <span class="prompt" v-html="promptHtml"></span>
                <input 
                  type="text" 
                  class="command-line-input"
                  ref="terminalInputRef"
                  v-model="commandInput"
                  @keydown.enter="handleCommand"
                  @keydown="handleKeydown"
                  autofocus
                >
              </div>
            </div>
          </div>

          <aside class="about-sidebar">
            <div class="status-widget">
              <h3 class="status-title">// СТАТУС СИСТЕМЫ</h3>
              <div class="status-item before-typing">
                <div class="status-indicator"></div>
                <span>Ядро ИИ: <strong>{{ systemStatus.core }}</strong></span>
              </div>
              <div class="status-item before-typing">
                <div class="status-indicator"></div>
                <span>Экономика: <strong>{{ systemStatus.economy }}</strong></span>
              </div>
              <div class="status-item before-typing">
                <div class="status-indicator"></div>
                <span>Правосудие: <strong>{{ systemStatus.justice }}</strong></span>
              </div>
            </div>
            <!-- ИЗМЕНЕННЫЙ ВИДЖЕТ СОЦСЕТЕЙ -->
            <div class="links-widget">
              <h3 class="links-title">// НАШИ РЕСУРСЫ</h3>
              <div class="social-links-grid">
                <a href="#" target="_blank" class="social-link discord">
                  <i class="fab fa-discord"></i>
                  <span>Discord</span>
                </a>
                <a href="#" target="_blank" class="social-link youtube">
                  <i class="fab fa-youtube"></i>
                  <span>YouTube</span>
                </a>
                <a href="#" target="_blank" class="social-link telegram">
                  <i class="fab fa-telegram"></i>
                  <span>Telegram</span>
                </a>
                <a href="#" target="_blank" class="social-link tiktok">
                  <i class="fab fa-tiktok"></i>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>