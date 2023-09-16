export const getSystemPrompts = (
  type: "completion" | "improve_writing" | "fix_grammar_spelling",
): string => {
  if (type === "fix_grammar_spelling") {
    return (
      "You will be provided with statements, and your task is to convert them to standard language." +
      "The statements may contain grammatical errors, and you should correct them. " +
      "The language of the statements might be various, like English or Italian. Use your knowledge to identify the language and correct it accordingly."
    );
  }

  return (
    "You are an AI writing assistant that continues existing text based on context from prior text. " +
    "Give more weight/priority to the later characters than the beginning ones. " +
    "Limit your response to no more than 200 characters, but make sure to construct complete sentences."
  );
};
