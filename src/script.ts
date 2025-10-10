document.addEventListener('DOMContentLoaded', () => {

    // --- 1. АНИМАЦИЯ СЧЕТЧИКА БАЛАНСА ---
    // TS FIX: Добавили типы для аргументов: element - это HTML-элемент, duration - число.
    function animateBalance(element: HTMLElement, duration: number) {
        // TS FIX: textContent может быть null, поэтому добавили проверку.
        if (!element.textContent) return;
        const finalValue = parseInt(element.textContent, 10);
        if (isNaN(finalValue)) return;

        // TS FIX: startTimestamp может быть либо числом, либо null.
        let startTimestamp: number | null = null;
        
        // TS FIX: timestamp, который передает requestAnimationFrame, является числом.
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // TS FIX: textContent ожидает строку, а Math.floor возвращает число. Конвертируем.
            element.textContent = Math.floor(progress * finalValue).toString();

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = finalValue.toString(); // Убедимся, что в конце точное значение
            }
        };
        element.textContent = '0'; 
        window.requestAnimationFrame(step);
    }

    const balanceElement = document.getElementById('balance-amount');
    if (balanceElement) {
        animateBalance(balanceElement, 1500); 
    }

    // --- 2. КОД ДЛЯ АНИМАЦИИ КАРТЫ ---
    // TS FIX: Указываем, что ищем именно HTML-элементы, а не просто Element.
    const card = document.querySelector<HTMLElement>('.card-display');
    const cardWrapper = document.querySelector<HTMLElement>('.card-display-wrapper');

    if (card && cardWrapper) {
        let isEffectActive = false;

        // TS FIX: 'e' в этом событии - это MouseEvent, у которого есть clientX и clientY.
        const handleMouseMove = (e: MouseEvent) => {
            if (!isEffectActive) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;
            card.style.transform = `translateY(-10px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        const handleMouseLeave = () => {
            isEffectActive = false;
            card.classList.remove('card-active');
            card.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
        };

        cardWrapper.addEventListener('click', () => {
            if (isEffectActive) return;
            isEffectActive = true;
            card.classList.add('card-active');
            card.style.transform = 'translateY(-10px) scale(1.1)';
        });

        cardWrapper.addEventListener('mousemove', handleMouseMove);
        cardWrapper.addEventListener('mouseleave', handleMouseLeave);
    }

    // --- КОД ДЛЯ АНИМАЦИИ ФИЛЬТРОВ ---
    const filtersContainer = document.querySelector<HTMLElement>('.transaction-filters');
    if (filtersContainer) {
        const filters = filtersContainer.querySelectorAll<HTMLElement>('.filter-btn');
        const transactionItemsToFilter = document.querySelectorAll<HTMLElement>('.transactions-panel:not(.fines-panel) .transaction-list > .transaction-item');
        
        const activeIndicator = document.createElement('span');
        activeIndicator.classList.add('active-indicator');
        filtersContainer.prepend(activeIndicator);

        // TS FIX (ИЗМЕНЕНИЕ №1): Теперь функция принимает 'container' как аргумент.
        function moveIndicator(target: HTMLElement | null, container: HTMLElement) {
            if (!target) return;
            const targetRect = target.getBoundingClientRect();
            // TS FIX: Используем 'container', который был передан в функцию.
            const containerRect = container.getBoundingClientRect();
            activeIndicator.style.width = `${targetRect.width}px`;
            activeIndicator.style.transform = `translateX(${targetRect.left - containerRect.left}px)`;
        }

        function filterTransactions(filterType: string | null) {
            transactionItemsToFilter.forEach(item => {
                item.classList.add('hidden');
            });

            setTimeout(() => {
                transactionItemsToFilter.forEach(item => {
                    const amountElement = item.querySelector('.transaction-amount');
                    if (!amountElement) return;

                    const isPositive = amountElement.classList.contains('positive');
                    const isNegative = amountElement.classList.contains('negative');
                    let shouldBeVisible = false;

                    switch (filterType) {
                        case 'Пополнения': if (isPositive) shouldBeVisible = true; break;
                        case 'Списания': if (isNegative) shouldBeVisible = true; break;
                        case 'Все': default: shouldBeVisible = true; break;
                    }
                    if (shouldBeVisible) {
                        item.classList.remove('hidden');
                    }
                });
            }, 150);
        }
        
        const initialActiveFilter = filtersContainer.querySelector<HTMLElement>('.filter-btn.active');
        // TS FIX (ИЗМЕНЕНИЕ №2): Передаем filtersContainer в функцию.
        moveIndicator(initialActiveFilter, filtersContainer);

        filters.forEach(filter => {
            filter.addEventListener('click', (e: Event) => {
                const currentFilter = e.currentTarget as HTMLElement;
                if (currentFilter.classList.contains('active')) return;

                filters.forEach(f => f.classList.remove('active'));
                currentFilter.classList.add('active');
                // TS FIX (ИЗМЕНЕНИЕ №3): И здесь тоже передаем filtersContainer.
                moveIndicator(currentFilter, filtersContainer);
                
                filterTransactions(currentFilter.textContent?.trim() ?? null);
            });
        });
    }

    // --- ЛОГИКА МОДАЛЬНОГО ОКНА АНАЛИТИКИ ---
    const openBtn = document.getElementById('open-analytics-btn');
    const closeBtn = document.getElementById('close-analytics-btn');
    const modal = document.getElementById('analytics-modal');
    const analyticsChart = document.getElementById('analytics-chart');
    const legendItems = document.querySelectorAll<HTMLElement>('.legend-item');

    if (openBtn && closeBtn && modal && analyticsChart) {
        openBtn.addEventListener('click', () => modal.classList.add('modal-visible'));
        const closeModal = () => modal.classList.remove('modal-visible');
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e: MouseEvent) => {
            if (e.target === modal) closeModal();
        });

        legendItems.forEach(item => {
            // TS FIX: dataset.highlight - это string | undefined. Проверяем его наличие.
            const highlightClass = item.dataset.highlight;
            if (highlightClass) {
                item.addEventListener('mouseenter', () => analyticsChart.classList.add(highlightClass));
                item.addEventListener('mouseleave', () => analyticsChart.classList.remove(highlightClass));
            }
        });
    }

    // --- ЛОГИКА РАСКРЫВАЮЩИХСЯ ТРАНЗАКЦИЙ ---
    const transactionItems = document.querySelectorAll<HTMLElement>('.transaction-list .transaction-item');
    transactionItems.forEach(item => {
        const summary = item.querySelector('.transaction-summary');
        if (summary) {
            summary.addEventListener('click', () => {
                transactionItems.forEach(i => {
                    if (i !== item) i.classList.remove('expanded');
                });
                item.classList.toggle('expanded');
            });
        }
    });

    // --- ОБЩАЯ ФУНКЦИЯ ДЛЯ УПРАВЛЕНИЯ МОДАЛЬНЫМИ ОКНАМИ ---
    // Чтобы не повторять один и тот же код, создадим универсальную функцию.
    function setupModal(openBtnId: string, closeBtnId: string, modalId: string) {
        const openBtn = document.getElementById(openBtnId);
        const closeBtn = document.getElementById(closeBtnId);
        const modal = document.getElementById(modalId);

        if (openBtn && closeBtn && modal) {
            const openModal = () => modal.classList.add('visible');
            const closeModal = () => modal.classList.remove('visible');

            openBtn.addEventListener('click', openModal);
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e: MouseEvent) => {
                if (e.target === modal) closeModal();
            });
            document.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal();
            });
            return true; // Возвращаем true, если все элементы найдены
        }
        return false; // Возвращаем false, если что-то не найдено
    }

    // Используем нашу новую функцию
    setupModal('new-transfer-btn', 'close-transfer-modal', 'transfer-modal');
    setupModal('new-payment-btn', 'close-payment-modal', 'payment-modal');
    setupModal('autopay-btn', 'close-autopay-modal', 'autopay-modal');
    setupModal('design-btn', 'close-design-modal', 'design-modal');
    
    // --- ЛОГИКА ВЫПАДАЮЩЕГО МЕНЮ АВТОПЛАТЕЖЕЙ ---
    const autopayCards = document.querySelectorAll<HTMLElement>('.autopay-card');
    autopayCards.forEach(card => {
        const optionsBtn = card.querySelector<HTMLElement>('.autopay-options-btn');
        const dropdown = card.querySelector<HTMLElement>('.autopay-dropdown');
        if (optionsBtn && dropdown) {
            optionsBtn.addEventListener('click', (e: MouseEvent) => {
                e.stopPropagation();
                document.querySelectorAll<HTMLElement>('.autopay-dropdown.visible').forEach(d => {
                    if (d !== dropdown) d.classList.remove('visible');
                });
                dropdown.classList.toggle('visible');
            });
        }
    });
    window.addEventListener('click', () => {
        document.querySelectorAll<HTMLElement>('.autopay-dropdown.visible').forEach(d => {
            d.classList.remove('visible');
        });
    });

    // --- ЛОГИКА МОДАЛЬНОГО ОКНА УПРАВЛЕНИЯ ЛИМИТАМИ ---
    const openLimitsBtn = document.getElementById('limits-btn');
    const closeLimitsBtn = document.getElementById('close-limits-modal');
    const limitsModal = document.getElementById('limits-modal');

    if (openLimitsBtn && closeLimitsBtn && limitsModal) {
        // TS FIX: slider - это не просто HTMLElement, а HTMLInputElement.
        const slider = document.getElementById('limit-slider') as HTMLInputElement;
        const limitValueDisplay = document.getElementById('limit-value');
        const limitDisplayContainer = document.querySelector<HTMLElement>('.limit-display');

        function updateSliderBackground() {
            if (!slider) return;
            const min = parseInt(slider.min, 10);
            const max = parseInt(slider.max, 10);
            const val = parseInt(slider.value, 10);
            const percentage = ((val - min) * 100) / (max - min);
            slider.style.background = `linear-gradient(to right, var(--primary-color) ${percentage}%, #333 ${percentage}%)`;
        }

        function updateLimitDisplay() {
            if (!slider || !limitValueDisplay || !limitDisplayContainer) return;
            const maxValue = parseInt(slider.max, 10);
            const currentValue = parseInt(slider.value, 10);
            const currencySymbol = limitDisplayContainer.querySelector<HTMLElement>('.currency-symbol');

            if (currentValue >= maxValue) {
                limitValueDisplay.textContent = 'Без лимита';
                limitDisplayContainer.classList.add('no-limit');
                if (currencySymbol) currencySymbol.style.display = 'none';
            } else {
                limitValueDisplay.textContent = currentValue.toString();
                limitDisplayContainer.classList.remove('no-limit');
                if (currencySymbol) currencySymbol.style.display = 'inline';
            }
            updateSliderBackground();
        }

        const openModal = () => {
            limitsModal.classList.add('visible');
            updateLimitDisplay(); 
        };
        const closeModal = () => limitsModal.classList.remove('visible');

        openLimitsBtn.addEventListener('click', openModal);
        closeLimitsBtn.addEventListener('click', closeModal);
        limitsModal.addEventListener('click', (e: MouseEvent) => { if (e.target === limitsModal) closeModal() });
        document.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Escape' && limitsModal.classList.contains('visible')) closeModal() });

        if (slider) {
            slider.step = "10";
            slider.value = slider.max; 
            slider.addEventListener('input', updateLimitDisplay);
            updateLimitDisplay(); 
        }
    }

    // --- ЛОГИКА МОДАЛЬНОГО ОКНА СМЕНЫ ДИЗАЙНА ---
    const designModal = document.getElementById('design-modal');
    if (designModal) {
        const designCards = designModal.querySelectorAll<HTMLElement>('.design-card');
        designCards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('locked')) {
                    console.log('Эта карта заблокирована. Цена:', card.dataset.price, 'АР');
                    return;
                }
                designCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    }

    // --- ЛОГИКА МОДАЛЬНОГО ОКНА ОПАСНЫХ ДЕЙСТВИЙ ---
    const blockBtn = document.getElementById('block-account-btn');
    const deleteBtn = document.getElementById('delete-account-btn');
    const dangerModal = document.getElementById('danger-action-modal');

    if (blockBtn && deleteBtn && dangerModal) {
        const closeBtn = document.getElementById('cancel-danger-action');
        const confirmBtn = document.getElementById('confirm-danger-action');
        const modalTitle = dangerModal.querySelector<HTMLElement>('.danger-modal-title');
        const modalText = dangerModal.querySelector<HTMLElement>('.danger-modal-text');
        
        if (closeBtn && confirmBtn && modalTitle && modalText) {
            const noticeBlock = document.createElement('div');
            noticeBlock.className = 'important-notice';
            noticeBlock.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p><strong>Важно:</strong> Разблокировать счет можно будет только в отделении банка в течение 21 дня. После этого счет будет выставлен на аукцион.</p>
            `;

            const openModal = (type: 'block' | 'delete') => {
                const existingNotice = dangerModal.querySelector('.important-notice');
                if (existingNotice) existingNotice.remove();

                if (type === 'block') {
                    modalTitle.textContent = 'Заблокировать счет?';
                    modalText.textContent = 'Вы уверены, что хотите заблокировать этот счет? Вы не сможете совершать по нему никаких операций.';
                    confirmBtn.textContent = 'Заблокировать';
                    modalText.after(noticeBlock);
                } else if (type === 'delete') {
                    modalTitle.textContent = 'Удалить счет?';
                    modalText.textContent = 'Вы уверены, что хотите НАВСЕГДА удалить этот счет? Все средства будут утеряны, а действие необратимо.';
                    confirmBtn.textContent = 'Удалить';
                }
                dangerModal.classList.add('visible');
            };

            const closeModal = () => dangerModal.classList.remove('visible');

            blockBtn.addEventListener('click', () => openModal('block'));
            deleteBtn.addEventListener('click', () => openModal('delete'));
            closeBtn.addEventListener('click', closeModal);
            dangerModal.addEventListener('click', (e: MouseEvent) => { if (e.target === dangerModal) closeModal() });
            document.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Escape' && dangerModal.classList.contains('visible')) closeModal() });
            confirmBtn.addEventListener('click', () => {
                alert('Действие подтверждено! (Функционал в разработке)');
                closeModal();
            });
        }
    }

    // --- ЛОГИКА КНОПКИ "ПОДЕЛИТЬСЯ РЕКВИЗИТАМИ" ---
    const shareBtn = document.getElementById('share-card-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation(); 
            const cardNameElement = document.getElementById('card-name-text');
            const cardNumberElement = document.getElementById('card-number-text');
            
            if (!cardNameElement?.textContent || !cardNumberElement?.textContent) {
                console.error("Не найдены элементы с именем или номером карты.");
                return;
            }

            const cardName = cardNameElement.textContent.trim();
            const cardNumber = cardNumberElement.textContent.trim();
            const playerNickname = "{PLAYER_NICKNAME}";
            const textToCopy = `Реквизиты для перевода:\n- Ник: ${playerNickname}\n- Счет: ${cardName}\n- Номер: ${cardNumber}`.trim();

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalIcon = shareBtn.innerHTML;
                shareBtn.innerHTML = '<i class="fas fa-check"></i>';
                shareBtn.classList.add('copied');
                setTimeout(() => {
                    shareBtn.innerHTML = originalIcon;
                    shareBtn.classList.remove('copied');
                }, 1500);
            }).catch(err => {
                console.error('Не удалось скопировать текст: ', err);
                alert('Ошибка при копировании реквизитов.');
            });
        });
    }

    // --- ЛОГИКА МОДАЛЬНОГО ОКНА РЕДАКТИРОВАНИЯ НАЗВАНИЯ ---
    const openEditNameBtn = document.getElementById('edit-card-name-btn');
    if (openEditNameBtn) {
        const editNameModal = document.getElementById('edit-name-modal');
        const cardNameElement = document.getElementById('card-name-text');
        const newNameInput = document.getElementById('new-card-name') as HTMLInputElement;
        const saveNameBtn = document.getElementById('save-card-name-btn');
        const editCharCounter = document.getElementById('edit-char-counter');
        
        if (editNameModal && cardNameElement && newNameInput && saveNameBtn && editCharCounter) {
            let isNextSaveSuccessful = true;

            const updateEditCounter = () => {
                const currentLength = newNameInput.value.length;
                const maxLength = newNameInput.maxLength;
                editCharCounter.textContent = `${currentLength}/${maxLength}`;
                editCharCounter.classList.toggle('limit-reached', currentLength >= maxLength);
            };

            const openModal = (e: MouseEvent) => {
                e.stopPropagation();
                if (cardNameElement.textContent) {
                    newNameInput.value = cardNameElement.textContent.trim();
                }
                updateEditCounter();
                editNameModal.classList.add('visible');
            };

            const closeModal = () => editNameModal.classList.remove('visible');

            setupModal('edit-card-name-btn', 'close-edit-name-modal', 'edit-name-modal');
            openEditNameBtn.addEventListener('click', openModal); // Добавляем специфичный обработчик открытия
            
            newNameInput.addEventListener('input', updateEditCounter);

            saveNameBtn.addEventListener('click', () => {
                const newName = newNameInput.value.trim();
                if (newName.length === 0) {
                    alert("Название не может быть пустым!");
                    return;
                }
                const originalIconHTML = openEditNameBtn.innerHTML;
                
                if (isNextSaveSuccessful) {
                    alert(`Название успешно изменено на "${newName}"!`);
                    cardNameElement.textContent = newName;
                    openEditNameBtn.innerHTML = '<i class="fas fa-check"></i>';
                    openEditNameBtn.classList.add('success');
                } else {
                    alert(`Ошибка сохранения! Возможно, не прошло 7 дней.`);
                    openEditNameBtn.innerHTML = '<i class="fas fa-times"></i>';
                    openEditNameBtn.classList.add('error');
                }
                isNextSaveSuccessful = !isNextSaveSuccessful;
                
                setTimeout(() => {
                    openEditNameBtn.innerHTML = originalIconHTML;
                    openEditNameBtn.classList.remove('success', 'error');
                }, 2000);
                
                closeModal();
            });
        }
    }
});