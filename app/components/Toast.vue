<script setup lang="ts">

interface Props  {
  title?:string;
  message?:string;
  icon?:string;
  type?:'success'|'error'|'info'|'warning';
  duration?:number;
}

const props = withDefaults(defineProps<Props>(), {
  title:'',
  message:'',
  icon:'',
  type:'info',
  duration:3000,
})

</script>

<template>
  <div>
    
  </div>
</template>

<style scoped></style>
