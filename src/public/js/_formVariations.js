let index = 0;

const itemView = (text) => {
  const view = document.createElement('span');
  const btnRemove = document.createElement('span');

  view.innerText = text;
  view.className = 'item-variations';

  btnRemove.className = 'fa fa-remove';
  btnRemove.dataset.remove = index;
  view.appendChild(btnRemove);

  return view;
};

const inputValue = (text) => {
  const inputItem = document.createElement('input');
  inputItem.value = text;
  inputItem.name = 'variations';
  inputItem.type = 'hidden';
  inputItem.dataset.index = index;

  return inputItem;
};

const addVariations = () => {
  const itemText = document.querySelector('#item-variations');
  const contentVariations = document.querySelector('#content-item-variations');
  const text = itemText.value.trim();

  if (text === '') return;

  document.querySelector('#form-variations').appendChild(inputValue(text));
  contentVariations.appendChild(itemView(text));

  itemText.value = '';
  index++;
};

const removeVariations = (index) => {
  document.querySelector(`[data-index='${index}']`).remove();
  document.querySelector(`[data-remove='${index}']`).parentElement.remove();
};

document.onclick = (e) => {
  const el = e.target;
  if (el.id === 'add-variations') addVariations();
  if (el.dataset.remove >= 0) removeVariations(el.dataset.remove);
};
