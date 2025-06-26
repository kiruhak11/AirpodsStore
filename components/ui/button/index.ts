import { type VariantProps, cva } from 'class-variance-authority';

export { default as Button } from './Button.vue';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold text-base shadow-sm ring-offset-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
        outline: 'border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]',
        secondary: 'bg-[var(--color-bg-secondary)] text-[var(--color-primary)] hover:bg-[var(--color-bg)]',
        ghost: 'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)]',
        link: 'text-[var(--color-primary)] underline-offset-4 hover:underline',
        destructive: 'bg-[var(--color-error)] text-white hover:bg-red-700',
      },
      size: {
        default: 'h-12 px-6 text-lg',
        xs: 'h-8 rounded px-3 text-xs',
        sm: 'h-10 rounded-md px-4 text-sm',
        lg: 'h-14 rounded-lg px-10 text-xl',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
