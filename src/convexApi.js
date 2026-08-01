// Browser-safe Proxy for Convex function references (no Node.js server dependencies)
export const api = new Proxy({}, {
  get(_, moduleName) {
    return new Proxy({}, {
      get(_, functionName) {
        return `${String(moduleName)}:${String(functionName)}`;
      }
    });
  }
});
