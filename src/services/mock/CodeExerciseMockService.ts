import { IResponseData } from "@/modals/apis/response";

// Mock solutions for different languages
const mockSolutions: Record<number, string> = {
  54: `// C++ Solution
#include <vector>
#include <unordered_map>

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};`,

  62: `// Java Solution
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            numMap.put(nums[i], i);
        }
        return new int[0];
    }
}`,

  63: `// JavaScript Solution
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const numMap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        numMap.set(nums[i], i);
    }
    return [];
};`,

  71: `# Python Solution
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        num_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in num_map:
                return [num_map[complement], i]
            num_map[num] = i
        return []`
};

export const CodeExerciseMockService = {
  async getAIGeneratedSolution(exerciseId: string, languageId: number) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const solution = mockSolutions[languageId];
    if (!solution) {
      throw new Error(`No mock solution available for language ID: ${languageId}`);
    }

    return {
      isSuccess: true,
      data: solution,
      message: "Success"
    } as IResponseData<string>;
  }
}; 