// Handle SVG imports in Jest tests
// This allows us to mock SVG imports in our tests

module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    // The output is always the same
    return 'svgTransform';
  },
};
