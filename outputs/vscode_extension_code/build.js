const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const esbuild = require('esbuild');

function incrementVersion() {
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const versionParts = packageJson.version.split('.');
    versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
    packageJson.version = versionParts.join('.');
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`Version incremented to ${packageJson.version}`);
    
    return packageJson.version;
}

function runTypeCheckAndLint() {
    console.log('Running type checking...');
    try {
        // Prefer local TypeScript to avoid npx restrictions in some environments
        try {
            execSync('node ./node_modules/typescript/bin/tsc --noEmit', { stdio: 'inherit', cwd: __dirname });
        } catch (_) {
            execSync('npx -y typescript@4.9.4 tsc --noEmit', { stdio: 'inherit', cwd: __dirname });
        }
        console.log('Type checking passed');
    } catch (error) {
        console.error('Type checking failed');
        process.exit(1);
    }
    
    console.log('Running linting...');
    try {
        execSync('npm run lint', { stdio: 'inherit', cwd: __dirname });
        console.log('Linting passed');
    } catch (error) {
        console.error('Linting failed');
        process.exit(1);
    }
}

function bundleExtension() {
    console.log('Bundling extension...');
    return esbuild.build({
        entryPoints: [path.join(__dirname, 'src/extension.ts')],
        bundle: true,
        outfile: path.join(__dirname, 'out/extension.js'),
        external: ['vscode'],
        format: 'cjs',
        platform: 'node',
        target: 'node16',
        minify: true,
        sourcemap: true,
        absWorkingDir: __dirname
    });
}

function createVSIX(version) {
    console.log('Creating VSIX package...');
    try {
        // Prefer local vsce to avoid npx restrictions; fallback to npx
        try {
            execSync('node ./node_modules/@vscode/vsce/vsce package', { stdio: 'inherit', cwd: __dirname, env: { ...process.env, SKIP_VSCODE_PREPUBLISH: '1' } });
        } catch (_) {
            execSync('npx @vscode/vsce package', { stdio: 'inherit', cwd: __dirname, env: { ...process.env, SKIP_VSCODE_PREPUBLISH: '1' } });
        }

        const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
        const vsixName = `${pkg.name}-${version}.vsix`;
        const src = path.join(__dirname, vsixName);
        const repoRoot = path.join(__dirname, '..', '..');
        const dest = path.join(repoRoot, vsixName);

        // Move VSIX to repo root
        if (fs.existsSync(src)) {
            if (fs.existsSync(dest)) fs.unlinkSync(dest);
            fs.renameSync(src, dest);
            console.log(`VSIX moved to repo root: ${vsixName}`);
        } else if (fs.existsSync(dest)) {
            console.log(`VSIX already present at repo root: ${vsixName}`);
        } else {
            throw new Error(`VSIX not found at ${src} or ${dest}`);
        }

        return vsixName;
    } catch (error) {
        console.error('Failed to create VSIX package');
        process.exit(1);
    }
}

function updateReadme(version, vsixName) {
    console.log('Updating README.md...');
    const readmePath = path.join(__dirname, '..', '..', 'README.md');
    
    if (fs.existsSync(readmePath)) {
        let readmeContent = fs.readFileSync(readmePath, 'utf8');
        const buildLineRegex = /\*\*Latest Build:\*\* \[Project Explorer [^\]]+\]\([^)]+\)/;
        const newBuildLine = `**Latest Build:** [Project Explorer ${version}](./${vsixName})`;
        
        if (buildLineRegex.test(readmeContent)) {
            readmeContent = readmeContent.replace(buildLineRegex, newBuildLine);
        } else {
            // Add build line after the title
            readmeContent = readmeContent.replace(
                /^# Project Explorer\s*$/m,
                `# Project Explorer\n\n${newBuildLine}`
            );
        }
        
        fs.writeFileSync(readmePath, readmeContent);
        console.log('README.md updated');
    }
}

function removeOldVSIX(currentVersion) {
    console.log('Removing old VSIX packages...');
    const extDir = __dirname;
    const repoRoot = path.join(__dirname, '..', '..');

    const cleanDir = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (file.endsWith('.vsix')) {
                if (!file.includes(currentVersion)) {
                    fs.unlinkSync(path.join(dir, file));
                    console.log(`Removed old VSIX from ${dir}: ${file}`);
                }
            }
        });
    };

    cleanDir(extDir);
    cleanDir(repoRoot);
}

async function main() {
    try {
        const version = incrementVersion();
        runTypeCheckAndLint();
        await bundleExtension();
        const vsixName = createVSIX(version);
        updateReadme(version, vsixName);
        removeOldVSIX(version);
        
        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

main();