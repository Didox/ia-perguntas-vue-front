import { createRouter, createWebHistory } from 'vue-router';
import QuizComponent from '../components/QuizComponent.vue';
import ResultComponent from '../components/ResultComponent.vue';

const routes = [
  { path: '/quiz', component: QuizComponent },
  { path: '/result', component: ResultComponent },
  { path: '/', redirect: '/quiz' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
