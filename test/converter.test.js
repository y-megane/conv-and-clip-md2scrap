// const { exportAllDeclaration } = require("@babel/types");
// const { fail } = require("yargs");

const md2scrap = require("../src/converter");
// import { md2scrap } from "../src/converter";
test("test jest", () => {
  expect(md2scrap("# h1 text")).toBe("[*** h1 text]");
});
