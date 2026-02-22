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
    label: "Petit langue",
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
  result.textContent = left.winText;
});