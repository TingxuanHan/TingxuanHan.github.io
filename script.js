const root = document.documentElement;
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav');
const themeButton = document.querySelector('.theme-button');
const themeLabel = themeButton.querySelector('span');
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

function storedTheme() {
  const value = localStorage.getItem('theme');
  return value === 'light' || value === 'dark' ? value : 'system';
}

function effectiveTheme(theme) {
  return theme === 'system' ? (colorScheme.matches ? 'dark' : 'light') : theme;
}

function applyTheme(theme) {
  if (theme === 'system') {
    root.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  } else {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }
  themeLabel.textContent = `Theme: ${theme}`;
  const colors = { light: '#f4f7f8', dark: '#10191e' };
  document.querySelector('meta[name="theme-color"]').content = colors[effectiveTheme(theme)];
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.dataset.open = String(!open);
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.dataset.open = 'false';
}));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.dataset.open === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.dataset.open = 'false';
    menuButton.focus();
  }
});

themeButton.addEventListener('click', () => {
  const themes = ['system', 'light', 'dark'];
  applyTheme(themes[(themes.indexOf(storedTheme()) + 1) % themes.length]);
});

colorScheme.addEventListener('change', () => {
  if (storedTheme() === 'system') applyTheme('system');
});

document.getElementById('year').textContent = new Date().getFullYear();
applyTheme(storedTheme());