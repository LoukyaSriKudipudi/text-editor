const input = document.querySelector(".input");
const output = document.querySelector(".output");
const select = document.querySelector(".select");
const place = document.querySelector(".place");
const replace = document.querySelector(".replace");
const submit = document.querySelector(".submit");
const copyButton = document.querySelector(".copyButton");
const inputReset = document.querySelector(".inputReset");
const outputReset = document.querySelector(".outputReset");
const swap = document.querySelector(".swap");
const save = document.querySelector(".save");
const historyItemsContainer = document.querySelector(".historyContainer");
input.focus();

select.addEventListener("change", () => {
  place.value = "";
  replace.value = "";
  let selectedValue = select.value;
  if (selectedValue === "padsstart" || selectedValue === "padsend") {
    place.removeAttribute("hidden");
    replace.removeAttribute("hidden");
    place.placeholder = "Enter text length";
    replace.placeholder = "Enter fill value";
  } else if (selectedValue === "replace") {
    replace.removeAttribute("hidden");
    place.removeAttribute("hidden");
    place.placeholder = "Place";
    replace.placeholder = "Replace";
  } else {
    place.setAttribute("hidden", true);
    replace.setAttribute("hidden", true);
  }
});

place.setAttribute("hidden", true);
replace.setAttribute("hidden", true);

function convertUpperCase(input) {
  output.value = input.toUpperCase();
}

function convertLowerCase(input) {
  output.value = input.toLowerCase();
}

function replaceText(input) {
  const from = new RegExp(place.value, "gi");
  const replacedText = input.replace(from, replace.value);
  output.value = replacedText;
}

function trimSpace(input) {
  const trimmedInput = input.trim();
  output.value = trimmedInput;
}

function padsStartText(input) {
  if (isNaN(place.value)) {
    output.value = "Invalid Path Length";
    return;
  }
  output.value = input.padStart(Number(place.value), replace.value);
}

function padsEndText(input) {
  if (isNaN(place.value)) {
    output.value = "Invalid Path Length";
    return;
  }
  output.value = input.padEnd(Number(place.value), replace.value);
}

function countLength(input) {
  let result = "";
  const withoutSpaces = input.trim().replace(/\s+/g, "");
  const words = input.trim().split(/\s+/).filter(Boolean);
  result += `Total Words: ${words.length}\n`;
  result += `Characters with spaces: ${input.length}\n`;
  result += `Characters without spaces: ${withoutSpaces.length}\n`;
  output.value = result;
}

function convertToCamelCase(input) {
  const words = input.trim().split(/\s+/);
  const camelCased = words
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
  output.value = camelCased;
}

function convertToPascalCase(input) {
  const words = input.trim().split(/\s+/);
  const pascalCased = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  output.value = pascalCased;
}
function convertToSnakeCase(input) {
  const words = input.trim().split(/\s+/);
  const snakeCased = words
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1).toLowerCase())
    .join("_");

  output.value = snakeCased;
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  let inputValue = input.value.toString();
  if (!inputValue.trim()) {
    output.value = "Please enter some text...";
    return;
  }
  let selectValue = select.value;
  switch (selectValue) {
    case "uppercase":
      convertUpperCase(inputValue);
      break;
    case "lowercase":
      convertLowerCase(inputValue);
      break;
    case "replace":
      replaceText(inputValue);
      break;
    case "padsstart":
      padsStartText(inputValue);
      break;
    case "padsend":
      padsEndText(inputValue);
      break;
    case "trimspace":
      trimSpace(inputValue);
      break;
    case "lengthcounter":
      countLength(inputValue);
      break;
    case "convertocamelcase":
      convertToCamelCase(inputValue);
      break;
    case "convertopascalcase":
      convertToPascalCase(inputValue);
      break;
    case "converttosnakecase":
      convertToSnakeCase(inputValue);
      break;
    default:
      console.log(selectValue);
      output.value = "Invalid option";
  }
});

swap.addEventListener("click", () => {
  input.value = output.value;
});

let copyButtonText = copyButton.textContent;
copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(output.value);
  copyButton.textContent = "Copied to Clipboard";
  setTimeout(() => {
    copyButton.textContent = copyButtonText;
  }, 1000);
});

