<script setup>
import { ref } from "vue";

const tableTitle = ref([
  "ID Number",
  "Type of Advert",
  "LGA",
  "Payment cycle",
  "Days left",
  "Status",
]);

const mobileTableTitle = ref(["Type of Advert", "LGA", "Status"]);

const SignInfo = ref([
  {
    idNumber: "LG234575",
    TypeofAdvert: "Directional Sign",
    LGA: "Surulere",
    Paymentcycle: "365 Days",
    Daysleft: "37 Days",
    Status: "Ongoing",
  },
  {
    idNumber: "LG234765",
    TypeofAdvert: "Projecting Sign",
    LGA: "Agege",
    Paymentcycle: "365 Days",
    Daysleft: "21 Days",
    Status: "Ongoing",
  },
  {
    idNumber: "LG293854",
    TypeofAdvert: "Street Lamp",
    LGA: "Eti-Osa",
    Paymentcycle: "365 Days",
    Daysleft: "15 Days",
    Status: "Ongoing",
  },
  {
    idNumber: "LG232390",
    TypeofAdvert: "Directional Sign",
    LGA: "Badagry",
    Paymentcycle: "365 Days",
    Daysleft: "12 Days",
    Status: "Ongoing",
  },
  {
    idNumber: "LG287945",
    TypeofAdvert: "Directional Sign",
    LGA: "Epe",
    Paymentcycle: "365 Days",
    Daysleft: "03 Days",
    Status: "Ongoing",
  },
  {
    idNumber: "LG234765",
    TypeofAdvert: "Directional Sign",
    LGA: "Ikorodu",
    Paymentcycle: "365 Days",
    Daysleft: "Ikorodu",
    Status: "Ongoing",
  },
]);
</script>

<template>
  <div
    class="flex flex-col gap-2 bg-white rounded-lg h-full justify-between pb-8 min-w-[300px] w-full"
  >
    <div class="flex flex-col">
      <div class="flex flexrow justify-between py-4 px-6 items-end">
        <h6 class="text-base font-semibold text-gray-700">My Signs</h6>
        <a
          class="text-xs font-light text-blue-900 border-b-blue-700 border-b-[1px]"
          href="#"
        >
          View More
        </a>
      </div>
    </div>

    <div class="w-full px-5">
      <table class="w-full table-auto">
        <thead>
          <tr class="border-b-[1px] border-slate-300">
            <th
              v-for="title in tableTitle"
              class="font-medium text-sm text-gray-700 pl-5 text-left md:table-cell"
              :class="{'hidden' : mobileTableTitle.includes(title)}"
            >
              {{ title }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="signs in SignInfo" class="border-b-[1px] border-slate-300">
            <td class="md:table-cell hidden">
              <p class="p-2 pl-6 text-sm text-gray-700">{{ signs.idNumber }}</p>
            </td>
            <td>
              <p class="p-2 pl-6 text-sm text-gray-700">
                {{ signs.TypeofAdvert }}
              </p>
            </td>
            <td>
              <p class="p-2 pl-6 text-sm text-gray-700">{{ signs.LGA }}</p>
            </td>
            <td class="md:table-cell hidden">
              <p class="p-2 pl-6 text-sm text-gray-700">
                {{ signs.Paymentcycle }}
              </p>
            </td>
            <td class="md:table-cell hidden">
              <p class="p-2 pl-6 text-sm text-gray-700">{{ signs.Daysleft }}</p>
            </td>
            <td>
              <p class="p-2 pl-6 text-sm text-gray-700">{{ signs.Status }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
