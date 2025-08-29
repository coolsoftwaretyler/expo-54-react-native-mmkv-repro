const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withModularHeaders = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      
      if (!fs.existsSync(podfilePath)) {
        throw new Error(`Podfile not found at ${podfilePath}`);
      }

      let podfileContent = fs.readFileSync(podfilePath, 'utf8');
      
      // Check if use_modular_headers! is already present
      if (podfileContent.includes('use_modular_headers!')) {
        console.log('use_modular_headers! already present in Podfile');
        return config;
      }

      // Find the first target block and add use_modular_headers! after it
      const targetPattern = /(target\s+['"]([^'"]+)['"]\s+do\s*\n)/;
      if (targetPattern.test(podfileContent)) {
        // Only replace the first occurrence
        podfileContent = podfileContent.replace(
          targetPattern,
          "$1  use_modular_headers!\n\n"
        );
        
        fs.writeFileSync(podfilePath, podfileContent);
        console.log('Successfully added use_modular_headers! to Podfile');
      } else {
        console.warn('Could not find any target block in Podfile');
      }

      return config;
    },
  ]);
};

module.exports = withModularHeaders;
