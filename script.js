let selectedShape = null;
let connectionMode = false;
let firstShape = null;
let editMode = false;

function selectShape(shape) {
  selectedShape = shape;
  document.getElementById('settings').style.display = 'block';
  connectionMode = false;
}

function startConnection() {
  connectionMode = true;
  firstShape = null;
  document.getElementById('settings').style.display = 'none';
  showMessage("Select the first and second object", 2700);
}

function showMessage(text, duration) {
  const message = document.getElementById("message");
  message.textContent = text;
  message.style.display = "block";
  setTimeout(() => {
    message.style.display = "none";
  }, duration);
}

function addShape(event) {
  if (connectionMode || editMode) return;

  const size = document.getElementById('sizeInput').value;
  const color = document.getElementById('colorInput').value;
  const glow = document.getElementById('glowInput').value;

  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const maxX = rect.width - size / 2;
  const maxY = rect.height - size / 2;
  const posX = Math.min(Math.max(size / 2, x), maxX);
  const posY = Math.min(Math.max(size / 2, y), maxY);

  const shapeElement = document.createElement('div');
  shapeElement.classList.add('shape', selectedShape);
  shapeElement.style.width = `${size}px`;
  shapeElement.style.height = `${size}px`;
  shapeElement.style.borderColor = color;
  shapeElement.style.boxShadow = `0 0 ${glow}px ${color}`;
  shapeElement.style.left = `${posX - size / 2}px`;
  shapeElement.style.top = `${posY - size / 2}px`;

  const editIcon = document.createElement('div');
  editIcon.classList.add('edit-icon');
  editIcon.onclick = () => uploadImage(shapeElement);
  shapeElement.appendChild(editIcon);

  shapeElement.onclick = (e) => {
    if (!editMode) selectForConnection(e, shapeElement);
  };

  event.currentTarget.appendChild(shapeElement);
  
  if (editMode) editIcon.style.display = "block";
}

function toggleEditMode() {
  editMode = !editMode;
  const editButton = document.getElementById("editButton");
  const icons = document.querySelectorAll('.edit-icon');
  icons.forEach(icon => {
    icon.style.display = editMode ? 'block' : 'none';
  });
  editButton.textContent = editMode ? "Stop" : "Edit";
}

function uploadImage(shapeElement) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        shapeElement.style.backgroundImage = `url(${e.target.result})`;
        shapeElement.style.backgroundSize = 'cover';
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function selectForConnection(event, shapeElement) {
  if (!connectionMode) return;

  if (!firstShape) {
    firstShape = shapeElement;
  } else if (firstShape !== shapeElement) {
    createConnection(firstShape, shapeElement);
    firstShape = null;
    connectionMode = false;
  } else {
    alert("Cannot connect an object to itself.");
  }
  event.stopPropagation();
}

function createConnection(shape1, shape2) {
  const rect1 = shape1.getBoundingClientRect();
  const rect2 = shape2.getBoundingClientRect();

  const x1 = rect1.left + rect1.width / 2;
  const y1 = rect1.top + rect1.height / 2;
  const x2 = rect2.left + rect2.width / 2;
  const y2 = rect2.top + rect2.height / 2;

  const distance = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  const line = document.createElement('div');
  line.classList.add('line');
  line.style.width = `${distance}px`;
  line.style.left = `${x1 - shape1.parentElement.getBoundingClientRect().left}px`;
  line.style.top = `${y1 - shape1.parentElement.getBoundingClientRect().top}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.backgroundColor = 'black';

  document.getElementById('rectangleContainer').appendChild(line);
}

function openHelp() {
  window.open("info.html", "_blank");
}
