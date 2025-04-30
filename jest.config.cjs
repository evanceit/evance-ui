module.exports = {
    transform: {
        "^.+\\.tsx?$": "babel-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
};
