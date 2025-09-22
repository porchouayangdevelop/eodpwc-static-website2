import { defineStore } from "pinia";
import type { AccountingDate, Batch, Process } from "@/types";

export const useEodStore = defineStore("myStore", () => {
  //state
  const loading = ref(false);
  const initialized = ref(false);
  const downloadUrl = ref<string>("");
  const fileName = ref<string>("");
  const error = ref<string>("");
  const accountingDate = ref<string>("");
  const historyItems = ref([]);
  const yhistory = ref([]);

  const items = ref<Batch[]>([]);

  //getter
  const isLoading = computed(() => loading.value);
  const isInitialized = computed(() => initialized.value);
  const getDownload = computed(() => downloadUrl.value);
  const getFileName = computed(() => fileName.value);
  const getError = computed(() => error.value);
  const getAccountingDate = computed(() => accountingDate.value);
  const getItems = computed(() => items.value);
  const getHistoryItems = computed(() => historyItems.value);
  const getYHistoryItems = computed(() => yhistory.value);

  //actions
  const fetchAccountingDate = async () => {
    loading.value = true;
    try {
      const { $axios } = useNuxtApp();
      const { data } = await $axios.get("/accounting/date");
      accountingDate.value = data;
      initialized.value = true;
      return;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getEodByBatNum = async (batNum: string): Promise<Batch[]> => {
    loading.value = true;
    try {
      const { $axios } = useNuxtApp();
      const { data } = await $axios.get(`${batNum}?queryType=query`);
      items.value.length = 0;
      const isArr = Array.isArray(data) ? data : [data];

      items.value = isArr;
      error.value = "";
      initialized.value = true;

      return data;
    } catch (error: any) {
      error.value = "Error fetching EOD data";
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const processToPWC = async (batNum: string, item: Process) => {
    loading.value = true;
    try {
      console.log(batNum, item);

      const { $axios } = useNuxtApp();
      console.log($axios);

      const { data } = await $axios.post(`process/${batNum}`, item);
      downloadUrl.value = data.data.file.downloadUrl;
      fileName.value = data.data.file.fileName;
      error.value = data.data.message;

      return data;
    } catch (error: any) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const yourHistory = async (your_name: string) => {
    loading.value = true;
    try {
      alert(your_name);
      const { $axios } = useNuxtApp();
      const { data } = await $axios.get(`/your-name?${your_name}`);
      yhistory.value = data;
      return data;
    } catch (error: any) {
      error.value = error.message;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const history = async () => {
    loading.value = true;
    try {
      const { $axios } = useNuxtApp();
      const { data } = await $axios.get(`alls-history`);
      historyItems.value = data.data;
      return data;
    } catch (error: any) {
      error.value = error.message;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const downloadFile = async () => {
    try {
      const { $axios } = useNuxtApp();
      const dURL = downloadUrl.value;
      if (items.value.length === 0) {
        return (error.value = "No items to download");
      }
      if (!dURL) {
        return (error.value = "No download URL found");
      }

      const { data } = await $axios.get(`download-url/${fileName.value}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `PWC_Doument_${fileName.value}_${
          accountingDate.value
        }_${items.value.find((val) => val.batNum)}.docx`
      );
      document.body.appendChild(link);
      link.click();
      // document.body.removeChild(link);
    } catch (error: any) {
      error.value = error.message;
      console.log(error);
    }
  };

  return {
    loading,
    initialized,
    items,
    accountingDate,
    downloadUrl,
    fileName,
    error,

    //getters
    getAccountingDate,
    getItems,
    getHistoryItems,
    getYHistoryItems,
    getDownload,
    getFileName,
    getError,
    isLoading,
    isInitialized,

    //actions
    getEodByBatNum,
    fetchAccountingDate,
    processToPWC,
    yourHistory,
    history,
    downloadFile,
  };
});
