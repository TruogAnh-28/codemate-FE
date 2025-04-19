export const prepareStdin = (input: string, languageId: number): string => {
  // For Python, we need to handle multiline input differently
  if (languageId === 71) { // Python
    return input.split('\n').join('\\n');
  }
  return input;
}; 