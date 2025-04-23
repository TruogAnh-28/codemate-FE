// problem.ts

import { TestInput, ProblemExample } from '../types/Code';

// Problem description
export const PROBLEM_DESCRIPTION: string = `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.`;

// Default test inputs
export const DEFAULT_TEST_INPUT: TestInput = {
  nums: '[2,7,11,15]',
  target: '9'
};

// Examples for the problem
export const PROBLEM_EXAMPLES: ProblemExample[] = [
  {
    title: 'Example 1:',
    input: {
      nums: '[2,7,11,15]',
      target: '9'
    },
    output: '[0,1]',
    explanation: 'Because nums[0] + nums[1] = 9, we return [0,1].'
  },
  {
    title: 'Example 2:',
    input: {
      nums: '[3,2,4]',
      target: '6'
    },
    output: '[1,2]',
    explanation: ''
  }
];

// Constraints for the problem
export const PROBLEM_CONSTRAINTS: string[] = [
  '2 <= nums.length <= 10^4',
  '-10^9 <= nums[i] <= 10^9',
  '-10^9 <= target <= 10^9'
];
