import { Role } from './types';

const COMMON_STARTING_SPECIALTIES = [
  {
    name: "冷门知识",
    description: "花费专注来引入一个出人意料的事实到故事中。解释其后果以及你如何得知此事。",
    type: "starting" as const
  },
  {
    name: "异想天开的计划",
    description: "花费专注并说明你的计划。如果听起来合理，你可以获得+2个骰子的检定奖励。否则，你仍然可以尝试，但难度正常。",
    type: "starting" as const
  }
];

export const ROLES: Role[] = [
  {
    id: "rowdy",
    name: "捣蛋鬼",
    englishName: "Rowdy",
    tagline: "勇敢且机智",
    description: "你喜欢拆解事物，有时甚至能重新组装它们。你知道自己体型小，所以你找到了补偿方式：精巧的工具或机器。",
    attributeDescriptors: {
      arms: ["多毛的", "能干的", "粗糙的"],
      eyes: ["好奇的", "狂野的", "细长的"],
      legs: ["结实的", "有纹身的", "精瘦的"],
      mouth: ["有疤痕的", "湿润的", "凸牙的"]
    },
    suggestedNames: ["德卡", "格里扎", "洛巴", "巴克", "伊兹-伊兹", "库图克", "格鲁姆", "布拉兹", "里布斯"],
    startingSpecialties: [
      ...COMMON_STARTING_SPECIALTIES,
      { name: "老练", description: "手臂属性 +1。", type: "starting", effect: "+1 Arms" },
      { name: "有备无患", description: "花费专注来制造一个手持工具或简单的装置，无论多么不切实际（一把锤子、撬棍等）。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "能工巧匠", description: "花费专注并做手臂检定，用周围的物品组装出一个令人印象深刻但杂乱无章的机器。", type: "advanced" },
      { name: "敲击维护", description: "当你敲击任何类型的机器或装置时，你可以做手臂检定，让它短暂地停止或突然启动。", type: "advanced" },
      { name: "紧要关头", description: "当你透支并将自己或另一个地精从麻烦中拉出来时，TP掷两个骰子并取较高结果。", type: "advanced" },
      { name: "危险感知", description: "当你进入一个紧张的局面时，你可以询问TP：这里谁或什么最危险？获得+1骰子。", type: "advanced" },
      { name: "我罩着你", description: "当你获取专注时，说出一个地精的名字。当不好的事情要发生在ta身上时，你可以让它发生在你身上。", type: "advanced" },
      { name: "一点杠杆", description: "花费专注，巧妙地利用你矮小的身体作为杠杆，来推动、拉动或举起一个对于高个子来说也稍微太大或太重的物体。", type: "advanced" },
      { name: "败中求进", description: "当你透支并失败时，TP会告诉你关于当前情况的一些新的且有用的信息。获得+1骰子。", type: "advanced" },
      { name: "灵巧", description: "手臂属性 +1。", type: "advanced" },
      { name: "精明", description: "眼睛属性 +1。", type: "advanced" }
    ]
  },
  {
    id: "rascal",
    name: "惹事精",
    englishName: "Rascal",
    tagline: "顽皮且灵活",
    description: "你喜欢探索世界，这常常意味着把鼻子伸进不该去的地方。你逃脱麻烦的本事至少和陷入麻烦的本事一样高超。",
    attributeDescriptors: {
      arms: ["戴手套的", "爱抓的", "灵活的"],
      eyes: ["好奇的", "惊慌的", "蒙面的"],
      legs: ["苗条的", "有活力的", "不安分的"],
      mouth: ["薄的", "快速的", "狡猾的"]
    },
    suggestedNames: ["艾姆兹", "卡拉", "提格", "查姆", "珀兹", "斯凯夫", "吉姆", "伊布", "拉克"],
    startingSpecialties: [
      ...COMMON_STARTING_SPECIALTIES,
      { name: "敏捷", description: "腿脚属性 +1。", type: "starting", effect: "+1 Legs" },
      { name: "滑溜溜", description: "花费专注，挤压或扭曲你的身体以通过不可能的空间。像湿肥皂一样从某人手中滑出。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "翻滚技巧", description: "消耗专注，通过你的杂技表演来分散某人的注意力或吸引他们的注意。", type: "advanced" },
      { name: "泰然自若", description: "在进行运动或杂技动作时，花费专注可以忽略所有因失误而产生的复杂情况。", type: "advanced" },
      { name: "诋毁/贬低", description: "当你成功恶搞了一位有身份或有地位的人时，会有一位目击者成为地精们的朋友。", type: "advanced" },
      { name: "危险人物", description: "你身边总是带着弹弓、开锁器等。在使用它们的所有尝试中，检定+1骰子。", type: "advanced" },
      { name: "敏锐感知", description: "当你观察到有人在守护某物时，你可以询问TP：他的盲点是什么？获得+1骰子。", type: "advanced" },
      { name: "发现宝贝", description: "当你搜索一个区域时，你可以问TP：这里有什么有用或有价值的东西？获得+1骰子。", type: "advanced" },
      { name: "不沾涂层", description: "每个任务一次，你可以完美地躲避、逃避或忽略你的行为所造成的后果。", type: "advanced" },
      { name: "迅捷", description: "腿脚属性 +1。", type: "advanced" },
      { name: "灵巧", description: "手臂属性 +1。", type: "advanced" }
    ]
  },
  {
    id: "whiz-wart",
    name: "聪明蛋",
    englishName: "Whiz-Wart",
    tagline: "好奇且聪明",
    description: "你喜欢了解世界及其运作方式。你已经积累了一定的知识，掌握了一点点魔法。",
    attributeDescriptors: {
      arms: ["娇小的", "干净的", "颤抖的"],
      eyes: ["疲惫的", "算计的", "洞悉的"],
      legs: ["粗糙的", "颤巍巍的", "柔软的"],
      mouth: ["粗厚的", "紧绷的", "棱角分明的"]
    },
    suggestedNames: ["阿莎", "恩卡", "薇卡", "格里", "米兹", "吉克斯", "穆格", "奥克", "瓦佐"],
    startingSpecialties: [
      ...COMMON_STARTING_SPECIALTIES,
      { name: "博学", description: "眼睛属性 +1。", type: "starting", effect: "+1 Eyes" },
      { name: "精通魔法", description: "花费专注来施放法术：召唤光球、微风、火焰或寒冰冲击。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "奇思魔法", description: "你还知道：凭空变出视觉幻象，或向附近的人发送简短心灵消息。", type: "advanced" },
      { name: "奇物魔法", description: "你还知道：对拿着的物品做小改动（颜色、温度），或短暂活化一个小物体。", type: "advanced" },
      { name: "魔法手指", description: "当你摧毁一件魔法物品或咒语时，其能量会赋予你一种有用的超自然能力。", type: "advanced" },
      { name: "充能过载", description: "当你将专注用于一个法术时，也可以进行透支以增强其效果。", type: "advanced" },
      { name: "神奇伙伴", description: "你身边有一只神秘的动物灵伴。每任务一次，用它的力量重掷一个失败的骰子。", type: "advanced" },
      { name: "第三只眼", description: "当你观察魔法现象时，问TP：如果我干涉它会怎样？获得+1骰子。", type: "advanced" },
      { name: "博览群书", description: "当你进入重要地点时，问TP：我了解这个地点的哪些秘密？获得+1骰子。", type: "advanced" },
      { name: "精明", description: "眼睛属性 +1。", type: "advanced" },
      { name: "巧舌", description: "嘴巴属性 +1。", type: "advanced" }
    ]
  },
  {
    id: "rambler",
    name: "开心果",
    englishName: "Rambler",
    tagline: "和蔼且讨喜",
    description: "你是个出色的娱乐者。你喜爱结交新朋友，用言语、歌曲，或者甚至舞蹈来讲述故事。",
    attributeDescriptors: {
      arms: ["忙碌的", "修剪整齐的", "油腻的"],
      eyes: ["诚实的", "迷人的", "可爱的"],
      legs: ["笨拙的", "脏的", "冷静的"],
      mouth: ["大声的", "友好的", "傲慢的"]
    },
    suggestedNames: ["黛拉", "古利", "穆西", "金-吉", "吉格", "奎恩", "巴布斯", "因克", "托寇"],
    startingSpecialties: [
      ...COMMON_STARTING_SPECIALTIES,
      { name: "雄辩", description: "嘴巴属性 +1。", type: "starting", effect: "+1 Mouth" },
      { name: "说书人", description: "花费专注讲述一个精彩的故事，让听众全神贯注，或唤起强烈情感。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "大眼萌化", description: "消耗专注，让人觉得你很可爱。他们会倾向于帮助你或犹豫是否攻击你。", type: "advanced" },
      { name: "群体本能", description: "当你领导群体行动时，你可以无条件地升级最多两个失误。", type: "advanced" },
      { name: "傻瓜开窍", description: "有专注时，用话语激励另一个地精。对方获得专注，并在下一次检定中+1骰子。", type: "advanced" },
      { name: "神的弄臣", description: "当你逗乐TP且附近有非地精生物时，花费专注使其成为朋友。", type: "advanced" },
      { name: "讨好大师", description: "在交谈中观察某人时，问TP：ta想要什么？获得+1骰子。", type: "advanced" },
      { name: "人脉广泛", description: "每任务一次，回忆起你认识的一个人可以帮助你。TP会告诉你如何找到ta。", type: "advanced" },
      { name: "真心老铁", description: "当某人成为朋友时，他们会分享有用的东西。如果是信息，提供+1骰子。", type: "advanced" },
      { name: "巧舌", description: "嘴巴属性 +1。", type: "advanced" },
      { name: "迅捷", description: "腿脚属性 +1。", type: "advanced" }
    ]
  },
  {
    id: "ratter",
    name: "驯兽师",
    englishName: "Ratter",
    tagline: "野性且警觉",
    description: "你擅长理解生物及其行为。这使你可以追踪它们，并帮助你与小生物交朋友。",
    attributeDescriptors: {
      arms: ["泥泞的", "粗糙的", "敏捷的"],
      eyes: ["敏锐的", "疏离的", "温柔的"],
      legs: ["钢铁般的", "弯曲的", "有伤痕的"],
      mouth: ["歪斜的", "粗鲁的", "安静的"]
    },
    suggestedNames: ["阿里", "罗瓦", "斯佩塔", "特米", "伊德", "罗格-里格", "德里兹", "斯蒂夫", "乌尔"],
    startingSpecialties: [
      ...COMMON_STARTING_SPECIALTIES,
      { name: "热切", description: "眼睛属性 +1。", type: "starting", effect: "+1 Eyes" },
      { name: "动物伙伴", description: "花费专注让你的动物伙伴执行一项任务：侦察、载人、或安慰他人。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "搜寻犬", description: "花费专注，让动物伙伴找到或取回它认为有用的物体。", type: "advanced" },
      { name: "驴唇马嘴", description: "花费专注与动物交流。TP可能要求嘴巴检定来说服它们。", type: "advanced" },
      { name: "嗅觉灵敏", description: "花费专注追踪足迹。问TP两个关于制造足迹者的问题。", type: "advanced" },
      { name: "嗅到恐惧", description: "观察某人行动时，问TP：ta害怕什么？获得+1骰子。", type: "advanced" },
      { name: "毛茸朋友", description: "每任务一次，召唤一群小动物制造混乱。", type: "advanced" },
      { name: "放生者", description: "当你帮助一个非地精生物时，它会成为朋友。", type: "advanced" },
      { name: "伪装", description: "花费专注进行伪装，隐藏静态或缓慢的人和物体。", type: "advanced" },
      { name: "精明", description: "眼睛属性 +1。", type: "advanced" },
      { name: "迅捷", description: "腿脚属性 +1。", type: "advanced" }
    ]
  },
  {
    id: "high-speaker",
    name: "圣言者",
    englishName: "High-Speaker",
    tagline: "热心且受敬",
    description: "你可以与某种神灵交谈。这种联系使你可以创造奇迹：祝福、引导，甚至诅咒。",
    attributeDescriptors: {
      arms: ["精准的", "柔软的", "灵巧的"],
      eyes: ["睁大的", "明亮的", "关心的"],
      legs: ["敏捷的", "被包裹的", "精致的"],
      mouth: ["粗俗的", "悲伤的", "完美的"]
    },
    suggestedNames: ["拉卡", "艾希", "扎加", "巴格", "巴希", "吉基", "杰洛", "伦科", "纳鲁兹"],
    startingSpecialties: [
      ...COMMON_STARTING_SPECIALTIES,
      { name: "温和", description: "手臂属性 +1。", type: "starting", effect: "+1 Arms" },
      { name: "奇迹创造者", description: "花费专注来祝福一个配得的人：给予幸运、活力或财富。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "获得指引", description: "每任务一次，花费专注请求神谕。获得+1骰子。", type: "advanced" },
      { name: "热心帮助", description: "当你照顾他人时，对方明显好转。你也可以祝福其中一人。", type: "advanced" },
      { name: "你我皆苦", description: "看到有人痛苦时，问TP：怎样最好地互相帮助？获得+1骰子。", type: "advanced" },
      { name: "神圣领地", description: "消耗专注，短暂使区域神圣化（魔法减弱、宁静或昏睡）。", type: "advanced" },
      { name: "诅咒制造者", description: "花费专注诅咒一个配得的人：霉运、疾病或灾祸。", type: "advanced" },
      { name: "转化亡灵", description: "消耗专注，让不受欢迎的生物（亡灵等）感受到善意。", type: "advanced" },
      { name: "神之干预", description: "每任务一次，嘴巴检定，说服神明以宏大方式干预。", type: "advanced" },
      { name: "灵巧", description: "手臂属性 +1。", type: "advanced" },
      { name: "巧舌", description: "嘴巴属性 +1。", type: "advanced" }
    ]
  },
  {
    id: "square",
    name: "方脑壳",
    englishName: "Square",
    tagline: "严肃且固执",
    description: "你在一群傻瓜中显得正直。你喜欢规则和结构。这使你擅长承受变化，并与“无聊”的部分互动。",
    attributeDescriptors: {
      arms: ["紧张的", "焦虑的", "滋润的"],
      eyes: ["多疑的", "冷静的", "灰色的"],
      legs: ["稳固的", "能干的", "急躁的"],
      mouth: ["严肃的", "撅嘴的", "温柔的"]
    },
    suggestedNames: ["帕姆", "珍妮", "多蒂", "亚历克斯", "查理", "奥利", "诺曼", "鲍伯特", "道格"],
    startingSpecialties: [
      ...COMMON_STARTING_SPECIALTIES,
      { name: "坚定", description: "腿脚属性 +1。", type: "starting", effect: "+1 Legs" },
      { name: "沮丧", description: "你无法获得专注，你是始终专注的。当有人嘲笑你或不认真时，你获得'沮丧'（相当于专注）。", type: "starting" },
      { name: "合理的计划", description: "替代'异想天开的计划'。花费沮丧解释计划，参与者+1骰子。否则TP提供替代方案。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "坚定不移", description: "花费沮丧来抵抗变化，牢牢抓住某物，或变得不可动摇。", type: "advanced" },
      { name: "听我唠叨", description: "花费沮丧与人分享枯燥事实。让人睡着、默许或离开。", type: "advanced" },
      { name: "怒火中烧", description: "花费沮丧让在场人认真对待。即使地精朋友也会维持礼仪。", type: "advanced" },
      { name: "跺脚！", description: "只要有沮丧，可做腿部检定并跺脚，让所有人停下并恭敬后退。", type: "advanced" },
      { name: "扫兴者", description: "当你成功用逻辑向宇宙(TP)指出某事不合理时，获得沮丧。", type: "advanced" },
      { name: "住手！", description: "花费沮丧中断、停止或忽略对你产生负面影响的复杂情况。", type: "advanced" },
      { name: "为什么是我？", description: "当玩家用你的麻烦升级失误时，你获得沮丧，对方获得专注。", type: "advanced" },
      { name: "深入研究", description: "每任务一次，指定一个狭窄知识领域。你可以回答该领域所有问题，表现出惊人熟练度。", type: "advanced" },
      { name: "迅捷", description: "腿脚属性 +1。", type: "advanced" },
      { name: "精明", description: "眼睛属性 +1。", type: "advanced" }
    ]
  },
  {
    id: "nibbler",
    name: "碎食机",
    englishName: "Nibbler",
    tagline: "谐调且饥饿",
    description: "你与周围的环境协调一致，并明白万物归一。这使你可以与周围的世界对话，同时也让你明白你吃什么就是什么。",
    attributeDescriptors: {
      arms: ["肮脏的", "纹身的", "带爪的"],
      eyes: ["多色的", "野性的", "放大的"],
      legs: ["细长的", "扭曲的", "毛茸茸的"],
      mouth: ["宽阔的", "尖利的", "未洗的"]
    },
    suggestedNames: ["纳特", "克拉", "科顿", "杜兹", "博拉普", "沙克斯", "托格", "胡尔", "朗普"],
    startingSpecialties: [
      ...COMMON_STARTING_SPECIALTIES,
      { name: "饥饿", description: "嘴巴属性 +1。", type: "starting", effect: "+1 Mouth" },
      { name: "狼吞虎咽", description: "花费专注吃掉某物，转移一个属性点，并获得一个新能力（如吃鸟获飞行）。", type: "starting" }
    ],
    advancedSpecialties: [
      { name: "奇美拉", description: "你现在可以同时激活三种变形。", type: "advanced" },
      { name: "塞得进嘴？", description: "你可以安全吞咽不可食用或有毒东西。或暂时存东西在肚子里。", type: "advanced" },
      { name: "物体交谈", description: "花费专注与物体、植物交谈。它会提供服务或回答两个问题。", type: "advanced" },
      { name: "这是我的！", description: "花费专注舔一个无意识物体将其据为己有。其他人很难使用它。", type: "advanced" },
      { name: "吸尘器", description: "做嘴巴检定尝试将一个物体吸进张开的嘴里。", type: "advanced" },
      { name: "氛围检查", description: "进入不平衡空间时，问TP：什么在破坏氛围？获得+1骰子。", type: "advanced" },
      { name: "吃，变，重复", description: "如果完全吞下一个物体，你可以完美变成它（除了保留地精五官）。", type: "advanced" },
      { name: "巧舌", description: "嘴巴属性 +1。", type: "advanced" },
      { name: "灵巧", description: "手臂属性 +1。", type: "advanced" }
    ]
  }
];