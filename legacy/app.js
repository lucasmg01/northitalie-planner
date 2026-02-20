const frameworks = [
  {
    label: "Framework AIDA",
    build: ({ hook, body, proof, cta }) => `${hook}\n\n${body}\n\n${proof}\n\n${cta}`,
  },
  {
    label: "Framework PAS",
    build: ({ hook, body, proof, cta }) => `${hook}\n\n${body}\n\nCe qui change quand on corrige ce point: ${proof}\n\n${cta}`,
  },
  {
    label: "Framework Story",
    build: ({ hook, body, proof, cta }) => `${hook}\n\nIl y a quelques mois, je pensais l'inverse.\n${body}\n\nRésultat concret: ${proof}\n\n${cta}`,
  },
];

const hooksByTone = {
  direct: [
    "La plupart des gens compliquent ce sujet pour rien.",
    "Si tu veux des résultats, commence ici.",
    "Je vais être franc: ce point fait toute la différence.",
  ],
  story: [
    "Je vais te raconter un moment qui a changé ma façon de marketer.",
    "Au début, j'ai fait exactement l'erreur classique.",
    "Petit flashback: je pensais que la stratégie parfaite existait.",
  ],
  provoc: [
    "Opinion impopulaire: ce n'est pas ton produit le problème.",
    "Tu n'as pas un problème de visibilité, tu as un problème d'angle.",
    "Le 'contenu de valeur' ne suffit plus. Voilà pourquoi.",
  ],
  pedago: [
    "Voici un cadre simple que tu peux appliquer dès aujourd'hui.",
    "Décortiquons ce sujet en 3 étapes actionnables.",
    "Si tu débutes, commence par cette méthode.",
  ],
};

const endings = {
  awareness: "Si ce post t'aide, partage-le à quelqu'un de ton équipe.",
  engagement: "Tu veux que je poste la partie 2 ? Dis-le en commentaire.",
  leadgen: "Si tu veux le plan complet, envoie-moi un message privé.",
  authority: "Je publierai d'autres frameworks concrets sur ce sujet.",
};

const intensifiers = ["vraiment", "concrètement", "honnêtement", "souvent"];
const emojis = ["🔥", "💡", "🎯", "✅", "⚡"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uniqueHashtags(topic, audience) {
  const words = `${topic} ${audience}`
    .toLowerCase()
    .replace(/[^a-zA-Z0-9À-ÿ\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 3);

  const base = ["#marketing", "#linkedin", "#personalbranding"];
  const custom = words.map((w) => `#${w.replace(/[^a-zA-Z0-9À-ÿ]/g, "")}`);
  return [...new Set([...custom, ...base])].slice(0, 5).join(" ");
}

function humanBody(topic, audience, energy) {
  const vibe = Number(energy);
  const extra = vibe > 3 ? "Tu dois créer du contraste, pas du bruit." : "Reste simple et constant.";
  return [
    `Sujet: ${topic}.`,
    `Pour ${audience}, l'erreur fréquente c'est d'empiler des tactiques sans message clair.`,
    `Ce qui marche mieux: un angle fort, une preuve, puis une action précise.`,
    `${extra} Et surtout, parle comme une personne, pas comme une brochure.`,
  ].join(" ");
}

function socialProof(topic) {
  return `Sur ce thème (${topic}), les formats qui combinent opinion + exemple réel créent plus de conversations qualifiées.`;
}

function makeCta(goal, ctaValue, useEmoji) {
  const base = ctaValue && ctaValue.trim() ? ctaValue.trim() : endings[goal];
  return useEmoji ? `${pick(emojis)} ${base}` : base;
}

function styleHook(hook, energy, useEmoji) {
  const boost = Number(energy) > 3 ? ` ${pick(intensifiers)}.` : "";
  return `${useEmoji ? `${pick(emojis)} ` : ""}${hook}${boost}`;
}

function generatePosts(input) {
  const hookPool = hooksByTone[input.tone] || hooksByTone.direct;

  return frameworks.map((framework) => {
    const hook = styleHook(pick(hookPool), input.energy, input.withEmoji);
    const body = humanBody(input.topic, input.audience, input.energy);
    const proof = socialProof(input.topic);
    const cta = makeCta(input.goal, input.cta, input.withEmoji);
    const hashtags = uniqueHashtags(input.topic, input.audience);

    const post = framework.build({ hook, body, proof, cta });
    return {
      label: framework.label,
      text: `${post}\n\n${hashtags}`,
    };
  });
}

const form = document.getElementById("generatorForm");
const results = document.getElementById("results");
const template = document.getElementById("postTemplate");
const regenerateBtn = document.getElementById("regenerate");

let lastInput = null;

function renderPosts(posts) {
  results.innerHTML = "";

  posts.forEach((post, idx) => {
    const node = template.content.cloneNode(true);
    const label = node.querySelector(".post-label");
    const content = node.querySelector(".post-content");
    const copyBtn = node.querySelector(".btn-copy");

    label.textContent = `Variante ${idx + 1} - ${post.label}`;
    content.textContent = post.text;

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(post.text);
        copyBtn.textContent = "Copié";
        setTimeout(() => {
          copyBtn.textContent = "Copier";
        }, 1200);
      } catch {
        copyBtn.textContent = "Erreur";
      }
    });

    results.appendChild(node);
  });
}

function readInput() {
  return {
    topic: document.getElementById("topic").value,
    audience: document.getElementById("audience").value,
    goal: document.getElementById("goal").value,
    tone: document.getElementById("tone").value,
    energy: document.getElementById("energy").value,
    cta: document.getElementById("cta").value,
    withEmoji: document.getElementById("withEmoji").checked,
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = readInput();
  lastInput = input;
  renderPosts(generatePosts(input));
});

regenerateBtn.addEventListener("click", () => {
  if (!lastInput) return;
  renderPosts(generatePosts(lastInput));
});
