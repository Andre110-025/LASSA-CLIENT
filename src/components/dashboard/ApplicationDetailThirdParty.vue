<script setup></script>

<template>
  <div class="bg-white rounded-md p-5 pt-8 mt-6 max-w-xl mx-auto">
    <h4 class=" text-sm text-center">
      OUTDOOR ADVERTISING STRUCTURE APPLICATION (<span class="text-red-500"
        >THIRD PARTY</span
      >)
    </h4>

    <!-- Image and address -->
    <div class="flex flex-row w-full p-6 border-t-2 border-gray-300 border-b-2 mt-4">
      <img class="block w-14 h-14 bg-gray-500 rounded-full" src="" alt="" />
      <div class="flex flex-col px-6 justify-between w-4/5 h-fit gap-1">
        <div class="flex flex-row">
          <p class="w-1/2">XYZ Media</p>
          <p class="text-xs my-auto">2 Toyin street Ikeja</p>
        </div>
        <div class="flex flex-row">
          <p class="text-xs w-1/2">LASAA234575</p>
          <p class="text-xs">0801 234 5678</p>
        </div>
      </div>
    </div>

    <!-- General info -->
    <div class="flex flex-col p-6 gap-4">
      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Purpose of Application</p>
        <p class="text-sm">Application for a new sign</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
        <p class="text-sm">LED Billboard</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of Signs</p>
        <p class="text-sm">1</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Dimension in meters</p>
        <p class="text-sm">24 by 40 meters</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Overall Height</p>
        <p class="text-sm">100 meters</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Setback Distance</p>
        <p class="text-sm">5 meters</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Design format</p>
        <p class="text-sm">Landscape</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of faces</p>
        <p class="text-sm">Double face</p>
      </div>
    </div>

    <!-- Site Location -->
    <div class="flex flex-col p-6 gap-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Site Location
      </h6>
      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Site Address</p>
        <p class="text-sm">42, Yemi St, unity lane Surulere, Lagos</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">LGA</p>
        <p class="text-sm">Surulere</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">GIS Coordinates</p>
        <p class="text-sm">45</p>
      </div>
    </div>

    <!-- Property Description -->
    <div class="flex flex-col p-6 gap-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Property Description
      </h6>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Property Owner Phone No.</p>
        <p class="text-sm">0901 234 5678</p>
      </div>

      <div class="flex flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Property Owner Email</p>
        <p class="text-sm">account@email.com</p>
      </div>

      <div class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Owner’s Consent Letter</p>
        <img src="#" alt="" class=" w-full h-40 bg-gray-600">
      </div>
    </div>

    <!-- Signage Imagery -->
    <div class="flex flex-col p-6 gap-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Signage Imagery
      </h6>
      <div class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img src="#" alt="" class=" w-full h-40 bg-gray-600">
      </div>
    </div>

    <div class="flex flex-row justify-center gap-4 pb-20">
      <button class=" px-8 py-4 bg-red-600 rounded-md text-white ">
        Decline Application
      </button>
      <button class=" px-12 py-4 bg-green-600 rounded-md text-white ">
        Approve Application
      </button>
    </div>

  </div>
</template>
