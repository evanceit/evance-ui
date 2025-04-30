import { expect, test } from "@jest/globals";
import { mathEval } from "@/util";

test.each([
    ["2 + 3 * 4", 14],
    ["-(3 + 2)", -5],
    ["3 + (-4 * 2)", -5],
    ["((1600 - (3 * 32)) / 4)", 376],
    ["1 + -2", -1],
    ["-3", -3],
    ["(-3)", -3],
    ["10*1.2", 12],
])("mathEval('%s') === %d", (expression, expected) => {
    expect(mathEval(expression)).toBe(expected);
});
