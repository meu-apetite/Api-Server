let navSidebar = document.querySelector('.sidebar_content');
let mobileButton = document.querySelector('#mobile_btn')

mobileButton.addEventListener("click", () =>{
    navSidebar.classList.toggle('active')
})

