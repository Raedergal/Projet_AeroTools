const closeBtn = document.querySelector("#closeBtn")
const createBtn = document.querySelector('#createBtn')
const createToolBtn = document.querySelector('#createToolBtn')
const modal = document.querySelector("#modalContainer")
const editUserBtns = document.querySelectorAll('.editUserBtn')
const editToolBtns = document.querySelectorAll('.editToolBtn')
const form = document.querySelector('#formModal')

//MISC

editUserBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest('.card')

        const tech = {
            id: card.getAttribute('data-technician-id'),
            lastName: card.getAttribute('data-last-name'),
            firstName: card.getAttribute('data-first-name'),
            email: card.getAttribute('data-email'),
            aeronef: card.getAttribute('data-aeronef'),
        }

        updateModal(tech)
    })
})

editToolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        
        const tableTool = btn.closest('.tableTool')
        const tool = {
            id: tableTool.getAttribute('data-tool-id'),
            name: tableTool.getAttribute('data-name'),
            date: tableTool.getAttribute('data-date'),
            sn: tableTool.getAttribute('data-sn'),
        }
        updateToolModal(tool)
    })
})
if (closeBtn) {
    closeBtn.addEventListener("click", closeModal)
}

function closeModal() {
    modal.classList.remove("fixed")
    modal.classList.add("hidden")
}

if (createBtn) {
    createBtn.addEventListener("click", () => {
        addUserModal()
    })
}

if (createToolBtn) {
    createToolBtn.addEventListener("click", () => {
        addToolModal()
    })
}


//USER

function addUserModal() {
    document.querySelector('#titleModal').textContent = "Ajouter un technicien"
    modal.classList.remove("hidden")
    modal.classList.add("fixed")
    form.setAttribute("action", "/technicians")
    document.querySelector('#lastName').value = ""
    document.querySelector('#firstName').value = ""
    document.querySelector('#email').value = ""
    document.querySelector('#aeronef').value = ""
}

function updateModal(tech) {
    document.querySelector('#titleModal').textContent = "Modifier le technicien"
    modal.classList.remove("hidden")
    modal.classList.add("fixed")
    form.setAttribute("action", `/editUser/${tech.id}`)

    document.querySelector('#lastName').value = tech.lastName
    document.querySelector('#firstName').value = tech.firstName
    document.querySelector('#email').value = tech.email

    const select = document.querySelector('#aeronef')
    if (select) {
        select.value = tech.aeronef
        if (select.value === "") {
            const opt = Array.from(select.options).find(o => o.text.trim() === tech.aeronef)
            if (opt) select.value = opt.value
        }
    }
}

//TOOL

function addToolModal() {
    document.querySelector('#titleModal').textContent = "Ajouter un outil"
    modal.classList.remove("hidden")
    modal.classList.add("fixed")
    form.setAttribute("action", "/tools")
    document.querySelector('#name').value = ""
    document.querySelector('#sn').value = ""
    document.querySelector('#date').valueAsDate = null
}

function updateToolModal(tool) {
    document.querySelector('#titleModal').textContent = "Modifier l'outillage"

    modal.classList.remove("hidden")
    modal.classList.add("fixed")
    form.setAttribute("action", `/editTool/${tool.id}`)

    document.querySelector('#name').value = tool.name
    document.querySelector('#sn').value = tool.sn
    document.querySelector('#date').valueAsDate = null
}

