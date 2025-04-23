import { EditorOptions, LanguageMap, DefaultCode } from '../types/Code';

// Available programming languages
export const LANGUAGES: string[] = ['cpp', 'java', 'python'];

// Language ID mapping for Judge0
export const LANGUAGE_MAP: LanguageMap = {
  cpp: 54,    // C++17
  java: 62,   // Java 13
  python: 71  // Python 3
};

// Default code templates for each language
export const DEFAULT_CODE: DefaultCode = {
  cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

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
        return {}; // No solution found
    }
};

int main() {
    Solution solution;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = solution.twoSum(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`,
  java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement)) {
                return new int[] {numMap.get(complement), i};
            }
            numMap.put(nums[i], i);
        }
        return new int[] {}; // No solution found
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = solution.twoSum(nums, target);
        System.out.println("[" + result[0] + "," + result[1] + "]");
    }
}`,
  python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        num_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in num_map:
                return [num_map[complement], i]
            num_map[num] = i
        return []  # No solution found

if __name__ == "__main__":
    solution = Solution()
    nums = [2, 7, 11, 15]
    target = 9
    result = solution.twoSum(nums, target)
    print(f"[{result[0]},{result[1]}]")`
};

// Editor configuration options
export const EDITOR_OPTIONS: EditorOptions = {
    // Basic layout
    automaticLayout: true,
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    fontLigatures: true,
    lineHeight: 20,
    
    // Display features
    minimap: { 
      enabled: false,
      showSlider: 'mouseover',
      renderCharacters: true
    },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    lineDecorationsWidth: 10,
    glyphMargin: true,
    folding: true,
    foldingStrategy: 'auto',
    
    // Visual indicators
    renderLineHighlight: 'all',
    renderWhitespace: 'selection',
    renderControlCharacters: true,
    renderIndentGuides: true,
    
    // Scrolling behavior
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: true,
      verticalScrollbarSize: 14,
      horizontalScrollbarSize: 14
    },
    
    // Editor behavior
    cursorBlinking: 'blink',
    cursorStyle: 'line',
    cursorSmoothCaretAnimation: 'on',
    mouseWheelZoom: true,
    multiCursorModifier: 'alt',
    
    // Code intelligence
    quickSuggestions: true,
    snippetSuggestions: 'inline',
    formatOnPaste: true,
    formatOnType: true,
    autoIndent: 'full',
    
    // Error highlighting
    renderValidationDecorations: 'on',
    lightbulb: { enabled: 'on' },
    
    // Code aesthetics
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true
    },
    
    // Search features
    find: {
      addExtraSpaceOnTop: true,
      autoFindInSelection: 'multiline',
      seedSearchStringFromSelection: 'selection'
    },
    
    // Miscellaneous
    links: true,
    wordWrap: 'off',
    tabCompletion: 'on',
    wordBasedSuggestions: 'on',
    accessibilitySupport: 'auto',
    occurrencesHighlight: true,
    selectionHighlight: true
  }