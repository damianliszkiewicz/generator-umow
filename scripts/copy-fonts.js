const { cpSync, mkdirSync } = require("fs");
const { join } = require("path");

const src = join(__dirname, "..", "node_modules/@expo-google-fonts/source-serif-4");
const dest = join(__dirname, "..", "public/fonts");

mkdirSync(dest, { recursive: true });
cpSync(
  join(src, "400Regular/SourceSerif4_400Regular.ttf"),
  join(dest, "SourceSerif4_400Regular.ttf"),
);
cpSync(
  join(src, "700Bold/SourceSerif4_700Bold.ttf"),
  join(dest, "SourceSerif4_700Bold.ttf"),
);
console.log("Fonts copied to public/fonts/");
