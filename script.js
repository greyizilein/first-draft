// First Draft homepage logic: menu + sample prompt generation + copy/download + example fillers
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close on link click (mobile)
    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Helpers for non-repeating-ish phrasing
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  function buildGlobalPromptRules({ level, discipline, methodology, wordCount, citation, constraints }) {
    const tone = pick([
      "Write with formal academic clarity and controlled complexity.",
      "Write with a polished academic tone suitable for assessment.",
      "Write with disciplined academic precision and coherent flow."
    ]);

    const quality = pick([
      "Prioritise critical engagement over description and demonstrate synthesis across sources.",
      "Demonstrate evaluation, comparison, and synthesis rather than summary.",
      "Move from explanation to critique and justify claims with evidence."
    ]);

    const integrity = pick([
      "Do not invent data, quotes, or sources. If evidence is needed, state what kind and where it would come from.",
      "Do not fabricate citations. If a claim requires support, indicate that a scholarly source is required.",
      "Avoid made-up references; require real peer-reviewed sources."
    ]);

    const citationLine = citation === "Other / Institution-specific"
      ? "Use the citation style specified by the institution (follow the user’s guide exactly)."
      : `Use ${citation} referencing consistently (in-text + reference list formatting as required).`;

    const extra = (constraints && constraints.trim().length > 0)
      ? `User constraints to follow: ${constraints.trim()}`
      : "Follow standard academic conventions unless the user specifies constraints.";

    return [
      `Role: Act as a senior academic supervisor/examiner in ${discipline}.`,
      `Level: ${level}. Methodology context: ${methodology}. Target length: ${wordCount} words (±10%).`,
      tone,
      quality,
      citationLine,
      integrity,
      extra,
      "Output rule: Produce ONLY the requested section(s). Do NOT output the full paper unless explicitly instructed.",
      "Control rule: Work section-by-section. After completing the first section, STOP and wait for the user to say “Continue”."
    ].join("\n");
  }

  function chapterPromptTemplate(chapterLabel, sectionMap, context) {
    const sectionOrder = shuffle(Object.keys(sectionMap));
    const sectionsText = sectionOrder.map(k => {
      const v = sectionMap[k];
      return `- ${k}: ${v}`;
    }).join("\n");

    const verification = pick([
      "Before writing, list 5–8 key subtopics you will cover, then start Section 1 only.",
      "Before writing, propose a section outline with word allocations, then write Section 1 only.",
      "Before writing, draft a compact plan (headings + word counts), then write the first section only."
    ]);

    return `
PROMPT: ${chapterLabel}

CONTEXT
Topic/title: "${context.topic}"
Work type: ${context.workType}
Scope: ${context.scope}
Section requested: ${context.section}

GLOBAL RULES
${buildGlobalPromptRules(context)}

STRUCTURE REQUIREMENTS
${sectionsText}

QUALITY CHECKS (must comply)
- Align each paragraph to the purpose of the section.
- Maintain internal coherence and avoid repetition.
- Define key concepts and locate them within the discipline’s debates.
- Use appropriate evidence expectations for the level and methodology.
- Ensure the writing is assessable against typical marking criteria.

WORKFLOW
${verification}
Then write the first section only and STOP.
`.trim();
  }

  function buildSinglePrompt(context) {
    const sec = context.section;

    if (sec.includes("Introduction")) {
      return chapterPromptTemplate(
        "CHAPTER 1 — INTRODUCTION (Executable Prompt)",
        {
          "Background (funnel structure)": "Start broad (global context) → narrow to the precise research problem; justify relevance in the discipline.",
          "Problem statement": "Define what is not working / unknown / contested and why it matters academically and practically.",
          "Aim and objectives": "Write 1 aim + 3–6 objectives; ensure each is specific and researchable.",
          "Research questions (optional)": "Convert objectives into research questions where appropriate.",
          "Significance": "Explain scholarly and practical contribution and who benefits.",
          "Scope and delimitations": "Clarify boundaries: context, population, timeframe, variables/concepts.",
          "Definition of key terms": "Define core constructs as used in the study.",
          "Chapter map": "Briefly summarise what each chapter covers and how it connects."
        },
        context
      );
    }

    if (sec.includes("Literature Review")) {
      return chapterPromptTemplate(
        "CHAPTER 2 — LITERATURE REVIEW (Executable Prompt)",
        {
          "Search strategy (brief)": "State how literature would be identified and filtered (databases, keywords, inclusion/exclusion).",
          "Theoretical framework(s)": "Introduce and justify the most relevant theory(ies) for the topic.",
          "Conceptual definitions": "Define key variables/constructs and how scholars operationalise them.",
          "Thematic synthesis": "Organise literature by themes/relationships (not author-by-author). Compare and contrast positions.",
          "Evidence and debates": "Highlight major findings, contradictions, and methodological limitations in the field.",
          "Gap construction": "Identify a specific, defensible gap leading to the study’s aim/objectives.",
          "Conceptual model (if relevant)": "Describe the conceptual relationships the study will examine."
        },
        context
      );
    }

    if (sec.includes("Methodology")) {
      return chapterPromptTemplate(
        "CHAPTER 3 — METHODOLOGY (Executable Prompt)",
        {
          "Research design justification": "Explain why this design fits the aim/questions and how it aligns with the discipline.",
          "Methodology alignment": `Explain how ${context.methodology} shapes sampling, data collection, and analysis decisions.`,
          "Sampling": "Define population, sampling technique, inclusion/exclusion criteria, and sample size justification.",
          "Data collection": "Describe instruments/protocols, reliability/validity or trustworthiness, and procedure.",
          "Data analysis": "Specify analytic steps (statistical/thematic), assumptions, and how outcomes map to objectives.",
          "Ethics": "Consent, anonymity, data handling, risks, approvals.",
          "Limitations": "Anticipate design constraints and mitigation strategies."
        },
        context
      );
    }

    if (sec.includes("Analysis")) {
      return chapterPromptTemplate(
        "CHAPTER 4 — ANALYSIS / RESULTS (Executable Prompt)",
        {
          "Data preparation": "Explain cleaning/coding steps and readiness checks.",
          "Descriptive overview": "Provide a structured overview of the dataset/participants/themes without over-interpreting.",
          "Primary analysis": "Execute the main analytic approach; interpret, do not just report.",
          "Secondary analysis": "Explore additional patterns relevant to objectives/questions.",
          "Robustness / credibility checks": "Assumptions checks, triangulation, reliability, sensitivity.",
          "Interim summary": "Summarise what the analysis shows and what it does not show."
        },
        context
      );
    }

    if (sec.includes("Discussion")) {
      return chapterPromptTemplate(
        "CHAPTER 5 — DISCUSSION + CONCLUSION (Executable Prompt)",
        {
          "Discussion (synthesis)": "Interpret findings against the literature and theory; explain agreements/conflicts.",
          "Answers to research questions": "Answer each question explicitly, with evidence-based justification.",
          "Implications": "Theoretical + practical implications, tailored to stakeholders.",
          "Limitations": "Method, data, scope, and inference limitations; avoid generic statements.",
          "Recommendations": "Actionable, evidence-based recommendations aligned to the findings.",
          "Future research": "Specific directions that logically follow from limitations and gaps.",
          "Conclusion": "Concise closure: what was learned and why it matters."
        },
        context
      );
    }

    if (sec.includes("Abstract")) {
      return chapterPromptTemplate(
        "ABSTRACT (Executable Prompt)",
        {
          "Purpose": "State the problem, aim, and why it matters in 1–2 sentences.",
          "Method": "Briefly describe methodology and data source.",
          "Results": "Summarise the main findings at a high level (no invented data).",
          "Conclusion": "State implications and contribution.",
          "Keywords": "Provide 5–7 keywords aligned to the topic."
        },
        context
      );
    }

    // Fallback
    return chapterPromptTemplate(
      "ACADEMIC SECTION (Executable Prompt)",
      {
        "Purpose": "State what the section must achieve and how it supports the overall work.",
        "Structure": "Provide headings and word allocations.",
        "Quality": "Require critical engagement and proper evidencing."
      },
      context
    );
  }

  function buildFullWorkPrompts(context) {
    // Build 5 prompts, one per chapter, each with variation
    const base = {
      ...context,
      scope: "Full work (Chapters 1–5)"
    };

    const prompts = [
      buildSinglePrompt({ ...base, section: "Introduction (Chapter 1)" }),
      buildSinglePrompt({ ...base, section: "Literature Review (Chapter 2)" }),
      buildSinglePrompt({ ...base, section: "Methodology (Chapter 3)" }),
      buildSinglePrompt({ ...base, section: "Analysis / Results (Chapter 4)" }),
      buildSinglePrompt({ ...base, section: "Discussion + Conclusion (Chapter 5)" })
    ];

    return prompts.join("\n\n" + "—".repeat(58) + "\n\n");
  }

  // Main form wiring
  const form = document.getElementById("projectForm");
  const output = document.getElementById("promptOutput");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  if (form && output) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const context = {
        level: document.getElementById("academicLevel").value,
        workType: document.getElementById("workType").value,
        scope: document.getElementById("scope").value,
        section: document.getElementById("section").value,
        discipline: document.getElementById("discipline").value,
        methodology: document.getElementById("methodology").value,
        topic: document.getElementById("topic").value,
        wordCount: document.getElementById("wordCount").value,
        citation: document.getElementById("citation").value,
        constraints: document.getElementById("constraints").value
      };

      const isFull = context.scope.includes("Full work");
      const promptText = isFull ? buildFullWorkPrompts(context) : buildSinglePrompt(context);

      output.value = promptText;
      output.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    copyBtn?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(output.value || "");
        copyBtn.textContent = "Copied";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
      } catch {
        // fallback
        output.select();
        document.execCommand("copy");
        copyBtn.textContent = "Copied";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
      }
    });

    downloadBtn?.addEventListener("click", () => {
      const blob = new Blob([output.value || ""], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "first-draft-prompts.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  // Fill sample examples
  const exA = document.getElementById("exA");
  const exB = document.getElementById("exB");

  if (exA) {
    exA.textContent =
`PROMPT (Sample): Literature Review — Executable

Role: Act as a senior academic reviewer in [DISCIPLINE].
Task: Write ONLY Section 1: Theoretical framework for "[TOPIC]".

Rules:
- Use the chosen citation style consistently.
- Compare and synthesise sources (no author-by-author summary).
- Define key constructs and show how scholars operationalise them.
- End Section 1 with a 3–5 sentence bridge to the next theme.

Stop after Section 1 and wait for "Continue".`;
  }

  if (exB) {
    exB.textContent =
`PROMPT (Sample): Methodology — Executable

Role: Act as an examiner.
Task: Draft ONLY the "Research design justification" section for "[TOPIC]".

Include:
- Why this design fits the aim/questions
- How it aligns with the methodology
- What would count as credible evidence
- 2–3 limitations and mitigations

Stop after this section and wait for "Continue".`;
  }

  // Copy sample buttons
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy");
      const el = sel ? document.querySelector(sel) : null;
      if (!el) return;

      const text = el.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy sample"), 1200);
      } catch {
        // fallback: create temp textarea
        const t = document.createElement("textarea");
        t.value = text;
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy sample"), 1200);
      }
    });
  });

})();
