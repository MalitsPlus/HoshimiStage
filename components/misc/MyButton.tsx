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
        "active:transform-none transition duration-150",
        className
      )}
      {...theirProps}
    >
      {children}
    </Button>
  )
}

export default MyButton
