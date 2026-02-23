const leftImages = [
  
  {
    id: "left-1",
    label: "Toute mimi",
    src: "images/imgGauche/touteMimi.png",
    winText: "WOW non mais là y a même pas de compétition, t'as vu comment elle est mignonne mon amoureuse."
  },
  {
    id: "left-2",
    label: "Dodo pour mon chaton",
    src: "images/imgGauche/dodo.png",
    winText: "Même en dormant mon amoureuse est plus belle que toi."
  },
  {
    id: "left-3",
    label: "Petit coeur hihi",
    src: "images/imgGauche/coeur.png",
    winText: "mohhhh un petit coeur, en plus elle est tellement plus mignonne que toi."
  },
  {
    id: "left-4",
    label: "Petite langue",
    src: "images/imgGauche/langue.png",
    winText: "Un peu freaky avec sa langue mais qd même plus belle que toi."
  },
  {
    id: "left-5",
    label: "Concentrée",
    src: "images/imgGauche/preparation.png",
    winText: "Même en se concentrant pour se préparer, elle est plus belle que toi."
  },
  {
    id: "left-6",
    label: "Faut enlever ces poils",
    src: "images/imgGauche/poil.png",
    winText: "Ils ont l'air dur à enlever ses poils, pourtant même comme ça elle est magnifique mon chaton."
  }
];

const rightImages = [
  {
    id: "right-1",
    label: "Margot Robbie",
    src: "images/imgDroite/margotRobbie.png"
  },
  {
    id: "right-2",
    label: "Ana de Armas",
    src: "images/imgDroite/anaDeArmas.png"
  },
  {
    id: "right-3",
    label: "Elizabeth Olsen",
    src: "images/imgDroite/elizabethOlsen.png"
  },
  {
    id: "right-4",
    label: "Emma Stone",
    src: "images/imgDroite/emmaStone.png"
  },
  {
    id: "right-5",
    label: "Emily Ratajkowski",
    src: "images/imgDroite/emilyRatajkowski.png"
  },
  {
    id: "right-6",
    label: "Sydney Sweeney",
    src: "images/imgDroite/sydneySweeney.png"
  }
];

const leftSelect = document.getElementById("leftSelect");
const rightSelect = document.getElementById("rightSelect");
const leftPreview = document.getElementById("leftPreview");
const rightPreview = document.getElementById("rightPreview");
const compareBtn = document.getElementById("compareBtn");
const result = document.getElementById("result");
const rightUpload = document.getElementById("rightUpload");

let currentRightUploadedImage = null;
let lastWinText = "";

const leftTraits = {
  "left-1": ["mignonne", "magnifique", "rayonnante"],
  "left-2": ["belle", "douce", "naturellement belle"],
  "left-3": ["cute", "tendre", "charmante"],
  "left-4": ["drôle", "audacieuse", "craquante"],
  "left-5": ["élégante", "focus", "stylée"],
  "left-6": ["authentique", "attachante", "unique"]
};
const winTemplates = [
  "Verdict: la photo de gauche gagne. Ma future femme est plus {leftTrait} que {right}.",
  "La photo de gauche gagne clairement: Mon amoureuse est bien plus {leftTrait} que {right}.",
  "Décision finale: la photo de gauche gagne. Mon petit coeur est trop {leftTrait}, {right} ne suit pas aujourd'hui.",
  "Sans hésiter, la photo de gauche gagne: Mon chaton reste plus {leftTrait} que {right}.",
  "Résultat officiel: la photo de gauche gagne. l'amour de ma vie domine ce round contre {right}."
];

function fillSelect(selectEl, items) {
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    selectEl.appendChild(option);
  });
}

function getLeftSelection() {
  return leftImages.find((img) => img.id === leftSelect.value) || leftImages[0];
}

function getRightSelection() {
  if (rightSelect.value === "uploaded" && currentRightUploadedImage) {
    return { id: "uploaded", src: currentRightUploadedImage };
  }

  return rightImages.find((img) => img.id === rightSelect.value) || rightImages[0];
}

function refreshPreviews() {
  const left = getLeftSelection();
  const right = getRightSelection();

  leftPreview.src = left.src;
  rightPreview.src = right.src;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomDifferent(arr, previous) {
  if (arr.length <= 1) return arr[0] || "";
  let next = pickRandom(arr);
  while (next === previous) {
    next = pickRandom(arr);
  }
  return next;
}

function getTrait(traitMap, id, fallback) {
  return pickRandom(traitMap[id] || fallback);
}

function buildWinText(left, right) {
  const template = pickRandomDifferent(winTemplates, lastWinText);
  const leftTrait = getTrait(leftTraits, left.id, ["incroyable", "belle", "touchante"]);

  return template
    .replace("{left}", left.label)
    .replace("{right}", right.label || "la photo de droite")
    .replace("{leftTrait}", leftTrait)
}

fillSelect(leftSelect, leftImages);
fillSelect(rightSelect, rightImages);

leftSelect.value = leftImages[0].id;
rightSelect.value = rightImages[0].id;
refreshPreviews();

leftSelect.addEventListener("change", () => {
  refreshPreviews();
  result.textContent = "Le verdict apparaîtra ici.";
});

rightSelect.addEventListener("change", () => {
  refreshPreviews();
  result.textContent = "Le verdict apparaîtra ici.";
});

rightUpload.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    currentRightUploadedImage = reader.result;

    let uploadedOption = rightSelect.querySelector('option[value="uploaded"]');
    if (!uploadedOption) {
      uploadedOption = document.createElement("option");
      uploadedOption.value = "uploaded";
      uploadedOption.textContent = "Image importée";
      rightSelect.appendChild(uploadedOption);
    }

    rightSelect.value = "uploaded";
    refreshPreviews();
    result.textContent = "Image de droite importée. Clique sur comparer.";
  };

  reader.readAsDataURL(file);
});

compareBtn.addEventListener("click", () => {
  const left = getLeftSelection();
  const right = getRightSelection();
  const text = buildWinText(left, right);
  result.textContent = text;
  lastWinText = text;
});
