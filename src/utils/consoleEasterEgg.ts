/**
 * Console Easter Egg - 控制台彩蛋
 * 在浏览器控制台显示各种有趣的图案和信息
 */

// ASCII 艺术图案集合
const ASCII_ARTS = [
  // 经典的"Hello World"
  `
╔═══════════════════════════════════════╗
║                                       ║
║       🎉 Welcome to LumiCMS! 🎉      ║
║                                       ║
║      轻量 • 自由 • 优雅的内容管理系统     ║
║                                       ║
╚═══════════════════════════════════════╝
`,

  // 代码图案
  `
    ┌─────────────────────────────────┐
    │   </>  Code with Passion  </>   │
    └─────────────────────────────────┘
    
         ╭─╮     ╭─╮
        ╱   ╲   ╱   ╲
       │  ●  ╲ ╱  ●  │
        ╲    ╱─╲    ╱
         ╰──╯   ╰──╯
    `,

  // 猫咪图案
  `
       ╱|、
      (˚ˎ 。7  
       |、˜〵          
       じしˍ,)ノ
    
    Hello from the console! 🐾
    `,

  // 火箭图案
  `
           /\\
          /  \\
         |    |
          \\  /
           \\/
          /  \\
         /____\\
        🚀 Ready to Launch! 🚀
    `,

  // 心形图案
  `
         ♡♡♡♡♡    ♡♡♡♡♡
       ♡       ♡        ♡
      ♡                  ♡
       ♡               ♡
         ♡           ♡
           ♡       ♡
             ♡   ♡
               ♡
    
      Made with ♡ by ZQDesigned
    `
];

// 彩色样式定义
const CONSOLE_STYLES = {
  title: 'color: #FF6B6B; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);',
  subtitle: 'color: #4ECDC4; font-size: 14px; font-weight: normal;',
  ascii: 'color: #45B7D1; font-family: monospace; font-size: 12px; line-height: 1.2;',
  info: 'color: #96CEB4; font-size: 12px;',
  warning: 'color: #FFEAA7; font-size: 11px;',
  link: 'color: #6C5CE7; font-size: 12px; text-decoration: underline;',
  rainbow: [
    'color: #FF6B6B;',
    'color: #4ECDC4;',
    'color: #45B7D1;',
    'color: #96CEB4;',
    'color: #FFEAA7;',
    'color: #DDA0DD;',
    'color: #98D8C8;'
  ]
};

// 彩虹文字效果
function rainbowText(text: string): void {
  let output = '';
  const styles: string[] = [];

  for (let i = 0; i < text.length; i++) {
    if (text[i] !== ' ') {
      output += `%c${text[i]}`;
      styles.push(CONSOLE_STYLES.rainbow[i % CONSOLE_STYLES.rainbow.length]);
    } else {
      output += ' ';
    }
  }

  console.log(output, ...styles);
}

// 打印开发者信息
function printDeveloperInfo(): void {
  console.log('%c💻 Developer Info', CONSOLE_STYLES.title);
  console.log('%c├─ Author: ZQDesigned', CONSOLE_STYLES.info);
  console.log('%c├─ GitHub: https://github.com/ZQDesigned', CONSOLE_STYLES.link);
  console.log('%c├─ Blog: https://blog.zqdesigned.city', CONSOLE_STYLES.link);
  console.log('%c└─ Built with React + TypeScript + Vite', CONSOLE_STYLES.info);
}

// 打印技术栈信息
function printTechStack(): void {
  const buildTime = import.meta.env.VITE_BUILD_TIME;
  const gitHash = import.meta.env.VITE_GIT_HASH;

  console.log('%c🛠️ Tech Stack', CONSOLE_STYLES.title);
  console.log('%c├─ Framework: React 18 + TypeScript', CONSOLE_STYLES.info);
  console.log('%c├─ Build Tool: Vite', CONSOLE_STYLES.info);
  console.log('%c├─ Styling: Emotion + Ant Design', CONSOLE_STYLES.info);
  console.log('%c├─ Routing: React Router', CONSOLE_STYLES.info);

  if (buildTime) {
    const buildDate = new Date(Number(buildTime)).toLocaleString();
    console.log(`%c├─ Build Time: ${buildDate}`, CONSOLE_STYLES.info);
  }

  if (gitHash) {
    console.log(`%c└─ Version: ${gitHash}`, CONSOLE_STYLES.info);
  }
}

// 打印隐藏功能提示
function printHiddenFeatures(): void {
  console.log('%c🎮 Hidden Features', CONSOLE_STYLES.title);
  console.log('%c├─ Try typing: up up down down left right left right B A', CONSOLE_STYLES.info);
  console.log('%c├─ Right-click for context menu', CONSOLE_STYLES.info);
  console.log('%c├─ Click avatar to open settings', CONSOLE_STYLES.info);
  console.log('%c└─ Check out the games section! 🎯🐍🧩', CONSOLE_STYLES.info);
}

// 打印警告信息
function printSecurityWarning(): void {
  console.log('%c⚠️ Security Warning', 'color: #FF4757; font-size: 16px; font-weight: bold;');
  console.log('%c如果有人告诉你在此处复制粘贴代码，那很可能是诈骗！', CONSOLE_STYLES.warning);
  console.log('%cIf someone told you to copy-paste code here, it\'s probably a scam!', CONSOLE_STYLES.warning);
}

// 随机选择ASCII图案
function getRandomAsciiArt(): string {
  return ASCII_ARTS[Math.floor(Math.random() * ASCII_ARTS.length)];
}

// 主函数：显示控制台彩蛋
export function showConsoleEasterEgg(): void {
  // 清除控制台（可选）
  console.clear();

  // 显示随机ASCII艺术
  console.log('%c' + getRandomAsciiArt(), CONSOLE_STYLES.ascii);

  // 显示彩虹欢迎文字
  console.log(''); // 空行
  rainbowText('✨ Welcome to LumiCMS Console! ✨');
  console.log(''); // 空行

  // 显示各种信息
  printDeveloperInfo();
  console.log(''); // 空行

  printTechStack();
  console.log(''); // 空行

  printHiddenFeatures();
  console.log(''); // 空行

  // 安全警告
  printSecurityWarning();
  console.log(''); // 空行

  // 结束语
  console.log('%c🎉 Happy coding and exploring! 🎉', CONSOLE_STYLES.subtitle);
  console.log('%cType console.clear() to clear this message.', 'color: #95a5a6; font-size: 10px;');
}

// 额外的交互式函数，用户可以在控制台调用
declare global {
  interface Window {
    showEasterEgg: () => void;
    showRandomArt: () => void;
    rainbowLog: (text: string) => void;
  }
}

window.showEasterEgg = () => {
  showConsoleEasterEgg();
};

window.showRandomArt = () => {
  console.log('%c' + getRandomAsciiArt(), CONSOLE_STYLES.ascii);
};

window.rainbowLog = (text: string) => {
  rainbowText(text || 'Hello World!');
};
