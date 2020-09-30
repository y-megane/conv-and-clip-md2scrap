const md2scrap = require("../src/md2scrap");

describe("header", () => {
  test("# to [*** str]", () => {
    expect(md2scrap("# h1 #text")).toBe("[*** h1 #text]");
  });

  test("## str to [** str]", () => {
    expect(md2scrap("## h2 text")).toBe("[** h2 text]");
  });

  test("### str to [* str]", () => {
    expect(md2scrap("### h3 text")).toBe("[* h3 text]");
  });

  test("####.. str to [* str]", () => {
    expect(md2scrap("#### h4 or lower text")).toBe("[* h4 or lower text]");
  });
});

describe("font", () => {
  test("bold", () => {
    expect(md2scrap("xxx **bold** xxx")).toBe("xxx [* bold] xxx");
  });
  test("italic", () => {
    expect(md2scrap("xxx *italic* xxx")).toBe("xxx [/ italic] xxx");
  });
  test("strikethrough", () => {
    expect(md2scrap("xxx ~strikethrough~ xxx")).toBe(
      "xxx [- strikethrough] xxx"
    );
  });
});

// Scrapbox doesn't support nested blockquotes
describe("blockquotes", () => {
  test("Singleline", () => {
    expect(md2scrap(">single")).toBe(">single");
  });
  test("Multilile", () => {
    expect(
      md2scrap(`
      >line1
      >line2
      >
      >line3`)
    ).toBe(`
      >line1
      >line2
      >
      >line3`);
  });
});

//Up to level4 is implemented.
describe("Unordered list", () => {
  test("Unordered List with -", () => {
    expect(
      md2scrap(`
- level1
  - level2
    - level3
      - level4
    - level3
  - level2`)
    ).toBe(`
 level1
  level2
   level3
    level4
   level3
  level2`);
  });
  test("Unordered List with *", () => {
    expect(
      md2scrap(`
* level1
  * level2
    * level3
      * level4
    * level3
  * level2`)
    ).toBe(`
 level1
  level2
   level3
    level4
   level3
  level2`);
  });
});

// Scrapbox doesn't support Ordered List
describe("Ordered list", () => {
  test("Ordered List is converted to Unordered List", () => {
    expect(
      md2scrap(`
1. level1
  1. level2
    1. level3
      1. level4
  1. level2
  2. level2`)
    ).toBe(`
 level1
  level2
   level3
    level4
  level2
  level2`);
  });
});

describe("Code block", () => {
  test("Code block without extention or file name", () => {
    expect(
      md2scrap(`
\`\`\`
function greet() {
  console.log("Hello");
}
\`\`\`
`)
    ).toBe(`
code:text
 function greet() {
   console.log("Hello");
 }
`);
  });

  test("Code block with language name", () => {
    expect(
      md2scrap(`
\`\`\`js
function greet() {
  console.log("Hello");
}
\`\`\`
`)
    ).toBe(`
code:js
 function greet() {
   console.log("Hello");
 }
`);
  });

  test("Code block with file name", () => {
    expect(
      md2scrap(`
\`\`\`js:hello.js
function greet() {
  console.log("Hello");
}
\`\`\`
`)
    ).toBe(`
code:hello.js
 function greet() {
   console.log("Hello");
 }
`);
  });

  describe("Image", () => {
    test("![alt](url title) to [url]", () => {
      expect(
        md2scrap('![alt](https://test-image-store.examle.com/test.png "title")')
      ).toBe("[https://test-image-store.examle.com/test.png]");
    });

    test("![](url title) to [url]", () => {
      expect(
        md2scrap('![](https://test-image-store.examle.com/test.png "title")')
      ).toBe("[https://test-image-store.examle.com/test.png]");
    });

    test("![alt](url) to [url]", () => {
      expect(
        md2scrap("![alt](https://test-image-store.examle.com/test.png)")
      ).toBe("[https://test-image-store.examle.com/test.png]");
    });

    test("![](url) to [url]", () => {
      expect(
        md2scrap("![](https://test-image-store.examle.com/test.png)")
      ).toBe("[https://test-image-store.examle.com/test.png]");
    });
  });

  describe("Link", () => {
    test("[text](url title) to [text url]", () => {
      expect(
        md2scrap('[text](https://test-image-store.examle.com "title")')
      ).toBe("[text https://test-image-store.examle.com]");
    });

    test("[text](url) to [text url]", () => {
      expect(md2scrap("[text](https://test-image-store.examle.com)")).toBe(
        "[text https://test-image-store.examle.com]"
      );
    });
  });
});
