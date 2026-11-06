import { addUser, findUserByEmail, initDB } from './database.js';

//экспорт в global scope
window.showAuthModal = showAuthModal;
window.hideAuthModal = hideAuthModal;
window.switchTab = switchTab;
window.logout = logout;
window.selectCar = selectCar;
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;

//Инициализация
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initDB();
    console.log('База данных инициализирована');
    
    // Привязка событий к формам
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
    
    checkAuth();
  } catch (error) {
    console.error('Ошибка инициализации БД:', error);
  }
});

function showAuthModal() {
  document.getElementById('authModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
  document.getElementById('authModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) hideAuthModal();
    });
  }
});

function switchTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  tabs.forEach(t => t.classList.remove('active'));
  forms.forEach(f => f.classList.remove('active'));
  if (tab === 'login') {
    tabs[0]?.classList.add('active');
    document.getElementById('loginForm')?.classList.add('active');
  } else {
    tabs[1]?.classList.add('active');
    document.getElementById('registerForm')?.classList.add('active');
  }
  document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
  document.querySelectorAll('input').forEach(el => el.classList.remove('error'));
}

async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('registerName')?.value.trim() || '';
  const email = document.getElementById('registerEmail')?.value.trim() || '';
  const password = document.getElementById('registerPassword')?.value || '';
  const confirm = document.getElementById('registerConfirm')?.value || '';
  
  let hasError = false;

  if (name.length < 2) { 
    showError('registerName', 'registerNameError'); 
    hasError = true; 
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) { 
    showError('registerEmail', 'registerEmailError'); 
    hasError = true; 
  }
  if (password.length < 6) { 
    showError('registerPassword', 'registerPasswordError'); 
    hasError = true; 
  }
  if (password !== confirm) { 
    showError('registerConfirm', 'registerConfirmError'); 
    hasError = true; 
  }
  
  if (hasError) return;

  try {
    await addUser({ name, email, password });
    loginUser({ name, email });
    alert('Регистрация успешна!');
    hideAuthModal();
    document.getElementById('registerForm')?.reset();
  } catch (error) {
    alert(error.message);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail')?.value.trim() || '';
  const password = document.getElementById('loginPassword')?.value || '';

  try {
    const user = await findUserByEmail(email);
    
    if (user && user.password === password) {
      loginUser({ name: user.name, email: user.email, id: user.id });
      hideAuthModal();
      document.getElementById('loginForm')?.reset();
    } else {
      alert('Неверный email или пароль');
    }
  } catch (error) {
    console.error('Ошибка входа:', error);
    alert('Ошибка при входе');
  }
}

function loginUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  checkAuth();
}

function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (currentUser) {
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
    if (userName) userName.textContent = currentUser.name;
    if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  } else {
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    
    if (authButtons) authButtons.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
  }
}

function logout() {
  if (confirm('Выйти из аккаунта?')) {
    localStorage.removeItem('currentUser');
    location.reload();
  }
}

function showError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('error');
  if (error) error.classList.add('show');
}

function selectCar(url) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    alert('Сначала войдите в систему!');
    showAuthModal();
    return;
  }
  location.href = url;
}

// Убираем ошибку при вводе
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('error');
      const errorEl = document.getElementById(this.id + 'Error');
      if (errorEl) errorEl.classList.remove('show');
    });
  });
});