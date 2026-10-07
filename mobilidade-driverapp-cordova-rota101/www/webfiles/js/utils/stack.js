class Stack {
    static getOriginInfo(stack, stackIndex = 0, exclude = []) {
        if (!stack) return {};
        const stackLines = stack.split("\n");

        const filteredLines = stackLines.filter(
            (line) =>
                line.match(/at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/) &&
                !exclude.some((ex) => line.includes(ex))
        );

        const match = filteredLines[stackIndex]?.match(/at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/);

        let originInfo = {};
        if (match) {
            originInfo = {
                method: match[1],
                file: match[2],
                line: match[3],
                column: match[4],
            };
        }
        return originInfo;
    }
}
