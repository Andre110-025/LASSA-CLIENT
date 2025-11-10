<script setup>
import { ref, onMounted } from "vue";
import IconCheckMark from "../icons/IconCheckMark.vue";
import { useUserStore } from "../../stores/user";
import signTypesService from "../../services/signTypesService";

const { userDetails } = useUserStore();

const productType = ref(
  userDetails.userInfo.user_type === "first_party"
    ? "first_party"
    : "third_party"
);

onMounted(() => {
  signTypesService.getAllSignTypes()
})
</script>

<template>
  <div class="container mx-auto p-5 bg-white">
    <h4>Advert Category</h4>

    <div
      class="flex flex-row flex-wrap gap-5 xs:gap-14 mt-6 mb-10"
      v-if="userDetails.userInfo.user_type === 'third_party'"
    >
      <div>
        <input
          type="radio"
          v-model="productType"
          class="logInput checked:border-b-2 peer"
          id="tab1"
          value="first_party"
        />
        <label
          for="tab1"
          class="peer-checked:border-b-2 peer-checked:shadow-lg border-b-mainColor p-2 text-xs xs:text-base"
          >First Party Products</label
        >
      </div>

      <div>
        <input
          type="radio"
          v-model="productType"
          class="logInput peer"
          id="tab2"
          value="third_party"
        />
        <label
          for="tab2"
          class="peer-checked:border-b-2 peer-checked:shadow-lg border-b-mainColor p-2 text-xs xs:text-base"
          >Third Party Products</label
        >
      </div>
    </div>

    <div class="flex flex-wrap gap-5 mt-5" v-if="productType === 'first_party'">
      <!-- OnPremise -->
      <div class="advertType">
        <div class="w-full">
          <img
            src="/on-Premise-Signage.png"
            class="w-full h-[200px] object-cover"
            alt=""
          />
          <p class="text-center font-semibold text-lg my-2.5">
            ON PREMISE Signage Permit
          </p>
          <ul class="w-[300px] mx-auto mb-2.5">
            <li class="checkPoints">
              <IconCheckMark />
              Projecting Sign, Directional Sign, Flat Sign
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Sky sign, Neon Sign, Roof Sign, Building Wall Sign
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Free-standing, Boundary Wall Sign
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Non-profit Sign, Canopy Sign, LED
            </li>
          </ul>
        </div>

        <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
          <button
            disabled
            v-if="false"
            class="block grow rounded-md border-mainColor border-2 bg-white max-w-[150px] px-4 py-2 focus:outline-none"
          >
            Coming Soon
          </button>
          <RouterLink
            :to="{ name: 'Premise Advert' }"
            class="grow blueBtn text-center"
            >Select</RouterLink
          >
        </div>
      </div>

      <!-- Mobile -->
      <div class="advertType">
        <div class="w-full">
          <img
            src="/mobile-Signage-icon.png"
            class="w-full h-[200px] object-cover"
            alt=""
          />
          <p class="text-center font-semibold text-lg my-2.5">
            Mobile Advert Permit (business owners and individuals)
          </p>
          <ul class="w-[300px] mx-auto mb-2.5">
            <li class="checkPoints">
              <IconCheckMark />
              Light Box Cab, Light Box Plus Doors Cab branding
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Car, Bus, Pick-up, SUV, Mini-bus, Taxi, Coaster
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Truck, Trailer, Luxurious bus, Excavators, Tractor
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Tricycle, Motorcycles, Dispatch Bicycles, Push cart
            </li>
          </ul>
        </div>

        <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
          <button v-if="false" class="grow whiteBtn max-w-[150px]">
            Learn More
          </button>
          <RouterLink :to="'mobileAdvert'" class="grow blueBtn text-center"
            >Select</RouterLink
          >
        </div>
      </div>

      <!-- Temporary Ads -->
      <div class="advertType">
        <div class="w-full">
          <img
            src="/temporary-advertising.png"
            class="w-full h-[200px] object-cover"
            alt=""
          />
          <p class="text-center font-semibold text-lg my-2.5">
            Temporary Advert Permit (business owners and individuals)
          </p>
          <ul class="w-[300px] mx-auto mb-2.5">
            <li class="checkPoints">
              <IconCheckMark />
              Moveable Sign, Gazebos, Water Advertisement
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Posters, Flags, Branded T-shirt, Feather Sign
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Cart/Trolley/Stand, Banners, Inflatable
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Wall Drape, Other
            </li>
          </ul>
        </div>

        <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
          <button
            disabled
            v-if="false"
            class="block grow rounded-md border-mainColor border-2 bg-white max-w-[150px] px-4 py-2 focus:outline-none"
          >
            Coming Soon
          </button>
          <RouterLink
            :to="'temporaryAdvert/first_party'"
            class="grow blueBtn text-center"
            >Select</RouterLink
          >
        </div>
      </div>

      <!-- Temporary Ads Blanket -->
      <div class="advertType">
        <div class="w-full">
          <img
            src="/temporary-advertising.png"
            class="w-full h-[200px] object-cover"
            alt=""
          />
          <p class="text-center font-semibold text-lg my-2.5">
            Temporary Blanket Advert Permit
          </p>
          <ul class="w-[300px] mx-auto mb-2.5">
            <li class="checkPoints">
              <IconCheckMark />
              Moveable Sign, Gazebos, Water Advertisement
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Posters, Flags, Branded T-shirt, Feather Sign
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Cart/Trolley/Stand, Banners, Inflatable
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Wall Drape, Other
            </li>
          </ul>
        </div>

        <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
          <button
            disabled
            class="block grow rounded-md border-mainColor border-2 bg-white max-w-[150px] px-4 py-2 focus:outline-none"
          >
            Coming Soon
          </button>
          <!-- <RouterLink
            :to="'temporaryAdBlanket'"
            class="grow blueBtn text-center"
            >Select</RouterLink
          > -->
        </div>
      </div>

      <!-- Small Format Ads -->
      <div class="advertType">
        <div class="w-full">
          <img
            src="/small-format.png"
            class="w-full h-[200px] object-cover"
            alt=""
          />
          <p class="text-center font-semibold text-lg my-2.5">
            Small Format Structure
          </p>
          <ul class="w-[300px] mx-auto mb-2.5">
            <li class="checkPoints">
              <IconCheckMark />
              Kiosk, Stands, Round-about
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Street Furniture, Boundary Wall Sign,
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Recreational Centres, Stick In-ground Sign
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Letterbox, Other
            </li>
          </ul>
        </div>

        <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
          <button
            disabled
            v-if="false"
            class="block grow rounded-md border-mainColor border-2 bg-white max-w-[150px] px-4 py-2 focus:outline-none"
          >
            Coming Soon
          </button>
          <RouterLink :to="'small-format-app'" class="grow blueBtn text-center"
            >Select</RouterLink
          >
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-5 mt-5" v-else>
      <!-- Street -->
      <div class="advertType">
        <div class="w-full">
          <img
            src="/streetlampost.png"
            class="w-full h-[200px] object-cover"
            alt=""
          />
          <p class="text-center font-semibold text-lg my-2.5">
            STREET LAMP POLES
          </p>
          <ul class="w-[300px] mx-auto mb-2.5">
            <li class="checkPoints">
              <IconCheckMark />
              Flex
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              LED
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Backlit
            </li>
          </ul>
        </div>

        <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
          <button
            disabled
            v-if="false"
            class="block grow rounded-md border-mainColor border-2 bg-white max-w-[150px] px-4 py-2 focus:outline-none"
          >
            Coming Soon
          </button>
          <RouterLink
            :to="{ name: 'streetApplication' }"
            class="grow blueBtn text-center"
            >Select</RouterLink
          >
        </div>
      </div>

      <!-- PAV -->
      <div class="advertType">
        <div class="w-full">
          <img
            src="/pavs-icon.png"
            class="w-full h-[200px] object-cover"
            alt=""
          />
          <p class="text-center font-semibold text-lg my-2.5">
            Promotional Advert Vehicles
          </p>
          <ul class="w-[300px] mx-auto mb-2.5">
            <li class="checkPoints">
              <IconCheckMark />
              Light Box Cab, Light Box Plus Doors Cab branding
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Car, Bus, Pick-up, SUV, Mini-bus, Taxi, Coaster
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Truck, Trailer, Luxurious bus, Excavators, Tractor
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Tricycle, Motorcycles, Dispatch Bicycles, Push cart
            </li>
          </ul>
        </div>

        <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
          <button
            disabled
            v-if="false"
            class="block grow rounded-md border-mainColor border-2 bg-white max-w-[150px] px-4 py-2 focus:outline-none"
          >
            Coming Soon
          </button>
          <RouterLink :to="'pavApplication'" class="grow blueBtn text-center"
            >Select</RouterLink
          >
        </div>
      </div>

      <!-- Outdoor Site -->
      <div class="advertType">
        <div class="w-full">
          <img
            src="/outdoor-site.png"
            class="w-full h-[200px] object-cover"
            alt=""
          />
          <p class="text-center font-semibold text-lg my-2.5">Outdoor Site</p>
          <ul class="w-[300px] mx-auto mb-2.5">
            <li class="checkPoints">
              <IconCheckMark />
              16 Sheet, 48 Sheet, 96 Sheet, Rooftop/Static
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Rooftop/Ultrawave, Unipole, Front/Back Lit
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              48 Sheet Ultrawave, Wall Panel Ultrawave, 96 Sheet Ultrawave
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              LED, Wall Drape, Wrap Around
            </li>
          </ul>
        </div>
        <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
          <button
            disabled
            v-if="false"
            class="block grow rounded-md border-mainColor border-2 bg-white max-w-[150px] px-4 py-2 focus:outline-none"
          >
            Coming Soon
          </button>
          <RouterLink
            :to="'outdoor-site-application'"
            class="grow blueBtn text-center"
            >Select</RouterLink
          >
        </div>
      </div>

      <!-- Temporary Ads -->
      <div class="advertType">
        <div class="w-full">
          <img
            src="/temporary-advertising.png"
            class="w-full h-[200px] object-cover"
            alt=""
          />
          <p class="text-center font-semibold text-lg my-2.5">
            Temporary Advert Permit (business owners and individuals)
          </p>
          <ul class="w-[300px] mx-auto mb-2.5">
            <li class="checkPoints">
              <IconCheckMark />
              Banner on Premise, Flag Pole
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Development Boards, feather Banner
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Inflatable, Water Tank
            </li>
            <li class="checkPoints">
              <IconCheckMark />
              Wall Drape, Other
            </li>
          </ul>
        </div>

        <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
          <button
            disabled
            v-if="false"
            class="block grow rounded-md border-mainColor border-2 bg-white max-w-[150px] px-4 py-2 focus:outline-none"
          >
            Coming Soon
          </button>
          <RouterLink
            :to="'temporaryAdvert/third_party'"
            class="grow blueBtn text-center"
            >Select</RouterLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
