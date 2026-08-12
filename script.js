const root = document.documentElement;
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav');
const themeButton = document.querySelector('.theme-button');
const themeLabel = themeButton.querySelector('span');
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
const desktopNavigation = window.matchMedia('(min-width: 901px)');

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

  const displayTheme = theme[0].toUpperCase() + theme.slice(1);
  const colors = { light: '#f3f6f7', dark: '#101a1f' };
  themeLabel.textContent = `Theme: ${displayTheme}`;
  document.querySelector('meta[name="theme-color"]').content = colors[effectiveTheme(theme)];
}

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.dataset.open = String(open);
  menuButton.textContent = open ? 'Close' : 'Menu';
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  setMenu(false);
}));

document.addEventListener('pointerdown', (event) => {
  if (navigation.dataset.open === 'true' && !navigation.contains(event.target) && event.target !== menuButton) {
    setMenu(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.dataset.open === 'true') {
    setMenu(false);
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

desktopNavigation.addEventListener('change', (event) => {
  if (event.matches) setMenu(false);
});

document.getElementById('year').textContent = new Date().getFullYear();
applyTheme(storedTheme());
