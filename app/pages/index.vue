<script setup lang="ts">
import type {
  TableColumn,
  TableRow,
  DropdownMenuItem,
  RadioGroupItem,
  RadioGroupValue,
} from "@nuxt/ui";
import type { Column } from "@tanstack/vue-table";
import { storeToRefs } from "pinia";
import {
  VueSpinnerIos,
  VueSpinnerPie,
  VueSpinnerPuff,
  VueSpinnerTail,
} from "vue3-spinners";
import { formatDateShort } from "#imports";
import dayjs from "dayjs";
import type { Process } from "~/types";
import { useEodStore } from "~/stores/eodStore";

const store = useEodStore();
const {
  loading,
  initialized,
  items,
  // accountingDate,
  downloadUrl,
  fileName,
  error,
} = storeToRefs(useEodStore());
const { getEodByBatNum, processToPWC, downloadFile } = store;

const toast = useToast();

const valid = ref(true);

// const date = formatDateShort(accountingDate.value);
const now = dayjs();
const preDate = now.subtract(1, "day").format("YYYYMMDD");

const radioItems = ref<RadioGroupItem[]>([
  {
    label: "ທ່ານ ໄຊຊະນະພອນ ຈັນທະວົງສາ",
    value: "Xaysanaphone CHANTHAVONGSA",
  },
  {
    label: "ທ່ານ ສັກປະເສິດ ດວງວິໄລ",
    value: "Sackpaserth DOUANGVILAY",
  },
  {
    label: "ທ່ານ ຈັນທະພອນ ມະນີວົງ",
    value: "Chanthaphone MANIVONG",
  },
  {
    label: "ທ່ານ ປໍຈົວຢ່າງ ຫວາຈົ່ງ",
    value: "Porchouayang VAJONG",
  },
  {
    label: "ທ່ານ ລົ່ງຢ່າງ",
    value: "Longyang",
  },
]);
const radioGroupValue = ref<RadioGroupValue>("");
const notes = ref("");

const state = reactive({
  inputValue: "",
});

const validateModule = computed(() =>
  items.value.find((val) => val.module === "Report")
);

const validateEndTime = computed(() =>
  items.value.find((val) => val.endTime === "null" || val.endTime === "")
);

