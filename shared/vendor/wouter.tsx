import {
  Children,
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type NavigateOptions = {
  replace?: boolean;
};

type RouteParams = Record<string, string>;

type RouteComponent<P = any> = React.ComponentType<P>;

type RouteProps = {
  path?: string;
  component?: RouteComponent<any>;
  children?: ReactNode | ((params: RouteParams) => ReactNode);
  /**
   * Internal flag passed by <Switch /> to avoid recomputing the match twice.
   */
  __wouter_hasMatch?: boolean;
  __wouter_params?: RouteParams;
};

type SwitchProps = {
  children: ReactNode;
};

type LinkProps = Omit<HTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: string;
  to?: string;
};

type MatchResult = {
  matches: boolean;
  params: RouteParams;
};

const subscribers = new Set<(path: string) => void>();

const getCurrentPath = () => {
  if (typeof window === "undefined") {
    return "/";
  }
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}` || "/";
};

const notifySubscribers = () => {
  const path = getCurrentPath();
  for (const subscriber of subscribers) {
    subscriber(path);
  }
};

if (typeof window !== "undefined") {
  const notify = () => notifySubscribers();
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
}

const subscribe = (listener: (path: string) => void) => {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
};

export function useLocation(): [string, (to: string, options?: NavigateOptions) => void] {
  const [location, setLocation] = useState<string>(() => getCurrentPath());

  useEffect(() => {
    const unsubscribe = subscribe(setLocation);
    return unsubscribe;
  }, []);

  const resolveTarget = useCallback((to: string) => {
    if (typeof window === "undefined" || !to) {
      return to;
    }
    const absolutePattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
    if (absolutePattern.test(to)) {
      return to;
    }
    const base = window.location;
    const url = new URL(to, `${base.origin}${base.pathname}${base.search}`);
    return `${url.pathname}${url.search}${url.hash}`;
  }, []);

  const navigate = useCallback(
    (to: string, options?: NavigateOptions) => {
      if (typeof window === "undefined" || !to) return;
      const resolved = resolveTarget(to);
      const absolutePattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

      if (absolutePattern.test(to)) {
        window.location.href = to;
        return;
      }

      const method = options?.replace ? "replaceState" : "pushState";
      if (typeof window.history[method] === "function") {
        window.history[method](null, "", resolved);
      } else {
        window.location.href = resolved;
        return;
      }

      setLocation(resolved);
      notifySubscribers();
    },
    [resolveTarget],
  );

  return [location, navigate];
}

const escapeRegex = (value: string) => value.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");

const matcherCache = new Map<string, { regex: RegExp; keys: string[] }>();

const compileMatcher = (pattern: string) => {
  const cached = matcherCache.get(pattern);
  if (cached) return cached;

  const keys: string[] = [];
  let patternExpr = pattern
    .replace(/\/+$/g, "")
    .replace(/\*/g, "(.*)")
    .replace(/:(\w+)/g, (_, key) => {
      keys.push(key);
      return "([^/]+)";
    });

  patternExpr = `^${escapeRegex(patternExpr)}$`
    .replace(/\\\(\.\*\\\)/g, "(.*)")
    .replace(/\\\(\[\^\/\]\+\)\\\)/g, "([^/]+)");

  const regex = new RegExp(patternExpr);
  const compiled = { regex, keys };
  matcherCache.set(pattern, compiled);
  return compiled;
};

const matchPath = (pattern: string | undefined, pathname: string): MatchResult => {
  if (!pattern) {
    return { matches: true, params: {} };
  }

  const targetPath = pathname.split("?")[0];
  const { regex, keys } = compileMatcher(pattern === "*" ? ".*" : pattern);
  const match = regex.exec(targetPath);
  if (!match) {
    return { matches: false, params: {} };
  }

  const params: RouteParams = {};
  keys.forEach((key, index) => {
    params[key] = decodeURIComponent(match[index + 1] || "");
  });
  return { matches: true, params };
};

export function Route({
  path,
  component: Component,
  children,
  __wouter_hasMatch,
  __wouter_params,
}: RouteProps) {
  const [location] = useLocation();
  const match = useMemo<MatchResult>(() => {
    if (__wouter_hasMatch) {
      return { matches: true, params: __wouter_params ?? {} };
    }
    return matchPath(path, location);
  }, [__wouter_hasMatch, __wouter_params, location, path]);

  if (!match.matches) {
    return null;
  }

  if (Component) {
    return <Component params={match.params} />;
  }

  if (typeof children === "function") {
    return <>{children(match.params)}</>;
  }

  return <>{children}</>;
}

export function Switch({ children }: SwitchProps) {
  const [location] = useLocation();
  const childArray = Children.toArray(children) as ReactNode[];

  for (const child of childArray) {
    if (!isValidElement(child)) {
      continue;
    }
    const element = child as ReactElement<RouteProps>;
    const { matches, params } = matchPath(element.props.path, location);
    if (matches) {
      return cloneElement(element, {
        __wouter_hasMatch: true,
        __wouter_params: params,
      });
    }
  }

  return null;
}

export function Link({ href, to, onClick, children, ...rest }: LinkProps) {
  const target = href ?? to ?? "#";
  const [, navigate] = useLocation();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(event);
      }
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }
      event.preventDefault();
      navigate(target);
    },
    [navigate, onClick, target],
  );

  return (
    <a {...rest} href={target} onClick={handleClick}>
      {children}
    </a>
  );
}

export default {
  Route,
  Switch,
  Link,
  useLocation,
};
