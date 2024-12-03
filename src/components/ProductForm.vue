<template>
  <!-- Container do formulário de produto -->
  <div class="bg-white p-4 shadow-md rounded-md">
    
    <!-- Formulário para criação ou atualização de produto -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      
      <!-- Campo para nome do produto -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Produto</label>
        <input type="text" v-model="product.title"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
          placeholder="Nome do produto" required />
      </div>

      <!-- Campo para preço do produto -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Preço</label>
        <input type="number" v-model="product.price"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
          placeholder="Preço do produto" required />
      </div>

      <!-- Botão para salvar o produto -->
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
        Salvar
      </button>
    </form>

    <!-- Exibição de mensagem de sucesso ou erro -->
    <p v-if="message" class="mt-4 text-green-600 font-medium">{{ message }}</p>
  </div>
</template>

<script>
// Importa funções para comunicação com a API
import { createProduct, updateProduct } from '../services/api';

export default {
  // Permite passar um produto já existente como propriedade para edição
  props: ['existingProduct'],

  // Estado inicial do componente
  data() {
    return {
      // Inicializa com um produto vazio ou com os dados de um produto existente
      product: this.existingProduct || { title: '', price: 0 },
      message: '', // Mensagem de feedback (sucesso ou erro)
    };
  },

  // Métodos que serão usados no componente
  methods: {
    // Função chamada ao submeter o formulário
    async handleSubmit() {
      try {
        // Valida se os campos estão preenchidos corretamente
        if (!this.product.title.trim() || this.product.price <= 0) {
          alert('Por favor, preencha todos os campos corretamente.');
          return; // Impede o envio se a validação falhar
        }

        // Se o produto já tem um ID, faz uma atualização; senão, cria um novo produto
        if (this.product.id) {
          await updateProduct(this.product.id, this.product);
          this.message = 'Produto atualizado com sucesso!';
        } else {
          // Prepara os dados para criação de um novo produto
          const productData = {
            title: this.product.title,
            price: this.product.price,
          };
          await createProduct(productData);
          this.message = 'Produto adicionado com sucesso!';
        }

        // Emite um evento para o componente pai atualizar a lista de produtos
        this.$emit('refresh');
        
        // Limpa os campos do formulário após a submissão
        this.product = { title: '', price: 0 };

        // Limpa a mensagem de sucesso após 3 segundos
        setTimeout(() => {
          this.message = '';
        }, 3000);

      } catch (error) {
        // Captura erros e os imprime no console para depuração
        console.error('Erro ao criar ou atualizar o produto:', error);
      }
    },
  },
};
</script>