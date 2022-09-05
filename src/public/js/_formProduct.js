import convertBase64 from "./util/convertFilebase64.js";

const selectCategories = document.querySelector('[name=categories]');
const areaAddVariations = document.querySelector('.add-variations');

const imageArea = document.querySelector('.image-area');
let productId = document.querySelector('#productId');
productId = productId ? productId.value : null;
let index = 0;
let files = [];

const uploadImage = async () => {
  const preset = 'lojaexpressa43092';
  const apiKey = '137841457752123';
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${preset}/image/upload`;

  for (const item of files) {
    const body = new FormData();
    body.append('file', item.file);
    body.append('api_key', apiKey);
    body.append('upload_preset', preset);
    body.append('product', 'dev');

    try {
      let response = await fetch(cloudinaryUrl, { method: 'POST', body });
      response = await response.json();
      if (!productId) {
        setInputValue(response.public_id, response.url);
      } else {
        await updateImage(response.public_id, response.url);
      }
    } catch (error) {
      console.log(error)
      return
    }
  }
};

const updateImage = async (id = 2, url = 111) => {
  try {
    await fetch(`/admin/product/updateImage/productId/${productId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ id, url }),
    });
  } catch (error) {
    alert('Ocorreu um erro ao adicionar a imagem');
  }
};

const deleteImage = async (imageId, productId) => {
  try {
    await fetch(`/admin/product/deleteImage/${imageId}/productId/${productId}`);
  } catch (error) {
    alert('Ocorreu um erro ao excluir a imagem');
  }
};

const updateFile = (id, file) => files.push({ id, file });

const removeFile = (id) => {
  files = files.filter((item) => Number(item.id) !== Number(id));
};

const showImage = async (id, file) => {
  const Wrapperimage = document.createElement('div');
  const imagePreview = document.createElement('img');
  const buttonClose = document.createElement('span');

  Wrapperimage.className = 'wrapper-preview wrapper-preview--image';

  imagePreview.className = 'preview';
  imagePreview.dataset.id = index;
  imagePreview.src = await convertBase64(file);

  buttonClose.className = 'button-close-img fa-solid fa-remove';
  buttonClose.dataset.close = 'close-image';

  Wrapperimage.appendChild(imagePreview);
  Wrapperimage.appendChild(buttonClose);
  imageArea.insertBefore(Wrapperimage, imageArea.firstChild);
};

const setInputValue = (id, url) => {
  const inputImage = document.createElement('input');
  const inputId = document.createElement('input');

  inputImage.name = 'image';
  inputImage.type = 'hidden';
  inputImage.value = url;
  inputId.name = 'imageId';
  inputId.type = 'hidden';
  inputId.value = id;

  document.querySelector('form').append(inputImage, inputId);
};

//Variations
const addVariations = () => {
  const newAreaAddVariations = areaAddVariations.cloneNode(true);
  document.querySelector('#variation-area').appendChild(newAreaAddVariations);
};

const findVariation = async (id) => {
  let response = await fetch(`/admin/variation/findAjax/${id}`);
  response = await response.json();
  return response;
};

const renderVariationsName = async (e) => {
  const variationId = e.target.value;
  const contentVariations = e.target.parentElement.parentElement;
  const selectVariationItem = contentVariations.querySelector('#variations-item');
  const variations = await findVariation(variationId);

  variations.variations.map((item) => {
    selectVariationItem.innerHTML += `<option value='${item._id}'>${item.name}</option>`;
  });
};

// Categories
const addCategory = () => {
  const newCategory = selectCategories.cloneNode(true);
  document.querySelector('#categories-area').appendChild(newCategory);
};

// Document events
document.onchange = async (e) => {
  const el = e.target;

  // Images
  if (el.id === 'add-image') {
    for (let i = 0; i < e.target.files.length; i++) {
      updateFile(index, e.target.files[i]);
      showImage(index, e.target.files[i]);
      index++;
    }

    if (productId) await uploadImage();
  }

  // Variations
  if (el.name === 'variations') renderVariationsName(e);
};

document.onclick = async (e) => {
  const el = e.target;

  // Images
  if (el.dataset.close) {
    const image = el.parentElement.querySelector('img');
    removeFile(image.dataset.id);
    el.parentElement.remove();
  }

  if (el.id === 'button-submit') {
    if (!productId) await uploadImage();
    document.querySelector('form').submit();
  }

  if (el.dataset.deleteImage) {
    const { imageId, productId } = el.dataset;
    deleteImage(imageId, productId);

    //remove of view
    const image = el.parentElement.querySelector('img');
    removeFile(image.dataset.id);
    el.parentElement.remove();
  }

  // Variations
  if (el.className === 'btn-add-variation') addVariations(e);

  // Categories
  if (el.className === 'btn-add-category') addCategory();
};