inputReset.addEventListener("click", () => {
  input.value = "";
  place.value = "";
  replace.value = "";
});
outputReset.addEventListener("click", () => {
  output.value = "";
});

output.addEventListener("click", () => {
  input.focus();
});

save.addEventListener("click", () => {
  let item = output.value.trim();
  if (item === "") return;
  saveItem(item);
  renderItems();
  output.value = "";
});

function saveItem(item) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(item);
  localStorage.setItem("history", JSON.stringify(history));
}

function renderItems(filteredHistory = null) {
  historyItemsContainer.innerHTML = "";
  let history =
    filteredHistory || JSON.parse(localStorage.getItem("history")) || [];

  if (!Array.isArray(history)) {
    console.warn("Invalid history format. Resetting...");
    localStorage.removeItem("history");
    history = [];
  }
  if (history.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "No saved items found.";
    historyItemsContainer.appendChild(emptyMsg);
    return;
  }

  history.forEach((item, index) => {
    const historyContainer = document.createElement("div");
    historyContainer.className = "eachHistoryContainer";
    const txtArea = document.createElement("textarea");
    txtArea.value = item;
    txtArea.rows = 5;
    txtArea.classList.add("histroyTextArea");
    txtArea.setAttribute("readonly", true);
    txtArea.addEventListener("change", () =>
      editItem(historyContainer, txtArea.value, index)
    );

    const delButton = document.createElement("button");
    delButton.textContent = "Delete";
    delButton.className = "historyDeleteButton";
    delButton.addEventListener("click", () => deleteItem(index));

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "historyEditButton";
    editButton.addEventListener("click", () => {
      txtArea.removeAttribute("readonly");
      txtArea.focus();
    });

    const swap = document.createElement("button");
    swap.textContent = "Swap";
    swap.addEventListener("click", () => {
      input.value = txtArea.value;
    });

    const editAndDeleteTextContainer = document.createElement("div");

    editAndDeleteTextContainer.className = "editAndDeleteTextContainer";
    historyContainer.appendChild(txtArea);
    editAndDeleteTextContainer.appendChild(editButton);
    editAndDeleteTextContainer.appendChild(swap);
    editAndDeleteTextContainer.appendChild(delButton);
    historyContainer.appendChild(editAndDeleteTextContainer);
    historyItemsContainer.appendChild(historyContainer);
  });
}

function deleteItem(index) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.splice(index, 1);
  localStorage.setItem("history", JSON.stringify(history));
  renderItems();
}
function editItem(container, updatedValue, index) {
  let items = JSON.parse(localStorage.getItem("history")) || [];
  items[index] = updatedValue.trim();
  localStorage.setItem("history", JSON.stringify(items));

  const autoSaveMessage = document.createElement("p");
  autoSaveMessage.textContent = "Auto Saved";
  autoSaveMessage.className = "autoSaveMessage";
  historyItemsContainer.appendChild(autoSaveMessage);

  setTimeout(() => {
    autoSaveMessage.remove();
  }, 1500);
}

const searchInput = document.querySelector(".filter");
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query !== "") {
    let items = JSON.parse(localStorage.getItem("history")) || [];
    const filteredItems = items.filter((item) =>
      item.toLowerCase().includes(query)
    );
    renderItems(filteredItems);
  } else {
    renderItems();
  }
});

renderItems();

const deleteHistroy = document.querySelector(".deleteHistory");
const modal = document.querySelector(".modal");
const cancelNo = document.querySelector(".cancelNo");
const deleteYes = document.querySelector(".deleteYes");

deleteHistroy.addEventListener("click", () => {
  modal.showModal();
});

deleteYes.addEventListener("click", () => {
  localStorage.removeItem("history");
  modal.close();
  renderItems();
});

cancelNo.addEventListener("click", () => {
  modal.close();
});

// download
const downloadOutput = document.querySelector(".downloadOutput");

downloadOutput.addEventListener("click", () => {
  if (output.value !== "") {
    const blob = new Blob([output.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "output.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
});
// loukya sri
