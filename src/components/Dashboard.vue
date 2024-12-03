<template>
    <div class="space-y-6">
        <!-- Título da seção de gerenciamento de produtos -->
        <h2 class="text-xl font-semibold text-gray-700">Gerenciamento de Produtos</h2>

        <!-- Componente para o formulário de produtos, passando o produto a ser editado e eventos para atualizar ou limpar o produto editado -->
        <ProductForm :product="editingProduct" @refresh="getProducts" @clear="clearEditing" />

        <!-- Componente para a lista de produtos, passando os produtos e eventos para atualizar a lista ou editar um produto -->
        <ProductList :products="products" @refresh="getProducts" @edit="editProduct" />
    </div>
</template>

<script>
import { fetchProducts } from '../services/api'; // Função para buscar os produtos da API
import ProductForm from './ProductForm.vue'; // Componente para o formulário de produtos
import ProductList from './ProductList.vue'; // Componente para listar os produtos

export default {
    components: { ProductForm, ProductList },
    data() {
        return {
            // Lista de produtos carregada da API
            products: [],

            // Produto sendo editado no formulário
            editingProduct: null,
        };
    },
    methods: {
        // Método para buscar os produtos da API
        async getProducts() {
            try {
                const { data } = await fetchProducts(); // Requisição para buscar produtos
                console.log('Resposta da API:', data); // Verificar o formato da resposta
                // Certifique-se de que a resposta tem a chave 'products' ou se é um array direto
                if (data && Array.isArray(data.products)) {
                    this.products = data.products; // Atualiza a lista de produtos com os dados da API
                } else if (Array.isArray(data)) {
                    this.products = data; // Caso a resposta seja um array diretamente
                } else {
                    // console.error('Estrutura inesperada da resposta:', data); // Log de erro caso não tenha 'products'
                }
            } catch (error) {
                console.error('Erro ao buscar produtos:', error); // Caso ocorra erro, exibe no console
            }
        },

        // Método para definir o produto a ser editado
        editProduct(product) {
            this.editingProduct = product; // Define o produto a ser editado no formulário
        },

        // Método para limpar o produto que está sendo editado
        clearEditing() {
            this.editingProduct = null; // Limpa a referência do produto em edição
        },
    },
    mounted() {
        // Quando o componente é montado, chama o método para buscar os produtos
        this.getProducts();
    },
};
</script>