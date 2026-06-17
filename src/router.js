// Router module
let routes = {};
let currentPage = null;
let appContainer = null;

export function initRouter(container) {
  appContainer = container;
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Handle initial route
}

export function addRoute(path, handler) {
  routes[path] = handler;
}

export function navigateTo(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return window.location.hash.slice(1) || '/';
}

async function handleRoute() {
  const path = getCurrentRoute();
  const handler = routes[path] || routes['/404'] || routes['/'];

  if (!handler) return;

  const protectedRoutes = ['/dashboard', '/workouts', '/nutrition', '/progress', '/settings'];
  if (protectedRoutes.includes(path)) {
    const userData = localStorage.getItem('fittrack_user');
    if (!userData) {
      navigateTo('/onboarding');
      return;
    }
  }

  // If user has data and tries to access landing, redirect to dashboard
  if (path === '/') {
    const userData = localStorage.getItem('fittrack_user');
    if (userData) {
      navigateTo('/dashboard');
      return;
    }
  }

  try {
    // Page transition out
    if (currentPage && appContainer.firstChild) {
      const oldPage = appContainer.firstChild;
      if (typeof oldPage.cleanup === 'function') {
        try {
          oldPage.cleanup();
        } catch (e) {
          console.warn('Page cleanup failed:', e);
        }
      }
      oldPage.classList.add('page-exit-active');
      await new Promise(r => setTimeout(r, 250));
    }

    appContainer.innerHTML = '';

    const page = await handler();
    if (page instanceof HTMLElement) {
      page.classList.add('page-enter');
      appContainer.appendChild(page);
      // Trigger reflow then animate in
      requestAnimationFrame(() => {
        page.classList.add('page-enter-active');
        page.classList.remove('page-enter');
      });
    }
    currentPage = path;
    window.scrollTo(0, 0);
  } catch (err) {
    console.error('Route error:', err);
  }
}
