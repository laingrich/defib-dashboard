const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
<<<<<<< HEAD
      { path: '', component: () => import('pages/IndexPage.vue') }
=======
      { path: '', component: () => import('pages/IndexPage.vue') },
>>>>>>> refs/remotes/origin/main
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
