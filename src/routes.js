import Index from "views/Index.js";
import Register from "views/auth/Register.js";
import Login from "views/auth/Login.js";
import Tables from "views/Tables.js";
import Memberships from "views/Memberships";
import AddIndividualMembership from "views/AddIndividualMembership";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/membership",
    name: "Memberships",
    icon: "ni ni-bullet-list-67 text-red",
    component: Memberships,
    layout: "/admin",
    children: [
      {
        path: "/membership/individual/add",
        name: "Add New Individual Membership",
        icon: "ni ni-bullet-list-67 text-red", // redundant
        component: AddIndividualMembership,
        layout: "/admin",
      },
      {
        path: "/membership/club-individual/add",
        name: "Add New Club Individual Membership",
        icon: "ni ni-bullet-list-67 text-red", // redundant
        component: Tables,
        layout: "/admin",
      },
      {
        path: "/membership/renew-membership",
        name: "Renew or change a Membership",
        icon: "ni ni-bullet-list-67 text-red", // redundant
        component: Tables,
        layout: "/admin",
      },
      {
        path: "/membership/about",
        name: "About",
        icon: "ni ni-bullet-list-67 text-red", // redundant
        component: Tables,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    isMenu: false,
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
    isMenu: false,
  },
];
export default routes;
