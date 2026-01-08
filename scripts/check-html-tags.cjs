const fs = require('fs');
const path = require('path');

// 获取目标目录（命令行参数或默认为 Frontend/Vue）
const targetDir = process.argv[2] || path.join(__dirname, '../Frontend/Vue');

// 递归获取目录下所有 .md 文件
function getAllMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 检查单个文件
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // 分割成行
  const lines = content.split('\n');

  // 跟踪代码块状态
  let inCodeBlock = false;
  let codeBlockStart = -1;

  // 标签栈
  const tagStack = [];
  const tagPositions = [];
  const errors = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // 检查代码块标记
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockStart = lineNum;
      } else {
        inCodeBlock = false;
      }
      return;
    }
    
    // 如果在代码块中，跳过
    if (inCodeBlock) {
      return;
    }
    
    // 查找HTML标签（排除已转义的）
    const openTagRegex = /<(\w+)[^>]*>/g;
    const closeTagRegex = /<\/(\w+)>/g;
    
    let match;
    
    // 查找开标签
    while ((match = openTagRegex.exec(line)) !== null) {
      const tagName = match[1];
      // 跳过自闭合标签
      if (!['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
        tagStack.push({ tag: tagName, line: lineNum, type: 'open' });
        tagPositions.push({ tag: tagName, line: lineNum, content: line.trim() });
      }
    }
    
    // 查找闭标签
    while ((match = closeTagRegex.exec(line)) !== null) {
      const tagName = match[1];
      
      // 检查栈顶是否匹配
      if (tagStack.length === 0) {
        errors.push(`第 ${lineNum} 行：找到闭标签 </${tagName}>，但没有对应的开标签`);
        errors.push(`   内容: ${line.trim()}`);
      } else {
        const lastTag = tagStack[tagStack.length - 1];
        if (lastTag.tag.toLowerCase() === tagName.toLowerCase()) {
          tagStack.pop();
        } else {
          errors.push(`第 ${lineNum} 行：标签不匹配`);
          errors.push(`   期望: </${lastTag.tag}> (第 ${lastTag.line} 行打开)`);
          errors.push(`   实际: </${tagName}>`);
          errors.push(`   内容: ${line.trim()}`);
        }
      }
      
      tagPositions.push({ tag: tagName, line: lineNum, content: line.trim() });
    }
  });

  // 检查未闭合的标签
  if (tagStack.length > 0) {
    tagStack.forEach(item => {
      errors.push(`<${item.tag}> 在第 ${item.line} 行打开但未闭合`);
    });
  }

  return {
    hasError: errors.length > 0,
    errors: errors,
    tagPositions: tagPositions
  };
}

// 主函数
function main() {
  if (!fs.existsSync(targetDir)) {
    console.error(`❌ 目录不存在: ${targetDir}`);
    process.exit(1);
  }

  const stat = fs.statSync(targetDir);
  let filesToCheck = [];

  if (stat.isDirectory()) {
    console.log(`🔍 检查目录: ${targetDir}\n`);
    filesToCheck = getAllMarkdownFiles(targetDir);
    console.log(`📄 找到 ${filesToCheck.length} 个 Markdown 文件\n`);
  } else if (stat.isFile() && targetDir.endsWith('.md')) {
    console.log(`🔍 检查文件: ${targetDir}\n`);
    filesToCheck = [targetDir];
  } else {
    console.error(`❌ 请提供一个目录或 .md 文件`);
    process.exit(1);
  }

  let totalErrors = 0;
  const filesWithErrors = [];

  filesToCheck.forEach(filePath => {
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    const result = checkFile(filePath);

    if (result.hasError) {
      totalErrors += result.errors.length;
      filesWithErrors.push({ path: relativePath, errors: result.errors });
    }
  });

  // 输出结果
  if (filesWithErrors.length === 0) {
    console.log('✅ 所有文件的HTML标签都正确闭合！');
  } else {
    console.log(`❌ 发现 ${filesWithErrors.length} 个文件有问题：\n`);
    filesWithErrors.forEach(({ path: filePath, errors }) => {
      console.log(`📄 ${filePath}`);
      errors.forEach(error => {
        console.log(`   ${error}`);
      });
      console.log('');
    });
    process.exit(1);
  }
}

main();
