let idCounter = 0
const input = document.querySelector('input[type="text"]')

userInput.addEventListener('submit', (event) =>{
  event.preventDefault()
  addTask()
})

let addTask = ()=>{
  idCounter++

  let newValue = input.value;
  list.innerHTML += `
  <div class="task-container" id="${idCounter}">
    <label>
      <input type="checkbox">
      ${newValue}
    </label>
  <i class="fa-solid fa-trash-can closeBtn"></i>
</div>`
input.value = ''
updateStats()
}

list.addEventListener('click', (event)=>{
  console.log(event)
   if(event.srcElement.nodeName == "INPUT"){
    updateStats()
  }else if(event.srcElement.nodeName == "I"){
    deleteTask(event.srcElement.parentNode.id)
  }
})

let updateStats = ()=>{
  let element = list.querySelectorAll('div')
  let checkbox = list.querySelectorAll('input[type="checkbox"]:checked')
  stats.innerHTML = `<p>tareas pendinetes: ${element.length} completadas: ${checkbox.length}</p>`
}

let deleteTask = (id)=>{
  let taskToDelete = document.getElementById(id)
  list.removeChild(taskToDelete)
  updateStats()
}

