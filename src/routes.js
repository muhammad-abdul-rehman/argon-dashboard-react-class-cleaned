import Index from "views/Index.js";
import Register from "views/auth/Register.js";
import Login from "views/auth/Login.js";
import Tables from "views/Tables.js";
import Memberships from "views/memberships/Memberships";
import AddIndividualMembership from "views/memberships/AddIndividualMembership";
import Customers from "views/Customers";
import Payment from "views/Payment";
import AddClubMembership from "views/memberships/AddClubMembership";
import Clubs from "views/Clubs";
import RenewMembership from "views/memberships/RenewMembership";
import Filr from "views/filr/Filr";
import Library from "views/filr/Library";
import Logos from "views/sponsored-logos/Logos";
import Speakers from "views/speakers/Speakers";
import Users from "views/users/Users";
import EditUser from "views/users/EditUser";
import CreateLogo from "views/sponsored-logos/CreateLogo";
import CreateSpeaker from "views/speakers/CreateSpeaker";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/customer",
    name: "Members",
    icon: "ni ni-single-02 text-red",
    component: Customers,
    layout: "/admin",
  },
  {
    path: "/payment",
    name: "Payment",
    icon: "ni ni-credit-card text-black",
    component: Payment,
    layout: "/admin",
  },
  {
    path: "/clubs",
    name: "Clubs",
    icon: "fa fa-users text-green",
    component: Clubs,
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
        icon: "fa fa-user-plus text-info", // redundant
        component: AddIndividualMembership,
        layout: "/admin",
        showInSidebar: true,
      },
      {
        path: "/membership/club-individual/add",
        name: "Add New Club Membership",
        icon: "fa fa-user-plus  text-green", // redundant
        component: AddClubMembership,
        layout: "/admin",
        showInSidebar: true,
      },
      {
        path: "/membership/renew-membership/:id",
        name: "Renew or change a Membership",
        icon: "ni ni-bullet-list-67 text-blue", // redundant
        component: RenewMembership,
        layout: "/admin",
        showInSidebar: false,
      },
      {
        path: "/membership/about",
        name: "About",
        icon: "ni ni-bullet-list-67 text-red", // redundant
        component: Tables,
        layout: "/admin",
        showInSidebar: true,
      },
    ],
  },
  {
    path: "/filr",
    name: "Filr",
    icon: "fa fa-folder text-red",
    component: Filr,
    layout: "/admin",
    children: [
      {
        path: "/filr-lists",
        name: "Filr Library",
        icon: "fa  fa-book text-green", // redundant
        component: Library,
        layout: "/admin",
        showInSidebar: true,
      },
    ],
  },
  {
    path: "/sponsored-logos",
    name: "Sponsored Logos",
    icon: "fa fa-images text-green",
    component: Logos,
    layout: "/admin",
    children: [
      {
        path: "/sponsored-logos/create",
        name: "Create Logo",
        icon: "fa  fa-book text-green", // redundant
        component: CreateLogo,
        layout: "/admin",
        showInSidebar: false,
      },
    ],
  },
  {
    path: "/speakers",
    name: "Speakers",
    icon: "fa fa-bullhorn text-green",
    component: Speakers,
    layout: "/admin",
    children: [
      {
        path: "/speakers/create",
        name: "Create Ppeaker",
        icon: "fa  fa-book text-green", // redundant
        component: CreateSpeaker,
        layout: "/admin",
        showInSidebar: false,
      },
    ],
  },
  {
    path: "/users",
    name: "Users",
    icon: "fa fa-user text-green",
    component: Users,
    layout: "/admin",
    children: [
      {
        path: "/users/:id",
        name: "User",
        icon: "fa  fa-book text-green", // redundant
        component: EditUser,
        layout: "/admin",
        showInSidebar: false,
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
