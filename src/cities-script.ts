document.addEventListener('DOMContentLoaded', () => {

    // --- Управление модальным окном ---
    const openMapBtn = document.getElementById('open-map-btn');
    const closeMapBtn = document.getElementById('close-map-btn');
    const mapModal = document.getElementById('map-modal');
    const popup = document.getElementById('info-popup');

    if (openMapBtn && closeMapBtn && mapModal && popup) {
        openMapBtn.addEventListener('click', () => {
            mapModal.classList.remove('hidden');
        });

        closeMapBtn.addEventListener('click', () => {
            mapModal.classList.add('hidden');
            popup.classList.add('hidden');
        });
    }

    // TS FIX: Явно указываем, что это HTML-элементы, чтобы TS знал об их свойствах.
    const viewport = document.getElementById('map-viewport') as HTMLElement;
    const mapContainer = document.getElementById('map-container') as HTMLElement;
    
    // --- Логика перетаскивания карты (Panning) ---
    // TS FIX: Задаем типы для переменных состояния.
    let isDragging: boolean = false;
    let startX: number = 0;
    let startY: number = 0;
    let scrollLeft: number = 0;
    let scrollTop: number = 0;

    // TS FIX: Проверяем наличие обоих элементов перед добавлением обработчиков.
    if (viewport && mapContainer) {
        // TS FIX: Указываем тип события - MouseEvent.
        viewport.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button !== 0) return; 
            if (popup && !popup.classList.contains('hidden')) {
                popup.classList.add('hidden');
            }
            isDragging = true;
            viewport.style.cursor = 'grabbing';
            startX = e.pageX - viewport.offsetLeft;
            startY = e.pageY - viewport.offsetTop;
            scrollLeft = viewport.scrollLeft;
            scrollTop = viewport.scrollTop;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e: MouseEvent) => {
            if (!isDragging) return;
            const x = e.pageX - viewport.offsetLeft;
            const y = e.pageY - viewport.offsetTop;
            viewport.scrollLeft = scrollLeft - (x - startX);
            viewport.scrollTop = scrollTop - (y - startY);
        });

        const stopDragging = () => {
            if (isDragging) {
                isDragging = false;
                viewport.style.cursor = 'grab';
            }
        };

        window.addEventListener('mouseup', stopDragging);
        viewport.addEventListener('mouseleave', stopDragging);
    }
    
    // --- Логика масштабирования (ЗУМ) ---
    let scale: number = 1;
    const minScale: number = 1;
    const maxScale: number = 1.5;
    const zoomIntensity: number = 0.1;

    if (viewport && mapContainer) {
        mapContainer.style.transform = `scale(${scale})`;
        // TS FIX: Указываем тип события - WheelEvent, т.к. нам нужно свойство deltaY.
        viewport.addEventListener('wheel', (e: WheelEvent) => {
            e.preventDefault();
            if (scale <= minScale && e.deltaY > 0) return;
            const rect = viewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const oldScale = scale;
            scale += (e.deltaY < 0 ? 1 : -1) * zoomIntensity;
            scale = Math.max(minScale, Math.min(maxScale, scale));
            const scaleRatio = scale / oldScale;
            viewport.scrollLeft = (viewport.scrollLeft + mouseX) * scaleRatio - mouseX;
            viewport.scrollTop = (viewport.scrollTop + mouseY) * scaleRatio - mouseY;
            mapContainer.style.transform = `scale(${scale})`;
        });
    }

    // --- ЛОГИКА POP-UP ОКОН ---
    // TS FIX: Указываем, что ищем коллекцию HTMLElement.
    const nodes = document.querySelectorAll<HTMLElement>('.map-node');
    const popupCityName = document.getElementById('popup-city-name');
    const popupCoords = document.getElementById('popup-coords');
    const popupMayor = document.getElementById('popup-mayor');
    const popupResidents = document.getElementById('popup-residents');
    const popupStatus = document.getElementById('popup-status');

    // TS FIX: Добавляем одну большую проверку на наличие ВСЕХ элементов pop-up'а.
    // Если хотя бы одного нет, код не будет выполняться и не вызовет ошибку.
    if (popup && popupCityName && popupCoords && popupMayor && popupResidents && popupStatus) {
        nodes.forEach(node => {
            node.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation(); 

                // TS FIX: Dataset-атрибуты могут быть undefined. Используем `??` (nullish coalescing)
                // чтобы предоставить значение по умолчанию и избежать ошибок.
                const cityName = node.dataset.cityName ?? 'Неизвестный город';
                const mayor = node.dataset.mayor ?? 'Нет данных';
                const residents = node.dataset.residents ?? '0';
                const status = node.dataset.status ?? 'Закрыт';
                const coordX = node.dataset.x ?? 'N/A';
                const coordZ = node.dataset.z ?? 'N/A';

                // Заполняем pop-up
                popupCityName.textContent = cityName;
                popupCoords.textContent = `${coordX}, ${coordZ}`;
                popupMayor.textContent = mayor;
                popupResidents.textContent = residents;
                popupStatus.innerHTML = `<span class="status-pill ${status === 'Открыт' ? 'status-open' : 'status-closed'}">${status}</span>`;
                
                // Позиционирование
                const nodeLeft = node.offsetLeft;
                const nodeTop = node.offsetTop;

                popup.style.left = `${nodeLeft}px`;
                popup.style.top = `${nodeTop - 20}px`; // Скорректируем позицию чуть выше
                
                popup.classList.remove('hidden');
            });
        });
    }

    if (mapModal && popup) {
        mapModal.addEventListener('click', () => {
            if (!popup.classList.contains('hidden')) {
                popup.classList.add('hidden');
            }
        });
    }
});