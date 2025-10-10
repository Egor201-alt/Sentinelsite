<script setup lang="ts">
import { ref } from 'vue';
import { marked } from 'marked'; // Импортируем библиотеку для Markdown

type Post = {
    id: number;
    date: string;
    // Текст поста теперь храним в "сыром" виде
    content: string; 
    likes: number;
    dislikes: number;
};

defineProps<{
  posts: Post[];
  author: string;
}>();

const newPostText = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Функция для автоматического изменения высоты textarea
function autoResizeTextarea() {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = 'auto'; // Сбрасываем высоту
    textarea.style.height = `${textarea.scrollHeight}px`; // Устанавливаем по содержимому
  }
}

// Функция для преобразования Markdown в HTML
function renderMarkdown(rawMarkdown: string) {
    // Используем v-html, поэтому нужно быть осторожным с пользовательским вводом.
    // marked() по умолчанию экранирует опасные теги.
    return marked(rawMarkdown);
}

function createPost() {
  if (newPostText.value.trim() === '') return;
  console.log('Создан новый пост (Markdown):', newPostText.value);
  // Здесь будет логика добавления нового поста в массив
  newPostText.value = '';
  // После отправки сбрасываем высоту textarea
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
}
</script>

<template>
  <div class="profile-posts-section">
    <h2>Стена игрока</h2>
    <div class="profile-feed">
      <div class="new-post-box">
        <!-- 
          ref="textareaRef" - привязываем textarea к переменной в скрипте.
          @input="autoResizeTextarea" - вызываем нашу функцию при каждом вводе символа.
        -->
        <textarea 
        ref="textareaRef"
        class="styled-input" 
        placeholder="Что происходит? Поддерживается Markdown..." 
        rows="1" 
        v-model="newPostText"
        @input="autoResizeTextarea"
        maxlength="512"
        ></textarea>
        <button class="send-btn" @click="createPost"><i class="fas fa-paper-plane"></i></button>
      </div>
      
      <div v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-header">
          <img :src="`https://visage.surgeplay.com/face/32/${author}.png`" :alt="`Аватар ${author}`">
          <div class="post-author-info">
            <span class="post-author-name">{{ author }}</span>
            <span class="post-date">{{ post.date }}</span>
          </div>
        </div>
        <!-- 
          v-html="renderMarkdown(post.content)" - теперь мы рендерим контент 
          через нашу функцию, которая преобразует Markdown в HTML.
        -->
        <div class="post-content" v-html="renderMarkdown(post.content)"></div>
        <div class="post-footer">
          <div class="post-actions">
            <button class="post-action-btn like-btn"><i class="fas fa-thumbs-up"></i> <span>{{ post.likes }}</span></button>
            <button class="post-action-btn dislike-btn"><i class="fas fa-thumbs-down"></i> <span>{{ post.dislikes }}</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>