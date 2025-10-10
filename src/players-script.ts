document.addEventListener('DOMContentLoaded', () => {
    // --- ПОИСК ИГРОКОВ ---

    const searchInput = document.getElementById('player-search-input') as HTMLInputElement;
    const searchButton = document.getElementById('search-btn') as HTMLButtonElement;
    const playerCards = document.querySelectorAll<HTMLElement>('.player-card');
    const searchResultsInfo = document.getElementById('search-results-info');
    const noResultsMessage = document.getElementById('no-results-message');

    // TS FIX: Функция теперь объявлена снаружи и принимает все необходимые элементы как аргументы.
    // Это делает ее самодостаточной и решает проблему с ошибками TypeScript.
    function performSearch(
        input: HTMLInputElement, 
        resultsInfo: HTMLElement, 
        noResults: HTMLElement, 
        cards: NodeListOf<HTMLElement>
    ) {
        const searchTerm = input.value.toLowerCase().trim();
        let foundCount = 0;

        cards.forEach(card => {
            const playerNameElement = card.querySelector('.player-name');
            if (playerNameElement?.textContent) {
                const playerName = playerNameElement.textContent.toLowerCase();
                const isVisible = playerName.includes(searchTerm);
                
                card.classList.toggle('hidden', !isVisible);
                
                if (isVisible) {
                    foundCount++;
                }
            }
        });

        if (searchTerm === '') {
            resultsInfo.classList.add('hidden');
            noResults.classList.add('hidden');
            cards.forEach(card => card.classList.remove('hidden'));
        } else if (foundCount > 0) {
            resultsInfo.innerHTML = `Найдено по запросу "<span>${searchTerm}</span>" ${foundCount} результатов:`;
            resultsInfo.classList.remove('hidden');
            noResults.classList.add('hidden');
        } else {
            const span = noResults.querySelector('span');
            if (span) {
                span.innerHTML = `Игрок "<strong>${searchTerm}</strong>" не найден`;
            }
            noResults.classList.remove('hidden');
            resultsInfo.classList.add('hidden');
        }
    }

    // Проверяем, что все элементы существуют
    if (searchInput && searchButton && playerCards.length > 0 && searchResultsInfo && noResultsMessage) {

        // Вешаем слушатель события 'click', вызывая нашу новую функцию с нужными аргументами
        searchButton.addEventListener('click', () => {
            performSearch(searchInput, searchResultsInfo, noResultsMessage, playerCards);
        });

        // Поиск по нажатию Enter
        searchInput.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                performSearch(searchInput, searchResultsInfo, noResultsMessage, playerCards);
            }
        });
    }

    // --- ЛОГИКА КАСТОМНОГО ВЫПАДАЮЩЕГО СПИСКА ---
    // Эта часть кода была корректной и остается без изменений.

    const customSelect = document.getElementById('custom-select');

    if (customSelect) {
        const trigger = customSelect.querySelector<HTMLElement>('.custom-select-trigger');
        const options = customSelect.querySelector<HTMLElement>('.custom-options');
        const optionItems = customSelect.querySelectorAll<HTMLElement>('.custom-option');
        const selectedText = customSelect.querySelector<HTMLElement>('.selected-option-text');
        const hiddenInput = document.getElementById('role-value') as HTMLInputElement;

        if (trigger && options && selectedText && hiddenInput) {
            trigger.addEventListener('click', () => {
                customSelect.classList.toggle('open');
                options.classList.toggle('hidden');
            });

            optionItems.forEach(option => {
                option.addEventListener('click', () => {
                    options.querySelector('.selected')?.classList.remove('selected');
                    option.classList.add('selected');

                    selectedText.innerHTML = option.innerHTML;
                    
                    const selectedValue = option.getAttribute('data-value');
                    hiddenInput.value = selectedValue ?? '';

                    customSelect.classList.remove('open');
                    options.classList.add('hidden');
                });
            });

            window.addEventListener('click', (e: MouseEvent) => {
                if (!customSelect.contains(e.target as Node)) {
                    customSelect.classList.remove('open');
                    options.classList.add('hidden');
                }
            });
        }
    }
});