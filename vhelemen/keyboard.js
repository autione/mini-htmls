import { glyphMap, exceptions, classes } from "./data.js";

/** @type {HTMLDivElement} */
const keyboard = document.querySelector("#keyboard");
const lines = ["'qertyuiop-", "asdfghjkl", "zxcvbnm"];

for (const line of lines) {
  const section = document.createElement("section");

  for (const char of line) {
    if (!(char in glyphMap)) continue;
    const [x, y] = glyphMap[char];

    const key = document.createElement("span");
    const reg = document.createElement("label");

    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const glyph = document.createElement("div");
    glyph.setAttribute("style", `--tx: ${x}; --ty: ${y};`);
    wrapper.appendChild(glyph);

    classes[char] && glyph.classList.add(classes[char]);
    glyph.classList.add("char");

    reg.innerText = char.toUpperCase();

    key.appendChild(wrapper);
    key.appendChild(reg);

    key.dataset.char = char;
    section.appendChild(key);
  }

  keyboard.appendChild(section);
}

addEventListener("keydown", (e) => {
  const target = keyboard.querySelector(`span[data-char="${e.key}"]`);
  if (!target || target.classList.contains("pressed")) return;

  target.classList.add("pressed");
});

addEventListener("keyup", (e) => {
  const target = keyboard.querySelector(`span[data-char="${e.key}"]`);
  if (!target || !target.classList.contains("pressed")) return;

  target.classList.remove("pressed");
});
