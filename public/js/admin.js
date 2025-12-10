const sidebar = document.getElementById('sidebar');
const openSidebar = document.getElementById('openSidebar');
const closeSidebar = document.getElementById('closeSidebar');

openSidebar?.addEventListener('click', () => {
  sidebar.classList.add('active');
});

closeSidebar?.addEventListener('click', () => {
  sidebar.classList.remove('active');
});
