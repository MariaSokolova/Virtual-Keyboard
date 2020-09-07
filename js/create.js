export default function createItem(tagName, className) {
  const item = document.createElement(tagName);
  item.classList.add(className);
  return item;
}
