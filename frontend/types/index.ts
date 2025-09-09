export type TtextHoverProps = {
   titile1: string;
   titile2: string;
};

export type TlogoMarqueeProps = {
   children: React.ReactNode;
   baseVelocity: string | number | any;
};

export type TMarqueeProps = {
   title: string;
   className: string;
};

export type TLinkHoverProps = {
  title?: string;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children?: React.ReactNode;
};

export type TButtonProps = {
   title: string;
   href: string;
};

export type TRoundedProps = {
  children: React.ReactNode;
  className?: string;
  backgroundColor: string;
};

export type TCurveProps = {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
};
