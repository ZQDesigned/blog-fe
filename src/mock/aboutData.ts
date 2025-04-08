import { AboutMeData } from '../types/types';

export const mockAboutData: AboutMeData = {
  sections: [
    {
      type: 'profile',
      title: '关于我',
      content: {
        avatar: 'https://www.loliapi.com/acg/pp/',
        bio: '👋 你好，我是 ZQDesigned，一名专注于 全栈开发 & 游戏开发 的开发者。我热爱技术，擅长 Spring Boot 后端开发、Kotlin 移动端开发、云原生架构，同时也在探索 Unity + xLua 进行游戏开发。这里是我的个人空间，记录我的思考、成长与项目经验。欢迎交流！',
        education: [
          {
            school: '合肥工业大学',
            degree: '本科',
            major: '地球信息科学与技术',
            time: '2019-2023'
          },
          {
            school: '北京大学',
            degree: '硕士',
            major: '计算机科学与技术',
            time: '2023-2026'
          }
        ],
        location: '中国 安徽',
        highlights: [
          '⚡ 自学 & 实践驱动的开发者',
          '🎓 热爱探索新技术，持续学习并追求卓越',
          '💡 善于解决复杂问题，具有创新思维',
        ],
      }
    },
    {
      type: 'skills',
      title: '专业技能',
      content: {
        categories: [
          {
            name: '后端开发',
            items: ['Java', 'Kotlin', 'Spring Boot', 'gRPC', 'MySQL', 'PostgreSQL', 'Redis'],
          },
          {
            name: '移动端 & 全栈',
            items: ['Android', 'Kotlin', 'Flutter', 'TypeScript', 'React', 'Next.js'],
          },
          {
            name: '游戏开发',
            items: ['Unity', 'xLua', 'C#', 'Shader', 'GamePlay'],
          },
          {
            name: '工具 & 云原生',
            items: ['Docker', 'Kubernetes', 'GitHub Actions', 'JetBrains IDE', 'CI/CD', 'Serverless'],
          },
        ],
      }
    },
    {
      type: 'journey',
      title: '开发旅程',
      content: {
        description: [
          '🌍 旅途仍在继续，探索从未止步。',
          '🔭 我追逐技术的光，穿梭于代码的星海。',
          '🛠️ 未来可期，愿与你共创更精彩的世界。',
        ],
        milestones: [
          {
            year: '2022',
            title: '全栈开发',
            description: '开始深入全栈开发领域，使用 Next.js 和 Nest.js 构建了多个企业级应用和个人项目。',
          },
          {
            year: '2020',
            title: '移动应用开发',
            description: '使用 Kotlin 开发了多个 Android 应用，并开始学习 Flutter 进行跨平台开发。',
          },
          {
            year: '2018',
            title: '后端开发',
            description: '步入软件行业，主要负责 Spring Boot 后端应用的开发与维护。',
          },
        ],
      }
    },
    {
      type: 'custom',
      id: 'projects',
      title: '代表作品',
      content: {
        description: '以下是我的一些代表性项目，展示了我在不同领域的技术能力和创新思维。',
        blockType: 'cards',
        items: [
          {
            title: 'LumiCMS 内容管理系统',
            description: '一款轻量级内容管理系统，采用 Spring Boot + React 技术栈，支持自定义主题和插件扩展。',
            imageUrl: 'https://www.loliapi.com/acg/pp/',
            link: 'https://github.com/ZQDesigned/lumicms',
          },
          {
            title: 'TechNotes 知识库',
            description: '个人知识管理工具，支持 Markdown 编辑、知识图谱、全文检索等功能。',
            imageUrl: 'https://www.loliapi.com/acg/pp/',
            link: 'https://github.com/ZQDesigned/technotes',
          },
          {
            title: 'PuzzleQuest 游戏',
            description: '基于 Unity 和 xLua 开发的益智解谜游戏，支持自定义关卡和在线排行榜。',
            imageUrl: 'https://www.loliapi.com/acg/pp/',
            link: 'https://github.com/ZQDesigned/puzzlequest',
          },
        ],
      }
    },
    {
      type: 'custom',
      id: 'awards',
      title: '获奖与认证',
      content: {
        description: '我的专业能力得到了多方面的认可：',
        blockType: 'list',
        items: [
          {
            title: 'AWS 认证解决方案架构师',
            description: '2023年获得，证书编号 AWS-123456',
            icon: 'TrophyOutlined',
          },
          {
            title: '开发者大赛一等奖',
            description: '2022年参加全国高校开发者大赛获得一等奖',
            icon: 'CrownOutlined',
          },
          {
            title: 'Microsoft Certified: Azure Developer Associate',
            description: '2021年获得，证书编号 MS-789012',
            icon: 'SafetyCertificateOutlined',
          },
        ],
      }
    },
    {
      type: 'contact',
      title: '联系方式',
      content: {
        items: [
          {
            type: 'GitHub',
            icon: 'GithubOutlined',
            value: 'GitHub: ZQDesigned',
            link: 'https://github.com/ZQDesigned',
          },
          {
            type: '邮箱',
            icon: 'MailOutlined',
            value: 'zqdesigned@mail.lnyynet.com',
            link: 'mailto:zqdesigned@mail.lnyynet.com',
          },
          {
            type: 'QQ',
            icon: 'QqOutlined',
            value: 'QQ: 2990918167',
          },
          {
            type: '微信',
            icon: 'WechatOutlined',
            value: '微信：点击查看二维码',
            isQrCode: true,
            qrCodeUrl: '/wechat-qr.jpg',
          },
        ],
      }
    }
  ]
};
