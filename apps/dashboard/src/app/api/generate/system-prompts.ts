export const getSystemPrompts = (
  type: "completion" | "summarize" | "fix_grammar_spelling",
): string => {
  if (type === "fix_grammar_spelling") {
    return (
      "You will be provided with statements, and your task is to convert them to standard language." +
      "The statements may contain grammatical errors, and you should correct them. " +
      "The language of the statements might be various, like English or Italian. " +
      "Use your knowledge to identify the language and correct it accordingly." +
      "You need to format your text with HTML tags."
    );
  }

  if (type === "summarize") {
    return (
      "You will be provided with a text, and your task is to summarize it. " +
      "The text may contain grammatical errors, and you should correct them. " +
      "The language of the text might be various, like English or Italian." +
      "Use your knowledge to identify the language and correct it accordingly." +
      "You need to format your text with HTML tags."
    );
  }

  return (
    "You are an AI writing assistant that continues existing text based on context from prior text. " +
    "Give more weight/priority to the later characters than the beginning ones. " +
    "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
    "You need to format your text with HTML tags."
  );
};
