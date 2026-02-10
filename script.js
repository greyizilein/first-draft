document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("projectForm");
  const outputWrapper = document.getElementById("output-wrapper");
  const outputField = document.getElementById("promptOutput");
  const copyBtn = document.getElementById("copyBtn");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      level: document.getElementById("academicLevel")?.value,
      type: document.getElementById("workType")?.value,
      section: document.getElementById("section")?.value,
      discipline: document.getElementById("discipline")?.value,
      methodology: document.getElementById("methodology")?.value,
      topic: document.getElementById("topic")?.value,
      words: document.getElementById("wordCount")?.value,
      output: document.getElementById("outputStyle")?.value
    };

    const prompt = `
You are a senior academic supervisor and examiner with extensive experience in UK higher education.

TASK:
Create a highly detailed academic writing prompt for the following work.

ACADEMIC CONTEXT:
- Level: ${data.level}
- Type of work: ${data.type}
- Section: ${data.section}
- Discipline: ${data.discipline}
- Methodology: ${data.methodology}
- Target length: ${data.words} words

PROJECT TOPIC:
"${data.topic}"

WRITING REQUIREMENTS:
- Use UK English
- Maintain a formal academic tone
- Do not use first-person or contractions
- Write in well-structured paragraphs only
- Move from description to critical evaluation
- Demonstrate synthesis, not summary
- Assume examiner-level scrutiny

CONTENT EXPECTATIONS:
- Define all key concepts using scholarly sources
- Integrate theory with practice
- Highlight debates, limitations, and gaps
- Use recent, credible academic literature
- Ensure logical flow and coherence
- Avoid generic explanations

CITATION REQUIREMENTS:
- Harvard referencing style
- Use "and" not "&" in in-text citations
- Cite all non-obvious claims
- Do not fabricate references

OUTPUT MODE:
${data.output}

IMPORTANT:
This prompt must guide writing. It must not generate the academic work itself.
`;

    outputField.value = prompt.trim();
    outputWrapper.classList.remove("hidden");
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      outputField.select();
      document.execCommand("copy");
      copyBtn.textContent = "Copied ✓";
      setTimeout(() => (copyBtn.textContent = "Copy Prompt"), 2000);
    });
  }
});
