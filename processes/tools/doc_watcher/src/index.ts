import * as fs from "fs";
import * as path from "path";
import * as chokidar from "chokidar";

interface DocInfo {
  title: string;
  firstParagraph: string;
  path: string;
}

interface TreeItem {
  name: string;
  path: string;
  type: "doc" | "directory" | "file";
  docInfo?: DocInfo;
  children: TreeItem[];
}

class DocWatcher {
  private readonly designDocsPath: string;
  private readonly agentsPath: string;
  private readonly rootPath: string;

  constructor() {
    this.rootPath = path.resolve(__dirname, "../../../..");
    this.designDocsPath = path.join(this.rootPath, "design_docs");
    this.agentsPath = path.join(this.rootPath, "AGENTS.md");
  }

  private parseDocContent(filePath: string): DocInfo {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");

      let title = "";
      let firstParagraph = "";
      let foundTitle = false;
      let foundFirstParagraph = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Look for title (first # header)
        if (!foundTitle && line.startsWith("# ")) {
          title = line.substring(2).trim();
          foundTitle = true;
          continue;
        }

        // Look for first paragraph after title
        if (
          foundTitle &&
          !foundFirstParagraph &&
          line.length > 0 &&
          !line.startsWith("#")
        ) {
          firstParagraph = line;
          foundFirstParagraph = true;
          break;
        }
      }

      // If no title found, use filename
      if (!title) {
        title = path
          .basename(filePath, ".md")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
      }

      const relativePath = path
        .relative(this.rootPath, filePath)
        .replace(/\\/g, "/");

      return {
        title,
        firstParagraph,
        path: `/${relativePath}`,
      };
    } catch (error) {
      console.error(`Error parsing doc ${filePath}:`, error);
      const relativePath = path
        .relative(this.rootPath, filePath)
        .replace(/\\/g, "/");
      return {
        title: path
          .basename(filePath, ".md")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        firstParagraph: "",
        path: `/${relativePath}`,
      };
    }
  }

  private buildTree(dirPath: string): TreeItem[] {
    const items: TreeItem[] = [];

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path
          .relative(this.rootPath, fullPath)
          .replace(/\\/g, "/");

        if (entry.isDirectory()) {
          // Check if directory has a doc with the same name
          const docPath = path.join(fullPath, `${entry.name}.md`);
          const hasMatchingDoc = fs.existsSync(docPath);

          if (hasMatchingDoc) {
            // Use doc entry instead of directory entry
            const docInfo = this.parseDocContent(docPath);
            const children = this.buildTree(fullPath).filter(
              (child) => !child.path.endsWith(`/${entry.name}.md`),
            );

            items.push({
              name: docInfo.title,
              path: `/${relativePath}`,
              type: "doc",
              docInfo,
              children,
            });
          } else {
            // Regular directory entry
            const children = this.buildTree(fullPath);
            if (children.length > 0) {
              // Only include directories with content
              items.push({
                name: `${entry.name}/`,
                path: `/${relativePath}/`,
                type: "directory",
                children,
              });
            }
          }
        } else if (entry.name.endsWith(".md")) {
          // Skip if this is a doc that matches its parent directory name
          const parentDir = path.basename(dirPath);
          const docName = path.basename(entry.name, ".md");

          // Also skip the root project_explorer.md as it's handled separately
          if (docName !== parentDir && entry.name !== "project_explorer.md") {
            const docInfo = this.parseDocContent(fullPath);
            items.push({
              name: docInfo.title,
              path: `/${relativePath}`,
              type: "doc",
              docInfo,
              children: [],
            });
          }
        } else {
          // Other files (images, etc.)
          items.push({
            name: entry.name,
            path: `/${relativePath}`,
            type: "file",
            children: [],
          });
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }

    return items.sort((a, b) => {
      // Sort: docs first, then directories, then files
      if (a.type !== b.type) {
        const order = { doc: 0, directory: 1, file: 2 };
        return order[a.type] - order[b.type];
      }
      return a.name.localeCompare(b.name);
    });
  }

  private generateIndexContent(): string {
    const tree = this.buildTree(this.designDocsPath);

    // Find the root doc (project_explorer.md)
    const rootDocPath = path.join(this.designDocsPath, "project_explorer.md");
    let rootDocInfo: DocInfo | null = null;

    if (fs.existsSync(rootDocPath)) {
      rootDocInfo = this.parseDocContent(rootDocPath);
    }

    let content =
      "Below is an overview of the design docs for this project. Please refer to these docs when writing code or planning features. If you're spec-ing out a new feature, please put it in the appropriate doc or create a new doc if one doesn't exist, also please check any docs that might reference or need to reference your new feature, and update those docs as well.\n\n";

    // Add root doc paragraph
    if (rootDocInfo) {
      content += `**[${rootDocInfo.title}](${rootDocInfo.path})**`;
      if (rootDocInfo.firstParagraph) {
        content += `: ${rootDocInfo.firstParagraph}`;
      }
      content += "\n\n";
    }

    // Add bulleted list
    content += this.generateBulletList(tree, 0);

    return content;
  }

  private generateBulletList(items: TreeItem[], depth: number): string {
    let content = "";
    const indent = "  ".repeat(depth);

    for (const item of items) {
      if (item.type === "doc" && item.docInfo) {
        content += `${indent}- **[${item.name}](${item.docInfo.path})**`;
        if (item.docInfo.firstParagraph) {
          content += `: ${item.docInfo.firstParagraph}`;
        }
        content += "\n";
      } else if (item.type === "directory") {
        content += `${indent}- **[${item.name}](${item.path})**\n`;
      } else if (item.type === "file") {
        content += `${indent}- **[${item.name}](${item.path})**\n`;
      }

      if (item.children.length > 0) {
        content += this.generateBulletList(item.children, depth + 1);
      }
    }

    return content;
  }

  private updateAgentsFile(indexContent: string): void {
    try {
      let agentsContent = fs.readFileSync(this.agentsPath, "utf-8");

      // Find the Design Docs Overview section
      const sectionStart = "## Design Docs Overview";
      const startIndex = agentsContent.indexOf(sectionStart);

      if (startIndex === -1) {
        // Add the section at the end
        agentsContent += `\n\n${sectionStart}\n\n${indexContent}`;
      } else {
        // Find the next section or end of file
        const afterSection = agentsContent.substring(
          startIndex + sectionStart.length,
        );
        const nextSectionMatch = afterSection.match(/\n## /);

        if (nextSectionMatch) {
          const nextSectionIndex =
            startIndex + sectionStart.length + nextSectionMatch.index!;
          agentsContent =
            agentsContent.substring(0, startIndex) +
            `${sectionStart}\n\n${indexContent}\n` +
            agentsContent.substring(nextSectionIndex);
        } else {
          // Replace to end of file
          agentsContent =
            agentsContent.substring(0, startIndex) +
            `${sectionStart}\n\n${indexContent}`;
        }
      }

      fs.writeFileSync(this.agentsPath, agentsContent);
      console.log("Updated AGENTS.md with new design docs index");
    } catch (error) {
      console.error("Error updating AGENTS.md:", error);
    }
  }

  private generateIndex(): void {
    console.log("Generating design docs index...");
    const indexContent = this.generateIndexContent();
    this.updateAgentsFile(indexContent);
  }

  public start(): void {
    console.log("Starting doc watcher...");
    console.log(`Watching: ${this.designDocsPath}`);

    // Generate initial index
    this.generateIndex();

    // Watch for changes
    const watcher = chokidar.watch(this.designDocsPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
    });

    watcher
      .on("add", (path) => {
        if (path.endsWith(".md")) {
          console.log(`Doc added: ${path}`);
          this.generateIndex();
        }
      })
      .on("change", (path) => {
        if (path.endsWith(".md")) {
          console.log(`Doc changed: ${path}`);
          this.generateIndex();
        }
      })
      .on("unlink", (path) => {
        if (path.endsWith(".md")) {
          console.log(`Doc removed: ${path}`);
          this.generateIndex();
        }
      })
      .on("ready", () => {
        console.log("Doc watcher is ready and watching for changes...");
      });
  }
}

// Start the watcher
const watcher = new DocWatcher();
watcher.start();
