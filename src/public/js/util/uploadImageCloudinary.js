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
      return alert('Erro ao fazer upload da image');
    }
  }
};