<script setup>
import HeaderView from '../components/dashboard/HeaderView.vue';
import SideBar from '../components/dashboard/SideBar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="font-sans bg-gray-100">
    <!-- Header -->
    <HeaderView />
    <!-- Sidebar -->
    <SideBar class="hidden lg:block" />
    <!-- Main Content Area -->
    <main class="lg:ml-64 pt-20 overflow-y-auto min-h-[100dvh]">
      <RouterView />
    </main>
  </div>
</template>
