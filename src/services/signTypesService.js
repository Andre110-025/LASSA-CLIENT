// services/signTypesService.js
import axios from "axios";

class SignTypesService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Get sign types for a specific product category
   * @param {string} category - The product category
   * @returns {Promise<Array>} Array of sign types
   */
  async getSignTypes(category) {
    const cacheKey = `signtypes_${category}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const endpoint = this.getEndpointForCategory(category);
      const response = await axios.get(endpoint);

      // Extract sign types from response
      const signTypes = this.extractSignTypes(response.data, category);

      // Cache the result
      this.cache.set(cacheKey, {
        data: signTypes,
        timestamp: Date.now(),
      });

      return signTypes;
    } catch (error) {
      console.error(`Error fetching sign types for ${category}:`, error);

      // Fallback to static data from helper if API fails
      return this.getFallbackSignTypes(category);
    }
  }

  /**
   * Get sign types for multiple categories
   * @param {Array<string>} categories - Array of category names
   * @returns {Promise<Object>} Object with category as key and sign types as value
   */
  async getMultipleSignTypes(categories) {
    const promises = categories.map((category) =>
      this.getSignTypes(category).then((types) => ({ category, types }))
    );

    const results = await Promise.all(promises);

    return results.reduce((acc, { category, types }) => {
      acc[category] = types;
      return acc;
    }, {});
  }

  /**
   * Get all available sign types for all categories
   * @returns {Promise<Object>} Object with all categories and their sign types
   */
  async getAllSignTypes() {
    const categories = [
      "on_premise",
      "outdoor",
      "temporary_first_party",
      "temporary_third_party",
      "temporary_blanket",
      "street_lamp",
      "mobile_ads",
      "third_party_mobile",
    ];

    return this.getMultipleSignTypes(categories);
  }

  /**
   * Get sign type by name within a category
   * @param {string} category - The product category
   * @param {string} signTypeName - The sign type name to find
   * @returns {Promise<Object|null>} Sign type object or null
   */
  async getSignTypeByName(category, signTypeName) {
    const signTypes = await this.getSignTypes(category);
    return signTypes.find((type) => type.name === signTypeName) || null;
  }

  /**
   * Check if a sign type exists in a category
   * @param {string} category - The product category
   * @param {string} signTypeName - The sign type name to validate
   * @returns {Promise<boolean>} Whether the sign type exists
   */
  async validateSignType(category, signTypeName) {
    const signType = await this.getSignTypeByName(category, signTypeName);
    return signType !== null;
  }

  /**
   * Get sign types as simple array of strings (for compatibility with existing code)
   * @param {string} category - The product category
   * @returns {Promise<Array<string>>} Array of sign type names
   */
  async getSignTypeNames(category) {
    const signTypes = await this.getSignTypes(category);
    return signTypes.map((type) => type.name);
  }

  /**
   * Clear cache for a specific category or all categories
   * @param {string} category - Optional category to clear, if not provided clears all
   */
  clearCache(category = null) {
    if (category) {
      this.cache.delete(`signtypes_${category}`);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get the appropriate endpoint for a category
   * @param {string} category - The product category
   * @returns {string} API endpoint
   */
  getEndpointForCategory(category) {
    const endpoints = {
      on_premise: "/getonpremisepricingdistinct",
      outdoor: "/getoutdoorpricingdistinct",
      temporary_first_party: "/gettemporarypricingdistinct/first_party",
      temporary_third_party: "/gettemporarypricingdistinct/third_party",
      temporary_blanket: "/gettemporarypricingdistinct/blanket",
      street_lamp: "/getstreetlamppricingdistinct",
      mobile_ads: "/getmobileadspricingdistinct",
      third_party_mobile: "/getthirdpartymobileadspricingdistinct",
    };

    return endpoints[category] || endpoints["on_premise"];
  }

  /**
   * Extract sign types from API response
   * @param {Object} data - API response data
   * @param {string} category - Category for context
   * @returns {Array} Extracted sign types
   */
  extractSignTypes(data, category) {
    // Handle the actual API response structure
    if (data.success && data.data && Array.isArray(data.data)) {
      return data.data.map((signTypeName, index) => ({
        id: index + 1,
        name: signTypeName,
        category: category,
        value: signTypeName, // Keep original value for form submissions
      }));
    }

    // Fallback for different response structures
    if (Array.isArray(data)) {
      return data.map((signTypeName, index) => ({
        id: index + 1,
        name: signTypeName,
        category: category,
        value: signTypeName,
      }));
    }

    return [];
  }

  /**
   * Fallback to static data if API fails
   * @param {string} category - The product category
   * @returns {Array} Static sign types
   */
  getFallbackSignTypes(category) {
    // Import static data from helper
    const staticData = {
      on_premise: [
        "Neon Wall/Canopy/Roof Signs/Flat Signs",
        "Wall/Canopy/Roof Signs/Flat Signs",
        "Neon Freestanding/Sky Sign",
        "Projecting Signs",
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
      ],
      outdoor: [
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
      ],
      small_format: [
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
        "building branding",
        "Water Advertisement",
        "wall moral",
        "floor mat",
        "containers",
        "entrance Arcade",
        "LED at filling station",
        "other",
      ],
      temporary: [
        "branded t-shirt",
        "city walker/skaters",
        "banner on vehicle(car, bus)",
        "wall Drape for non-practitioner",
        "banner on a truck",
        "banner on rig",
        "feather sign",
        "cart/trolley/stand",
        "flags",
        "banners",
        "parasols",
        "roll-up banner",
        "gazebos/tent",
        "kiosk",
        "inflatables/mascot",
      ],
      third_party_temporary: [
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
      ],
      temporary_blanket: ["Intermediate", "Premium", "Standard"],
      street_lamp: ["FLEX", "LED", "BACKLIT"],
      mobile_ads: [
        "Trailer",
        "Truck",
        "Coaster",
        "Civilian",
        "Bus",
        "Pickup",
        "SUV",
        "Motorcycle",
        "Push-Cart",
        "Bicycle",
        "Tricycle",
        "Car",
      ],
      third_party_mobile: [
        "Light Box Cab",
        "Light Box Plus Doors Cab",
        "Promotional Advert Vehicles (PAV) Static",
        "Promotional Advert Vehicles (PAV) Ultrawave & LED",
        "Intra-State Luxurious Bus Advertising (LAGBUS/LAMATA/LAWMA)",
      ],
    };

    const types = staticData[category] || [];
    return types.map((signTypeName, index) => ({
      id: index + 1,
      name: signTypeName,
      category: category,
      value: signTypeName,
    }));
  }
}

// Create a singleton instance
const signTypesService = new SignTypesService();

export default signTypesService;
