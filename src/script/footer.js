function isElementHasCorrectText(node) {
  const text = node.innerText;
  return Boolean(text && !text.endsWith("}}"));
}
function isElementHasCorrectAttrValue(node, attrName) {
  const attrValue = node.getAttribute(attrName);
  return Boolean(attrValue && !attrValue.endsWith("}}"));
}

function replaceTextIfElementHasWrongText(node, text) {
  // если элемент имеет правильные данные,
  // то выходим из ф-ции
  if (isElementHasCorrectText(node)) return;
  node.innerHTML = text;
}
function replaceAttrValueIfElementHasWrongAttrValue(node, attrName, attrValue) {
  // если элемент имеет правильные данные,
  // то выходим из ф-ции
  if (isElementHasCorrectAttrValue(node, attrName)) return;
  node.setAttribute(attrName, attrValue);
}
function replaceDataIfElementHasWrongData(elem) {
  const nodeList = document.querySelectorAll(`.${elem.class}`);

  for (const node of nodeList) {
    switch (elem.type) {
      case "text":
        replaceTextIfElementHasWrongText(node, elem.text);
        break;
      case "link":
        replaceAttrValueIfElementHasWrongAttrValue(node, "href", elem.href);
        break;
      case "img":
        replaceAttrValueIfElementHasWrongAttrValue(node, "src", elem.src);
        break;
    }
  }
}

const footerElems = [
  {
    type: "text",
    class: "script_about_company1",
    text: "ИП Кучмистый М.С.",
  },
  {
    type: "text",
    class: "script_about_company2",
    text: "ИНН:280445074123",
  },
  {
    type: "text",
    class: "script_about_company3",
    text: "ОГРНИП:322237500221174",
  },
  {
    type: "text",
    class: "script_phone",
    text: "+7 495 147 99 90",
  },
  {
    type: "text",
    class: "script_chat",
    text: "support@comfplay.com",
  },
  {
    type: "link",
    class: "script_phone",
    href: "tel:+74951479990",
  },
  {
    type: "link",
    class: "script_chat",
    href: "mailto:support@comfplay.com",
  },
  {
    type: "link",
    class: "script_offer",
    href: "assets/doc/offer.pdf",
  },
  {
    type: "link",
    class: "script_privacy",
    href: "assets/doc/policy.pdf",
  },
  {
    type: "link",
    class: "script_processing",
    href: "assets/doc/permission.pdf",
  },
  {
    type: "link",
    class: "script_subscription",
    href: "/cabinet/#/subscription",
  },
  {
    type: "link",
    class: "script_tariff",
    href: "assets/doc/tariff.pdf",
  },
  {
    type: "img",
    class: "script_logo",
    src: "assets/images/footer/logo.png",
  },
];

for (let elem of footerElems) {
  replaceDataIfElementHasWrongData(elem);
}
