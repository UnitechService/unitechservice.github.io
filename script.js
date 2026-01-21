/*
  UnitechService – MAIN LOGIC
  ==========================
  Uses: prices.js (PRICES object)
  GitHub Pages compatible
*/

const db = PRICES;

// DOM Elements
const brandSelect = document.getElementById("brandSelect");
const modelSelect = document.getElementById("modelSelect");
const partSelect = document.getElementById("partSelect");
const originalPrice = document.getElementById("originalPrice");
const budgetPrice = document.getElementById("budgetPrice");
const orderButton = document.getElementById("orderButton");
const partImage = document.getElementById("partImage");

// ---------- HELPERS ----------

function resetUI() {
  originalPrice.textContent = "-";
  budgetPrice.textContent = "-";
  orderButton.disabled = true;
  partImage.src = "img/logo.png";
}

function updatePartImage(partName) {
  const name = partName.toLowerCase();

  const imageMap = [
    { key: ["screen", "ეკრანი"], img: "img/screen.png" },
    { key: ["battery", "ელემენტი"], img: "img/battery.png" },
    { key: ["charging", "port", "დამტენი"], img: "img/charging.png" },
    { key: ["camera", "კამერა"], img: "img/camera.png" },
    { key: ["housing", "კორპუსი"], img: "img/housing.png" },
    { key: ["firmware", "unlock", "პროგრამირება"], img: "img/firmware.png" },
    { key: ["back", "უკანა"], img: "img/back.png" },
    { key: ["glass", "შუშა"], img: "img/glass.png" }
  ];

  for (const item of imageMap) {
    if (item.key.some(k => name.includes(k))) {
      partImage.src = item.img;
      return;
    }
  }

  partImage.src = "img/logo.png";
}

function updateOrderButton() {
  orderButton.disabled = !(brandSelect.value && modelSelect.value && partSelect.value);
}

// ---------- LOADERS ----------

window.addEventListener("load", () => {
  Object.keys(db).sort().forEach(brand => {
    brandSelect.add(new Option(brand, brand));
  });
});

brandSelect.addEventListener("change", () => {
  modelSelect.innerHTML = `<option disabled selected>-- Select --</option>`;
  partSelect.innerHTML = `<option disabled selected>-- Select --</option>`;
  modelSelect.disabled = true;
  partSelect.disabled = true;
  resetUI();

  const brand = brandSelect.value;
  if (!db[brand]) return;

const models = Object.keys(db[brand]);

if (brand === "Apple") {
  models.sort((a, b) => {
    const normalize = model => {
      model = model.toLowerCase();

      // iPhone X family → 10
      if (model.includes("iphone x")) return 10;

      // Extract number for others (6, 7, 8, 11, 12...)
      const match = model.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    return normalize(a) - normalize(b);
  });
} else {
  models.sort();
}

models.forEach(model => {
  modelSelect.add(new Option(model, model));
});

  modelSelect.disabled = false;
  updateOrderButton();
});

modelSelect.addEventListener("change", () => {
  partSelect.innerHTML = `<option disabled selected>-- Select --</option>`;
  partSelect.disabled = true;
  resetUI();

  const brand = brandSelect.value;
  const model = modelSelect.value;

  if (!db[brand] || !db[brand][model]) return;

  Object.keys(db[brand][model]).forEach(part => {
    partSelect.add(new Option(part, part));
  });

  partSelect.disabled = false;
  updateOrderButton();
});

partSelect.addEventListener("change", () => {
  resetUI();

  const brand = brandSelect.value;
  const model = modelSelect.value;
  const part = partSelect.value;

  if (!db[brand] || !db[brand][model] || !db[brand][model][part]) return;

  const priceData = db[brand][model][part];

  originalPrice.textContent = priceData.o && priceData.o !== "-" ? priceData.o : "-";
  budgetPrice.textContent = priceData.b && priceData.b !== "-" ? priceData.b : "-";

  updatePartImage(part);
  updateOrderButton();
});

// ---------- WHATSAPP ----------

orderButton.addEventListener("click", () => {
  const brand = brandSelect.value;
  const model = modelSelect.value;
  const part = partSelect.value;

  if (!brand || !model || !part) return;

  const phone = "995591017347";
  const message = `
გამარჯობა, მსურს დავჯავშნო ვიზიტი:

ბრენდი: ${brand}
მოდელი: ${model}
ნაწილი: ${part}
  `.trim();

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

// ===== THEME TOGGLE (NO LOGIC CHANGE) =====
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
});
