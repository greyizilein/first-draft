document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("projectForm");
  const outputWrapper = document.getElementById("output-wrapper");
  const outputField = document.getElementById("promptOutput");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!form) return;

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function globalRules() {
    return `
Use UK English.
Do not use first-person or contractions.
Maintain a formal but natural academic tone.
Move from descriptive discussion to critical evaluation.
Assume examiner-level scrutiny.
Use Harvard referencing with "and" not "&".
Cite all non-obvious claims.
`;
  }

  function chapter(title, body) {
    return `=== PROMPT: ${title} ===\n\n${body}`;
  }

  function chapterOne(d) {
    return chapter("CHAPTER ONE – INTRODUCTION", `
I am working on a ${d.level}-level ${d.type} titled "${d.topic}".

${globalRules()}

Write Chapter One using a funnel structure.
Include background, rationale, aims, objectives, questions, significance, and structure.
Word count: 1800–2000 words.
Write section by section and pause after each section.
`);
  }

  function chapterTwo(d) {
    return chapter("CHAPTER TWO – LITERATURE REVIEW", `
Write a critical literature review for "${d.topic}".

${globalRules()}

Structure by variables and theory.
Compare and synthesise at least ${pick([30,35,40])} recent academic sources.
Identify clear gaps.
Write section by section.
`);
  }

  function chapterThree(d) {
    return chapter("CHAPTER THREE – METHODOLOGY", `
Write the methodology chapter for "${d.topic}".

${globalRules()}

Justify philosophy, approach, design, sampling, data collection, analysis, and ethics.
Link all decisions to objectives.
Write section by section.
`);
  }

  function chapterFour(d) {
    return chapter("CHAPTER FOUR – ANALYSIS", `
Write the analysis chapter for "${d.topic}".

${globalRules()}

Present and interpret findings.
Focus on analysis, not description.
Write section by section.
`);
  }

  function chapterFive(d) {
    return chapter("CHAPTER FIVE – CONCLUSION", `
Write the conclusion chapter for "${d.topic}".

${globalRules()}

Synthesize findings, answer questions, discuss implications, limitations, and recommendations.
Write section by section.
`);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      level: document.getElementById("academicLevel").value,
      type: document.getElementById("workType").value,
      section: document.getElementById("section").value,
      discipline: document.getElementById("discipline").value,
      methodology: document.getElementById("methodology").value,
      topic: document.getElementById("topic").value,
      words: document.getElementById("wordCount").value,
      output: document.getElementById("outputStyle").value
    };

    let prompts = [];

    if (data.section === "Full work") {
      prompts = [chapterOne, chapterTwo, chapterThree, chapterFour, chapterFive]
        .sort(() => Math.random() - 0.5)
        .map(fn => fn(data));
    } else {
      const map = {
        "Introduction": chapterOne,
        "Literature Review": chapterTwo,
        "Methodology": chapterThree,
        "Analysis": chapterFour,
        "Conclusion": chapterFive
      };
      prompts = [map[data.section](data)];
    }

    outputField.value = prompts.join("\n\n");
    outputWrapper.classList.remove("hidden");
  });

  copyBtn.addEventListener("click", () => {
    outputField.select();
    document.execCommand("copy");
  });

  downloadBtn.addEventListener("click", () => {
    const blob = new Blob([outputField.value], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "first-draft-prompts.txt";
    a.click();
  });

});
