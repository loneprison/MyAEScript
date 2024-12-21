const fs = require('fs');
const path = require('path');

// 文件夹路径
const folderPath = './src/utils'; // 请根据实际情况修改路径
const outputFileName = 'index.ts'; // 输出文件名

// 读取文件内容并判断默认导出形式
function analyzeExportDefault(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const defaultExportRegex = /export\s+default\s+{([^}]+)}/;

  const match = fileContent.match(defaultExportRegex);
  if (match) {
    // 提取对象中导出的键名
    const properties = match[1]
      .split(',')
      .map(prop => prop.trim())
      .filter(Boolean);
    return properties;
  }
  return null; // 没有导出对象
}

// 获取所有 .tsx 文件
function getTSXFiles(dir) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.tsx') && file !== outputFileName)
    .map(file => ({
      name: path.parse(file).name,
      path: path.join(dir, file),
    }));
}

// 生成 index.ts 文件内容
function generateExports(files) {
  return files
    .map(({ name, path }) => {
      const properties = analyzeExportDefault(path);

      if (properties) {
        // 如果是对象导出，解构对象并单独导出每个属性
        return `import ${name}Default from './${name}';\n` +
               `export const { ${properties.join(', ')} } = ${name}Default;`;
      } else {
        // 简单的默认导出
        return `export { default as ${name} } from './${name}';`;
      }
    })
    .join('\n\n');
}


// 写入 index.ts 文件
function createIndexFile(dir, fileName) {
  const files = getTSXFiles(dir);
  if (files.length === 0) {
    console.log('没有找到 .tsx 文件。');
    return;
  }

  const content = generateExports(files);
  const filePath = path.join(dir, fileName);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`已生成 ${filePath}`);
}

// 执行
createIndexFile(folderPath, outputFileName);
