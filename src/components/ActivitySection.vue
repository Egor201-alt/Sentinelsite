<template>
  <section class="activity-section">
    <div class="activity-header">
      <h2>Недавняя активность</h2>
    </div>
    <ul class="activity-list">
      <li class="transaction-item">
        <div class="transaction-summary">
          <div class="transaction-main-info">
            <div class="transaction-icon-wrapper icon-negative"><i class="fas fa-shopping-cart"></i></div>
            <div class="transaction-details">
              <span class="transaction-title">Покупка в ТЦ</span>
              <span class="account-badge">Карта жителя</span>
            </div>
          </div>
          <div class="transaction-amount negative">-192 <span class="currency-symbol">АР</span></div>
        </div>
      </li>
      <li class="transaction-item">
        <div class="transaction-summary">
          <div class="transaction-main-info">
            <div class="transaction-icon-wrapper icon-positive"><i class="fas fa-piggy-bank"></i></div>
            <div class="transaction-details">
              <span class="transaction-title">Пополнение</span>
              <span class="account-badge">Накопительный</span>
            </div>
          </div>
          <div class="transaction-amount positive">+250 <span class="currency-symbol">АР</span></div>
        </div>
      </li>
      <li class="transaction-item">
        <div class="transaction-summary">
          <div class="transaction-main-info">
            <div class="transaction-icon-wrapper icon-transfer"><i class="fas fa-paper-plane"></i></div>
            <div class="transaction-details">
              <span class="transaction-title">Перевод игроку</span>
              <span class="account-badge">Карта жителя</span>
            </div>
          </div>
          <div class="transaction-amount negative">-50 <span class="currency-symbol">АР</span></div>
        </div>
      </li>
      <li class="transaction-item">
        <div class="transaction-summary">
          <div class="transaction-main-info">
            <div class="transaction-icon-wrapper icon-neutral"><i class="fas fa-landmark"></i></div>
            <div class="transaction-details">
              <span class="transaction-title">Налог города</span>
              <span class="account-badge">Карта жителя</span>
            </div>
          </div>
          <div class="transaction-amount negative">-12 <span class="currency-symbol">АР</span></div>
        </div>
      </li>
    </ul>
    <div class="pagination">
      <button class="page-btn" disabled><i class="fas fa-chevron-left"></i></button>
      <span>Страница 1</span>
      <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
    </div>
  </section>
</template>