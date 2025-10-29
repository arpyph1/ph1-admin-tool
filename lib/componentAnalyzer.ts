import * as fs from 'fs';
import * as path from 'path';

export interface ComponentInfo {
  filePath: string;
  componentName: string;
  content: string;
  imports: string[];
  exports: string[];
  props: string[];
  styling: {
    classes: string[];
    inlineStyles: any[];
  };
  structure: {
    sections: string[];
    headings: string[];
    text: string[];
  };
}

export interface ModificationPlan {
  type: 'content' | 'styling' | 'structure' | 'props';
  target: string;
  originalValue: string;
  newValue: string;
  reasoning: string;
}

export class ComponentAnalyzer {
  private projectRoot: string;
  
  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  async analyzeComponent(componentPath: string): Promise<ComponentInfo> {
    const fullPath = path.join(this.projectRoot, componentPath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Component not found: ${componentPath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    
    return {
      filePath: componentPath,
      componentName: this.extractComponentName(content),
      content,
      imports: this.extractImports(content),
      exports: this.extractExports(content),
      props: this.extractProps(content),
      styling: this.extractStyling(content),
      structure: this.extractStructure(content)
    };
  }

  async analyzeAllPages(): Promise<ComponentInfo[]> {
    const pagesDir = path.join(this.projectRoot, 'app');
    const components: ComponentInfo[] = [];
    
    // Analyze main pages
    const pageFiles = [
      'app/page.tsx',           // Homepage
      'app/admin/page.tsx',     // Admin
      'components/AdminDashboard.tsx'
    ];

    for (const pageFile of pageFiles) {
      if (fs.existsSync(path.join(this.projectRoot, pageFile))) {
        try {
          const info = await this.analyzeComponent(pageFile);
          components.push(info);
        } catch (error) {
          console.error(`Failed to analyze ${pageFile}:`, error);
        }
      }
    }

    return components;
  }

  private extractComponentName(content: string): string {
    // Extract component name from export default or function declaration
    const exportMatch = content.match(/export default function (\w+)/);
    if (exportMatch) return exportMatch[1];
    
    const funcMatch = content.match(/function (\w+)\(/);
    if (funcMatch) return funcMatch[1];
    
    const constMatch = content.match(/const (\w+).*=/);
    if (constMatch) return constMatch[1];
    
    return 'UnknownComponent';
  }

  private extractImports(content: string): string[] {
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    const imports: string[] = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  private extractExports(content: string): string[] {
    const exportRegex = /export\s+(?:default\s+)?(\w+)/g;
    const exports: string[] = [];
    let match;
    
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }

  private extractProps(content: string): string[] {
    // Extract props from interface or function parameters
    const interfaceMatch = content.match(/interface\s+\w+Props\s*{([^}]+)}/);
    if (interfaceMatch) {
      return interfaceMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('//'))
        .map(line => line.split(':')[0].trim().replace('?', ''));
    }
    
    return [];
  }

  private extractStyling(content: string): { classes: string[], inlineStyles: any[] } {
    // Extract Tailwind classes
    const classRegex = /className\s*=\s*["']([^"']+)["']/g;
    const classes: string[] = [];
    let match;
    
    while ((match = classRegex.exec(content)) !== null) {
      classes.push(...match[1].split(' ').filter(cls => cls.trim()));
    }
    
    // Extract inline styles
    const styleRegex = /style\s*=\s*\{([^}]+)\}/g;
    const inlineStyles: any[] = [];
    
    while ((match = styleRegex.exec(content)) !== null) {
      try {
        // This is a simplified extraction - would need more sophisticated parsing
        inlineStyles.push(match[1]);
      } catch (error) {
        // Skip invalid style objects
      }
    }
    
    return { classes: [...new Set(classes)], inlineStyles };
  }

  private extractStructure(content: string): { sections: string[], headings: string[], text: string[] } {
    // Extract JSX structure elements
    const headingRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g;
    const textRegex = /<p[^>]*>([^<]+)<\/p>/g;
    const sectionRegex = /<(section|div|main|article)[^>]*>/g;
    
    const headings: string[] = [];
    const text: string[] = [];
    const sections: string[] = [];
    
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(match[1].trim());
    }
    
    while ((match = textRegex.exec(content)) !== null) {
      text.push(match[1].trim());
    }
    
    while ((match = sectionRegex.exec(content)) !== null) {
      sections.push(match[1]);
    }
    
    return { sections, headings, text };
  }

  async generateModificationPlan(
    component: ComponentInfo, 
    prompt: string,
    operation: 'revise' | 'global'
  ): Promise<ModificationPlan[]> {
    // This would integrate with OpenAI to analyze the component and generate a modification plan
    // For now, return a mock plan
    
    const plans: ModificationPlan[] = [];
    
    // Example modification based on prompt analysis
    if (prompt.toLowerCase().includes('enterprise')) {
      plans.push({
        type: 'content',
        target: 'heading',
        originalValue: component.structure.headings[0] || '',
        newValue: 'Enterprise-Grade Solutions for Fortune 500 Companies',
        reasoning: 'Updated heading to emphasize enterprise focus'
      });
    }
    
    if (prompt.toLowerCase().includes('roi')) {
      plans.push({
        type: 'content',
        target: 'cta',
        originalValue: 'Get Started',
        newValue: 'Calculate Your ROI',
        reasoning: 'Updated CTA to emphasize measurable outcomes'
      });
    }
    
    return plans;
  }

  async applyModifications(
    component: ComponentInfo, 
    modifications: ModificationPlan[]
  ): Promise<string> {
    let modifiedContent = component.content;
    
    for (const mod of modifications) {
      switch (mod.type) {
        case 'content':
          // Replace text content while preserving JSX structure
          modifiedContent = modifiedContent.replace(
            new RegExp(this.escapeRegExp(mod.originalValue), 'g'),
            mod.newValue
          );
          break;
          
        case 'styling':
          // Modify CSS classes or styles
          // Implementation would depend on the specific styling changes needed
          break;
          
        case 'structure':
          // Modify JSX structure
          // Implementation would require AST parsing and modification
          break;
      }
    }
    
    return modifiedContent;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async saveComponent(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.projectRoot, filePath);
    const backupPath = `${fullPath}.backup.${Date.now()}`;
    
    // Create backup
    if (fs.existsSync(fullPath)) {
      fs.copyFileSync(fullPath, backupPath);
    }
    
    // Save new content
    fs.writeFileSync(fullPath, content, 'utf-8');
  }

  async getBackups(filePath: string): Promise<string[]> {
    const fullPath = path.join(this.projectRoot, filePath);
    const dir = path.dirname(fullPath);
    const basename = path.basename(fullPath);
    
    const files = fs.readdirSync(dir);
    return files
      .filter(file => file.startsWith(`${basename}.backup.`))
      .sort()
      .reverse(); // Most recent first
  }

  async restoreBackup(filePath: string, backupFileName: string): Promise<void> {
    const fullPath = path.join(this.projectRoot, filePath);
    const backupPath = path.join(path.dirname(fullPath), backupFileName);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${backupFileName}`);
    }
    
    fs.copyFileSync(backupPath, fullPath);
  }
}

export const componentAnalyzer = new ComponentAnalyzer();
