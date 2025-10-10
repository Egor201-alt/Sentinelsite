document.addEventListener('DOMContentLoaded', () => {
    
    // --- ЛОГИКА ФИЛЬТРАЦИИ СЧЕТОВ С АНИМИРОВАННЫМ ИНДИКАТОРОМ ---
    // TS FIX: Добавляем тип <HTMLElement> чтобы TS знал, что это HTML-элемент, а не просто Element.
    const filtersContainer = document.querySelector<HTMLElement>('.accounts-header .transaction-filters');
    const accountsList = document.querySelector<HTMLElement>('.accounts-list');
    
    // TS FIX: Добавляем проверку на существование accountsList, это критически важно.
    if (filtersContainer && accountsList) {
        const filters = filtersContainer.querySelectorAll<HTMLElement>('.filter-btn');
        // Сохраняем все карточки в памяти один раз
        const allAccountCards = Array.from(accountsList.querySelectorAll<HTMLElement>('.account-card'));

        const activeIndicator = document.createElement('span');
        activeIndicator.classList.add('active-indicator');
        filtersContainer.prepend(activeIndicator);

        // TS FIX: Функция теперь принимает 'container' как аргумент, чтобы избежать проблем с областью видимости.
        // target может быть либо элементом, либо null.
        function moveIndicator(target: HTMLElement | null, container: HTMLElement) {
            if (!target) return;
            const targetRect = target.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            activeIndicator.style.width = `${targetRect.width}px`;
            activeIndicator.style.transform = `translateX(${targetRect.left - containerRect.left}px)`;
        }

        const initialActiveFilter = filtersContainer.querySelector<HTMLElement>('.filter-btn.active');
        // TS FIX: Передаем filtersContainer в функцию.
        moveIndicator(initialActiveFilter, filtersContainer);

        // TS FIX: filterType может быть строкой или null.
        function filterAccounts(filterType: string | null) {
            // ШАГ 1: Плавно скрываем ВСЕ карточки, которые сейчас видны
            const visibleCards = accountsList!.querySelectorAll<HTMLElement>('.account-card:not(.hidden)');
            visibleCards.forEach(card => card.classList.add('hidden'));

            // ШАГ 2: Ждем окончания анимации скрытия
            setTimeout(() => {
                // ШАГ 3: Полностью очищаем контейнер
                accountsList!.innerHTML = '';
                
                // ШАГ 4: Определяем, какие карточки нужно показать
                const cardsToShow = allAccountCards.filter(card => {
                    const accountType = card.dataset.accountType;
                    switch (filterType) {
                        case 'Карты': return accountType === 'card';
                        case 'Накопления': return accountType === 'savings';
                        default: return true; // 'Все'
                    }
                });

                // ШАГ 5: Добавляем нужные карточки обратно в DOM
                cardsToShow.forEach(card => {
                    card.classList.add('hidden'); // Добавляем скрытыми
                    accountsList!.appendChild(card);
                    // ШАГ 6: С небольшой задержкой плавно показываем их
                    setTimeout(() => card.classList.remove('hidden'), 50);
                });
            }, 300); // Эта задержка должна совпадать с длительностью transition в CSS
        }

        filters.forEach(filter => {
            filter.addEventListener('click', (e: Event) => {
                // TS FIX: Явно указываем, что e.currentTarget - это HTMLElement.
                const currentFilter = e.currentTarget as HTMLElement;
                if (currentFilter.classList.contains('active')) return;

                filters.forEach(f => f.classList.remove('active'));
                currentFilter.classList.add('active');
                
                // TS FIX: Передаем filtersContainer и здесь.
                moveIndicator(currentFilter, filtersContainer);
                // TS FIX: Безопасно получаем textContent, используя опциональную цепочку (?.)
                filterAccounts(currentFilter.textContent?.trim() ?? null);
            });
        });
    }

    // --- ЛОГИКА МОДАЛЬНОГО ОКНА ---
    const openAccountBtn = document.getElementById('open-account-btn');
    const newAccountModal = document.getElementById('new-account-modal');
    const closeAccountBtn = document.getElementById('close-account-modal');
    // TS FIX: Это самое важное исправление. Указываем, что это HTMLInputElement,
    // чтобы TypeScript знал о свойствах .value и .maxLength.
    const accountNameInput = document.getElementById('account-name-input') as HTMLInputElement;
    const charCounter = document.getElementById('char-counter');

    if (openAccountBtn && newAccountModal && closeAccountBtn && accountNameInput && charCounter) {
        
        const openModal = () => {
            newAccountModal.classList.remove('hidden');
            updateCharCounter(); 
        };
        
        const closeModal = () => newAccountModal.classList.add('hidden');

        const updateCharCounter = () => {
            const currentLength = accountNameInput.value.length;
            const maxLength = accountNameInput.maxLength;

            charCounter.textContent = `${currentLength}/${maxLength}`;
            charCounter.classList.toggle('limit-reached', currentLength >= maxLength);
        };

        openAccountBtn.addEventListener('click', openModal);
        closeAccountBtn.addEventListener('click', closeModal);
        // TS FIX: Указываем, что event - это MouseEvent.
        newAccountModal.addEventListener('click', (event: MouseEvent) => {
            if (event.target === newAccountModal) {
                closeModal();
            }
        });

        accountNameInput.addEventListener('input', updateCharCounter);
    }
});