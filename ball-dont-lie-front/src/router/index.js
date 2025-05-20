import { createRouter, createWebHistory } from 'vue-router';
import HomeView  from '../views/HomeView.vue'
import TeamsView from '../views/TeamsView.vue';
import PlayersView from '../views/PlayersView.vue';
import DreamTeamView from '../views/DreamTeamView.vue';
import TeamDetails from '../views/TeamDetails.vue';
import PlayerDetails from '../views/PlayerDetails.vue';
import DraftView from '../views/DraftView.vue';

const routes = [
{
  path: "/",
  name: "Home",
  component: HomeView,
},
{
  path: "/teams",
  name: "Teams",
  component: TeamsView,
},
{
  path: "/teams/:id",
  name: "TeamDetails",
  component: TeamDetails,
  props: true,
},
{
  path: "/players",
  name: "Players",
  component: PlayersView,
},
{
  path: "/players/:id",
  name: "PlayerDetails",
  component: PlayerDetails,
  props: true,
},
{
  path: "/my-team",
  name: "MyTeam",
  component: DreamTeamView,
},
{
  path: "/draft",
  name: "Draft",
  component: DraftView,
}
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
