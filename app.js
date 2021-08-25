const getImages = () => JSON.parse(sessionStorage.getItem("images"));

let imagesArray = getImages() || [];

const updateHeading = (name) => {
  const headerEle = document.querySelector(".picture_name");
  headerEle.innerHTML = name;
};

const extractImage = (id) => JSON.parse(sessionStorage.getItem("images")).find((data) => data.id === id);

const highlightPicture = (e) => {
  const currentEle = e.target;
  const prevActiveEl = document.querySelector(".list_item .active");

  if (!prevActiveEl || !prevActiveEl.isEqualNode(currentEle)) {
    prevActiveEl && prevActiveEl.classList.remove("active");
    currentEle.classList.add("active");

    const image = extractImage(Number(currentEle.dataset.img));
    const highlightEle = document.querySelector(".selected_img");
    highlightEle.src = image.src;
    updateHeading(image.name);
  }
};

const toggleSelector = () => {
  // show sorter
  const selectEle = document.querySelector(".sorter");
  const imgArr = getImages();
  if (imgArr && imgArr.length > 1) {
    selectEle.classList.remove("hide");
    return;
  }
  selectEle.classList.add("hide");
};

const editName = (event) => {

  const editor = event.target;
  const inputElem = editor.previousElementSibling;
  // hide edit icon
  editor.classList.add('hide');
  
  //focus input element
  inputElem.readOnly = false;
  inputElem.focus();
};

const updateName = (event) => {
  const inputElem = event.target;
  const images = getImages();
  const img = images.find((data) => data.id === Number(inputElem.id));
  img.name = inputElem.value;
  sessionStorage.setItem("images", JSON.stringify(images));
  inputElem.readOnly = true;
  inputElem.nextElementSibling.classList.remove("hide");
};

const displayImgData = ({ src, name, id}) =>{
  const listEle = document.createElement("li");
  listEle.className = "list_item";
  listEle.innerHTML = `<img class="thumb_nail" src="${src}" data-img="${id}" onclick="highlightPicture(event)"/>`;
  listEle.innerHTML +=`<div class="editable-field"> <input class="editable-input" type="text" value="${name}" placeholder="Click The Edit Icon" onblur="updateName(event)" id="${id}" readonly/>
  <i class="fa fa-pencil-square-o edit-button" onclick="editName(event)"></i></div>`;
  console.log(listEle);
  document.querySelector(".picture_list").insertBefore(listEle, null);

  return listEle;
};

const storeImages = (image) => {
  imagesArray.push(image);
  sessionStorage.setItem("images", JSON.stringify(imagesArray));
};

const uploadImage = (evt) => {
  const files = evt.target.files; // FileList object

  // Loop through the FileList
  for (let i = 0, f; f = files[i]; i++) {
    const reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = function(e) {
      const result = e.target.result;
      const image = new Image();
      const id = imagesArray.length + i;
      const data = { src: result, name: f.name, size: f.size, id };

      image.src = result;
      // Closure to capture the image width & height
      image.onload = function () {
        data.height = this.height;
        data.width = this.width;
        
        storeImages(data);

        const liEle = displayImgData(data);
        highlightPicture({ target: liEle.childNodes[0] });
        toggleSelector();
      }
    };

    reader.readAsDataURL(f);
  }
};

const loadImages = (images) => {
  images.forEach((imageData, i) => {
    displayImgData(imageData, i);
  });
};

const handleSelectChange = (event) => {
  const images = getImages();
  const option = event.target.value;

  let listEle = document.querySelector(".picture_list");
  listEle.innerHTML = "";

  images.sort((a, b) => (a[option] > b[option]) ? 1 : -1);
  loadImages(images);
};

const loadImagesFromLocalStorage = () => {
  if (imagesArray && imagesArray.length) {
    loadImages(imagesArray);
    toggleSelector();
  }
};

loadImagesFromLocalStorage();