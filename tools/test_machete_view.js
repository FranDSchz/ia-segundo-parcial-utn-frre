const assert = require("assert");
const path = require("path");

const MacheteView = require(path.join(__dirname, "..", "docs", "machete_view.js"));

const methods = MacheteView.MACHETE_METHODS;
assert.strictEqual(methods.length, 8, "Should have 8 method cards (7 P2 + 1 Hopfield complement)");

let totalExamples = 0;
methods.forEach((m) => {
  assert.ok(m.id && m.title && m.subtitle, `Missing header fields in ${m.id}`);
  assert.ok(m.svgDiagram && m.svgDiagram.includes("<svg") && m.svgDiagram.includes("</svg>"), `Missing SVG diagram in ${m.id}`);
  assert.ok(Array.isArray(m.coreSteps) && m.coreSteps.length >= 3, `Missing coreSteps in ${m.id}`);
  assert.ok(Array.isArray(m.variants) && m.variants.length >= 1, `Missing variants in ${m.id}`);
  assert.ok(Array.isArray(m.traps) && m.traps.length >= 1, `Missing traps in ${m.id}`);
  assert.ok(Array.isArray(m.examples) && m.examples.length >= 1, `Missing examples in ${m.id}`);
  totalExamples += m.examples.length;

  // Verify no NaN / undefined and balanced $ KaTeX delimiters in every string
  const allStrings = [
    m.subtitle,
    ...m.coreSteps,
    ...m.variants.flatMap((v) => [v.name, v.formula, v.detail]),
    ...m.traps,
    ...m.examples.flatMap((ex) => [ex.title, ex.bodyHtml])
  ];
  allStrings.forEach((s) => {
    const str = String(s || "");
    assert.ok(!str.includes("NaN") && !str.includes("undefined"), `Found NaN/undefined in ${m.id}`);
    // Count unescaped single $ markers (after removing $$ pairs)
    const strippedDouble = str.replace(/\$\$/g, "");
    const singleCount = (strippedDouble.match(/(?<!\\)\$/g) || []).length;
    assert.strictEqual(singleCount % 2, 0, `Unbalanced $ KaTeX delimiter in ${m.id}: ${str.slice(0, 80)}`);
  });
});

assert.ok(totalExamples >= 16, `Expected >= 16 worked examples, got ${totalExamples}`);

// Verify P2 filter vs ALL filter
const p2Only = MacheteView.filterMacheteMethods("", "P2_ONLY");
assert.strictEqual(p2Only.length, 7, "P2_ONLY should exclude Hopfield complement");
assert.ok(!p2Only.some((m) => m.id === "HOPFIELD"));

const allList = MacheteView.filterMacheteMethods("", "ALL");
assert.strictEqual(allList.length, 8);

// Verify keyword searches across variants & formulas
assert.ok(MacheteView.filterMacheteMethods("laplace", "ALL").some((m) => m.id === "NAIVE_BAYES"));
assert.ok(MacheteView.filterMacheteMethods("complemento", "ALL").some((m) => m.id === "AG"));
assert.ok(MacheteView.filterMacheteMethods("ranking", "ALL").some((m) => m.id === "AG"));
assert.ok(MacheteView.filterMacheteMethods("upgma", "ALL").some((m) => m.id === "CLUSTERING"));
assert.ok(MacheteView.filterMacheteMethods("recta", "ALL").some((m) => m.id === "PERCEPTRON"));
assert.ok(MacheteView.filterMacheteMethods("loocv", "ALL").some((m) => m.id === "KNN"));

console.log(`ALL MACHETE VIEW TESTS PASSED! (${methods.length} methods, ${totalExamples} worked examples)`);
