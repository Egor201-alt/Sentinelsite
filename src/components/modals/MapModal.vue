<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close']);

const viewport = ref<HTMLElement | null>(null);
const mapContainer = ref<HTMLElement | null>(null);
const popupRef = ref<HTMLElement | null>(null);

const cities = [
    { name: "Тест201", mayor: "Egor201", residents: 201, status: "Открыт", coords: {x: "N/A", z: "N/A"}, position: { left: '25%', top: '25%' }, nodeClass: 'node-blue' },
    { name: "ОплеЛенд", mayor: "opl67", residents: 1488, status: "Открыт", coords: {x: "N/A", z: "N/A"}, position: { left: '30%', top: '25%' }, nodeClass: 'node-blue' },
    { name: "Мекс. Картель", mayor: "Мега крутой Картем", residents: 16, status: "Закрыт", coords: {x: "N/A", z: "N/A"}, position: { left: '50%', top: '15%' }, nodeClass: 'node-red' },
    { name: "Лоутаб", mayor: "Блари", residents: 1, status: "Закрыт", coords: {x: "N/A", z: "N/A"}, position: { left: '75%', top: '57%' }, nodeClass: 'node-green' },
];

const isPopupVisible = ref(false);
const popupData = ref({ name: '', mayor: '', residents: 0, status: 'Закрыт', coords: ''});
const popupPosition = ref({ top: '0px', left: '0px' });

const scale = ref(1);
const isDragging = ref(false);
let startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0;

async function handleNodeClick(e: MouseEvent, city: typeof cities[0]) {
    e.stopPropagation();
    const node = e.currentTarget as HTMLElement;

    popupData.value = {
        name: city.name,
        mayor: city.mayor,
        residents: city.residents,
        status: city.status,
        coords: `${city.coords.x}, ${city.coords.z}`
    };
    
    isPopupVisible.value = true;
    await nextTick();

    const popupEl = popupRef.value;
    if (!popupEl) return;

    // ИСПРАВЛЕНИЕ: Отступ теперь 5px, как ты и просил.
    const newTop = node.offsetTop + node.offsetHeight + 5; 
    const newLeft = node.offsetLeft + (node.offsetWidth / 2);

    popupPosition.value = {
        top: `${newTop}px`,
        left: `${newLeft}px`
    };
}

const hidePopup = () => {
    isPopupVisible.value = false;
};

// --- Полная, не сокращенная логика карты ---
const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0 || !viewport.value) return; 
    hidePopup();
    isDragging.value = true;
    viewport.value.style.cursor = 'grabbing';
    startX = e.pageX - viewport.value.offsetLeft;
    startY = e.pageY - viewport.value.offsetTop;
    scrollLeft = viewport.value.scrollLeft;
    scrollTop = viewport.value.scrollTop;
    e.preventDefault();
};

const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !viewport.value) return;
    const x = e.pageX - viewport.value.offsetLeft;
    const y = e.pageY - viewport.value.offsetTop;
    viewport.value.scrollLeft = scrollLeft - (x - startX);
    viewport.value.scrollTop = scrollTop - (y - startY);
};

const stopDragging = () => {
    if (isDragging.value && viewport.value) {
        isDragging.value = false;
        viewport.value.style.cursor = 'grab';
    }
};

const handleWheel = (e: WheelEvent) => {
    if (!viewport.value || !mapContainer.value) return;
    e.preventDefault();
    if (scale.value <= 1 && e.deltaY > 0) return;
    
    const rect = viewport.value.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const oldScale = scale.value;
    scale.value += (e.deltaY < 0 ? 1 : -1) * 0.1;
    scale.value = Math.max(1, Math.min(1.5, scale.value));
    
    const scaleRatio = scale.value / oldScale;
    viewport.value.scrollLeft = (viewport.value.scrollLeft + mouseX) * scaleRatio - mouseX;
    viewport.value.scrollTop = (viewport.value.scrollTop + mouseY) * scaleRatio - mouseY;
    
    mapContainer.value.style.transform = `scale(${scale.value})`;
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', stopDragging);
});
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', stopDragging);
});
</script>

<template>
  <div class="map-modal" :class="{hidden: !isVisible}">
    <button class="close-map-btn" @click="emit('close')"><i class="fas fa-times"></i></button>
    <div 
        class="map-viewport" 
        ref="viewport"
        @mousedown="handleMouseDown"
        @mouseleave="stopDragging"
        @wheel="handleWheel"
    >
        <div class="map-container" ref="mapContainer" @click="hidePopup">
            <div class="map-hub"></div>
            <!-- Линии -->
            <div class="line-v line-red" style="left: 50%; top: 0; height: 50%;"></div>
            <div class="line-h line-blue" style="top: 50%; left: 0; width: 50%;"></div>
            <div class="line-h line-green" style="top: 50%; right: 0; width: 50%;"></div>
            <div class="line-v line-yellow" style="left: 50%; bottom: 0; height: 50%;"></div>
            <div class="line-v line-blue" style="left: 25%; top: 25%; height: 25%;"></div> 
            <div class="line-v line-blue" style="left: 30%; top: 25%; height: 25%;"></div>
            <div class="line-h line-dashed" style="left: 25%; top: 25%; width: 5%;"></div>
            <div class="line-v line-green" style="left: 75%; top: 50%; height: 7%;"></div>

            <!-- Узлы и Названия -->
            <div v-for="city in cities" :key="city.name">
              <div 
                class="map-node"
                :class="city.nodeClass"
                :style="city.position"
                @click.stop="handleNodeClick($event, city)"
              ></div>
              <div class="map-node-label" :style="city.position">
                {{ city.name }}
              </div>
            </div>

            <!-- ИСПРАВЛЕНИЕ: Оборачиваем попап в <Transition> для плавной анимации -->
            <Transition name="popup">
              <div class="info-popup" ref="popupRef" v-if="isPopupVisible" :style="popupPosition">
                  <div class="popup-image-placeholder">
                      <i class="fas fa-image"></i><span>Фотография города</span>
                  </div>
                  <div class="popup-content">
                      <h4>{{ popupData.name }}</h4>
                      <p><i class="fas fa-map-marker-alt"></i> Координаты: <strong>{{ popupData.coords }}</strong></p>
                      <p><i class="fas fa-crown"></i> Мэр: <strong>{{ popupData.mayor }}</strong></p>
                      <p><i class="fas fa-users"></i> Жители: <strong>{{ popupData.residents }}</strong></p>
                      <p>Статус: 
                          <span class="status-pill" :class="popupData.status === 'Открыт' ? 'status-open' : 'status-closed'">{{ popupData.status }}</span>
                      </p>
                  </div>
              </div>
            </Transition>
        </div>
        <div class="coords-indicator">
            <span class="coords-label">Location</span>
            <span class="coords-value">0, 0</span>
        </div>
    </div>
  </div>
</template>

<style scoped>
.map-node-label {
  position: absolute;
  transform: translate(-50%, -170%);
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

.info-popup {
    position: absolute;
    transform: translateX(-50%);
    transform-origin: top center;
}

/* --- ИСПРАВЛЕНИЕ: Правильные классы для плавной анимации --- */
/* Классы для компонента <Transition> с именем "popup" */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px) scale(0.95);
}
</style>