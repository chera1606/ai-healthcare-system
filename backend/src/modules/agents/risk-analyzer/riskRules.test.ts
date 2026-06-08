import { assessBloodPressure } from './riskRules.js';

// ============================================
// Blood Pressure Rule Tests
// ============================================

/**
 * Test function to verify blood pressure risk assessment rules
 * These tests ensure the deterministic logic works correctly
 */
export function runBloodPressureTests() {
  console.log('Running Blood Pressure Rule Tests...\n');

  const tests = [
    {
      name: 'Test 1: BP 148/95 should be HIGH',
      systolic: 148,
      diastolic: 95,
      expected: 'high'
    },
    {
      name: 'Test 2: BP 120/75 should be NORMAL',
      systolic: 120,
      diastolic: 75,
      expected: 'normal'
    },
    {
      name: 'Test 3: BP 135/85 should be ELEVATED',
      systolic: 135,
      diastolic: 85,
      expected: 'elevated'
    },
    {
      name: 'Test 4: BP 180/120 should be CRITICAL',
      systolic: 180,
      diastolic: 120,
      expected: 'critical'
    },
    {
      name: 'Test 5: BP 140/90 should be HIGH',
      systolic: 140,
      diastolic: 90,
      expected: 'high'
    },
    {
      name: 'Test 6: BP 130/80 should be ELEVATED',
      systolic: 130,
      diastolic: 80,
      expected: 'elevated'
    },
    {
      name: 'Test 7: BP 118/76 should be NORMAL',
      systolic: 118,
      diastolic: 76,
      expected: 'normal'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = assessBloodPressure(test.systolic, test.diastolic);
    
    if (result.level === test.expected) {
      console.log(`✓ ${test.name}`);
      console.log(`  Result: ${result.level} (Expected: ${test.expected})`);
      console.log(`  Explanation: ${result.explanation}\n`);
      passed++;
    } else {
      console.log(`✗ ${test.name}`);
      console.log(`  Result: ${result.level} (Expected: ${test.expected})`);
      console.log(`  Explanation: ${result.explanation}\n`);
      failed++;
    }
  }

  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Run tests if this file is executed directly
import { fileURLToPath } from 'url';
const isMain = process.argv[1] && (
  process.argv[1] === fileURLToPath(import.meta.url) || 
  process.argv[1].replace(/\\/g, '/').endsWith('riskRules.test.ts') ||
  process.argv[1].replace(/\\/g, '/').endsWith('riskRules.test.js')
);

if (isMain) {
  runBloodPressureTests();
}
