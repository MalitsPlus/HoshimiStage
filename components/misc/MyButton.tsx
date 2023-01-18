import { Button, ButtonProps } from "@mantine/core";
import classNames from "classnames";
import { PolymorphicComponentProps } from "../../src/utils/polymorphic";

type Props = PolymorphicComponentProps<"button", ButtonProps>

const MyButton = ({
  children,
  className,
  ...props
}: Props
) => {
  const theirProps = props;
  return (
    <Button
      className={classNames(
        "bg-sky-600 hover:bg-sky-700 active:bg-sky-800",
        "dark:bg-sky-600 dark:hover:bg-sky-700 dark:active:bg-sky-800 ",
        "disabled:dark:bg-zinc-600",
        "active:transform-none transition duration-150 p-2",
        className
      )}
      {...theirProps}
    >
      {children}
    </Button>
  )
}

export default MyButton
