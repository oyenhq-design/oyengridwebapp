export const PermissionService = {
  getRoles: () => {
    return [
      { name: "Platform Founder", desc: "Permanent system admin role. Access to all operational parameters.", modules: "All Modules" },
      { name: "Engineering Lead", desc: "Manages deployments, releases, and feature flags.", modules: "DevOps, Releases, Flags" },
      { name: "Product Manager", desc: "Evaluates experiments and target flags.", modules: "Experiments, Flags" }
    ];
  },

  getPermissionsMatrix: () => {
    return {
      "Organizations": ["Read", "Create", "Manage Settings"],
      "Workspaces": ["Read", "Archive", "Override Limits"],
      "Security": ["Read SOC", "Terminate Session", "IP Block"],
      "Deployments": ["Trigger Build", "Rollback Release"]
    };
  },

  hasAccess: (role, module) => {
    if (role === "Platform Founder") return true;
    if (role === "Engineering Lead") {
      return ["Deployments", "Releases", "FeatureFlags"].includes(module);
    }
    return false;
  }
};
