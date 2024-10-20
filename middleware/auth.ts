export default defineNuxtMiddleware((context: { route: { meta: any[] }; redirect: (arg0: string) => any }) => {
  const supabase = useSupabaseAuthClient();
  const user = supabase.auth.user();

  // Проверяем, требуется ли авторизация на странице
  const requiresAuth = context.route.meta.some((meta) => meta.requiresAuth);

  if (requiresAuth && !user) {
    // Если авторизация требуется, но пользователь не залогинен, перенаправляем на страницу входа
    return context.redirect('/login');
  }

  // Если страница не требует авторизации или пользователь залогинен, продолжаем
});
