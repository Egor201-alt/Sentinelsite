<script setup lang="ts">
import './landing-style.css'; // <-- Убедись, что путь к стилям верный
import { ref, onMounted, onUnmounted } from 'vue';

const player = {
    nickname: 'egor201'
};

// --- Секция для управления мобильным меню ---
const isMobileMenuOpen = ref(false);
const mobileNavRef = ref<HTMLElement | null>(null);
const mobileToggleRef = ref<HTMLElement | null>(null);

const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };

const closeMenuOnClickOutside = (event: MouseEvent) => {
    if (isMobileMenuOpen.value && mobileNavRef.value && mobileToggleRef.value && !mobileNavRef.value.contains(event.target as Node) && !mobileToggleRef.value.contains(event.target as Node)) {
        isMobileMenuOpen.value = false;
    }
};

// --- Секция для управления модальным окном заявки ---
const isModalOpen = ref(false);
const formData = ref({
  nickname: '',
  age: '',
  roleplay_goals: '',
  why_us: ''
});

const openModal = () => {
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden'; // Блокируем скролл фона
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = ''; // Возвращаем скролл
};

const submitApplication = () => {
  // Тут будет твоя логика отправки данных на сервер
  console.log('Отправка заявки:', formData.value);
  alert('Ваша заявка успешно отправлена на рассмотрение!');
  closeModal();
};

