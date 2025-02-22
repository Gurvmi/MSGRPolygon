document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.message === 'Авторизация успешна!') {
            alert(result.message);
            // Сохраните данные пользователя (например, в localStorage)
            localStorage.setItem('user', JSON.stringify(result.user));
            // Перенаправьте пользователя на другую страницу
            window.location.href = 'main.html'; // Пример перенаправления
        } else {
            alert(result.message);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
});