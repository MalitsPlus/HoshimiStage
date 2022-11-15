import { MantineTheme } from "@mantine/core";

export const IPR_THEME: Partial<MantineTheme> = /*tw*/ {
  colorScheme: "light",
  // colors: {
  //   ipr: ['#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7', '#339af0', '#228be6', '#1c7ed6', '#1971c2', '#1864ab',],
  // },
  // primaryColor: "ipr",
  // activeStyles: {
  //   transform: "none",
  //   filter: "brightness(.9)"
  // },
  components: {
    Button: {
      classNames: {
        root: "bg-red-500 text-4xl"
      },
      defaultProps: {},
    },
    TextInput: {
      classNames: {
        input: `bg-slate-500 border-yellow-800 rounded-none border`,
        root: "bg-slate-500"
      }
    }
  }
};
