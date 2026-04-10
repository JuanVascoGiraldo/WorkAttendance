import Actions from "../../actions/Actions";
import User from "../../actions/User";

const actionSources = [
  { className: Actions?.constructor, object: Actions },
  { className: User, object: User },
];

const getMethodNames = (source) => {
  const prototypeMethods = source?.className?.prototype
    ? Object.getOwnPropertyNames(source.className.prototype)
    : [];
  const objectMethods = source?.object ? Object.keys(source.object) : [];

  return [...new Set([...prototypeMethods, ...objectMethods])];
};

const BuildActions = (cookie = null) => {
  const merged = {};

  for (const source of actionSources) {
    if (cookie && source.object && typeof source.object === "object") {
      source.object.cookie = cookie;
    }

    for (const methodName of getMethodNames(source)) {
      if (methodName === "constructor") {
        continue;
      }

      const method = source.object?.[methodName];
      if (typeof method === "function") {
        merged[methodName] = method.bind(source.object);
      }
    }
  }

  return merged;
};

const actionsState = BuildActions();

const useActions = () => actionsState;

export { useActions, BuildActions };
export default BuildActions;