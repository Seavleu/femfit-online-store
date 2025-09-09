import { TButtonProps } from "@/types";
import { ArrowUpRight } from "lucide-react";
import SquareButton from "./SquareButton";
import LinkHover from "@/animation/LinkHover";

interface AnimatedButtonProps extends TButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AnimatedButton({ 
  href, 
  title, 
  variant = 'primary', 
  size = 'md',
  className = ''
}: AnimatedButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: 'bg-black text-white',
          rounded: '#fff',
          text: 'text-white group-hover:text-black'
        };
      case 'secondary':
        return {
          container: 'bg-gray-100 text-black',
          rounded: '#000',
          text: 'text-black group-hover:text-white'
        };
      case 'outline':
        return {
          container: 'border border-gray-300 text-gray-700',
          rounded: '#000',
          text: 'text-gray-700 group-hover:text-white'
        };
      default:
        return {
          container: 'bg-black text-white',
          rounded: '#fff',
          text: 'text-white group-hover:text-black'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-4 py-2',
          text: 'text-sm',
          icon: 'w-4 h-4'
        };
      case 'md':
        return {
          container: 'px-6 py-3',
          text: 'text-base',
          icon: 'w-5 h-5'
        };
      case 'lg':
        return {
          container: 'px-8 py-4',
          text: 'text-lg',
          icon: 'w-6 h-6'
        };
      default:
        return {
          container: 'px-6 py-3',
          text: 'text-base',
          icon: 'w-5 h-5'
        };
    }
  };

  const styles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <div className={`group ${className}`}>
      <SquareButton
        className={`${styles.container} ${sizeStyles.container} cursor-pointer rounded-lg`}
        backgroundColor={styles.rounded}
      >
        <LinkHover
          href={href}
          title={title}
          className={`z-10 font-medium uppercase tracking-wider ${styles.text} ${sizeStyles.text}`}
        />
        <div className={`p-2 rounded-full scale-[0.3] mr-2 group-hover:scale-[0.9] transition-all z-10 transform duration-[0.3s] ease-[.215,.61,.355,1]`}>
          <ArrowUpRight
            strokeWidth={1.5}
            className={`${sizeStyles.icon} scale-[0] group-hover:scale-[1] transition-transform duration-300`}
          />
        </div>
      </SquareButton>
    </div>
  );
}
