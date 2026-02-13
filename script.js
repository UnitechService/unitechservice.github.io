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

const orderVisitButton = document.getElementById("orderVisitButton");
const sendRepairButton = document.getElementById("sendRepairButton");

const partImage = document.getElementById("partImage");

// ---------- HELPERS ----------

function resetUI() {
  originalPrice.textContent = "-";
  budgetPrice.textContent = "-";
  orderVisitButton.disabled = true;
  sendRepairButton.disabled = true;
  partImage.src = "img/logo.png";
}

function updateOrderButtons() {
  const ready = brandSelect.value && modelSelect.value && partSelect.value;
  orderVisitButton.disabled = !ready;
  sendRepairButton.disabled = !ready;
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

// ---------- LOADERS ----------

window.addEventListener("load", () => {
  Object.keys(db).sort().forEach(brand => {
    brandSelect.add(new Option(brand, brand));
  });
});

// ---------- BRAND ----------

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
        if (model.includes("iphone x")) return 10;
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
});

// ---------- MODEL ----------

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
});

// ---------- PART ----------

partSelect.addEventListener("change", () => {
  resetUI();

  const brand = brandSelect.value;
  const model = modelSelect.value;
  const part = partSelect.value;

  if (!db[brand] || !db[brand][model] || !db[brand][model][part]) return;

  const priceData = db[brand][model][part];

originalPrice.textContent =
  priceData.o && priceData.o !== "-" ? priceData.o : "-";

budgetPrice.textContent =
  priceData.b && priceData.b !== "-" ? priceData.b : "-";


  updatePartImage(part);
  updateOrderButtons();
});

// ---------- ORDER VISIT (WHATSAPP) ----------

orderVisitButton.addEventListener("click", (e) => {
  e.preventDefault();

  bookingModal.style.display = "flex";
});


// ---------- SEND FOR REPAIR (DELIVERY) ----------

sendRepairButton.addEventListener("click", () => {
  const address = "კეკელიძის 8, თბილისი";

  const services = [
    { name: "Yandex", url: "https://taxi.yandex.com" },
    { name: "Glovo", url: "https://glovoapp.com" },
    { name: "Wolt", url: "https://wolt.com" },
    { name: "Bolt", url: "https://bolt.eu" }
  ];

  let text = "აირჩიეთ მიწოდების სერვისი:\n\n";
  services.forEach((s, i) => {
    text += `${i + 1}. ${s.name}\n`;
  });

  const choice = prompt(text);
  const selected = services[choice - 1];

  if (selected) {
    window.open(selected.url, "_blank");
    alert(
      "კურიერის გამოძახებისას მიუთითეთ ეს მისამართი:\n\n" +
      address
    );
  }
});

// ---------- THEME TOGGLE ----------

const toggle = document.getElementById("themeToggle");

if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    toggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
  });
}


// ==========================
// CUSTOM DROPDOWN (FIXED)
// ==========================

document.querySelectorAll(".custom-dropdown").forEach(dropdown => {
  const display = dropdown.querySelector(".dropdown-display");
  const list = dropdown.querySelector(".dropdown-list");
  const select = dropdown.querySelector("select");
  const span = display.querySelector("span");

  function rebuildList() {
    list.innerHTML = "";

    [...select.options].forEach(opt => {
      if (opt.disabled) return;

      const li = document.createElement("li");
      li.textContent = opt.textContent;

      li.addEventListener("click", e => {
        e.stopPropagation(); // 🔴 CRITICAL FIX

        select.value = opt.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));

        span.textContent = opt.textContent;
        list.style.display = "none";
        dropdown.classList.remove("open");
      });

      list.appendChild(li);
    });
  }

  display.addEventListener("click", e => {
    e.stopPropagation();

    rebuildList();
    const isOpen = list.style.display === "block";

    document
      .querySelectorAll(".dropdown-list")
      .forEach(l => (l.style.display = "none"));

    document
      .querySelectorAll(".custom-dropdown")
      .forEach(d => d.classList.remove("open"));

    if (!isOpen) {
      list.style.display = "block";
      dropdown.classList.add("open");
    }
  });
});

// CLOSE ON OUTSIDE CLICK
document.addEventListener("click", () => {
  document
    .querySelectorAll(".dropdown-list")
    .forEach(l => (l.style.display = "none"));

  document
    .querySelectorAll(".custom-dropdown")
    .forEach(d => d.classList.remove("open"));
});

// ================= BOOKING MODAL =================

const bookingModal = document.getElementById("bookingModal");
const bookingDate = document.getElementById("bookingDate");
const bookingTime = document.getElementById("bookingTime");
const confirmBooking = document.getElementById("confirmBooking");
const closeBooking = document.getElementById("closeBooking");
const bookingInput = document.getElementById("bookingDateTime");

// Order Visit ღილაკზე დაჭერა


// დახურვა
closeBooking.addEventListener("click", () => {
  bookingModal.style.display = "none";
});

// კვირა დაბლოკვა + დროების გენერაცია
bookingDate.addEventListener("change", () => {
  const selected = new Date(bookingDate.value);

  if (selected.getDay() === 0) {
    alert("კვირას არ ვმუშაობთ");
    bookingDate.value = "";
    return;
  }

  bookingTime.innerHTML = "";

  for (let hour = 12; hour < 19; hour++) {
    const option = document.createElement("option");
    option.value = `${hour}:00`;
    option.textContent = `${hour}:00`;
    bookingTime.appendChild(option);
  }
});

// დადასტურება
confirmBooking.addEventListener("click", () => {

  if (!bookingDate.value || !bookingTime.value) {
    alert("აირჩიეთ დღე და დრო");
    return;
  }

  bookingModal.style.display = "none";

  const brand = brandSelect.value;
  const model = modelSelect.value;
  const part = partSelect.value;

  const phone = "995591017347";

  const message = `
გამარჯობა, მსურს ვიზიტის დაჯავშნა:

ბრენდი: ${brand}
მოდელი: ${model}
ნაწილი: ${part}
ვიზიტის დრო: ${bookingDate.value} ${bookingTime.value}
  `.trim();

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

