document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("projectForm");
  const outputWrapper = document.getElementById("output-wrapper");
  const outputField = document.getElementById("promptOutput");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!form) return;

  /* -------------------------
     VARIATION ENGINE
  -------------------------- */

  function variant(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  /* -------------------------
     GLOBAL ACADEMIC RULES
  -------------------------- */

  function globalRules(data) {
    return `
Humanise the content so it reads as written by a human academic.
Use UK English only.
Do not use first-person or contractions.
Maintain a formal but natural academic tone.
Move from descriptive discussion to critical evaluation.
Synthesise literature rather than summarising it.
Assume examiner-level scrutiny throughout.

Citation rules:
- Harvard referencing style
- Use "and", not "&"
- Cite all non-obvious claims
- Do not fabricate sources
`;
  }

  /* -------------------------
     CHAPTER BUILDERS
  -------------------------- */

  function chapterOne(data) {
    return `
=== PROMPT: CHAPTER ONE – INTRODUCTION ===

I am working on a ${data.level}-level ${data.type} in ${data.discipline} titled:

"${data.topic}"

Write Chapter One.

${globalRules(data)}

STRUCTURE AND REQUIREMENTS:

Heading: Introduction  
Introduce the topic using a funnel structure, beginning with the global context and narrowing to the specific research problem.
Use empirical data and recent statistics.
Do not discuss methodology.
Word count: 800–1000 words.

Heading: Rationale  
Provide a clear justification for why this research is necessary.
Word count: 200 words.

Heading: Research Aim and Objectives  
- Craft one concise research aim (30–50 words).
- Develop four focused research objectives.
- Convert the objectives into four quantitative research questions.

Heading: Significance of the Study  
Explain who benefits from the study and how.
Word count: 200 words.

Heading: Research Deliverable  
Explain what the research will ultimately produce.
Word count: 100–200 words.

Heading: Dissertation Structure  
Briefly describe the five chapters of the dissertation.

Total word count: 1800–2000 words.

Write section by section and pause after each section until instructed to continue.
`;
  }

  function chapterTwo(data) {
    return `
=== PROMPT: CHAPTER TWO – LITERATURE REVIEW ===

Write Chapter Two (Literature Review) for the study titled:

"${data.topic}"

${globalRules(data)}

REQUIREMENTS:
- Structure the review around the study variables.
- Include relevant theories and conceptual frameworks.
- Compare, contrast, and critically evaluate sources.
- Identify clear gaps in the literature.
- Do not repeat sources.
- Use at least ${variant([30, 35, 40])} unique, recent academic sources.

End with a clear literature gap that justifies the research.

Write section by section and pause until instructed.
`;
  }

  function chapterThree(data) {
    return `
=== PROMPT: CHAPTER THREE – METHODOLOGY ===

Write Chapter Three (Research Methodology) for the study titled:

"${data.topic}"

${globalRules(data)}

REQUIREMENTS:
- Justify the research philosophy, approach, and design.
- Explain and defend the chosen methodology (${data.methodology}).
- Discuss sampling, data collection, and data analysis.
- Explicitly link decisions to the research objectives.
- Address ethical considerations in detail.

Maintain critical justification throughout.

Write section by section and pause until instructed.
`;
  }

  function chapterFour(data) {
    return `
=== PROMPT: CHAPTER FOUR – DATA ANALYSIS ===

Write Chapter Four (Data Analysis) for the study titled:

"${data.topic}"

${globalRules(data)}

REQUIREMENTS:
- Present and analyse the data systematically.
- Use appropriate statistical or thematic techniques.
- Integrate tables and figures conceptually (describe them).
- Focus on interpretation, not description.

Write section by section and pause until instructed.
`;
  }

  function chapterFive(data) {
    return `
=== PROMPT: CHAPTER FIVE – DISCUSSION, CONCLUSION, AND RECOMMENDATIONS ===

Write Chapter Five for the study titled:

"${data.topic}"

${globalRules(data)}

REQUIREMENTS:
- Synthesize findings with the literature.
- Answer the research questions explicitly.
- Discuss theoretical and practical implications.
- Acknowledge limitations.
- Provide evidence-based recommendations.

Write section by section and pause until instructed.
`;
  }

  /* -------------------------
     PROMPT ORCHESTRATION
  -------------------------- */

  function buildPrompts(data) {
    const builders = {
      "Introduction": [chapterOne],
      "Literature Review": [chapterTwo],
      "Methodology": [chapterThree],
      "Analysis": [chapterFour],
      "Conclusion": [chapterFive],
      "Full work": shuffle([
        chapterOne,
        chapterTwo,
        chapterThree,
        chapterFour,
        chapterFive
      ])
    };

    const selected = builders[data.section] || builders["Full work"];
    return selected.map(fn => fn(data)).join("\n\n");
  }

  /* -------------------------
     FORM HANDLER
  -------------------------- */

  form.addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      level: academicLevel.value,
      type: workType.value,
      section: section.value,
      discipline: discipline.value,
      methodology: methodology.value,
      topic: topic.value,
      words: wordCount.value,
      output: outputStyle.value
    };

    const result = buildPrompts(data);
    outputField.value = result.trim();
    outputWrapper.classList.remove("hidden");
  });

  /* -------------------------
     COPY + DOWNLOAD
  -------------------------- */

  copyBtn.addEventListener("click", () => {
    outputField.select();
    document.execCommand("copy");
    copyBtn.textContent = "Copied ✓";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  });

  downloadBtn.addEventListener("click", () => {
    const blob = new Blob([outputField.value], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "first-draft-prompts.txt";
    link.click();
  });
});
