// 基本React类型声明
declare module 'react' {
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  export type Key = string | number;

  export interface ReactNode {
    // 实际上这个类型更复杂，但这里简化处理
  }

  export type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);

  export interface Component<P = {}, S = {}> {
    render(): ReactNode;
    props: Readonly<P>;
    state: Readonly<S>;
    setState(state: S | ((prevState: Readonly<S>, props: Readonly<P>) => S | null), callback?: () => void): void;
  }

  export interface FC<P = {}> {
    (props: P): ReactElement | null;
    displayName?: string;
  }

  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => (void | (() => void)), deps?: readonly any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useMemo<T>(factory: () => T, deps: readonly any[]): T;
  export function useRef<T>(initialValue: T): { current: T };

  // 添加更多需要的React API
}

// 确保JSX命名空间存在
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}

  interface IntrinsicElements {
    // HTML元素
    div: any;
    span: any;
    p: any;
    h1: any;
    h2: any;
    h3: any;
    button: any;
    input: any;
    textarea: any;
    select: any;
    option: any;
    form: any;
    label: any;
    a: any;
    table: any;
    thead: any;
    tbody: any;
    tr: any;
    th: any;
    td: any;
    svg: any;
    path: any;
    polygon: any;
    ul: any;
    li: any;
    // 添加更多HTML元素...
  }
}

declare module 'react-dom' {
  function render(element: React.ReactElement, container: Element | null): void;
  function createPortal(children: React.ReactNode, container: Element): React.ReactPortal;
}

declare module 'next/link' {
  import { ReactNode, MouseEventHandler } from 'react';
  
  export interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    target?: string;
    children: ReactNode;
  }
  
  export default function Link(props: LinkProps): JSX.Element;
}
