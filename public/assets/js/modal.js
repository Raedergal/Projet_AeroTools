const closeBtn = document.querySelector("#closeBtn")
const createBtn = document.querySelector('#createUser')
const modal = document.querySelector("#modalContainer")
const editUserBtns = document.querySelectorAll('.editUserBtn')

closeBtn.addEventListener("click", closeModal)

if (createBtn) {
    createBtn.addEventListener("click", () => {
        addUserModal()
    })
}

function addUserModal() {
    modal.classList.remove("hidden")
    modal.classList.add("fixed")
    form.setAttribute("action", "/technicians")
    document.querySelector('#titleModal').textContent = "Ajouter un technicien"
    document.querySelector('#lastName').value = ""
    document.querySelector('#firstName').value = ""
    document.querySelector('#email').value = ""
    document.querySelector('#aeronef').value = ""
}


function updateModal(tech) {
    modal.classList.remove("hidden")
    modal.classList.add("fixed")
    const form = document.querySelector('#formModal')
    form.setAttribute("action", `/editUser/${tech.id}`)

    document.querySelector('#titleModal').textContent = "Modifier le technicien"
    document.querySelector('#lastName').value = tech.lastName
    document.querySelector('#firstName').value = tech.firstName
    document.querySelector('#email').value = tech.email

    const select = document.querySelector('#aeronef');
    if (select) {
        select.value = tech.aeronef
        if (select.value === "") {
            const opt = Array.from(select.options).find(o => o.text.trim() === tech.aeronef);
            if (opt) select.value = opt.value;
        }
    }

}

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

function closeModal() {
    modal.classList.remove("fixed")
    modal.classList.add("hidden")
}