// --- Хуки жизненного цикла ---
onMounted(() => {
    // @ts-ignore
    if (window.particlesJS) {
        // @ts-ignore
        window.particlesJS("particles-js", { "particles": { "number": { "value": 50, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#FCD34D" }, "shape": { "type": "circle" }, "opacity": { "value": 0.3, "random": true }, "size": { "value": 2, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#FCD34D", "opacity": 0.1, "width": 1 }, "move": { "enable": true, "speed": 1.5, "direction": "none", "out_mode": "out" } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "resize": true }, "modes": { "repulse": { "distance": 100, "duration": 0.4 } } } });
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    document.addEventListener('click', closeMenuOnClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', closeMenuOnClickOutside);
    document.body.style.overflow = ''; // На всякий случай
});
</script>

<template>
    <div id="particles-js"></div>

    <!-- ШАПКА И ПРОФИЛЬ -->
    <header class="landing-header">
      <a href="#" class="logo">
        <img src="/assets/icon_sentinel.png" alt="Логотип Sentinel">
        <span>Sentinel</span>
      </a>
      <nav class="header-nav">
        <a href="#features">Особенности</a>
        <a href="#">Википедия</a>
        <a href="#">Правила</a>
      </nav>
      <div class="header-right-panel">
        <div class="social-links">
          <a href="#" target="_blank" title="Discord"><i class="fab fa-discord"></i></a>
          <a href="#" target="_blank" title="Telegram"><i class="fab fa-telegram"></i></a>
          <a href="#" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>
        </div>
        <a href="profile.html" class="auth-btn">
          <span>{{ player.nickname }}</span>
          <img :src="`https://visage.surgeplay.com/face/32/${player.nickname}.png`" alt="Аватар">
        </a>
      </div>
      <button class="mobile-menu-btn" ref="mobileToggleRef" @click="toggleMobileMenu">
        <i v-if="!isMobileMenuOpen" class="fas fa-bars"></i>
        <i v-else class="fas fa-times"></i>
      </button>
    </header>

    <div class="mobile-nav" ref="mobileNavRef" :class="{ open: isMobileMenuOpen }">
      <a href="#features">Особенности</a>
      <a href="#">Википедия</a>
      <a href="#">Правила</a>
    </div>

    <!-- ОСНОВНОЙ КОНТЕНТ -->
    <main>
        <section class="container hero">
            <div class="hero-content animate-on-scroll">
                <h1>Твоя история,<br>написанная<br><span class="highlight">нейросетью</span></h1>
                <p>Sentinel — это RolePlay-эксперимент. Законы, экономика и сюжет здесь создаются непредсказуемым ИИ. Забудь о правилах. Адаптируйся.</p>
                <div class="cta-buttons">
                    <a href="#" class="btn btn-primary" @click.prevent="openModal">Подать заявку</a>
                    <a href="#features" class="btn btn-secondary">Узнать больше</a>
                </div>
            </div>
            <div class="hero-render animate-on-scroll" style="transition-delay: 150ms;">
                [ Место для вашего эпичного рендера ]
            </div>
        </section>

        <section id="features" class="container">
            <h2 class="animate-on-scroll">Ключевые особенности</h2>
            <div class="features-grid">
                <div class="feature-card animate-on-scroll" style="transition-delay: 100ms;"><div class="card-content"><div class="feature-icon"><i class="fa-solid fa-gavel"></i></div><h3>ИИ-Правосудие</h3><p>Забудь о предвзятых модераторах. Sentinel AI анализирует логи и выносит вердикты, которые могут быть как строго логичными, так и абсолютно непредсказуемыми.</p></div></div>
                <div class="feature-card animate-on-scroll" style="transition-delay: 200ms;"><div class="card-content"><div class="feature-icon"><i class="fa-solid fa-chart-line"></i></div><h3>Живая Экономика</h3><p>Нейросеть постоянно следит за рынком, регулируя цены и вводя уникальные экономические события, чтобы поддерживать баланс и интерес.</p></div></div>
                <div class="feature-card animate-on-scroll" style="transition-delay: 300ms;"><div class="card-content"><div class="feature-icon"><i class="fa-solid fa-users"></i></div><h3>Динамичный мир</h3><p>Правила сервера не высечены в камне. ИИ может изменять их в зависимости от действий игроков, создавая по-настояшему живой и развивающийся мир.</p></div></div>
            </div>
        </section>

        <section id="algorithm" class="container">
            <h2 class="animate-on-scroll">Алгоритм работы Sentinel AI</h2>
            <div class="algorithm-timeline animate-on-scroll">
                <div class="algo-step"><div class="algo-icon"><i class="fa-solid fa-database"></i></div><h4>Сбор данных</h4><p>Каждое действие на сервере анализируется.</p></div>
                <div class="algo-step"><div class="algo-icon"><i class="fa-solid fa-brain"></i></div><h4>Анализ и обучение</h4><p>ИИ делает выводы и адаптирует свои модели.</p></div>
                <div class="algo-step"><div class="algo-icon"><i class="fa-solid fa-gear"></i></div><h4>Принятие решения</h4><p>ИИ вносит новые правила, выносит вердикты или запускает ивент.</p></div>
                <div class="algo-step"><div class="algo-icon"><i class="fa-solid fa-arrows-rotate"></i></div><h4>Цикл обратной связи</h4><p>Реакция игроков становится новыми данными для анализа.</p></div>
            </div>
        </section>

        <section id="final-cta" class="container animate-on-scroll">
            <div class="cta-content">
                <h2>Готов стать частью <span class="highlight">эксперимента?</span></h2>
                <p>Sentinel — это сервер с whitelist-системой. Мы ищем игроков, готовых влиять на историю и принимать непредсказуемые вызовы. Места ограничены.</p>
                <a href="#" class="btn btn-primary btn-large" @click.prevent="openModal">ПОДАТЬ ЗАЯВКУ НА WHITELIST</a>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>© 2024 Sentinel Project. Все права защищены.</p>
    </footer>

    <!-- УНИКАЛЬНОЕ МОДАЛЬНОЕ ОКНО ЗАЯВКИ -->
    <Transition name="modal-fade">
        <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
            <div class="modal-container" @click.stop>
            <!-- Левая информационная панель -->
            <div class="modal-info-panel">
                <div class="info-logo">
                    <img src="/assets/icon_sentinel.png" alt="Sentinel">
                    <span>Sentinel Whitelist</span>
                </div>
                <p class="info-description">
                    Ваша заявка — первый шаг в уникальный мир, управляемый ИИ. Отнеситесь к ответам серьезно.
                </p>
                
                <!-- НОВЫЙ БЛОК ДЛЯ ВИДЕО -->
                <div class="info-video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <!-- КОНЕЦ НОВОГО БЛОКА -->
                
                <ul class="info-tips">
                    <li><i class="fas fa-check"></i><span>Будьте честны и развернуты</span></li>
                    <li><i class="fas fa-check"></i><span>Продемонстрируйте креативность</span></li>
                    <li><i class="fas fa-check"></i><span>Покажите, что вы понимаете концепцию</span></li>
                </ul>
                <div class="info-footer">
                    Эксперимент ждет вас.
                </div>
            </div>

                <!-- Правая панель с формой -->
                <div class="modal-form-panel">
                    <button class="modal-close-btn" @click="closeModal" title="Закрыть">&times;</button>
                    <header class="modal-header">
                        <h2>Анкета на заявку</h2>
                        <p>Пожалуйста, заполните все поля</p>
                    </header>
                    <div class="modal-body">
                        <form @submit.prevent="submitApplication">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="nickname">Ваш никнейм в Minecraft</label>
                                    <input type="text" id="nickname" v-model="formData.nickname" placeholder="opl67" required>
                                </div>
                                <div class="form-group">
                                    <label for="age">Ваш реальный возраст</label>
                                    <input type="number" id="age" v-model="formData.age" placeholder="14" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="roleplay_goals">Чем планируете заниматься на сервере?</label>
                                <textarea id="roleplay_goals" v-model="formData.roleplay_goals" rows="4" placeholder="Загриферю сервер, сделаю лавакаст на спавне, ебну нейросеть" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="why_us">Почему вы выбрали именно наш проект?</label>
                                <textarea id="why_us" v-model="formData.why_us" rows="4" placeholder="Расскажите, что вас привлекло в концепции ИИ-управления" required></textarea>
                            </div>

                            <!-- ВОТ ДОБАВЛЕННЫЙ БЛОК -->
                            <div class="form-disclaimer">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                <span>Все заявки проверяет нейросеть. Мы не несем ответственности за ее решения. В случае отклонениея вы можете подать аппеляцию</span>
                            </div>
                            <!-- КОНЕЦ ДОБАВЛЕННОГО БЛОКА -->
                            
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-primary btn-large">Отправить на рассмотрение</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>