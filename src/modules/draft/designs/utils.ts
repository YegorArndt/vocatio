export const heading = (text: string) => ({
  type: "heading-2",
  id: `heading-for-${text}`,
  props: {
    value: text,
  },
});
