const form = document.getElementById("projectForm");
const outputWrapper = document.getElementById("output-wrapper");
const outputField = document.getElementById("promptOutput");
const copyBtn = document.getElementById("copyBtn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const values = [...form.elements].reduce((acc, el) => {
    if (el.tagName === "SELECT" || el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      if (el.previousElementSibling) {
        acc[el.previousElementSibling.innerText] = el.value;
      }
    }
    return acc;
  }, {});

  const prompt = `
You are a senior academic supervisor and examiner with extensive experience in UK higher education.

TASK:
Create a highly detailed academic writing prompt for the following work.

ACADEMIC CONTEXT:
- Level: ${values["Academic Level"]}
- Type of work: ${values["Type of Work"]}
- Section: ${values["Section / Chapter"]}
- Discipline: ${values["Discipline"]}
- Methodology: ${values["Methodology"]}
- Target length: ${values["Target Word Count"]} words

PROJECT TOPIC:
"${values["Project Topic"]}"

WRITING REQUIREMENTS:
- Use UK English
- Maintain a formal academic tone
- Do not use first-person or contractions
- Write in clear, well-structured paragraphs only
- Move from descriptive discussion to critical evaluation
- Demonstrate synthesis, not summary
- Assume examiner-level scrutiny

CONTENT EXPECTATIONS:
- Define all key concepts using scholarly sources
- Integrate theory with practice
- Highlight debates, limitations, and gaps
- Use recent, credible academic literature
- Ensure logical flow and coherence
- Avoid generic or superficial explanations

CITATION REQUIREMENTS:
- Use Harvard referencing style
- Use "and" not "&" in in-text citations
- Cite all non-obvious claims
- Do not fabricate references

OUTPUT MODE:
${values["Output Style"]}

STRUCTURE:
Generate a prompt that instructs an AI to:
- Follow the correct academic structure for the selected section
- Respect the specified word count
- Write section by section if step-by-step output is requested
- Stop after each section when gated output is selected

IMPORTANT:
This prompt must guide writing. It must not generate the academic work itself.
`;

  outputField.value = prompt.trim();
  outputWrapper.classList.remove("hidden");
});

copyBtn.addEventListener("click", function () {
  outputField.select();
  document.execCommand("copy");
  copyBtn.textContent = "Copied ✓";
  setTimeout(() => (copyBtn.textContent = "Copy Prompt"), 2000);
});
