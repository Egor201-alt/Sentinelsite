document.addEventListener('DOMContentLoaded', () => {
    // --- Логика для кастомных выпадающих списков ---

    // TS FIX: Указываем, что ищем коллекцию HTMLElement
    const filterGroups = document.querySelectorAll<HTMLElement>('.filter-group');

    // TS FIX: Типизируем аргумент. Он может быть либо элементом, либо null.
    const closeAllDropdowns = (exceptThisOne: HTMLElement | null = null) => {
        filterGroups.forEach(group => {
            if (group !== exceptThisOne) {
                group.classList.remove('active');
            }
        });
    };

    filterGroups.forEach(group => {
        // TS FIX: Добавляем типы для всех элементов внутри компонента.
        const select = group.querySelector<HTMLElement>('.styled-select');
        const menu = group.querySelector<HTMLElement>('.dropdown-menu');
        
        // TS FIX: Критически важная проверка. Если нет основных частей, пропускаем эту группу.
        if (!select || !menu) return;

        // TS FIX: Указываем, что ищем коллекцию HTMLLIElement.
        const options = group.querySelectorAll<HTMLLIElement>('.dropdown-menu li');
        const selectedDisplay = select.querySelector<HTMLSpanElement>('span');
        const selectedIcon = select.querySelector<HTMLElement>('.selected-icon');

        // TS FIX: Дополнительная проверка на наличие элемента для отображения текста.
        // Без него дальнейшая логика не имеет смысла.
        if (!selectedDisplay) return;

        // TS FIX: Указываем тип события (MouseEvent) для доступа к e.stopPropagation()
        select.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            const wasActive = group.classList.contains('active');
            // Сначала закрываем все остальные
            closeAllDropdowns(group);
            // Затем переключаем текущий
            group.classList.toggle('active');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                // TS FIX: Безопасно получаем текст и иконку из выбранной опции.
                // Используем `?? ''` на случай, если textContent будет null.
                const text = option.textContent ?? '';
                // `dataset.icon` может быть undefined, это нормально.
                const iconClass = option.dataset.icon;

                // Обновляем отображение в "селекте"
                selectedDisplay.textContent = text;

                // TS FIX: Обновляем иконку, только если она существует и у опции есть data-icon.
                if (selectedIcon && iconClass) {
                    // .className полностью заменяет классы, что безопасно.
                    selectedIcon.className = `selected-icon ${iconClass}`;
                }
                
                group.classList.remove('active');
            });
        });
    });

    // Закрываем все меню, если клик был вне их
    window.addEventListener('click', () => {
        closeAllDropdowns();
    });

});