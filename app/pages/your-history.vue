<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const store = useEodStore();
const { getYHistoryItems } = storeToRefs(store);
const { yourHistory } = store;

const your_name = ref(route.query.your_name as string);

onMounted(() => {
  yourHistory(your_name.value);
});

watch([your_name], (newVal) => {
  router.replace({
    query: {
      your_name: newVal,
    },
  });
});
</script>

<template>
  <div>
    {{ getYHistoryItems }}

    {{ route.query }}
  </div>
</template>

<style scoped></style>
