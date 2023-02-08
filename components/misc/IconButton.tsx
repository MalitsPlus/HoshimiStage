import { Tooltip, UnstyledButton, UnstyledButtonProps } from "@mantine/core";
import { FloatingPosition } from "@mantine/core/lib/Floating/types";
import { TablerIcon } from "@tabler/icons";
import classNames from "classnames";
import { forwardRef } from "react";

type InternalIconButtonProps = {
  icon: TablerIcon,
  floatingPosition: FloatingPosition,
  disabled?: boolean,
  label?: string,
}

export type IconButtonProps =
  Partial<Omit<UnstyledButtonProps, keyof InternalIconButtonProps>>
  & InternalIconButtonProps
  & Partial<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof InternalIconButtonProps | keyof UnstyledButtonProps>>
  & { ref?: any }

function InternalIconButton({ icon: Icon, floatingPosition, label, disabled, className, onClick, ...props }: IconButtonProps) {
  return (
    <Tooltip label={label} position={floatingPosition} className='rounded-full'>
      <div>
        <UnstyledButton
          onClick={disabled ? undefined : onClick}
          className={classNames(
            'flex rounded-full justify-center items-center text-blue-600 dark:text-blue-200',
            !disabled && 'hover:bg-blue-100 dark:hover:bg-zinc-700',
            "aspect-square rounded-full transition-colors duration-default",
            disabled && 'text-blue-300 dark:text-zinc-500 cursor-default',
            className,
          )}
          {...props}
        >
          <Icon stroke={1.5} />
        </UnstyledButton>
      </div>
    </Tooltip>
  )
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => (
  <InternalIconButton ref={ref} {...props} />
))
IconButton.displayName = "IconButton"
