import React, { useState, useRef } from 'react';
import { ROLES } from './data';
import { GoblinCharacter, Role, Specialty, TitleData, AttributeType } from './types';
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  RefreshCcw, 
  User, 
  Eye, 
  Hand, 
  Footprints, 
  MessageCircle,
  Sparkles,
  Scroll,
  Info,
  Download,
  Upload,
  Trophy,
  Medal,
  Eraser,
  Plus,
  Check,
  X,
  Puzzle,
  Crown,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Dices,
  Home
} from 'lucide-react';

// --- Components ---

const Button = ({ onClick, children, variant = 'primary', disabled = false, className = '', title = '' }: any) => {
  const baseStyle = "px-4 py-3 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-md touch-manipulation select-none";
  const variants = {
    primary: "bg-emerald-700 text-amber-50 hover:bg-emerald-600 disabled:bg-stone-400 border-2 border-emerald-900",
    secondary: "bg-stone-200 text-stone-800 hover:bg-stone-300 disabled:opacity-50 border-2 border-stone-400",
    outline: "bg-transparent border-2 border-emerald-800 text-emerald-900 hover:bg-emerald-100",
    danger: "bg-red-700 text-white hover:bg-red-600 border-2 border-red-900",
    ghost: "bg-transparent text-stone-600 hover:bg-stone-200 shadow-none px-2 py-1"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      title={title}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', title, action }: any) => (
  <div className={`bg-[#f3ead3] border-2 border-stone-800 rounded-lg shadow-[4px_4px_0px_0px_rgba(44,36,27,1)] p-4 ${className}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-3 border-b-2 border-stone-800 pb-2">
         {title && <h3 className="font-display text-xl text-stone-800">{title}</h3>}
         {action}
      </div>
    )}
    {children}
  </div>
);

const StatBadge = ({ icon: Icon, value, label, highlight = false, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-transform active:scale-95 
      ${highlight ? 'bg-emerald-100 border-emerald-600' : 'bg-stone-50 border-stone-300'}
      ${onClick ? 'cursor-pointer hover:bg-emerald-50 hover:border-emerald-400 shadow-sm' : ''}
    `}
  >
    <Icon size={24} className="text-emerald-800 mb-1" />
    <span className="text-xs uppercase font-bold text-stone-600">{label}</span>
    <span className="text-2xl font-display text-stone-900">{value}</span>
    {onClick && <div className="absolute bottom-1 right-1 opacity-20"><Dices size={12}/></div>}
  </div>
);

const DiceIcon = ({ value, size = 24, className = "" }: any) => {
  const icons = [Dice1, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const TheIcon = icons[value] || Dice6;
  return <TheIcon size={size} className={className} />;
};

// --- Main App ---

export default function App() {
  // Steps: 0:Home, 1:Role, 2:Stats, 3:Identity, 5:Sheet
  const [step, setStep] = useState(0); 
  const [character, setCharacter] = useState<Partial<GoblinCharacter>>({
    pendingAchievements: ["", ""]
  });
  
  // UI State for Modals
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [specialtySelectionMode, setSpecialtySelectionMode] = useState<'mission' | 'achievement'>('mission');
  const [newTitleName, setNewTitleName] = useState("");
  const [selectedSpec, setSelectedSpec] = useState<Specialty | null>(null);

  // Dice Roller State
  const [showDiceModal, setShowDiceModal] = useState(false);
  const [diceConfig, setDiceConfig] = useState({ label: '', baseDice: 0 });
  const [currentDiceCount, setCurrentDiceCount] = useState(0);
  const [rollResults, setRollResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Helpers ---

  const getStatBonus = (char: Partial<GoblinCharacter>, stat: string): number => {
    if (!char.roleId) return 0;
    const role = ROLES.find(r => r.id === char.roleId);
    let bonus = 0;
    
    // Starting
    role?.startingSpecialties.forEach(s => {
      if (s.effect && s.effect.toLowerCase().includes(stat)) bonus += 1;
    });

    // Main Advanced
    if (char.selectedAdvancedSpecialty) {
      const adv = role?.advancedSpecialties.find(s => s.name === char.selectedAdvancedSpecialty);
      if (adv?.effect && adv.effect.toLowerCase().includes(stat)) bonus += 1;
    }

    // Extra Specialties from Titles
    char.extraSpecialties?.forEach(s => {
      if (s.effect && s.effect.toLowerCase().includes(stat)) bonus += 1;
    });

    return bonus;
  };

  const isSpecialtyOwned = (specName: string) => {
    const role = ROLES.find(r => r.id === character.roleId);
    if (role?.startingSpecialties.some(s => s.name === specName)) return true;
    if (character.selectedAdvancedSpecialty === specName) return true;
    if (character.extraSpecialties?.some(s => s.name === specName)) return true;
    return false;
  };

  const exportCharacter = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `goblin_${character.name || 'unnamed'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importCharacter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.roleId && json.attributes) {
           if (!json.pendingAchievements) json.pendingAchievements = ["", ""];
           setCharacter(json);
           setStep(5);
        } else {
           alert("无效的角色卡文件");
        }
      } catch (err) {
        alert("文件读取失败");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Dice Logic ---

  const openDiceRoller = (label: string, baseValue: number) => {
    setDiceConfig({ label, baseDice: baseValue });
    setCurrentDiceCount(baseValue);
    setRollResults([]);
    setShowDiceModal(true);
  };

  const rollDice = () => {
    setIsRolling(true);
    // Simple animation delay
    setTimeout(() => {
      const results = Array.from({ length: Math.max(1, currentDiceCount) }, () => Math.floor(Math.random() * 6) + 1);
      // Sort descending
      results.sort((a, b) => b - a);
      setRollResults(results);
      setIsRolling(false);
    }, 400);
  };

  const getRollResultText = (highest: number) => {
    if (highest === 6) return { text: "完全成功", color: "text-emerald-600" };
    if (highest >= 4) return { text: "有代价成功", color: "text-amber-600" };
    return { text: "失败", color: "text-red-600" };
  };

  // --- Campaign Logic ---

  const handleAchievementChange = (index: 0 | 1, value: string) => {
    const newArr = [...(character.pendingAchievements || ["", ""])] as [string, string];
    newArr[index] = value;
    setCharacter(prev => ({ ...prev, pendingAchievements: newArr }));
  };

  const initiateAddTitle = (mode: 'mission' | 'achievement') => {
    setSpecialtySelectionMode(mode);
    setNewTitleName(mode === 'achievement' 
      ? `${character.pendingAchievements?.[0]}${character.pendingAchievements?.[1]}` 
      : ""
    );
    setSelectedSpec(null);
    setShowSpecialtyModal(true);
  };

  const confirmAddTitle = () => {
    if (!newTitleName || !selectedSpec) {
      alert("请填写头衔名称并选择一个专长。");
      return;
    }

    const newTitle: TitleData = {
      name: newTitleName,
      grantedSpecialty: selectedSpec,
      dateObtained: new Date().toLocaleDateString(),
      type: specialtySelectionMode === 'mission' ? 'mission' : 'achievement_merge'
    };

    setCharacter(prev => ({
      ...prev,
      pendingAchievements: specialtySelectionMode === 'achievement' ? ["", ""] : prev.pendingAchievements,
      titles: [...(prev.titles || []), newTitle],
      extraSpecialties: [...(prev.extraSpecialties || []), selectedSpec]
    }));

    setShowSpecialtyModal(false);
  };

  // --- Steps Renders ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-fade-in pb-20">
      <div className="mb-4">
        <h1 className="text-5xl font-display text-emerald-900 mb-2 drop-shadow-md">地精跑断腿</h1>
        <h2 className="text-2xl font-serif text-stone-600 italic">Goblin Errands</h2>
        <p className="text-xs text-stone-500 mt-2">v2.4 纯净版</p>
      </div>
      
      <Card className="max-w-md w-full transform rotate-1">
        <p className="text-lg leading-relaxed mb-4">
          你是一只地精。你属于一个部落。你需要去跑腿。
        </p>
        <p className="text-stone-600">
          这是一款关于混乱、误解和（意外的）英雄主义的微型桌面角色扮演游戏。
        </p>
      </Card>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={() => setStep(1)} className="text-xl">
          <Sparkles className="w-5 h-5" /> 创建新角色
        </Button>
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-5 h-5" /> 导入角色 (.json)
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={importCharacter} 
          accept=".json" 
          className="hidden" 
        />
      </div>
    </div>
  );

  const renderRoleSelection = () => (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <h2 className="text-3xl font-display text-center mb-6 text-emerald-900">
        选择天职
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {ROLES.map(role => (
          <div key={role.id} onClick={() => {
            setCharacter(prev => ({
              ...prev,
              roleId: role.id,
              attributes: {
                arms: { value: 0, descriptor: '' },
                legs: { value: 0, descriptor: '' },
                eyes: { value: 0, descriptor: '' },
                mouth: { value: 0, descriptor: '' },
              },
              bodyDescriptor: '',
              mindDescriptor: '',
              pendingAchievements: ["", ""]
            }));
            setStep(2);
            window.scrollTo(0, 0);
          }} className="cursor-pointer transition-transform hover:-translate-y-1">
            <Card className="relative overflow-hidden group">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-2xl font-display text-emerald-900">{role.name}</h3>
                </div>
                <span className="bg-amber-200 text-amber-900 text-xs px-2 py-1 rounded-full font-bold border border-amber-400">
                  {role.tagline}
                </span>
              </div>
              <p className="text-stone-700 leading-snug">{role.description}</p>
            </Card>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#fdf6e3] via-[#fdf6e3] to-transparent">
        <Button variant="secondary" onClick={() => setStep(0)} className="w-full">返回主菜单</Button>
      </div>
    </div>
  );

  const renderAttributes = () => {
    if (!character.roleId) return null;
    const role = ROLES.find(r => r.id === character.roleId)!;
    const values = [1, 2, 3, 4];
    
    const assignedValues = Object.values(character.attributes || {}).map(a => a.value).filter(v => v > 0);
    const isComplete = assignedValues.length === 4 && new Set(assignedValues).size === 4;

    const handleResetNumbers = () => {
      setCharacter(prev => ({
        ...prev,
        attributes: {
          arms: { ...prev.attributes!.arms, value: 0 },
          legs: { ...prev.attributes!.legs, value: 0 },
          eyes: { ...prev.attributes!.eyes, value: 0 },
          mouth: { ...prev.attributes!.mouth, value: 0 },
        }
      }));
    };

    const handleAttributeAssign = (attr: keyof GoblinCharacter['attributes'], value: number) => {
      setCharacter(prev => {
        if (!prev.attributes) return prev;
        const newAttrs = { ...prev.attributes };
        (Object.keys(newAttrs) as Array<keyof typeof newAttrs>).forEach(k => {
          if (newAttrs[k].value === value) newAttrs[k].value = 0;
        });
        newAttrs[attr] = { ...newAttrs[attr], value };
        return { ...prev, attributes: newAttrs };
      });
    };

    const handleDescriptorChange = (attr: keyof GoblinCharacter['attributes'], val: string) => {
        setCharacter(prev => ({
            ...prev,
            attributes: {
                ...prev.attributes!,
                [attr]: { ...prev.attributes![attr], descriptor: val }
            }
        }));
    };

    const renderAttrRow = (key: keyof GoblinCharacter['attributes'], label: string, icon: any, descriptors: string[]) => {
      return (
        <Card className="mb-4 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {icon}
              <h3 className="font-display text-xl">{label}</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {values.map(val => {
              const isSelected = character.attributes?.[key]?.value === val;
              const isUsedElsewhere = !isSelected && Object.entries(character.attributes || {}).some(([k, v]) => k !== key && v.value === val);
              
              return (
                <button
                  key={val}
                  onClick={() => handleAttributeAssign(key, val)}
                  disabled={isUsedElsewhere}
                  className={`
                    h-12 rounded-lg font-display text-xl border-2 transition-all relative
                    ${isSelected ? 'bg-emerald-600 text-white border-emerald-800 shadow-inner' : ''}
                    ${isUsedElsewhere ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed' : 'bg-white border-stone-400 hover:border-emerald-500'}
                  `}
                >
                  {val}
                </button>
              );
            })}
          </div>

          <div>
            <label className="text-xs font-bold text-stone-500 uppercase mb-1 block">形容词</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {descriptors.map(desc => (
                <button
                  key={desc}
                  onClick={() => handleDescriptorChange(key, desc)}
                  className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                    character.attributes?.[key]?.descriptor === desc 
                      ? 'bg-amber-200 border-amber-500 text-amber-900' 
                      : 'bg-stone-100 border-stone-300 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {desc}
                </button>
              ))}
            </div>
            <input 
              type="text" 
              placeholder="或者自己填写..." 
              value={character.attributes?.[key]?.descriptor || ""}
              onChange={(e) => handleDescriptorChange(key, e.target.value)}
              className="w-full bg-transparent border-b-2 border-dashed border-stone-400 px-2 py-1 text-sm font-handwriting focus:border-emerald-500 outline-none placeholder:text-stone-400 text-emerald-900"
            />
          </div>
        </Card>
      );
    };

    return (
      <div className="p-4 max-w-2xl mx-auto pb-24">
        <div className="flex justify-between items-end mb-6">
          <div>
             <h2 className="text-3xl font-display text-emerald-900">分配属性</h2>
             <p className="text-stone-600 text-sm">将 1, 2, 3, 4 分配给属性。</p>
          </div>
          <Button variant="ghost" onClick={handleResetNumbers} title="撤销分配">
             <Eraser size={20} /> 重置数值
          </Button>
        </div>

        {renderAttrRow('arms', '手臂', <Hand />, role.attributeDescriptors.arms)}
        {renderAttrRow('legs', '腿脚', <Footprints />, role.attributeDescriptors.legs)}
        {renderAttrRow('eyes', '眼睛', <Eye />, role.attributeDescriptors.eyes)}
        {renderAttrRow('mouth', '嘴巴', <MessageCircle />, role.attributeDescriptors.mouth)}

        <Card title="其他特征">
            <div className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-stone-600 mb-1">体格描述</label>
                   <input 
                      type="text"
                      className="w-full p-2 bg-white border-2 border-stone-300 rounded focus:border-emerald-500 outline-none"
                      placeholder="例如：像个土豆..."
                      value={character.bodyDescriptor || ""}
                      onChange={(e) => setCharacter(p => ({...p, bodyDescriptor: e.target.value}))}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-stone-600 mb-1">心灵描述</label>
                   <input 
                      type="text"
                      className="w-full p-2 bg-white border-2 border-stone-300 rounded focus:border-emerald-500 outline-none"
                      placeholder="例如：充满了蜜蜂..."
                      value={character.mindDescriptor || ""}
                      onChange={(e) => setCharacter(p => ({...p, mindDescriptor: e.target.value}))}
                   />
                </div>
            </div>
        </Card>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-[#fdf6e3] border-t border-stone-200 flex gap-4 z-10">
          <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">上一步</Button>
          <Button 
            disabled={!isComplete} 
            onClick={() => setStep(3)} 
            className="flex-[2]"
          >
            下一步
          </Button>
        </div>
      </div>
    );
  };

  const renderIdentity = () => {
    if (!character.roleId) return null;
    const role = ROLES.find(r => r.id === character.roleId)!;

    return (
      <div className="p-4 max-w-2xl mx-auto pb-24">
        <h2 className="text-3xl font-display text-center mb-6 text-emerald-900">我是谁？</h2>
        
        <Card className="mb-6" title="基本信息">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-600 mb-1">名字</label>
              <input 
                type="text" 
                className="w-full p-3 bg-white border-2 border-stone-300 rounded-lg font-display text-lg focus:border-emerald-500 outline-none"
                placeholder="输入名字..."
                value={character.name || ''}
                onChange={(e) => setCharacter({...character, name: e.target.value})}
              />
              <div className="mt-2 text-xs text-stone-500">
                <span className="mr-2">建议:</span>
                {role.suggestedNames.slice(0, 5).map(n => (
                  <span 
                    key={n} 
                    className="inline-block bg-stone-200 px-2 py-0.5 rounded mr-1 mb-1 cursor-pointer hover:bg-emerald-100"
                    onClick={() => setCharacter({...character, name: n})}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-600 mb-1">外貌 / 携带物品</label>
              <textarea 
                className="w-full p-3 bg-white border-2 border-stone-300 rounded-lg focus:border-emerald-500 outline-none h-24"
                placeholder="甚至可以是你捡到的垃圾..."
                value={character.appearance || ''}
                onChange={(e) => setCharacter({...character, appearance: e.target.value})}
              />
            </div>
          </div>
        </Card>

        <Card title="高级专长">
          <p className="text-sm text-stone-600 mb-4">选择一项作为初始高级专长：</p>
          <div className="space-y-3">
            {role.advancedSpecialties.map(spec => (
              <label key={spec.name} className="flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-white border-stone-300 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50">
                <input 
                  type="radio" 
                  name="advanced_spec" 
                  className="mt-1 w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                  checked={character.selectedAdvancedSpecialty === spec.name}
                  onChange={() => setCharacter({...character, selectedAdvancedSpecialty: spec.name})}
                />
                <div>
                  <div className="font-bold text-stone-800">{spec.name} {spec.effect && <span className="text-xs text-emerald-600 bg-emerald-100 px-1 rounded ml-1">{spec.effect}</span>}</div>
                  <div className="text-sm text-stone-600 leading-tight mt-1">{spec.description}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-[#fdf6e3] border-t border-stone-200 flex gap-4 z-10">
          <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">上一步</Button>
          <Button 
            disabled={!character.name || !character.selectedAdvancedSpecialty} 
            onClick={() => setStep(5)} 
            className="flex-[2]"
          >
            完成创建
          </Button>
        </div>
      </div>
    );
  };

  const renderSpecialtyModal = () => {
    // Determine which roles/specialties to show
    const currentRole = ROLES.find(r => r.id === character.roleId);
    
    // For Mission: Only current role's ADVANCED specialties
    // For Achievement: ALL roles, ALL specialties
    let rolesToShow = specialtySelectionMode === 'mission' && currentRole ? [currentRole] : ROLES;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-[#fdf6e3] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl border-4 border-stone-800">
          <h2 className="text-2xl font-display text-emerald-900 mb-1">
            {specialtySelectionMode === 'mission' ? '任务成功：选择奖励' : '功绩合成：解锁新能力'}
          </h2>
          <p className="text-stone-600 mb-4 text-sm">
            {specialtySelectionMode === 'mission' 
               ? '任务成功！给你的地精一个新的头衔，并从本职列表中选择一个高级专长。'
               : '两个功绩合成了一个传说！给这个新头衔命名，并从任意职业（包括初始和高级）中选择一个新专长！'}
          </p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-stone-600 mb-1">新头衔名称</label>
              <input 
                type="text" 
                className="w-full p-2 bg-white border-2 border-stone-300 rounded font-display text-lg"
                placeholder={specialtySelectionMode === 'achievement' ? "例如：屠龙者 (自动合并建议)" : "例如：蘑菇采集者"}
                value={newTitleName}
                onChange={(e) => setNewTitleName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-600 mb-2">选择奖励专长</label>
              <div className="h-72 overflow-y-auto border-2 border-stone-300 rounded bg-white p-2 space-y-4">
                {rolesToShow.map(role => {
                  // Filter specialties based on rules
                  const startingSpecs = specialtySelectionMode === 'achievement' ? role.startingSpecialties : [];
                  const advancedSpecs = role.advancedSpecialties; // Always allowed for own class in mission, and all classes in achievement

                  const allSpecsForRole = [...startingSpecs, ...advancedSpecs];
                  if (allSpecsForRole.length === 0) return null;

                  return (
                    <div key={role.id}>
                      <h4 className="font-bold text-stone-500 bg-stone-100 p-1 mb-2 sticky top-0 flex justify-between">
                        <span>{role.name}</span>
                        {specialtySelectionMode === 'achievement' && role.id !== character.roleId && <span className="text-xs font-normal text-stone-400">跨职业</span>}
                      </h4>
                      <div className="space-y-2">
                        {allSpecsForRole.map(spec => {
                          const owned = isSpecialtyOwned(spec.name);
                          return (
                            <label key={spec.name} className={`flex items-start gap-2 p-2 rounded border border-transparent ${owned ? 'opacity-40 cursor-not-allowed bg-stone-100' : 'hover:bg-emerald-50 cursor-pointer has-[:checked]:border-emerald-500'}`}>
                              <input 
                                type="radio" 
                                name="new_spec" 
                                className="mt-1"
                                disabled={owned}
                                onChange={() => setSelectedSpec({...spec, sourceRole: role.name})}
                                checked={selectedSpec?.name === spec.name}
                              />
                              <div className="flex-1">
                                <div className="font-bold text-sm text-stone-800 flex justify-between">
                                  <span>{spec.name}</span>
                                  {spec.type === 'starting' && <span className="text-[10px] bg-stone-200 px-1 rounded text-stone-600">初始</span>}
                                </div>
                                <div className="text-xs text-stone-500">{spec.description}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowSpecialtyModal(false)} className="flex-1">取消</Button>
            <Button onClick={confirmAddTitle} className="flex-1">获得头衔与专长</Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDiceModal = () => {
    const highest = rollResults.length > 0 ? Math.max(...rollResults) : 0;
    const resultInfo = getRollResultText(highest);

    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-[#fdf6e3] w-full max-w-sm rounded-2xl p-6 shadow-2xl border-4 border-stone-800 relative">
          <button 
             onClick={() => setShowDiceModal(false)}
             className="absolute top-2 right-2 p-2 text-stone-400 hover:text-stone-600"
          >
             <X size={24} />
          </button>
          
          <div className="text-center mb-6">
             <h2 className="text-2xl font-display text-emerald-900 mb-1">{diceConfig.label} 检定</h2>
             <p className="text-stone-500 text-sm">点击 +/- 调整骰子数量</p>
          </div>

          {/* Dice Count Control */}
          <div className="flex items-center justify-center gap-6 mb-8">
             <button 
               onClick={() => setCurrentDiceCount(Math.max(1, currentDiceCount - 1))}
               className="w-12 h-12 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-300 font-bold text-xl active:scale-95 transition-transform"
             >
               -
             </button>
             <div className="text-5xl font-display text-stone-800 w-16 text-center">
               {currentDiceCount}
             </div>
             <button 
               onClick={() => setCurrentDiceCount(currentDiceCount + 1)}
               className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 font-bold text-xl active:scale-95 transition-transform shadow-md"
             >
               +
             </button>
          </div>

          {/* Roll Button */}
          <Button 
             onClick={rollDice} 
             disabled={isRolling}
             className={`w-full text-xl py-4 mb-6 ${isRolling ? 'opacity-80' : ''}`}
          >
             {isRolling ? '投掷中...' : '投掷!'}
          </Button>

          {/* Results */}
          <div className="min-h-[120px] flex flex-col items-center justify-center">
             {rollResults.length > 0 ? (
               <div className="animate-in zoom-in slide-in-from-bottom-4 duration-300">
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                     {rollResults.map((val, idx) => (
                       <DiceIcon 
                         key={idx} 
                         value={val} 
                         size={48} 
                         className={val === highest ? "text-stone-900 drop-shadow-md scale-110" : "text-stone-400"} 
                       />
                     ))}
                  </div>
                  <div className={`text-center font-display text-2xl ${resultInfo.color}`}>
                     {resultInfo.text}
                  </div>
               </div>
             ) : (
               <div className="text-stone-300">
                  <Dices size={48} />
               </div>
             )}
          </div>
        </div>
      </div>
    );
  };

  const renderSheet = () => {
    if (!character.roleId || !character.attributes) return null;
    const role = ROLES.find(r => r.id === character.roleId)!;
    
    // Calculate final stats including bonuses
    const finalArms = (character.attributes.arms.value || 0) + getStatBonus(character, 'arms');
    const finalLegs = (character.attributes.legs.value || 0) + getStatBonus(character, 'legs');
    const finalEyes = (character.attributes.eyes.value || 0) + getStatBonus(character, 'eyes');
    const finalMouth = (character.attributes.mouth.value || 0) + getStatBonus(character, 'mouth');

    const advSpecialty = role.advancedSpecialties.find(s => s.name === character.selectedAdvancedSpecialty);
    const achievements = character.pendingAchievements || ["", ""];
    const canCombine = achievements[0] && achievements[1];

    return (
      <div className="p-4 max-w-2xl mx-auto pb-24 relative">
        {showSpecialtyModal && renderSpecialtyModal()}
        {showDiceModal && renderDiceModal()}

        {/* Top Controls */}
        <div className="flex justify-end gap-2 mb-4">
           <Button variant="ghost" onClick={exportCharacter} title="导出 JSON"><Download size={20}/></Button>
        </div>

        {/* Header */}
        <div className="mb-6 border-b-4 border-emerald-900 pb-2">
            <h1 className="text-4xl font-display text-emerald-900 leading-none">{character.name}</h1>
            <p className="text-stone-600 font-bold flex items-center gap-2 mt-1">
               {role.name}
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <Card className="flex flex-col gap-4 bg-white relative">
              <div className="absolute top-2 right-2 text-[10px] text-stone-400 font-bold bg-stone-100 px-1 rounded">点击投掷</div>
              <div className="grid grid-cols-2 gap-4">
                 <StatBadge icon={Hand} label="手臂" value={finalArms} onClick={() => openDiceRoller('手臂', finalArms)} />
                 <StatBadge icon={Footprints} label="腿脚" value={finalLegs} onClick={() => openDiceRoller('腿脚', finalLegs)} />
                 <StatBadge icon={Eye} label="眼睛" value={finalEyes} onClick={() => openDiceRoller('眼睛', finalEyes)} />
                 <StatBadge icon={MessageCircle} label="嘴巴" value={finalMouth} onClick={() => openDiceRoller('嘴巴', finalMouth)} />
              </div>
              <div className="flex justify-around border-t pt-2 mt-2">
                <div className="text-center">
                   <span className="block text-xs font-bold uppercase text-stone-500">体格</span>
                   <span className="text-sm font-display text-stone-800 leading-tight block min-h-[1.2em]">{character.bodyDescriptor || "-"}</span>
                </div>
                <div className="text-center">
                   <span className="block text-xs font-bold uppercase text-emerald-700">心灵</span>
                   <span className="text-sm font-display text-emerald-800 leading-tight block min-h-[1.2em]">{character.mindDescriptor || "-"}</span>
                </div>
              </div>
           </Card>
           
           <div className="flex flex-col gap-2">
              {[
                {k: 'arms', l: '的手臂'}, {k: 'legs', l: '的腿脚'}, {k: 'eyes', l: '的眼睛'}, {k: 'mouth', l: '的嘴巴'}
              ].map(item => (
                <div key={item.k} className="bg-stone-200 p-2 rounded text-xs text-stone-600 italic">
                   {character.attributes?.[item.k as AttributeType].descriptor || "..."} {item.l}
                </div>
              ))}
              <Button variant="secondary" onClick={() => openDiceRoller('普通', 2)} className="mt-auto text-sm py-2 bg-white border-stone-300">
                <Dices size={16} /> 自定义投掷
              </Button>
           </div>
        </div>

        {/* Titles List */}
        <div className="mb-6">
           <div className="flex justify-between items-end border-b-2 border-stone-300 pb-1 mb-3">
             <h3 className="font-display text-2xl text-stone-800">头衔</h3>
             <Button variant="ghost" className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-1" onClick={() => initiateAddTitle('mission')}>
                <Crown size={16} /> 任务成功
             </Button>
           </div>
           
           {(character.titles?.length || 0) === 0 && <p className="text-stone-400 italic text-sm">暂无头衔。</p>}
           
           {character.titles?.map((t, idx) => (
             <div key={idx} className="bg-white p-3 rounded shadow-sm border border-amber-300 mb-2 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-amber-100 px-2 py-1 text-[10px] text-amber-800 border-bl rounded-bl flex items-center gap-1">
                  {t.type === 'achievement_merge' && <Puzzle size={10} />}
                  {t.dateObtained}
               </div>
               <div className="font-display text-xl text-amber-800 mb-1">{t.name}</div>
               {t.grantedSpecialty && (
                  <div className="text-sm pl-2 border-l-2 border-emerald-300">
                    <span className="font-bold text-stone-700">{t.grantedSpecialty.name}</span>
                    <span className="text-[10px] text-stone-400 ml-2">[{t.grantedSpecialty.sourceRole}]</span>
                    <p className="text-stone-500 text-xs">{t.grantedSpecialty.description}</p>
                  </div>
               )}
             </div>
           ))}
        </div>

        {/* Campaign Section: Achievements */}
        <Card className="mb-6 bg-amber-50" title="功绩">
           <p className="text-xs text-stone-500 mb-2">每个任务最多只能获得一个功绩。两个功绩可以合成一个头衔。</p>
           <div className="flex flex-col gap-2">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="功绩 1..."
                  className="w-full p-2 pr-8 border border-stone-300 rounded focus:border-emerald-500 outline-none bg-white text-stone-900"
                  value={achievements[0]}
                  onChange={(e) => handleAchievementChange(0, e.target.value)}
                />
                {achievements[0] && <Check size={16} className="absolute right-2 top-3 text-emerald-500" />}
             </div>
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="功绩 2..."
                  className="w-full p-2 pr-8 border border-stone-300 rounded focus:border-emerald-500 outline-none bg-white text-stone-900"
                  value={achievements[1]}
                  onChange={(e) => handleAchievementChange(1, e.target.value)}
                />
                {achievements[1] && <Check size={16} className="absolute right-2 top-3 text-emerald-500" />}
             </div>
           </div>
           
           {canCombine && (
             <Button onClick={() => initiateAddTitle('achievement')} className="w-full mt-3 text-sm py-2 bg-amber-600 border-amber-800 text-white animate-pulse">
               <Puzzle size={16} /> 合成头衔 & 选择任意专长
             </Button>
           )}
        </Card>

        {/* Specialties */}
        <div className="space-y-4 mb-8">
           <h3 className="font-display text-2xl text-stone-800 border-b-2 border-stone-300 pb-1">职业专长</h3>
           {/* Starting */}
           {role.startingSpecialties.map(spec => (
             <div key={spec.name} className="bg-white p-3 rounded shadow-sm border border-stone-200">
               <div className="font-bold text-emerald-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {spec.name}
                  {spec.effect && <span className="text-xs bg-emerald-100 text-emerald-700 px-1 rounded ml-auto">{spec.effect}</span>}
               </div>
               <p className="text-sm text-stone-600 mt-1">{spec.description}</p>
             </div>
           ))}
           {/* Initial Advanced */}
           {advSpecialty && (
             <div className="bg-emerald-50 p-3 rounded shadow-sm border border-emerald-200">
               <div className="font-bold text-emerald-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {advSpecialty.name}
                  {advSpecialty.effect && <span className="text-xs bg-emerald-100 text-emerald-700 px-1 rounded ml-auto">{advSpecialty.effect}</span>}
               </div>
               <p className="text-sm text-stone-600 mt-1">{advSpecialty.description}</p>
             </div>
           )}
        </div>

        {/* Actions */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-[#fdf6e3] border-t border-stone-200 flex gap-2 z-10">
           <Button variant="secondary" onClick={() => setStep(0)} className="flex-1 text-sm"><Home size={16}/> 返回主页</Button>
           <Button variant="outline" onClick={() => setStep(3)} className="flex-1 text-sm"><ChevronLeft size={16}/> 修改资料</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-5 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
      
      {step === 0 && renderIntro()}
      {step === 1 && renderRoleSelection()}
      {step === 2 && renderAttributes()}
      {step === 3 && renderIdentity()}
      {step === 5 && renderSheet()}
    </div>
  );
}