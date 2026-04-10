import React, { useState } from 'react';

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({ 
  children, 
  onClick, 
  className = '' 
}) => {
  // 状态机：静止(idle) -> 悬停进入(hovering) -> 离开退出(leaving)
  const[hoverState, setHoverState] = useState<'idle' | 'hovering' | 'leaving'>('idle');

  const handleMouseEnter = () => {
    setHoverState('hovering');
  };

  const handleMouseLeave = () => {
    setHoverState('leaving');
    // 等待波浪退出动画（600ms）完成后，瞬间重置回初始状态，准备下一次触发
    setTimeout(() => {
      setHoverState('idle');
    }, 600);
  };

  // 根据当前状态计算 SVG 的 Y轴位移 和 过渡动画
  let translateY = '0%';
  let transition = 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)'; // 极致丝滑的缓动曲线

  if (hoverState === 'idle') {
    translateY = '0%';
    transition = 'none'; // 瞬间重置，不需要动画
  } else if (hoverState === 'hovering') {
    translateY = '-40%'; // 向上推，展现 U型白浪
  } else if (hoverState === 'leaving') {
    translateY = '-80%'; // 继续向上推，展现 n型黑底
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // 基础样式：黑色胶囊状、固定高度、居中对齐
      className={`relative overflow-hidden bg-black rounded-full px-10 flex items-center justify-center cursor-pointer h-14 min-w-[160px] ${className}`}
      // 强制开启 3D 渲染层级，防止 mix-blend-mode 穿透污染到网页的背景层
      style={{ transform: 'translateZ(0)' }}
    >
      {/* 细白边框层 (20% 透明度) */}
      <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none z-20" />

      {/* SVG 魔法波浪遮罩（高度是按钮的 5 倍，藏在外面） */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none z-0"
        style={{
          height: '500%',
          transform: `translateY(${translateY})`,
          transition: transition,
        }}
        viewBox="0 0 100 500"
        preserveAspectRatio="none"
      >
        {/* 
            关键路径解析：
            0-150: 黑色空白 (原始状态)
            150-200: U 型向下凹陷的波浪 (Hover进入时)
            200-300: 实心纯白块 (充满按钮)
            300-350: n 型向上凸起的波浪 (Hover离开时)
        */}
        <path
          d="M 0,150 C 30,200 70,200 100,150 L 100,350 C 70,300 30,300 0,350 Z"
          fill="white"
        />
      </svg>

      {/* 文字层：利用 mix-blend-difference 实现遇白变黑，遇黑变白 */}
      <span className="relative z-10 text-white mix-blend-difference font-bold tracking-[0.05em] text-[14px] uppercase whitespace-nowrap">
        {children}
      </span>
    </button>
  );
};

export default LiquidButton;