<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <header class="bg-blue-600 text-white py-4 shadow-md">
      <h1 class="text-center text-2xl font-bold">Admin Dashboard</h1>
    </header>
    <main class="container mx-auto p-4">
      <Dashboard />
    </main>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue';

export default {
  components: {
    Dashboard,
  },
};
</script>