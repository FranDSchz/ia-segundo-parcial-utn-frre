const assert = require("assert");
const path = require("path");

const MacheteView = require(path.join(__dirname, "..", "docs", "machete_view.js"));

const methods = MacheteView.MACHETE_METHODS;
assert.strictEqual(methods.length, 8, "Should have 8 method cards (7 P2 + 1 Hopfield complement)");

let totalExamples = 0;
let totalSteps = 0;
let visualCount = 0;

methods.forEach((m) => {
  assert.ok(m.id && m.title && m.subtitle, `Missing header fields in ${m.id}`);
  assert.ok(m.svgDiagram && m.svgDiagram.includes("<svg") && m.svgDiagram.includes("</svg>"), `Missing SVG diagram in ${m.id}`);
  assert.ok(Array.isArray(m.coreSteps) && m.coreSteps.length >= 3, `Missing coreSteps in ${m.id}`);
  assert.ok(Array.isArray(m.variants) && m.variants.length >= 1, `Missing variants in ${m.id}`);
  assert.ok(Array.isArray(m.traps) && m.traps.length >= 1, `Missing traps in ${m.id}`);
  assert.ok(Array.isArray(m.examples) && m.examples.length >= 1, `Missing examples in ${m.id}`);
  totalExamples += m.examples.length;

  const allStrings = [
    m.subtitle,
    ...m.coreSteps,
    ...m.variants.flatMap((v) => [v.name, v.formula, v.detail]),
    ...m.traps
  ];

  m.examples.forEach((ex) => {
    assert.ok(ex.problemHtml && ex.conclusionHtml, `Missing problemHtml/conclusionHtml in ${ex.id}`);
    assert.ok(Array.isArray(ex.steps) && ex.steps.length >= 3, `Example ${ex.id} must have >= 3 progressive steps`);
    totalSteps += ex.steps.length;
    allStrings.push(ex.title, ex.problemHtml, ex.conclusionHtml);
    if (ex.steps.some((s) => Boolean(s.visualHtml))) {
      visualCount += 1;
    }
    ex.steps.forEach((s, i) => {
      assert.ok(s.title && s.paperComment && s.mathHtml && s.note, `Incomplete step ${i + 1} in ${ex.id}`);
      allStrings.push(s.title, s.paperComment, s.mathHtml, s.note);
    });
  });

  allStrings.forEach((s) => {
    const str = String(s || "");
    assert.ok(!str.includes("NaN") && !str.includes("undefined"), `Found NaN/undefined in ${m.id}`);
    const strippedDouble = str.replace(/\$\$/g, "");
    const singleCount = (strippedDouble.match(/(?<!\\)\$/g) || []).length;
    assert.strictEqual(singleCount % 2, 0, `Unbalanced $ KaTeX delimiter in ${m.id}: ${str.slice(0, 80)}`);
  });
});

assert.ok(totalExamples >= 16, `Expected >= 16 worked examples, got ${totalExamples}`);
assert.ok(totalSteps >= 48, `Expected >= 48 progressive steps across examples, got ${totalSteps}`);
assert.ok(visualCount >= 12, `Expected >= 12 examples with custom visual diagrams/charts, got ${visualCount}`);

const p2Only = MacheteView.filterMacheteMethods("", "P2_ONLY");
assert.strictEqual(p2Only.length, 7, "P2_ONLY should exclude Hopfield complement");
assert.ok(!p2Only.some((m) => m.id === "HOPFIELD"));

const allList = MacheteView.filterMacheteMethods("", "ALL");
assert.strictEqual(allList.length, 8);

assert.ok(MacheteView.filterMacheteMethods("laplace", "ALL").some((m) => m.id === "NAIVE_BAYES"));
assert.ok(MacheteView.filterMacheteMethods("complemento", "ALL").some((m) => m.id === "AG"));
assert.ok(MacheteView.filterMacheteMethods("ranking", "ALL").some((m) => m.id === "AG"));
assert.ok(MacheteView.filterMacheteMethods("upgma", "ALL").some((m) => m.id === "CLUSTERING"));
assert.ok(MacheteView.filterMacheteMethods("recta", "ALL").some((m) => m.id === "PERCEPTRON"));
assert.ok(MacheteView.filterMacheteMethods("loocv", "ALL").some((m) => m.id === "KNN"));
assert.ok(MacheteView.filterMacheteMethods("overfitting", "ALL").some((m) => m.id === "MLP"));

console.log(`ALL MACHETE VIEW TESTS PASSED! (${methods.length} methods, ${totalExamples} examples, ${totalSteps} progressive steps, ${visualCount} visual diagrams)`);
