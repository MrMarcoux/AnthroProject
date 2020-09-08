import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Model from '@/components/Model.vue'
import Project from '../components/Project.vue'
import Member from '@/components/Member.vue'
import Team from '@/components/Team.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Model',
    component: Model
  },
  {
    path: '/projects/:uuid',
    name: 'Project',
    component: Project
  },
  {
    path: '/members/:uuid',
    name: 'Member',
    component: Member
  },
  {
    path: '/teams/:uuid',
    name: 'Team',
    component: Team
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