const validateInputRegex = (value: string): boolean => {
  const regex = /^[^a-zA-Z*\-+@.$#>?<=/]+$/;
  return regex.test(value);
};

const goToBatch = async () => {
  if (!state.inputValue) {
    toast.add({
      title: "ກະລຸນາລະບຸໃສ່ຂໍ້ມູນເລກປິດລະບົບ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  if (!validateInputRegex(state.inputValue)) {
    toast.add({
      title: "ຫ້າມປ້ອນອັກສອນພິເສດ ແລະ ຕົວອັກສອນ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  loading.value = true;
  error.value = "";
  setTimeout(async () => {
    await getEodByBatNum(state.inputValue);
    loading.value = false;
  }, 1000);
};

const refreshData = async () => {
  loading.value = true;
  if (!state.inputValue) {
    items.value = [];
    loading.value = false;
    return;
  }

  setTimeout(async () => {
    await getEodByBatNum(state.inputValue);
    loading.value = false;
  }, 1000);
};

const process = async () => {
  if (!state.inputValue) {
    toast.add({
      title: "ກະລຸນາລະບຸໃສ່ຂໍ້ມູນເລກປິດລະບົບ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  if (!items.value.length) {
    toast.add({
      title: "ບໍ່ມີຂໍ້ມູນ ບໍ່ສາມາດບັນທຶກໄດ້",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  if (!radioGroupValue.value) {
    toast.add({
      title: "ກະລຸນາເລືອກຜູ້ປະຕິບັດກ່ອນ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  if (validateModule.value) {
    toast.add({
      title: "ຂໍ້ມູນປິດລະບົບຍັງບໍ່ສຳເລັດ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
  }

  if (validateEndTime.value) {
    toast.add({
      title: "ຂໍ້ມູນປິດລະບົບຍັງບໍ່ສຳເລັດ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
  }

  const item: Process = {
    fullName: radioGroupValue.value,
    description: notes.value,
    remarks: "",
    followUp: "Mr Nilundone INSIRI (Head of section)",
  };

  processToPWC(state.inputValue, item)
    .then((res) => {
      if(res.statusCode === 500){
        toast.add({
          title: "ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ",
          color: "error",
          duration: 1000,
          icon: "i-heroicons-information-circle",
        });
        return;
      }


      toast.add({
        title: "ສ້າງເອົາຂໍ້ມູນສຳເລັດ",
        color: "success",
        duration: 1000,
        icon: "i-heroicons-information-circle",
      });
    })
    .catch(() => {
      toast.add({
        title: "ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ",
        color: "error",
        duration: 1000,
        icon: "i-heroicons-information-circle",
      });
    });
};

const downloadFileDetail = async () => {
  if (!items.value.length) {
    toast.add({
      title: "ບໍ່ມີຂໍ້ມູນ ບໍ່ສາມາດດາວໂຫລດ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  if (validateEndTime.value) {
    toast.add({
      title: "ຂໍ້ມູນປິດລະບົບຍັງບໍ່ສຳເລັດ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  if (downloadUrl.value === null && downloadUrl.value === "") {
    toast.add({
      title: "ບໍ່ພົບຂໍ້ມູນ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  downloadFile()
    .then(() => {
      state.inputValue = "";
      notes.value = "";
      radioGroupValue.value = "";
      notes.value = "";
      items.value = [];
      downloadUrl.value = "";
      fileName.value = "";
    })
    .catch((error) => {
      toast.add({
        title: error.message,
        color: "error",
        duration: 1000,
        icon: "i-heroicons-information-circle",
      });
    });
};
const reset = () => {
  if(!state.inputValue){
    toast.add({
      title: "ຍັງບໍ່ໄດ້ປ້ອນເລກປີດລະບົບ ບໍ່ສາມາດລ້າງຂໍ້ມູນໄດ້",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  if(!items.value.length){
    toast.add({
      title: "ບໍ່ມີຂໍ້ມູນ ບໍ່ສາມາດລ້າງຂໍ້ມູນໄດ້",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  if(!radioGroupValue.value){
    toast.add({
      title: "ຂໍ້ມູນປິດລະບົບຍັງບໍ່ສຳເລັດ",
      color: "error",
      duration: 1000,
      icon: "i-heroicons-information-circle",
    });
    return;
  }

  state.inputValue = "";
  notes.value = "";
  radioGroupValue.value = "";
  notes.value = "";
  items.value = [];
  downloadUrl.value = "";
  fileName.value = "";
};

onMounted(async () => {
  // await getEodByBatNum(preDate);
});
</script>

<template>
  <div class="">
    <UCard class="w-full h-full">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="">ຂໍ້ມູນປິດລະບົບ</h3>

          <div class="flex items-center gap-2">
            <UButton
              class="cursor-pointer"
              icon="i-heroicons-arrow-path"
              variant="subtle"
              @click="refreshData"
              >reload</UButton
            >
            <UInput
              v-model="state.inputValue"
              variant="outline"
              placeholder="input batnum..."
            />
            <UButton
              class="cursor-pointer"
              icon="i-heroicons-magnifying-glass"
              variant="subtle"
              @click="goToBatch"
              >ຄົ້ນຫາ</UButton
            >
          </div>
        </div>
      </template>
      <template #default>
        <div
          v-if="loading || !initialized"
          class="justify-center flex items-center"
        >
          <VueSpinnerTail size="100" color="blue" />
          <span class="text-sm text-gray-500">ກຳລັງໂຫຼດ...</span>
        </div>
        <div v-else-if="items.length === 0">
          <div class="flex justify-center items-center">
            <span class="text-red-500">ບໍ່ພົບຂໍ້ມູນ</span>
          </div>
        </div>
        <div v-else>
          <UTable
            :data="items"
            :ui="{
              th: 'text-center py-1',
              td: 'text-center py-1',
            }"
          >
            <template #empty>
              <div class="flex justify-center items-center">
                <span class="text-red-500">ບໍ່ພົບຂໍ້ມູນ</span>
              </div>
            </template>
          </UTable>
        </div>
      </template>
      <!-- <VueSpinnerTail size="40" color="green" />

      <UButton icon="i-heroicons-information-circle" variant="subtle" @click="showToast">Toast</UButton> -->
    </UCard>

    <UCard class="my-1">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold">ສ້າງເອົາຂໍ້ມູນ</h3>
        </div>
      </template>
      <template #default>
        <UTextarea
          v-model="notes"
          :rows="5"
          class="w-full"
          placeholder="ປ້ອນຂໍ້ມູນລາຍລະອຽດ ເຊັ່ນ ປີດມື້ມີເອີເຣີຈາກລະບົບ..."
        />
      </template>
    </UCard>

    <UCard class="my-1">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold">ເລືອກຜູ້ປະຈຳການ</h3>
        </div>
      </template>
      <template #default>
        <URadioGroup
          v-model="radioGroupValue"
          :items="radioItems"
          variant="list"
          orientation="horizontal"
          class="cursor-pointer"
        />
      </template>
    </UCard>

    <div class="flex justify-start gap-2">
      <UButton
        class="cursor-pointer"
        icon="i-lucide-check-check"
        variant="subtle"
        color="primary"
        @click="process"
        >ບັນທຶກ</UButton
      >
      <UButton
        class="cursor-pointer"
        icon="i-lucide-folder-input"
        variant="subtle"
        color="secondary"
        @click="downloadFileDetail"
        >ດາວໂຫຼດ</UButton
      >
      <UButton
        class="cursor-pointer"
        icon="i-lucide-trash-2"
        variant="subtle"
        color="error"
        @click="reset"
        >ລ້າງ</UButton
      >

      <UButton
        class="cursor-pointer"
        icon="i-lucide-binoculars"
        variant="subtle"
        color="warning"
        >ເບິ່ງປະຫວັດຂອງທ່ານ</UButton
      >

      <UButton
        class="cursor-pointer"
        icon="i-lucide-scan-search"
        variant="subtle"
        color="neutral"
        >ເບິ່ງປະຫວັດທັງໝົດ</UButton
      >
    </div>
  </div>
</template>

<style scoped></style>
