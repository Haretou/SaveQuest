const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Permettre à Metro de reconnaitre les fichiers .riv comme des assets
config.resolver.assetExts.push('riv');

module.exports = withNativeWind(config, { input: './global.css' });
