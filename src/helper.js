export function useHelpers() {
  const lagosLGAs = [
    "Agege",
    "Aguda/Itire-Ikate",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo Odofin",
    "Apapa",
    "Badagry",
    "Computer Village",
    "Epe",
    "Eti-osa",
    "Ibeju-Lekki 1",
    "Ibeju-Lekki 2",
    "Ikeja",
    "Ikorodu Central",
    "Ikorodu West",
    "Ikoyi-Obalende",
    "Ifako-Ijaiye",
    "Ikeja",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Lekki Phase 1",
    "Magodo/Isheri",
    "Mosan Okunola",
    "Mushin",
    "Ojo",
    "Oshodi/Isolo",
    "Onigbongbo",
    "Shomolu",
    "Surulere",
    "Others",
  ];

  const premiseSignTypes = [
    "Neon Wall/Canopy/Roof Signs/Flat Signs",
    "Wall/Canopy/Roof Signs/Flat Signs",
    "Neon Freestanding/Sky Sign",
    "Projecting Signs/Snapper Frame/Lollipop",
    "Window Display",
    "Wall Drapes",
    "Freestanding",
    "Sky Signs",
    "Flags",
    "Small shops",
    "Led Screens At Filling Stations",
    "Led Sign",
    "Street Light Pole Directional Sign",
    "Street Directional Sign",
    "Tank Farm",
    "Buntings",
  ];

  const outDoorSignTypes = [
    "16 Sheet",
    "48 Sheet",
    "96 Sheet",
    "Rooftop/Static",
    "Rooftop/Ultrawave",
    "Unipole(Neon)",
    "Unipole",
    "Front/Back Lit",
    "48 Sheet Ultrawave",
    "Wall Panel Ultrawave",
    "96 Sheet Ultrawave",
    "Unipole Ultrawave",
    "Unipole(Neon) Ultrawave",
    "Wall Drape",
    "Wrap Around",
    "Iconic Structure (Billboard)",
    "Tank Farm",
    // "Water Advertisement",
    "Water Tank",
    "Water Tank Ultrawave",
    "Advert on Bridge built on private sector Initiative",
    "Bridge Panel (Pedestrian/vehicular)",
    "Advert on Bridge built on private sector Initiative Ultrawave",
    "Bridge Panel Ultrawave (Pedestrian/vehicular)",
    "Overhead Gantries/Directional signs(A)",
    "Overhead Gantries/Directional signs(B)",
    "Overhead Gantries/Directional signs(C)",
    "Overhead Gantries/Directional signs Ultrawave(A)",
    "Overhead Gantries/Directional signs Ultrawave(B)",
    "Overhead Gantries/Directional signs Ultrawave(C)",
    "LED",
  ];

  const smallFormatTypes = [
    "kiosk Branding",
    "SME kiosk",
    "Third Party kiosk",
    "round-about",
    "Traffic Warden boot",
    "traffic light branding",
    "Composite Directional Sign",
    "Street Directional Sign",
    "a-frame board",
    "small format iconic cube",
    "Bus Shelter",
    "street furniture",
    // "boundary wall sign",
    "building branding",
    "Water Advertisement",
    "wall moral",
    "floor mat",
    // "letterbox",
    // "recreational centres",
    // "stick in-ground sign",
    "containers",
    "entrance Arcade",
    "LED at filling station",
    "other",
  ];

  const temporaryFirstTypes = [
    "branded t-shirt",
    "city walker/skaters",
    "3D city walker/skaters",
    "banner on vehicle(car, bus)",
    "wall Drape for non-practitioner",
    "banner on a truck",
    "banner on rig",
    "feather sign",
    "cart/trolley/stand",
    "3D cart/trolley/stand",
    "flags",
    "banners",
    "parasols",
    "roll-up banner",
    "gazebos/tent",
    "kiosk",
    "inflatables/mascot",
    "Static Branding on Car",
    "Static Branding on Tricycle",
    "Static Branding on Truck",
    "Static Branding on Bus",
    "3D Branding on Car",
    "3D Branding on Tricycle",
    "3D Branding on Truck",
    "3D Branding on Bus",
  ];

  const temporaryThirdTypes = [
    "banner on premise",
    "wall Drape for practitioner",
    "development boards",
    "development boards for government contractor",
    "flag pole/feather banner",
    "inflatables/mascot",
    "Water Advertisement",
    "wrap around(construction site)",
    "blimp",
    "water tank",
    // "water tank for airport",
    // "water tank ultra wave",
    // "water tank ultra wave for airport",
  ];

  function convertTo12HourFormat(time24Hour) {
    // Extract hours and minutes from the input time string
    const [hours, minutes] = time24Hour.split(":").map(Number);

    // Check if it's AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12;

    // Pad the minutes with leading zero if needed
    const paddedMinutes = String(minutes).padStart(2, "0");

    // Return the 12-hour time string
    return `${hours12}:${paddedMinutes} ${period}`;
  }

  function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = dateObj.toLocaleString("en-US", options);

    return formattedDate;
  }

  function isToday(dateStr) {
    const currentDate = new Date();
    const date = new Date(dateStr);

    const today =
      currentDate.getDate() === date.getDate() &&
      currentDate.getMonth() === date.getMonth() &&
      currentDate.getFullYear() === date.getFullYear();

    if (today) {
      return "Today";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }

  function dateToStr(dateStr) {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function monthDayStr(dateStr) {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }

  function timeFormat(dateString) {
    // Convert the ISO 8601 date string to a Date object
    const date = new Date(dateString);

    // Format the date using the Intl.DateTimeFormat API
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);

    return formattedDate;
  }

  function dateToSlash(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  const formatCurrenc = (str) => {
    return str.toLocaleString("en-US", {
      style: "currency",
      currency: "NGN",
    });
  };

  const formatCurrency = (str) => {
    const num = Number(str); // so this convert any value at all, passed as str into a number
    if (isNaN(num)) return "₦0.00"; // if any value other than number is passed, then it turns it to #0.00

    // java script number convertor to Naira, kobo
    return num.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  };

  // Channel Selection
  const channelList = (cost) => {
    if (cost >= 400000) return ["bank_transfer", "bank"];
    else return ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"];
  };

  const todayDate = () => {
    return new Date().toISOString().split("T")[0]; // Formats today's date as YYYY-MM-DD
  };

  const endOfYear = () => {
    const now = new Date();
    const endOfCurrentYear = new Date(now.getFullYear(), 11, 31); // December 31st
    return endOfCurrentYear.toISOString().split("T")[0]; // Formats end of year as YYYY-MM-DD
  };

  const generateRandomRef = () => {
    const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);
    return `iy67f${rand(10, 60)}hvc${rand(10, 90)}`;
  };

  // Custom Validations
  const containsUppercase = (value) => /[A-Z]/.test(value);
  const containsLowercase = (value) => /[a-z]/.test(value);
  const containsNumber = (value) => /[0-9]/.test(value);
  const containsSpecial = (value) => /[#?!@$%^&*-+=]/.test(value);

  return {
    lagosLGAs,
    premiseSignTypes,
    outDoorSignTypes,
    smallFormatTypes,
    temporaryFirstTypes,
    temporaryThirdTypes,
    convertTo12HourFormat,
    formatDate,
    timeFormat,
    isToday,
    formatCurrency,
    containsUppercase,
    containsLowercase,
    containsNumber,
    containsSpecial,
    dateToStr,
    todayDate,
    endOfYear,
    monthDayStr,
    dateToSlash,
    channelList,
    generateRandomRef,
  };
}
