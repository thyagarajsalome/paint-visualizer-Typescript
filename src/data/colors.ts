export type Color = {
  name: string;
  hex: string;
};

export type ColorCategory = {
  name: string;
  swatchColor: string;
  colors: Color[];
};

export const paintColors: ColorCategory[] = [
  {
    name: "Soft Whites",
    swatchColor: "#FDF9F7",
    colors: [
      { name: "Cloud White", hex: "#F8F4F0" },
      { name: "Linen White", hex: "#F5EFEA" },
      { name: "Alabaster", hex: "#ECE7E4" },
    ],
  },
  {
    name: "Calm Blues",
    swatchColor: "#E6F0F5",
    colors: [
      { name: "Sky Blue Light", hex: "#EBF5F8" },
      { name: "Powder Blue", hex: "#DCEEF3" },
      { name: "Baby Blue", hex: "#BDE0E9" },
    ],
  },
  {
    name: "Gentle Greens",
    swatchColor: "#E9F5E6",
    colors: [
      { name: "Mint Cream", hex: "#EDF8EC" },
      { name: "Celadon", hex: "#DEEEDD" },
      { name: "Tea Green", hex: "#CFE4CE" },
    ],
  },
];
