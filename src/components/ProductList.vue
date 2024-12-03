<template>
    <!-- Container do componente de lista de produtos -->
    <div class="bg-white p-4 shadow-md rounded-md">

        <!-- Campo de filtro para pesquisar por nome de produto -->
        <input v-model="filter" type="text" placeholder="Pesquisar por..." class="mb-4 p-2 border rounded w-full" />

        <!-- Título da seção 'Lista de Produtos' -->
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Lista de Produtos</h3>

        <!-- Lista de produtos filtrados -->
        <ul class="divide-y divide-gray-200">
            <li v-for="product in filteredProducts" :key="product.id"
                class="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">

                <!-- Exibição do título e preço do produto -->
                <div class="mb-4 sm:mb-0">
                    <p class="font-medium text-gray-800">{{ product.title }}</p>
                    <p class="text-sm text-gray-600">{{ formatPrice(product.price) }}</p>
                </div>

                <!-- Botões de ação (Editar e Eliminar) -->
                <div class="flex space-x-2 justify-start sm:justify-end">
                    <button @click="editProduct(product)"
                        class="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600">
                        Editar
                    </button>
                    <button @click="confirmDelete(product.id)"
                        class="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700">
                        Eliminar
                    </button>
                </div>
            </li>
        </ul>

        <!-- Modal de Confirmação para exclusão de produto -->
        <div v-if="showModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <p class="text-gray-800 text-lg font-semibold mb-4">Tem certeza que deseja eliminar?</p>
                <div class="flex justify-end space-x-2">
                    <!-- Botões para cancelar ou confirmar a exclusão -->
                    <button @click="cancelDelete"
                        class="bg-gray-300 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-400">
                        Não
                    </button>
                    <button @click="deleteConfirmed"
                        class="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700">
                        Sim
                    </button>
                </div>
            </div>
        </div>

        <!-- Feedback de Exclusão: sucesso ou erro -->
        <p v-if="deleteSuccess" class="text-green-600 font-medium mt-4">Produto excluído com sucesso!</p>
        <p v-if="deleteError" class="text-red-600 font-medium mt-4">Erro ao excluir o produto. Tente novamente.</p>
    </div>
</template>

<script>
// Importa função para excluir produto da API
import { deleteProduct } from "../services/api";

export default {
  // Recebe uma lista de produtos como propriedade
  props: ["products"],

  // Estado inicial do componente
  data() {
    return {
      showModal: false, // Controle da exibição do modal de confirmação
      productIdToDelete: null, // ID do produto a ser excluído
      filter: "", // Termo de busca para filtrar produtos
      deleteSuccess: false, // Indica se a exclusão foi bem-sucedida
      deleteError: false, // Indica se houve erro na exclusão
    };
  },

  // Computed property para filtrar produtos de acordo com o termo de busca
  computed: {
    filteredProducts() {
      return this.products.filter((product) =>
        product.title.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
  },

  // Métodos do componente
  methods: {
    // Emite evento para editar o produto selecionado
    editProduct(product) {
      this.$emit("edit", product);
    },

    // Exibe o modal de confirmação de exclusão
    confirmDelete(id) {
      this.productIdToDelete = id;
      this.showModal = true;
    },

    // Cancela a exclusão e fecha o modal
    cancelDelete() {
      this.showModal = false;
      this.productIdToDelete = null;
    },

    // Confirma a exclusão do produto
    async deleteConfirmed() {
      if (this.productIdToDelete) {
        try {
          // Tenta excluir o produto
          await deleteProduct(this.productIdToDelete);
          this.deleteSuccess = true;
          this.deleteError = false;
          this.$emit("refresh"); // Emite evento para atualizar a lista de produtos
        } catch (error) {
          // Caso erro, exibe mensagem de erro
          this.deleteSuccess = false;
          this.deleteError = true;
          console.error(error);
        } finally {
          // Fecha o modal e limpa o estado após 3 segundos
          setTimeout(() => {
            this.cancelDelete();
            this.deleteSuccess = false;
            this.deleteError = false;
          }, 3000);
        }
      }
    },

    // Formata o preço do produto no formato da moeda de Angola
    formatPrice(price) {
      return new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(price);
    },
  },
};
</script>