<template>
  <div class="container mt-5">
    <div v-if="carregando">
      <p>Carregando...</p>
    </div>
    <div v-else-if="mostrarResultado">
      <!-- Mensagem de resultado -->
      <div class="alert alert-success mt-3" role="alert">
        Fim do jogo! Você acertou {{ acertos }} de {{ perguntas.length }}.
        <div class="mt-3">
          <button @click="recomecar" class="btn btn-info">Recomeçar</button>
        </div>
      </div>
    </div>
    <div v-else-if="perguntas.length > 0">
      <h2>Qual é a tradução correta para "{{ perguntaAtual?.palavra }}"?</h2>
      <div v-for="opcao in perguntaAtual?.opcoes" :key="opcao" class="form-check">
        <input class="form-check-input" type="radio" :id="opcao" :value="opcao" v-model="respostaUsuario">
        <label class="form-check-label" :for="opcao">{{ opcao }}</label>
      </div>
      <button v-if="perguntaIndex === perguntas.length - 1" @click="verificarRespostas" class="btn btn-primary mt-3">Verificar</button>
      <button v-else @click="proximaPergunta" class="btn btn-secondary mt-3">Próxima</button>
    </div>
    <div v-else>
      <p>Não foi possível carregar as perguntas.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      perguntas: [],
      perguntaIndex: 0,
      respostaUsuario: '',
      acertos: 0,
      respostas: [],
      mostrarResultado: false,
      carregando: false, // Indica se a chamada para a API está em andamento
    };
  },
  computed: {
    perguntaAtual() {
      return this.perguntas[this.perguntaIndex];
    }
  },
  methods: {
    carregarPerguntas() {
      this.carregando = true; // Inicia o carregamento
      axios.get('http://localhost:5000/tradutor')
        .then(response => {
          if (response.data && response.data.length > 0) {
            this.perguntas = response.data;
            this.mostrarResultado = false;
          } else {
            // Se a resposta for null ou vazia, limpa as perguntas
            this.perguntas = [];
          }
        })
        .catch(error => {
          console.error('Erro ao carregar as perguntas:', error);
          this.perguntas = []; // Limpa as perguntas em caso de erro
        })
        .finally(() => {
          this.carregando = false; // Finaliza o carregamento
        });
    },
    proximaPergunta() {
      this.respostas.push(this.respostaUsuario);
      this.respostaUsuario = '';
      this.perguntaIndex++;
    },
    verificarRespostas() {
      this.respostas.push(this.respostaUsuario);
      this.perguntas.forEach((pergunta, index) => {
        if (pergunta.traducao === this.respostas[index]) {
          this.acertos++;
        }
      });
      this.mostrarResultado = true;
    },
    recomecar() {
      this.perguntaIndex = 0;
      this.acertos = 0;
      this.respostas = [];
      this.respostaUsuario = '';
      this.carregarPerguntas(); // Recarrega as perguntas da API
    }
  },
  mounted() {
    this.carregarPerguntas();
  }
};
</script>
