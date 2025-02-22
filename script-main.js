document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = 'login.html'; // Перенаправление, если пользователь не авторизован
    }

    // Отображение приветствия
    document.getElementById('welcomeMessage').textContent = `Привет, ${user.username}!`;

    // Выход из системы
    document.getElementById('logoutButton').addEventListener('click', function () {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});