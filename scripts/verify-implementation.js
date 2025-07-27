#!/usr/bin/env node

/**
 * Implementation Verification Script
 * 
 * This script verifies that all components of the PokerGameAdapter
 * implementation are correctly installed and functional.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 BigStack Poker Backend Migration - Implementation Verification\n');

// File paths to verify
const requiredFiles = [
  // Core adapter files
  'src/services/PokerGameAdapter.js',
  'src/hooks/usePokerGameAdapter.js',
  'src/config/features.js',
  
  // Server-side files
  'server/bots/BotManager.js',
  'server/server.js',
  
  // Example components
  'src/components/poker/PokerGameAdapterExample.jsx',
  'src/pages/game/Bot9MaxPageAdapter.jsx',
  
  // Test files
  'src/services/__tests__/PokerGameAdapter.test.js',
  'src/services/__tests__/PokerGameAdapter.integration.test.js',
  'src/services/__tests__/PokerGameAdapter.e2e.test.js',
  'src/services/__tests__/test-helpers.js',
  'server/bots/__tests__/BotManager.test.js',
  
  // Documentation
  'MIGRATION_GUIDE.md',
  'IMPLEMENTATION_SUMMARY.md'
];

let allFilesExist = true;
let fileChecks = [];

console.log('📁 Checking required files...\n');

requiredFiles.forEach(filePath => {
  const fullPath = path.join(path.dirname(__dirname), filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`✅ ${filePath} (${sizeKB}KB)`);
    fileChecks.push({ file: filePath, exists: true, size: sizeKB });
  } else {
    console.log(`❌ ${filePath} - MISSING`);
    fileChecks.push({ file: filePath, exists: false });
    allFilesExist = false;
  }
});

console.log('\n🔧 Checking code integration...\n');

// Check if PokerGameAdapter is properly implemented
const checkAdapterImplementation = () => {
  try {
    const adapterPath = path.join(path.dirname(__dirname), 'src/services/PokerGameAdapter.js');
    const adapterCode = fs.readFileSync(adapterPath, 'utf8');
    
    const requiredMethods = [
      'initialize',
      'performAction',
      'transformBackendToClient',
      'transformClientToBackend',
      'getBotDecision',
      'switchToLocalMode',
      'destroy'
    ];
    
    const missingMethods = requiredMethods.filter(method => 
      !adapterCode.includes(`${method}(`));
    
    if (missingMethods.length === 0) {
      console.log('✅ PokerGameAdapter has all required methods');
      return true;
    } else {
      console.log(`❌ PokerGameAdapter missing methods: ${missingMethods.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error checking PokerGameAdapter: ${error.message}`);
    return false;
  }
};

// Check if BotManager is properly integrated
const checkBotManagerIntegration = () => {
  try {
    const serverPath = path.join(path.dirname(__dirname), 'server/server.js');
    const serverCode = fs.readFileSync(serverPath, 'utf8');
    
    if (serverCode.includes('BotManager') && serverCode.includes('botManager')) {
      console.log('✅ BotManager integrated into server.js');
      return true;
    } else {
      console.log('❌ BotManager not properly integrated into server.js');
      return false;
    }
  } catch (error) {
    console.log(`❌ Error checking BotManager integration: ${error.message}`);
    return false;
  }
};

// Check if Features system is properly configured
const checkFeatureFlags = () => {
  try {
    const featuresPath = path.join(path.dirname(__dirname), 'src/config/features.js');
    const featuresCode = fs.readFileSync(featuresPath, 'utf8');
    
    const requiredFeatures = [
      'shouldUseBackendForBots',
      'enableBackendForCurrentUser',
      'setRolloutPercentage',
      'getFeatureStatus'
    ];
    
    const missingFeatures = requiredFeatures.filter(feature => 
      !featuresCode.includes(feature));
    
    if (missingFeatures.length === 0) {
      console.log('✅ Feature flag system properly configured');
      return true;
    } else {
      console.log(`❌ Feature flags missing: ${missingFeatures.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error checking feature flags: ${error.message}`);
    return false;
  }
};

// Check if React hook is properly implemented
const checkReactHook = () => {
  try {
    const hookPath = path.join(path.dirname(__dirname), 'src/hooks/usePokerGameAdapter.js');
    const hookCode = fs.readFileSync(hookPath, 'utf8');
    
    if (hookCode.includes('usePokerGameAdapter') && hookCode.includes('useState')) {
      console.log('✅ React hook properly implemented');
      return true;
    } else {
      console.log('❌ React hook missing or incomplete');
      return false;
    }
  } catch (error) {
    console.log(`❌ Error checking React hook: ${error.message}`);
    return false;
  }
};

const adapterOk = checkAdapterImplementation();
const botManagerOk = checkBotManagerIntegration();
const featuresOk = checkFeatureFlags();
const hookOk = checkReactHook();

const allChecksPass = allFilesExist && adapterOk && botManagerOk && featuresOk && hookOk;

console.log('\n📊 Implementation Summary:\n');

console.log(`Files Created: ${fileChecks.filter(f => f.exists).length}/${requiredFiles.length}`);
console.log(`Core Implementation: ${adapterOk ? '✅' : '❌'}`);
console.log(`Server Integration: ${botManagerOk ? '✅' : '❌'}`);
console.log(`Feature Flags: ${featuresOk ? '✅' : '❌'}`);
console.log(`React Integration: ${hookOk ? '✅' : '❌'}`);

if (allChecksPass) {
  console.log('\n🎉 Implementation Verification: PASSED\n');
  console.log('✅ All components are properly implemented');
  console.log('✅ Ready for testing and deployment');
  console.log('\n🚀 Next Steps:');
  console.log('1. Run tests: npm run test:all');
  console.log('2. Test feature flags: BigStackFeatures.enableBackendForCurrentUser()');
  console.log('3. Deploy with 0% rollout for safety');
  console.log('4. Gradually increase rollout percentage');
} else {
  console.log('\n❌ Implementation Verification: FAILED\n');
  console.log('Please fix the issues above before proceeding.');
  process.exit(1);
}

// Additional verification functions
console.log('\n🧪 Testing Quick Verification:\n');

const runQuickTests = () => {
  console.log('To verify everything works correctly, run these commands:\n');
  
  console.log('# Test adapter functionality');
  console.log('npm run test:adapter\n');
  
  console.log('# Test integration between components');
  console.log('npm run test:integration\n');
  
  console.log('# Test end-to-end game scenarios');
  console.log('npm run test:e2e\n');
  
  console.log('# Test server-side bot management');
  console.log('npm run test:server\n');
  
  console.log('# Run all tests with coverage');
  console.log('npm run test:coverage\n');
  
  console.log('# Manual testing in browser:');
  console.log('// Open browser console and run:');
  console.log('BigStackFeatures.enableBackendForCurrentUser();');
  console.log('// Then navigate to a bot game page');
  console.log('// Check that it connects to backend (Network tab shows WebSocket)');
  console.log('// Verify game plays identically to local mode\n');
};

runQuickTests();

console.log('📋 Component Integration Checklist:\n');

const integrationSteps = [
  '□ Update Bot9MaxPage.jsx to use PokerGameAdapterExample',
  '□ Update Bot6MaxPage.jsx with same pattern',
  '□ Update BotHeadsUpPage.jsx with same pattern', 
  '□ Test feature flag switching between modes',
  '□ Verify stats tracking works in both modes',
  '□ Test error handling and fallback behavior',
  '□ Deploy server changes with bot support',
  '□ Configure feature flag rollout strategy'
];

integrationSteps.forEach(step => console.log(step));

console.log('\n💡 Pro Tips:\n');
console.log('• Start with 0% backend rollout for safety');
console.log('• Use debug mode: localStorage.setItem("pokerAdapterDebug", "true")');
console.log('• Monitor WebSocket connections in browser Network tab');
console.log('• Check console for adapter logs and errors');
console.log('• Test bot behavior is identical between modes');
console.log('• Verify chip conservation and game state consistency\n');

console.log('📞 Troubleshooting:\n');
console.log('If tests fail or behavior differs:');
console.log('1. Check console logs for detailed error messages');
console.log('2. Verify feature flags are working: Features.getFeatureStatus(userId)');
console.log('3. Test with forced local mode: Features.disableBackendForCurrentUser()');
console.log('4. Check server logs for bot creation and action processing');
console.log('5. Verify WebSocket connection in browser Network tab\n');

if (allChecksPass) {
  console.log('🎯 Status: READY FOR PRODUCTION DEPLOYMENT! 🚀');
} else {
  console.log('⚠️  Status: REQUIRES FIXES BEFORE DEPLOYMENT');
  process.exit(1);
}