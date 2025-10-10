<script setup lang="ts">
import { ref } from 'vue';

type Post = {
  id: number;
  author: { name: string; avatar: string; tag: string; verified: boolean; };
  meta: string;
  isFeatured: boolean;
  content: { title?: string; paragraphs: string[] };
  likes: number;
  dislikes: number;
};

const newPostText = ref('');

const posts = ref<Post[]>([
  {
    id: 1,
    author: { name: 'Тест201', avatar: 'Egor201', tag: 'Egor201', verified: true },
    meta: '10 мин. назад от @Egor201',
    isFeatured: true,
    content: {
      title: 'Хелоу май фриендс!',
      paragraphs: ['карочi пр усим!!', 'етоо лютый тестик жопы егора!!', 'а вы любите тесты на жопы? <strong>если да то ставьте лайк!!</strong> 🤪']
    },
    likes: 0,
    dislikes: 15
  },
  {
    id: 2,
    author: { name: 'opl67', avatar: 'opl67', tag: '', verified: false },
    meta: '2 часа назад',
    isFeatured: false,
    content: {
      title: 'Прр барни!',
      paragraphs: ['как вашi дела??']
    },
    likes: 19,
    dislikes: 0
  },
]);

function createPost() {
  if (newPostText.value.trim() === '') return;
  // Логика создания нового поста
  console.log('Создан новый пост:', newPostText.value);
  // Здесь будет код для добавления поста в начало списка `posts.value.unshift(...)`
  newPostText.value = '';
}
</script>

<template>
  <div class="news-feed-container">
    <div class="new-post-box">
      <textarea class="styled-input" placeholder="Что происходит?" rows="1" v-model="newPostText"></textarea>
      <button class="send-btn" @click="createPost"><i class="fa-solid fa-paper-plane"></i></button>
    </div>

    <div class="news-feed">
      <div v-for="post in posts" :key="post.id" class="post-card" :class="{'featured-post': post.isFeatured}">
        <div class="post-header">
          <img :src="`https://visage.surgeplay.com/face/32/${post.author.avatar}.png`" alt="Аватар">
          <div class="post-author-info">
            <span class="post-author-name">
              {{ post.author.name }} 
              <i v-if="post.author.verified" class="fas fa-check-circle verified-icon"></i>
            </span>
            <span class="post-meta">{{ post.meta }}</span>
          </div>
        </div>
        <div class="post-content">
          <h3 v-if="post.content.title">{{ post.content.title }}</h3>
          <p v-for="(p, index) in post.content.paragraphs" :key="index" v-html="p"></p>
        </div>
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