// The following providing a kind of WGSL import system.

/// <reference types="@webgpu/types" />

export type WGSLModuleConfig = {
    label?: string;
    imports?: WGSLModule[];
    code: WGSLCode;
}

export class WGSLModule {
    readonly label: string;
    private imports: WGSLModule[] = [];
    private code: WGSLCode;
    symbols = new Set<string>();

    constructor(cfg: WGSLModuleConfig) {
        if (cfg.imports) {
            this.imports.push(...cfg.imports);
        }
        this.label = cfg.label ?? "<unnamed>";
        this.code = cfg.code;

        for (const token of this.code.tokens) {
            if (token instanceof WGSLName) {
                if (this.symbols.has(token.name)) {
                    throw new Error("duplicate symbol");
                }
                this.symbols.add(token.name);
            } else if (token instanceof WGSLRef) {
                if (!token.mod.symbols.has(token.name)) {
                    throw new Error(`reference to unknown symbol "${token.name}" in module "${token.mod.label}" from module "${this.label}"`);
                }
                this.imports.push(token.mod);
            }
        }
    }

    // Create a reference to a symbol this module "exports".
    ref(name: string) {
        return new WGSLRef(this, name);
    }

    private importOrder(): WGSLModule[] {
        const ordered: WGSLModule[] = [];
        const imported = new Set<WGSLModule>();
        const next = (mod: WGSLModule, seen: Set<WGSLModule>) => {
            seen.add(mod);
            for (const imp of mod.imports) {
                if (seen.has(imp)) { throw new Error("import cycle"); }
                if (!imported.has(imp)) {
                    next(imp, seen);
                }
            }
            imported.add(mod);
            ordered.push(mod);
            seen.delete(mod);
        }

        next(this, new Set());
        return ordered;
    }

    // Create a text representation of the code of this module only.
    private render(imports: Map<WGSLModule, string>): string {
        const prefix = imports.get(this);
        if (prefix === undefined) {
            throw new Error(`internal: module "${this.label}" is imported but has no prefix`);
        }

        let s = '';
        for (const token of this.code.tokens) {
            if (token instanceof WGSLName) {
                s += prefix + token.name;
            } else if (token instanceof WGSLRef) {
                const refPrefix = imports.get(token.mod);
                if (refPrefix === undefined) {
                    throw new Error("module not found");
                }
                s += refPrefix + token.name;
            } else {
                s += token;
            }
        }

        s = stripExtraIndent(s);
        s = `\n// -------- Module: ${this.label} --------\n` + s;
        return s;
    }

    // Render the code of this module with all its dependencies.
    private generate(): string {
        const mods = this.importOrder();
        const imports = new Map<WGSLModule, string>();
        for (const [idx, mod] of mods.entries()) {
            imports.set(mod, `m${idx}_`);
        }

        const textMods = [];
        for (const mod of mods) {
            textMods.push(mod.render(imports));
        }
        const s = textMods.join("\n");
        console.groupCollapsed(`Generated shader code "${this.label}"`);
        console.log(s);
        console.groupEnd();
        return textMods.join("\n");
    }

    toDesc(): GPUShaderModuleDescriptorWGSL {
        return {
            label: this.label,
            code: this.generate(),
            // sourceMap
            // hint
        }
    }
}

export class WGSLName {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

export class WGSLRef {
    mod: WGSLModule;
    name: string;
    constructor(mod: WGSLModule, name: string) {
        this.mod = mod;
        this.name = name;
    }
}

export type WGSLToken = string | WGSLName | WGSLRef;

// https://gpuweb.github.io/gpuweb/wgsl/#identifiers
const markersRE = /@@(([a-zA-Z_][0-9a-zA-Z][0-9a-zA-Z_]*)|([a-zA-Z][0-9a-zA-Z_]*))/g;

// WGSLCode holds a snippet of code, without parsing.
// This is used to allow mixing actual text representation of WGSL but also
// Javascript references to other module - that are interpretated differently
// when "rendering" the WGSL code.
export class WGSLCode {
    readonly tokens: WGSLToken[];
    constructor(tokens: WGSLToken[]) {
        this.tokens = [...tokens];
    }
}

// Declare WGSLCode using template strings.
export function wgsl(strings: TemplateStringsArray, ...keys: (WGSLToken | WGSLCode | WGSLCode[])[]) {
    const tokens = [...wgslSplit(strings[0])];
    for (let i = 1; i < strings.length; i++) {
        const token = keys[i - 1];
        if (Array.isArray(token)) {
            for (const subtoken of token) {
                tokens.push(...subtoken.tokens);
            }
        } else if (token instanceof WGSLCode) {
            tokens.push(...token.tokens);
        } else if (typeof token === "string") {
            tokens.push(...wgslSplit(token));
        } else {
            tokens.push(token);
        }
        tokens.push(...wgslSplit(strings[i]));
    }

    return new WGSLCode(tokens);
}

function wgslSplit(s: string): WGSLToken[] {
    const tokens: WGSLToken[] = [];
    let prevIndex = 0;
    for (const m of s.matchAll(markersRE)) {
        if (m.index === undefined) { throw new Error("oops") }
        if (m.index > prevIndex) {
            tokens.push(s.slice(prevIndex, m.index));
        }
        prevIndex = m.index + m[0].length;
        tokens.push(new WGSLName(m[1]));
    }
    if (prevIndex < s.length) {
        tokens.push(s.slice(prevIndex, s.length));
    }
    return tokens;
}

// Find if there is a common indentation on all lines (spaces, tabs) and remove
// it.
// Lines with only spaces and tabs are ignored.
// Also removes trailing spaces.
function stripExtraIndent(s: string): string {
    const lines = s.split("\n");
    let prefix: string | null = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trimEnd();
        lines[i] = line;
        if (line.length > 0) {
            if (prefix === null) {
                prefix = line.match(/^[ \t]*/)![0];
            } else {
                let idx = 0;
                while (idx < prefix.length && idx < line.length && line[idx] == prefix[idx]) {
                    idx++;
                }
                prefix = prefix.slice(0, idx);
            }
        }
    }
    if (prefix !== null) {
        for (let i = 0; i < lines.length; i++) {
            if (lines.length == 0) {
                continue
            }
            lines[i] = lines[i].slice(prefix.length);
        }
    }
    return lines.join("\n");
}

function testWGSLModules() {
    console.group("testWGSL");
    console.log("tagged template 1", wgsl``);
    console.log("tagged template 2", wgsl`a`);
    console.log("tagged template 3", wgsl`${"plop"}`);
    console.log("tagged template 4", wgsl`foo @@bar plop`);

    const testModule1 = new WGSLModule({
        label: "test1",
        code: wgsl`
            foo
            coin @@bar plop
        `,
    });

    const testModule2 = new WGSLModule({
        label: "test2",
        code: wgsl`
            foo ${testModule1.ref("bar")}
        `,
    });

    console.log("render1", testModule2.toDesc().code);
    console.groupEnd();
}
