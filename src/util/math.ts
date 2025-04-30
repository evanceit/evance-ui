/**
 * # `mathEval()`
 *
 * Basic mathematical string expression evaluation.
 *
 * This avoids unsafe use of `eval()` and supports basic math expressions such as:
 *
 * * 2 + 3 * 4
 * * -(3 + 2)
 * * 3 + (-4 * 2)
 * * ((1600 - (3 * 32)) / 4)
 * * 1 + -2
 * * 10*1.2
 *
 * @param expression
 */
export function mathEval(expression: string): number | null {
    const ops: Record<
        string,
        {
            precedence: number;
            associativity: "left" | "right";
            fn: (a: number, b: number) => number;
        }
    > = {
        "+": { precedence: 1, associativity: "left", fn: (a, b) => a + b },
        "-": { precedence: 1, associativity: "left", fn: (a, b) => a - b },
        "*": { precedence: 2, associativity: "left", fn: (a, b) => a * b },
        "/": { precedence: 2, associativity: "left", fn: (a, b) => a / b },
    };

    const output: (number | string)[] = [];
    const operators: string[] = [];
    const tokens: string[] = [];

    // Tokenize manually to handle negative numbers
    const regex = /\d+(\.\d+)?|[()+\-*/]/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(expression.replace(/\s+/g, "")))) {
        tokens.push(match[0]);
    }

    if (!tokens.length) {
        return null;
    }

    let prevToken: string | undefined;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // Handle unary minus by converting to (0 - number)
        if (
            token === "-" &&
            (i === 0 || (prevToken && (prevToken in ops || prevToken === "(")))
        ) {
            const next = tokens[i + 1];
            if (next && /^\d+(\.\d+)?$/.test(next)) {
                output.push(0);
                output.push(Number(next));
                output.push("-");
                i++; // Skip the number token
                prevToken = next;
                continue;
            } else if (next === "(") {
                // Support unary minus before parentheses: `-(3 + 2)`
                output.push(0);
                operators.push("-");
                continue;
            }
        }

        if (/^\d+(\.\d+)?$/.test(token)) {
            output.push(Number(token));
        } else if (token in ops) {
            while (
                operators.length &&
                operators[operators.length - 1] in ops &&
                ((ops[token].associativity === "left" &&
                    ops[token].precedence <=
                        ops[operators[operators.length - 1]].precedence) ||
                    (ops[token].associativity === "right" &&
                        ops[token].precedence <
                            ops[operators[operators.length - 1]].precedence))
            ) {
                output.push(operators.pop()!);
            }
            operators.push(token);
        } else if (token === "(") {
            operators.push(token);
        } else if (token === ")") {
            while (
                operators.length &&
                operators[operators.length - 1] !== "("
            ) {
                output.push(operators.pop()!);
            }
            if (operators[operators.length - 1] === "(") {
                operators.pop();
            } else {
                return null; // mismatched parentheses
            }
        } else {
            return null; // invalid token
        }

        prevToken = token;
    }

    while (operators.length) {
        const op = operators.pop()!;
        if (op === "(" || op === ")") {
            return null;
        }
        output.push(op);
    }

    const stack: number[] = [];
    for (const token of output) {
        if (typeof token === "number") {
            stack.push(token);
        } else if (token in ops) {
            const b = stack.pop();
            const a = stack.pop();
            if (a === undefined || b === undefined) return null;
            stack.push(ops[token].fn(a, b));
        }
    }

    return stack.length === 1 ? stack[0] : null;
}
