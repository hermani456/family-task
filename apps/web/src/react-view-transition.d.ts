declare module "react" {
  export interface ViewTransitionProps {
    children?: React.ReactNode;
    name?: string;
  }

  export const ViewTransition: React.ComponentType<ViewTransitionProps>;
}
