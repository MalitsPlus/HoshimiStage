import { IconMusic, IconQuestionCircle, IconSearch } from "@tabler/icons";

export const Pages = [
  { icon: IconMusic, label: "Notemap", href: "/" },
  { icon: IconSearch, label: "Card Search", href: "/search" },
  { icon: IconQuestionCircle, label: "Help", href: "/help" },
] as const
