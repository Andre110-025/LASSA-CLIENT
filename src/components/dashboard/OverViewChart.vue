<script setup>
import { reactive } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Legend, ArcElement } from "chart.js";

ChartJS.register(Legend, ArcElement);

ChartJS.defaults.font.size = 10;

const props = defineProps({
DoughnutData : {
    type: Object,
    required: true,
  }
});

// const DoughnutData = reactive({
//   labels: [],
//   datasets: [
//     {
//       backgroundColor: ["#41B883", "#E46651"],
//       data: [30, 70],
//       cutout: "60%",
//     },
//   ],
// });

const doughnutOptions = reactive({
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "bottom",
      align: "center",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 30,
      },
    },
  },
});
</script>

<template>
  <Doughnut
    id="my-chart-id"
    class="h-[100px] w-[100px]"
    :options="doughnutOptions"
    :data="DoughnutData"
  />
</template>
