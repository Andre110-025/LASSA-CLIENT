import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";
import AuthView from "../views/Auth.vue";
import LoginView from "../components/auth/Login.vue";
import RegisterView from "../components/auth/Register.vue";
import VerifyAccountView from "../components/auth/VerifyAccount.vue";
import ResetPasswordView from "../components/auth/ResetPassword.vue";
import DashboardView from "../views/Dashboard.vue";
import OverView from "../components/dashboard/OverView.vue";
import AccountChoice from "../components/dashboard/AccountChoice.vue";
import EnterKycView from "../components/dashboard/EnterKyc.vue";
import FirstPartyKyc from "../components/dashboard/FirstPartyKyc.vue";
import InterestExpression from "../components/dashboard/thirdParty/InterestExpression.vue";
import AdvertCategory from "../components/dashboard/AdvertCategory.vue";
import updatePwdView from "../components/auth/UpdatePassword.vue";
import RequestView from "../views/RequestView.vue";
import ViewDownloads from "../components/dashboard/ViewDownloads.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      redirect: { name: "Register" },
    },
    {
      path: "/auth",
      redirect: { name: "Register" },
      name: "auth",
      component: AuthView,
      beforeEnter: (to, from, next) => {
        const userDetails = useUserStore().userDetails;

        userDetails.accessToken && userDetails.userInfo
          ? next({ name: "Overview" })
          : next();
      },
      children: [
        {
          path: "register",
          name: "Register",
          component: RegisterView,
        },
        {
          path: "login",
          name: "Login",
          component: LoginView,
        },
        {
          path: "resetPwd",
          name: "Reset Password",
          component: ResetPasswordView,
          beforeEnter: (to, from, next) => {
            from.name == "Login" ? next() : next("/auth/login");
          },
        },
        {
          path: "verify",
          name: "Verify Account",
          component: VerifyAccountView,
          beforeEnter: (to, from, next) => {
            from.name == "Register" ||
            from.name == "Login" ||
            from.name == "Reset Password"
              ? next()
              : next("/auth/login");
          },
        },
        {
          path: "change-password",
          name: "Change Password",
          component: updatePwdView,
          beforeEnter: (to, from, next) => {
            from.name == "Verify Account" ? next() : next("/auth/login");
          },
        },
      ],
    },
    {
      path: "/accountType",
      name: "Select Account",
      component: AccountChoice,
      beforeEnter: (to, from, next) => {
        const userDetails = useUserStore().userDetails;
        if (userDetails.accessToken) {
          userDetails.userInfo.user_type ? next({ name: "Overview" }) : next();
        } else {
          next("/auth/login");
        }
      },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      redirect: { name: "Overview" },
      component: DashboardView,
      beforeEnter: async (to, from, next) => {
        await useUserStore().getUserData();
        const userDetails = useUserStore().userDetails;

        if (userDetails.accessToken && userDetails.userInfo) {
          if (!userDetails.userInfo.user_type) {
            next("/accountType");
          } else {
            next();
          }
        } else {
          next("/auth/login");
        }
      },
      children: [
        {
          path: "overview",
          name: "Overview",
          component: OverView,
        },
        {
          path: "request",
          name: "Request",
          component: RequestView,
          beforeEnter: (to, from, next) => {
            const userDetails = useUserStore().userDetails;

            if (!userDetails.userInfo.kyc_status) {
              userDetails.userInfo.user_type === "first_party"
              ? next({ name: "Kyc-Form" })
              : next({ name: "Interest-Expression" });
            } else {
              next();
            }
          },
          children: [
            {
              path: "",
              name: "RequestLists",
              component: () => import("../components/dashboard/Requests.vue"),
            },
            {
              path: "premise-app-detail/:id",
              name: "Premise Application Detail",
              component: () =>
                import("../components/dashboard/PremiseApplicationDetail.vue"),
            },
            {
              path: "mobile-app-detail/:id",
              name: "Mobile Application Detail",
              component: () =>
                import("../components/dashboard/MobileApplicationDetail.vue"),
            },
            {
              path: "temporary-app-detail/:id",
              name: "Temporary Application Detail",
              component: () =>
                import("../components/dashboard/TemporaryDetail.vue"),
            },
            {
              path: "pav-app-detail/:id",
              name: "PAV Application Detail",
              component: () =>
                import("../components/dashboard/PavApplicationDetail.vue"),
            },
            {
              path: "street-app-detail/:id",
              name: "Street Lamp Application Detail",
              component: () =>
                import(
                  "../components/dashboard/StreetLampApplicationDetail.vue"
                ),
            },
            {
              path: "outdoor-app-detail/:id",
              name: "Outdoor Site Application Detail",
              component: () =>
                import("../components/dashboard/OutDoorApplicationDetail.vue"),
            },
            {
              path: "small-format-detail/:id",
              name: "Small Format Application Detail",
              component: () =>
                import("../components/dashboard/SmallFormatDetail.vue"),
            },
          ],
        },
        {
          path: "enterKyc",
          name: "Enter Kyc",
          component: EnterKycView,
          children: [
            {
              path: "first-party",
              name: "Kyc-Form",
              component: FirstPartyKyc,
              beforeEnter: (to, from, next) => {
                const userDetails = useUserStore().userDetails;

                !userDetails.userInfo.kyc_status &&
                userDetails.userInfo.user_type === "first_party"
                  ? next()
                  : next({ name: "RequestLists" });
              },
            },
            {
              path: "third-party",
              name: "Interest-Expression",
              component: InterestExpression,
              beforeEnter: (to, from, next) => {
                const userDetails = useUserStore().userDetails;
                
                userDetails.userInfo.user_type === "third_party"
                  ? next()
                  : next({ name: "RequestLists" });
              },
            },
          ],
        },
        {
          path: "advertCategory",
          name: "Advert Category",
          component: AdvertCategory,
        },
        {
          path: "premiseAdvert",
          name: "Premise Advert",
          component: () =>
            import("../components/dashboard/firstParty/PremiseAdvert.vue"),
        },
        {
          path: "temporaryAdvert/:app_type",
          name: "Temporary Advert",
          component: () =>
            import("../components/dashboard/TemporaryAdvert.vue"),
        },
        {
          path: "temporaryAdBlanket",
          name: "Temporary Advert Blanket",
          component: () =>
            import("../components/dashboard/TemporaryAdvertBlanket.vue"),
          redirect: { name: "Advert Category" },
        },
        {
          path: "mobileAdvert",
          name: "Mobile Advert",
          component: () => import("../components/dashboard/MobileAdvert.vue"),
        },
        {
          path: "pavApplication",
          name: "Promotional Advert vehicles",
          component: () =>
            import("../components/dashboard/MobilePavAdvert.vue"),
        },
        {
          path: "small-format-app",
          name: "Small Format Application",
          component: () =>
            import("../components/dashboard/SmallFormatApp.vue"),
        },
        {
          name: "streetApplication",
          path: "street-lamp-poles/application",
          component: () =>
            import("../components/dashboard/thirdParty/StreetLamp.vue"),
        },
        {
          name: "OutDoorApplication",
          path: "outdoor-site-application",
          component: () =>
            import("../components/dashboard/thirdParty/OutdoorSite.vue"),
        },
        {
          name: "ViewDownloads",
          path: "view-downloads/:app_type/:id",
          component: ViewDownloads,
        },
        {
          path: "payments",
          name: "Payments",
          component: () => import("../views/WalletPayment.vue"),
        },
        {
          path: "settings",
          name: "UserSettings",
          component: () => import("../components/dashboard/UserSetting.vue"),
        },
        {
          path: "upload-img",
          name: "ImageUpload",
          component: () => import("../components/dashboard/ImageUploadView.vue"),
        },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: { name: "Login" } },
  ],
});

export default router;
