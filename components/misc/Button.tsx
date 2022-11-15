import classNames from "classnames"
import { Button as MButton, ButtonProps } from "@mantine/core"
import { FC, ComponentProps, forwardRef } from "react"

const ButtonWithRef = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  ({
    children,
    className,
    ...props
  }, ref) => {
    return (
      <button
        className={classNames(
          "btn",
          "no-animation",
          "border-none",
          "btn-primary",
          "dark:bg-red-400",
          "hover:brightness-90",
          "active:brightness-75",
          className
        )}
        ref={ref as never}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ButtonWithRef.displayName = "Button"

const Button = ({
  children,
  className,
  ...props
}: ButtonProps
) => {
  const theirProps = props;
  return (
    <MButton
      className={classNames(
        className
      )}
      {...theirProps}
    >
      {children}
    </MButton>
  )
}

// const Button = ({
//   children,
//   className,
//   ...props
// }: & ComponentProps<"button">
// ) => {
//   const theirProps = props;
//   return (
//     <button
//       className={classNames(
//         "bg-red-400",
//         "active:transform-none",
//         "hover:brightness-90",
//         "active:brightness-75",
//         className
//       )}
//       {...theirProps}
//     >
//       {children}
//     </button>
//   )
// }

// export default Button
