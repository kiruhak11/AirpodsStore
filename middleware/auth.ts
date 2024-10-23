export default function ({ store, route, redirect }) {
  // Условие: если это страница профиля или другая защищённая страница
  if (route.name === 'profile' && !store.state.auth.user) {
    return redirect('/login');
  }

  // Для всех других страниц редиректов нет
}
