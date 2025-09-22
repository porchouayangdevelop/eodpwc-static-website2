<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useEodStore } from "~/stores/eodStore";
const store = useEodStore();
const { loading, initialized, items, accountingDate } = storeToRefs(
  useEodStore()
);
const {  fetchAccountingDate } = store;

const isDevelopment = process.env;

onMounted(() => {
  fetchAccountingDate();
});
</script>

<template>
  <div class="h-screen">
    <!-- Navigation -->
    <nav class="bg-gradient-to-r from-green-600 to-green-900 shadow-sm">
      <UContainer class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-xl font-bold text-white">
              ເວັບສະໜອງຂໍ້ມູນປິດລະບົບ
            </NuxtLink>
          </div>
          <div class="flex flex-row items-center space-x-4 justify-end">
            <div v-if="accountingDate" class="flex items-center space-x-4">
              <span class="text-sm text-white">
                ວັນທີ: {{ accountingDate }}
              </span>
            </div>
            <!-- <div class="flex items-center space-x-4">
              <span class="text-sm text-white font-mono">
                ໂມດ: {{ isDevelopment ? "Development" : "Production" }}
              </span>
            </div> -->
          </div>
        </div>
      </UContainer>
    </nav>

    <!-- Main Content -->
    <main class="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <UContainer class="py-4" :fluid="true">
        <slot />
      </UContainer>
    </main>

    <!-- Footer -->
    <!-- <footer class="bg-gray-50 border-t">
      <div class="container mx-auto px-4 py-1">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 @apb.com.la</p>
        </div>
      </div>
    </footer> -->
  </div>
</template>

<style scoped></style>
