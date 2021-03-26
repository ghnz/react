import { lazy } from "react";
import Route from "../types/Route";
import { RootState } from "redux/reducers/index";
import RoleType from "enums/RoleType";

const releaseBreadcrumb = (params: { releaseId?: string }, store: RootState): string => {
    return store.release.releases?.find((r) => r.releaseId === params.releaseId)?.version || "";
};

const allReleases = (isArchived: boolean): Route[] => {
    const path = isArchived ? "/:productId/all-releases/archived" : "/:productId/all-releases";
    const bcvalue = isArchived ? 0 : -1;
    const breadcrumb = isArchived ? "Archived releases" : "All releases";

    return [
        {
            path: path,
            breadcrumb: (params: { productId?: string }, store: RootState, path: string): string => {
                return path.indexOf(`/${params.productId}/all-releases/archived`) === bcvalue ? breadcrumb : "";
            },
            component: lazy(() => import("../router/Routes")),
            permission: RoleType.admin,
            exact: false,
            routes: [
                {
                    path: path + "/:releaseId",
                    breadcrumb: releaseBreadcrumb,
                    component: lazy(() => import("../pages/release/ReleaseRoot")),
                    permission: RoleType.admin,
                    exact: false,
                    routes: [
                        {
                            path: "",
                            breadcrumb: (params: { version: string | undefined }, store: RootState): string => {
                                return params.version || "";
                            },
                            component: lazy(() => import("../pages/release/release-detail/AdminReleaseDetail")),
                            permission: RoleType.admin,
                            exact: true,
                        },
                    ],
                },
                {
                    path: "",
                    breadcrumb: "",
                    component: lazy(() => import("../pages/product/all-releases/AllReleases")),
                    permission: RoleType.admin,
                    exact: true,
                },
            ],
        },
    ];
};

export const routes: Route[] = [
    {
        path: "/",
        component: lazy(() => import("../pages/landing/index")),
        exact: true,
    },
    {
        path: "/reports",
        breadcrumb: "Reports",
        component: lazy(() => import("../pages/reports/Reports")),
        permission: RoleType.admin,
        exact: true
    },
    {
      path: "/download-log",
      breadcrumb: "Download log",
      component: lazy(() => import("../pages/download-log/DownloadLog")),
      exact: true,
      permission: RoleType.user
    },
    {
        path: "/:productId",
        breadcrumb: (params: object, store: RootState): string => {
            return store.product.currentProduct?.name || "";
        },
        component: lazy(() => import("../pages/product/ProductRoot")),
        exact: false,
        routes: [
            ...allReleases(true),
            ...allReleases(false),
            {
                path: "/:productId/draft-releases",
                breadcrumb: "Draft releases",
                component: lazy(() => import("../router/Routes")),
                permission: RoleType.admin,
                exact: false,
                routes: [
                    {
                        path: "/:productId/draft-releases/new-release",
                        breadcrumb: "New release",
                        component: lazy(() => import("../pages/release/new-release/NewRelease")),
                        permission: RoleType.admin,
                        exact: true,
                    },
                    {
                        path: "/:productId/draft-releases/:releaseId",
                        breadcrumb: releaseBreadcrumb,
                        component: lazy(() => import("../pages/release/ReleaseRoot")),
                        permission: RoleType.admin,
                        exact: false,
                        routes: [
                            {
                                path: "/:productId/draft-releases/:releaseId/review",
                                breadcrumb: '',
                                component: lazy(() => import("../pages/release/review-release/ReviewRelease")),
                                permission: RoleType.admin,
                                exact: true,
                            },
                            {
                                path: "",
                                component: lazy(() => import("../pages/release/edit-release/EditRelease")),
                                permission: RoleType.admin,
                                exact: false,
                                routes: [
                                    {
                                        path: "/:productId/draft-releases/:releaseId/files",
                                        component: lazy(() => import("../pages/release/edit-release/Files")),
                                        permission: RoleType.admin,
                                        exact: true,
                                    },
                                    {
                                        path: "/:productId/draft-releases/:releaseId/regional-distribution",
                                        component: lazy(() =>
                                            import("../pages/release/edit-release/RegionalDistribution"),
                                        ),
                                        permission: RoleType.admin,
                                        exact: true,
                                    },
                                    {
                                        path: "/:productId/draft-releases/:releaseId/validate-upload",
                                        component: lazy(() => import("../pages/release/edit-release/ValidateUpload")),
                                        permission: RoleType.admin,
                                        exact: true,
                                    },
                                    {
                                        path: "",
                                        component: lazy(() =>
                                            import("../pages/release/edit-release/ReleaseInformation"),
                                        ),
                                        permission: RoleType.admin,
                                        exact: true,
                                    },
                                ],
                            }
                        ],
                    },
                    {
                        path: "",
                        breadcrumb: (params: { version: string | undefined }, store: RootState): string => {
                            return params.version || "";
                        },
                        component: lazy(() => import("../pages/product/draft-releases/DraftReleases")),
                        permission: RoleType.admin,
                        exact: true,
                    },
                ],
            },
            {
                path: "/:productId/current-release",
                breadcrumb: "Current release",
                component: lazy(() => import("../pages/release/current-release/CurrentRelease")),
                permission: RoleType.user,
                exact: true,
            },
            {
                path: "/:productId/previous-releases",
                breadcrumb: "Previous releases",
                component: lazy(() => import("../router/Routes")),
                permission: RoleType.user,
                exact: false,
                routes: [
                    {
                        path: "/:productId/previous-releases/:releaseId",
                        breadcrumb: releaseBreadcrumb,
                        component: lazy(() => import("../pages/release/ReleaseRoot")),
                        permission: RoleType.user,
                        exact: false,
                        routes: [
                            {
                                path: "",
                                breadcrumb: (params: { version: string | undefined }, store: RootState): string => {
                                    return params.version || "";
                                },
                                component: lazy(() => import("../pages/release/release-detail/ReleaseDetail")),
                                permission: RoleType.user,
                                exact: true,
                            },
                        ],
                    },
                    {
                        path: "",
                        breadcrumb: (params: { version: string | undefined }, store: RootState): string => {
                            return params.version || "";
                        },
                        component: lazy(() => import("../pages/product/previous-releases/PreviousReleases")),
                        permission: RoleType.user,
                        exact: true,
                    },
                ],
            },
            {
                path: "",
                redirect: (params: { productId: string }, isAdmin: boolean): string => {
                    return isAdmin ? `${params.productId}/all-releases` : `${params.productId}/current-release`;
                },
                exact: true,
            }
        ],
    }
];

export default { routes };
