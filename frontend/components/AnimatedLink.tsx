import { TLinkHoverProps } from "@/types";
import SquareButton from "./SquareButton";
import LinkHover from "@/animation/LinkHover";

interface AnimatedLinkProps extends TLinkHoverProps {
  variant?: 'default' | 'rating' | 'navigation';
  backgroundColor?: string;
  className?: string;
}

export default function AnimatedLink({ 
  href, 
  title, 
  className = '',
  variant = 'default',
  backgroundColor = '#fff'
}: AnimatedLinkProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'rating':
        return {
          container: 'absolute left-[25px] bottom-[35px] w-fit rounded-[50px] border border-white cursor-pointer',
          text: 'xl:text-[18px] xl:leading-[18px] text-[14px] leading-[14px] font-NeueMontreal text-white uppercase tracking-wider',
          rounded: 'py-[8px] px-[12px]',
          textColor: 'hover:text-black'
        };
      case 'navigation':
        return {
          container: 'w-fit sub-paragraph font-medium capitalize before:h-[1px] after:h-[1px] before:bottom-[1px] after:bottom-[1px]',
          text: 'text-gray-700 hover:text-black',
          rounded: 'py-2 px-4',
          textColor: 'hover:text-white'
        };
      default:
        return {
          container: 'w-fit',
          text: 'text-gray-600 hover:text-black',
          rounded: 'py-2 px-4',
          textColor: 'hover:text-white'
        };
    }
  };

  const styles = getVariantStyles();

  if (variant === 'rating') {
    return (
      <div className={styles.container}>
        <SquareButton backgroundColor={backgroundColor} className={`${styles.rounded} rounded-lg`}>
          <LinkHover
            href={href}
            title={title}
            className={`z-10 ${styles.textColor} ${styles.text}`}
          />
        </SquareButton>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SquareButton backgroundColor={backgroundColor} className={`${styles.rounded} rounded-lg`}>
        <LinkHover
          href={href}
          title={title}
          className={`z-10 ${styles.textColor} ${styles.text} ${className}`}
        />
      </SquareButton>
    </div>
  );
}
