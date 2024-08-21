import { glyphMap, exceptions, classes } from "./data.js";

/** @type {HTMLSpanElement} */ const plaintext = document.querySelector("#plaintext");
/** @type {HTMLButtonElement} */ const display = document.querySelector("#display");
/** @type {HTMLDivElement} */ const raw = document.querySelector("#raw");

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const state = {
  displayString: "",
  cursorPos: 0,
};

const executeConversion = () => {
  let final = "";

  for (let i = 0; i < state.displayString.length; i++) {
    const char = state.displayString[i];
    if (char === "'" || char === "-") continue;

    const next = state.displayString[i + 1] || "";

    let syllable = exceptions[char] || char;

    const isApos = next === "'";
    const isPortAndException = next === "-" && char in exceptions;
    const canStrip = (isApos || isPortAndException) && syllable.length > 1;
    if (canStrip) syllable = syllable.substring(0, syllable.length - 1);

    final += syllable;
  }

  return final;
};

const addGlyphToDisplay = (x, y, c) => {
  const vhWrap = document.createElement("div");
  vhWrap.classList.add("wrapper");
  c && vhWrap.classList.add(c);

  const vhChar = document.createElement("div");
  vhChar.setAttribute("style", `--tx: ${x}; --ty: ${y};`);
  vhChar.classList.add("char");

  vhWrap.appendChild(vhChar);
  display.appendChild(vhWrap);

  return vhWrap;
};

const addCharToDisplay = (char, order) => {
  const pos = glyphMap[char];
  if (!pos) return;

  const element = addGlyphToDisplay(...pos, classes[char]);
  element.dataset.index = order;
  element.style.order = order;
  element.ariaHidden = true;
};

const updateDisplay = () => {
  display.querySelectorAll(".wrapper").forEach((c) => c.remove());
  for (let i = 0; i < state.displayString.length; i++) addCharToDisplay(state.displayString[i], i + 1);

  /** @type {HTMLDivElement} */
  const cursor = display.querySelector(".cursor") || document.createElement("div");
  cursor.style.order = state.cursorPos;
  cursor.classList.add("cursor");

  if (state.displayString[state.cursorPos - 1] === "-") cursor.classList.add("port");
  else cursor.classList.remove("port");

  display.appendChild(cursor);

  raw.innerHTML = state.displayString
    .split("")
    .map((c) => {
      const isCaps = c.match(/([a-z]|[A-Z])/g) && c.toUpperCase() === c;
      return `<label><small>${isCaps ? "↑" : ""}</small>${c.toUpperCase()}</label>`;
    })
    .join("");
};

const clampCursor = () => (state.cursorPos = clamp(state.cursorPos, 0, state.displayString.length));
const moveCursor = (by) => {
  state.cursorPos += by;
  clampCursor();
};

const writeAtCursor = (txt) => {
  const arr = state.displayString.split("");

  const pre = arr.slice(0, state.cursorPos).join("");
  const pos = arr.slice(state.cursorPos).join("");

  state.displayString = `${pre}${txt}${pos}`;
  moveCursor(1);
};

display.addEventListener("click", (e) => {
  /** @type {HTMLDivElement} */
  const target = e.target;
  const index = (target.dataset.index || target.parentElement.dataset.index) ?? state.displayString.length;

  if (index) {
    state.cursorPos = index;

    clampCursor();
    updateDisplay();
  }

  display.focus();
});

display.addEventListener("keydown", (e) => {
  const rules = [
    [/ss/g, "S"],
    [/\-\-/g, "-"],
  ];

  switch (e.key) {
    case "Backspace": {
      if (state.displayString.length <= 0 || state.cursorPos <= 0) break;

      const arr = state.displayString.split("");
      arr.splice(state.cursorPos - 1, 1);

      state.displayString = arr.join("");
      moveCursor(-1);

      break;
    }

    case "Delete": {
      if (state.displayString.length <= 0 || state.cursorPos >= state.displayString.length) break;

      const arr = state.displayString.split("");
      arr.splice(state.cursorPos, 1);

      state.displayString = arr.join("");

      break;
    }

    case "ArrowLeft": {
      moveCursor(-1);
      break;
    }

    case "ArrowRight": {
      moveCursor(1);
      break;
    }

    case "Home": {
      e.preventDefault();
      state.cursorPos = 0;

      break;
    }

    case "End": {
      e.preventDefault();
      state.cursorPos = state.displayString.length;

      break;
    }

    case "Enter": {
      writeAtCursor("\n");
      break;
    }

    default: {
      if (!(e.key in glyphMap)) break;
      e.preventDefault();

      writeAtCursor(e.key);
    }
  }

  for (const [expr, repl] of rules) state.displayString = state.displayString.replace(expr, repl);

  clampCursor();
  updateDisplay();
  plaintext.innerHTML = executeConversion().replace(/\n/g, "<br />") || `<i style="opacity: 0.5">No data</i>`;
});
