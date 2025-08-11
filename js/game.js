// 游戏设置变量
let selectedRange = 10; // 默认范围
let selectedOperation = 'multiplication'; // 默认运算类型
let selectedDifficulty = 'noCarry'; // 默认难度

let currentScore = 0;
let timeLeft = 120; // 默认2分钟
let selectedTime = 120; // 用户选择的时间
let timer = null;
let gameActive = false;
let currentAnswer = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

// A、B、C选项相关变量
let optionA = 0;
let optionB = 0;
let optionC = 0;
let correctOption = ''; // 'A'、'B' 或 'C'

// 上一道题目的信息，用于避免重复
let lastQuestion = {
  num1: 0,
  num2: 0,
  operation: '',
  answer: 0
};

// 使用Web Audio API创建音效
let audioContext;
let correctSoundBuffer;
let wrongSoundBuffer;
let inputTimer; // 用于检测停止输入的定时器
let hasAnswered = false; // 标记是否已经回答过当前题目

// 初始化音频上下文
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// 创建简单的提示音
function createBeepSound(frequency, duration, type = 'sine') {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// 播放音效的函数
function playSound(soundType) {
  try {
    initAudio();
    
    if (soundType === 'correctSound') {
      // 播放愉快的上升音调
      createBeepSound(523.25, 0.1); // C5
      setTimeout(() => createBeepSound(659.25, 0.1), 50); // E5
      setTimeout(() => createBeepSound(783.99, 0.15), 100); // G5
    } else if (soundType === 'wrongSound') {
      // 播放低沉的错误音
      createBeepSound(220, 0.3, 'sawtooth'); // A3
    }
  } catch (e) {
    console.log('音效播放失败:', e);
  }
}

// 范围选择函数
function selectRange(range) {
  selectedRange = range;
  
  // 直接移除所有预设范围按钮的激活状态
  document.getElementById('range10').classList.remove('active');
  document.getElementById('range50').classList.remove('active');
  document.getElementById('range100').classList.remove('active');
  
  // 激活当前选择的按钮
  if (range === 10) {
    document.getElementById('range10').classList.add('active');
  } else if (range === 50) {
    document.getElementById('range50').classList.add('active');
  } else if (range === 100) {
    document.getElementById('range100').classList.add('active');
  }
  
  // 更新自定义输入框
  document.getElementById('customRangeInput').value = range;
  
  // 重置自定义输入框的视觉状态
  resetCustomRangeStyle();
}

// 设置自定义范围
function setCustomRange() {
  const customRange = parseInt(document.getElementById('customRangeInput').value);
  if (customRange >= 1 && customRange <= 1000) {
    selectedRange = customRange;
    
    // 直接移除所有预设范围按钮的激活状态
    document.getElementById('range10').classList.remove('active');
    document.getElementById('range50').classList.remove('active');
    document.getElementById('range100').classList.remove('active');
    
    // 为自定义输入框添加视觉反馈
    const customRangeInput = document.getElementById('customRangeInput');
    customRangeInput.style.borderColor = '#34c759';
    customRangeInput.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)';
  } else {
    alert('请输入1-1000之间的数字！');
  }
}

// 当用户在自定义输入框中输入时，自动应用该值为选中范围
function updateCustomRange() {
  const customRangeInput = document.getElementById('customRangeInput');
  const customRange = parseInt(customRangeInput.value);
  if (!isNaN(customRange) && customRange >= 1 && customRange <= 1000) {
    selectedRange = customRange;
    
    // 直接移除所有预设范围按钮的激活状态
    document.getElementById('range10').classList.remove('active');
    document.getElementById('range50').classList.remove('active');
    document.getElementById('range100').classList.remove('active');
    
    // 为自定义输入框添加视觉反馈
    customRangeInput.style.borderColor = '#34c759';
    customRangeInput.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)';
  }
}

// 重置自定义输入框的视觉状态
function resetCustomRangeStyle() {
  const customRangeInput = document.getElementById('customRangeInput');
  customRangeInput.style.borderColor = '#d1d1d6';
  customRangeInput.style.boxShadow = 'none';
}

// 运算类型选择函数
function selectOperation(operation) {
  selectedOperation = operation;
  
  // 更新界面显示
  const buttons = document.querySelectorAll('#gameSettings .options-row:nth-child(2) .setting-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (operation === 'multiplication') {
    document.getElementById('opMultiplication').classList.add('active');
  } else if (operation === 'addition') {
    document.getElementById('opAddition').classList.add('active');
  } else if (operation === 'subtraction') {
    document.getElementById('opSubtraction').classList.add('active');
  } else if (operation === 'division') {
    document.getElementById('opDivision').classList.add('active');
  }
  
  // 根据运算类型更新难度选项显示
  updateDifficultyOptions();
}

// 更新难度选项显示
function updateDifficultyOptions() {
  const difficultyOptions = document.getElementById('difficultyOptions');
  
  if (selectedOperation === 'addition' || selectedOperation === 'multiplication') {
    difficultyOptions.innerHTML = `
      <button class="setting-btn active" onclick="selectDifficulty('noCarry')" id="diffNoCarry">不进位</button>
      <button class="setting-btn" onclick="selectDifficulty('carry')" id="diffCarry">进位</button>
    `;
  } else {
    difficultyOptions.innerHTML = `
      <button class="setting-btn active" onclick="selectDifficulty('noCarry')" id="diffNoCarry">不退位</button>
      <button class="setting-btn" onclick="selectDifficulty('carry')" id="diffCarry">退位</button>
    `;
  }
  
  // 重新设置当前选中的难度
  if (selectedDifficulty === 'noCarry') {
    document.getElementById('diffNoCarry').classList.add('active');
  } else {
    document.getElementById('diffCarry').classList.add('active');
  }
}

// 难度选择函数
function selectDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  
  // 更新界面显示
  const buttons = document.querySelectorAll('#difficultyOptions .setting-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (difficulty === 'noCarry') {
    document.getElementById('diffNoCarry').classList.add('active');
  } else {
    document.getElementById('diffCarry').classList.add('active');
  }
}

// 选择预设时间
function selectTime(seconds, element) {
  selectedTime = seconds;
  timeLeft = seconds;
  
  // 更新界面显示
  document.getElementById('timeLeft').textContent = timeLeft;
  document.getElementById('customTimeInput').value = seconds;
  
  // 更新按钮状态
  const buttons = document.querySelectorAll('.time-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
}

// 设置自定义时间
function setCustomTime() {
  const customTime = parseInt(document.getElementById('customTimeInput').value);
  if (customTime >= 30 && customTime <= 1800) {
    selectedTime = customTime;
    timeLeft = customTime;
    
    // 更新界面显示
    document.getElementById('timeLeft').textContent = timeLeft;
    
    // 移除所有预设按钮的激活状态
    const buttons = document.querySelectorAll('.time-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
  } else {
    alert('请输入30-1800秒之间的时间！');
  }
}

// 模态对话框函数
function openSettingsModal() {
  // 初始化模态对话框中的设置值
  initializeModalSettings();
  document.getElementById('settingsModal').style.display = 'block';
}

function closeSettingsModal() {
  document.getElementById('settingsModal').style.display = 'none';
}

// 初始化模态对话框中的设置值
function initializeModalSettings() {
  // 范围选择
  const rangeButtons = document.querySelectorAll('#settingsModal .options-grid:first-child .option-btn');
  rangeButtons.forEach(btn => btn.classList.remove('active'));
  
  if (selectedRange === 10) {
    document.getElementById('modalRange10').classList.add('active');
  } else if (selectedRange === 50) {
    document.getElementById('modalRange50').classList.add('active');
  } else if (selectedRange === 100) {
    document.getElementById('modalRange100').classList.add('active');
  } else {
    // 自定义范围
    document.getElementById('modalCustomRangeInput').value = selectedRange;
  }
  
  // 类型选择
  const operationButtons = document.querySelectorAll('#settingsModal .setting-section:nth-child(2) .option-btn');
  operationButtons.forEach(btn => btn.classList.remove('active'));
  
  if (selectedOperation === 'multiplication') {
    document.getElementById('modalOpMultiplication').classList.add('active');
  } else if (selectedOperation === 'addition') {
    document.getElementById('modalOpAddition').classList.add('active');
  } else if (selectedOperation === 'subtraction') {
    document.getElementById('modalOpSubtraction').classList.add('active');
  } else if (selectedOperation === 'division') {
    document.getElementById('modalOpDivision').classList.add('active');
  }
  
  // 难度选择
  updateModalDifficultyOptions();
  
  // 时间选择
  const timeButtons = document.querySelectorAll('#settingsModal .setting-section:nth-child(4) .option-btn');
  timeButtons.forEach(btn => btn.classList.remove('active'));
  
  if (selectedTime === 60) {
    document.querySelector('#settingsModal .setting-section:nth-child(4) .option-btn:nth-child(1)').classList.add('active');
  } else if (selectedTime === 120) {
    document.querySelector('#settingsModal .setting-section:nth-child(4) .option-btn:nth-child(2)').classList.add('active');
  } else if (selectedTime === 180) {
    document.querySelector('#settingsModal .setting-section:nth-child(4) .option-btn:nth-child(3)').classList.add('active');
  } else if (selectedTime === 300) {
    document.querySelector('#settingsModal .setting-section:nth-child(4) .option-btn:nth-child(4)').classList.add('active');
  }
  
  // 自定义时间输入框
  document.getElementById('modalCustomTimeInput').value = selectedTime;
  
  // 设置"每次启动时都显示设置对话框"复选框的状态
  const alwaysShowSettings = localStorage.getItem('showSettingsOnLoad');
  document.getElementById('alwaysShowSettings').checked = (alwaysShowSettings !== 'false');
}

// 更新模态对话框中的难度选项显示
function updateModalDifficultyOptions() {
  const difficultyOptions = document.getElementById('modalDifficultyOptions');
  
  if (selectedOperation === 'addition' || selectedOperation === 'multiplication') {
    difficultyOptions.innerHTML = `
      <button class="option-btn active" onclick="modalSelectDifficulty('noCarry')" id="modalDiffNoCarry">不进位</button>
      <button class="option-btn" onclick="modalSelectDifficulty('carry')" id="modalDiffCarry">进位</button>
    `;
  } else {
    difficultyOptions.innerHTML = `
      <button class="option-btn active" onclick="modalSelectDifficulty('noCarry')" id="modalDiffNoCarry">不退位</button>
      <button class="option-btn" onclick="modalSelectDifficulty('carry')" id="modalDiffCarry">退位</button>
    `;
  }
  
  // 重新设置当前选中的难度
  if (selectedDifficulty === 'noCarry') {
    document.getElementById('modalDiffNoCarry').classList.add('active');
  } else {
    document.getElementById('modalDiffCarry').classList.add('active');
  }
}

// 重置模态对话框中的自定义范围输入框视觉状态
function resetModalCustomRangeStyle() {
  const customRangeInput = document.getElementById('modalCustomRangeInput');
  customRangeInput.style.borderColor = '#d1d1d6';
  customRangeInput.style.boxShadow = 'none';
}

// 模态对话框中的范围选择函数
function modalSelectRange(range) {
  selectedRange = range;
  
  // 直接移除所有预设范围按钮的激活状态
  document.getElementById('modalRange10').classList.remove('active');
  document.getElementById('modalRange50').classList.remove('active');
  document.getElementById('modalRange100').classList.remove('active');
  
  // 移除自定义输入框的激活样式
  resetModalCustomRangeStyle();
  
  // 激活当前选择的按钮
  if (range === 10) {
    document.getElementById('modalRange10').classList.add('active');
  } else if (range === 50) {
    document.getElementById('modalRange50').classList.add('active');
  } else if (range === 100) {
    document.getElementById('modalRange100').classList.add('active');
  }
  
  // 更新自定义输入框的值
  document.getElementById('modalCustomRangeInput').value = range;
}

// 模态对话框中的自定义范围更新函数
function updateModalCustomRange() {
  const customRangeInput = document.getElementById('modalCustomRangeInput');
  const customRange = parseInt(customRangeInput.value);
  if (!isNaN(customRange) && customRange >= 1 && customRange <= 1000) {
    selectedRange = customRange;
    
    // 直接移除所有预设范围按钮的激活状态
    document.getElementById('modalRange10').classList.remove('active');
    document.getElementById('modalRange50').classList.remove('active');
    document.getElementById('modalRange100').classList.remove('active');
    
    // 为自定义输入框添加视觉反馈
    customRangeInput.style.borderColor = '#34c759';
    customRangeInput.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)';
  }
}

// 模态对话框中的设置自定义范围函数
function setModalCustomRange() {
  const customRange = parseInt(document.getElementById('modalCustomRangeInput').value);
  if (customRange >= 1 && customRange <= 1000) {
    selectedRange = customRange;
    
    // 直接移除所有预设范围按钮的激活状态
    document.getElementById('modalRange10').classList.remove('active');
    document.getElementById('modalRange50').classList.remove('active');
    document.getElementById('modalRange100').classList.remove('active');
    
    // 为自定义输入框添加视觉反馈
    const customRangeInput = document.getElementById('modalCustomRangeInput');
    customRangeInput.style.borderColor = '#34c759';
    customRangeInput.style.boxShadow = '0 0 0 2px rgba(52, 199, 89, 0.2)';
  } else {
    alert('请输入1-1000之间的数字！');
  }
}

// 模态对话框中的运算类型选择函数
function modalSelectOperation(operation) {
  selectedOperation = operation;
  
  const buttons = document.querySelectorAll('#settingsModal .setting-section:nth-child(2) .option-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (operation === 'multiplication') {
    document.getElementById('modalOpMultiplication').classList.add('active');
  } else if (operation === 'addition') {
    document.getElementById('modalOpAddition').classList.add('active');
  } else if (operation === 'subtraction') {
    document.getElementById('modalOpSubtraction').classList.add('active');
  } else if (operation === 'division') {
    document.getElementById('modalOpDivision').classList.add('active');
  }
  
  // 根据运算类型更新难度选项显示
  updateModalDifficultyOptions();
}

// 模态对话框中的难度选择函数
function modalSelectDifficulty(difficulty) {
  const buttons = document.querySelectorAll('#modalDifficultyOptions .option-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (difficulty === 'noCarry') {
    document.getElementById('modalDiffNoCarry').classList.add('active');
  } else {
    document.getElementById('modalDiffCarry').classList.add('active');
  }
}

// 模态对话框中的时间选择函数
function modalSelectTime(seconds, element) {
  const buttons = document.querySelectorAll('#settingsModal .setting-section:nth-child(4) .option-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
}

// 模态对话框中的设置自定义时间函数
function setModalCustomTime() {
  const customTime = parseInt(document.getElementById('modalCustomTimeInput').value);
  if (customTime < 30 || customTime > 1800) {
    alert('请输入30-1800秒之间的时间！');
  }
}

// 保存设置并关闭模态对话框
function saveSettingsAndClose() {
  // 获取模态对话框中的设置值并应用到主设置中
  // 范围设置
  const rangeButtons = document.querySelectorAll('#settingsModal .options-grid:first-child .option-btn.active');
  if (rangeButtons.length > 0) {
    // 检查是否选择了预设范围
    if (document.getElementById('modalRange10').classList.contains('active')) {
      selectRange(10);
    } else if (document.getElementById('modalRange50').classList.contains('active')) {
      selectRange(50);
    } else if (document.getElementById('modalRange100').classList.contains('active')) {
      selectRange(100);
    } else {
      // 使用自定义范围
      const customRange = parseInt(document.getElementById('modalCustomRangeInput').value);
      if (customRange >= 1 && customRange <= 1000) {
        selectedRange = customRange;
        resetCustomRangeStyle();
      }
    }
  }
  
  // 类型设置
  if (document.getElementById('modalOpMultiplication').classList.contains('active')) {
    selectOperation('multiplication');
  } else if (document.getElementById('modalOpAddition').classList.contains('active')) {
    selectOperation('addition');
  } else if (document.getElementById('modalOpSubtraction').classList.contains('active')) {
    selectOperation('subtraction');
  } else if (document.getElementById('modalOpDivision').classList.contains('active')) {
    selectOperation('division');
  }
  
  // 难度设置
  if (document.getElementById('modalDiffNoCarry').classList.contains('active')) {
    selectDifficulty('noCarry');
  } else if (document.getElementById('modalDiffCarry').classList.contains('active')) {
    selectDifficulty('carry');
  }
  
  // 时间设置
  const timeButtons = document.querySelectorAll('#settingsModal .setting-section:nth-child(4) .option-btn.active');
  if (timeButtons.length > 0) {
    if (document.querySelector('#settingsModal .setting-section:nth-child(4) .option-btn:nth-child(1)').classList.contains('active')) {
      selectTime(60, document.querySelector('.time-btn:nth-child(1)'));
    } else if (document.querySelector('#settingsModal .setting-section:nth-child(4) .option-btn:nth-child(2)').classList.contains('active')) {
      selectTime(120, document.querySelector('.time-btn:nth-child(2)'));
    } else if (document.querySelector('#settingsModal .setting-section:nth-child(4) .option-btn:nth-child(3)').classList.contains('active')) {
      selectTime(180, document.querySelector('.time-btn:nth-child(3)'));
    } else if (document.querySelector('#settingsModal .setting-section:nth-child(4) .option-btn:nth-child(4)').classList.contains('active')) {
      selectTime(300, document.querySelector('.time-btn:nth-child(4)'));
    } else {
      // 使用自定义时间
      const customTime = parseInt(document.getElementById('modalCustomTimeInput').value);
      if (customTime >= 30 && customTime <= 1800) {
        selectedTime = customTime;
        timeLeft = customTime;
        document.getElementById('timeLeft').textContent = timeLeft;
        document.getElementById('customTimeInput').value = customTime;
        
        // 移除所有预设按钮的激活状态
        const buttons = document.querySelectorAll('.time-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
      }
    }
  }
  
  // 保存用户关于是否每次启动都显示设置对话框的选择
  const alwaysShowSettings = document.getElementById('alwaysShowSettings').checked;
  localStorage.setItem('showSettingsOnLoad', alwaysShowSettings ? 'true' : 'false');
  
  // 显示设置按钮
  document.getElementById('settingsButton').style.display = 'block';
  
  // 启用开始按钮
  const startBtn = document.getElementById('startBtn');
  startBtn.disabled = false;
  startBtn.style.opacity = '1';
  
  // 关闭模态对话框
  closeSettingsModal();
}

// 生成错误选项
function generateWrongOption(correctAnswer) {
  // 生成一个与正确答案不同的随机数
  let wrongOption;
  do {
    // 根据正确答案的大小范围生成错误选项
    if (correctAnswer < 10) {
      wrongOption = Math.floor(Math.random() * 20);
    } else if (correctAnswer < 50) {
      wrongOption = Math.floor(Math.random() * 100);
    } else if (correctAnswer < 100) {
      wrongOption = Math.floor(Math.random() * 200);
    } else {
      wrongOption = Math.floor(Math.random() * correctAnswer * 2);
    }
    
    // 确保错误选项不为负数
    wrongOption = Math.abs(wrongOption);
    
    // 确保错误选项不等于正确答案
    if (wrongOption === correctAnswer) {
      wrongOption = correctAnswer + Math.floor(Math.random() * 10) + 1;
    }
  } while (wrongOption === correctAnswer);
  
  return wrongOption;
}

// 随机生成题目
function generateQuestion() {
  let num1, num2;
  let maxNum = selectedRange;
  
  // 根据运算类型生成题目
  let isSameAsLast = false;
  if (selectedOperation === 'multiplication') {
    // 乘法
    do {
      num1 = Math.floor(Math.random() * Math.min(9, maxNum)) + 1;
      num2 = Math.floor(Math.random() * Math.min(9, maxNum)) + 1;
      // 避免1*X的题目
      // 避免与上一题相同
      isSameAsLast = (num1 === lastQuestion.num1 && num2 === lastQuestion.num2 && selectedOperation === lastQuestion.operation) ||
                     (num1 === lastQuestion.num2 && num2 === lastQuestion.num1 && selectedOperation === lastQuestion.operation);
    } while (!checkDifficulty(num1, num2, selectedOperation, selectedDifficulty) || 
             num1 === 1 || num2 === 1 || isSameAsLast);
    
    currentAnswer = num1 * num2;
    document.getElementById('question').textContent = `${num1} × ${num2} = `;
  } else if (selectedOperation === 'addition') {
    // 加法
    do {
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * maxNum) + 1;
      // 避免与上一题相同
      isSameAsLast = (num1 === lastQuestion.num1 && num2 === lastQuestion.num2 && selectedOperation === lastQuestion.operation) ||
                     (num1 === lastQuestion.num2 && num2 === lastQuestion.num1 && selectedOperation === lastQuestion.operation);
    } while (!checkDifficulty(num1, num2, selectedOperation, selectedDifficulty) || isSameAsLast);
    
    currentAnswer = num1 + num2;
    document.getElementById('question').textContent = `${num1} + ${num2} = `;
  } else if (selectedOperation === 'subtraction') {
    // 减法
    do {
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * maxNum) + 1;
      // 确保结果为正数
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      // 避免与上一题相同
      isSameAsLast = (num1 === lastQuestion.num1 && num2 === lastQuestion.num2 && selectedOperation === lastQuestion.operation);
    } while (!checkDifficulty(num1, num2, selectedOperation, selectedDifficulty) || isSameAsLast);
    
    currentAnswer = num1 - num2;
    document.getElementById('question').textContent = `${num1} - ${num2} = `;
  } else if (selectedOperation === 'division') {
    // 除法
    do {
      num2 = Math.floor(Math.random() * (maxNum - 1)) + 1; // 除数不能为0
      if (selectedDifficulty === 'noCarry') {
        // 整除情况：生成一个倍数
        const multiplier = Math.floor(Math.random() * (Math.floor(maxNum / num2) - 1)) + 1;
        num1 = num2 * multiplier;
      } else {
        // 非整除情况：确保不能整除
        num1 = Math.floor(Math.random() * maxNum) + 1;
        // 如果随机生成的能整除，则调整一下
        if (num1 % num2 === 0) {
          num1 = num1 + (num2 === 1 ? 1 : 1); // 避免除数为1的情况
          if (num1 > maxNum) num1 = num1 - 2;
        }
      }
      // 避免X/X的题目
      // 避免与上一题相同
      isSameAsLast = (num1 === lastQuestion.num1 && num2 === lastQuestion.num2 && selectedOperation === lastQuestion.operation);
    } while (!checkDifficulty(num1, num2, selectedOperation, selectedDifficulty) || 
             num1 <= 0 || num2 <= 0 || num1 > maxNum || num2 > maxNum ||
             num1 === num2 || isSameAsLast);
    
    currentAnswer = Math.floor(num1 / num2);
    document.getElementById('question').textContent = `${num1} ÷ ${num2} = `;
  }
  
  // 生成A、B、C选项
  // 随机决定正确答案放在哪个选项
  const optionPositions = ['A', 'B', 'C'];
  correctOption = optionPositions[Math.floor(Math.random() * 3)];
  
  if (correctOption === 'A') {
    optionA = currentAnswer;
    optionB = generateWrongOption(currentAnswer);
    optionC = generateWrongOption(currentAnswer);
    // 确保选项C与选项B不同
    while (optionC === optionB) {
      optionC = generateWrongOption(currentAnswer);
    }
  } else if (correctOption === 'B') {
    optionB = currentAnswer;
    optionA = generateWrongOption(currentAnswer);
    optionC = generateWrongOption(currentAnswer);
    // 确保选项C与选项A不同
    while (optionC === optionA) {
      optionC = generateWrongOption(currentAnswer);
    }
  } else {
    optionC = currentAnswer;
    optionA = generateWrongOption(currentAnswer);
    optionB = generateWrongOption(currentAnswer);
    // 确保选项B与选项A不同
    while (optionB === optionA) {
      optionB = generateWrongOption(currentAnswer);
    }
  }
  
  // 更新选项显示
  document.getElementById('optionAText').textContent = optionA;
  document.getElementById('optionBText').textContent = optionB;
  document.getElementById('optionCText').textContent = optionC;
  
  // 重置选项按钮样式
  document.getElementById('optionA').style.backgroundColor = '#007aff';
  document.getElementById('optionB').style.backgroundColor = '#007aff';
  document.getElementById('optionC').style.backgroundColor = '#007aff';
  document.getElementById('optionA').style.borderColor = '';
  document.getElementById('optionB').style.borderColor = '';
  document.getElementById('optionC').style.borderColor = '';
  
  hasAnswered = false; // 重置答题状态
  
  document.getElementById('answerInput').value = '';
  document.getElementById('answerInput').style.display = 'none'; // 隐藏输入框
  document.getElementById('optionsContainer').style.display = 'block'; // 显示选项
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  
  // 保存当前题目信息，用于下一次比较
  lastQuestion.num1 = num1;
  lastQuestion.num2 = num2;
  lastQuestion.operation = selectedOperation;
  lastQuestion.answer = currentAnswer;
  
  // 清除之前的定时器
  if (inputTimer) {
    clearTimeout(inputTimer);
    inputTimer = null;
  }
}

// 检查是否满足难度要求
function checkDifficulty(num1, num2, operation, difficulty) {
  if (operation === 'addition') {
    // 加法
    if (difficulty === 'noCarry') {
      // 不进位：个位数相加不超过10
      return (num1 % 10) + (num2 % 10) < 10;
    } else {
      // 进位：个位数相加超过或等于10
      return (num1 % 10) + (num2 % 10) >= 10;
    }
  } else if (operation === 'subtraction') {
    // 减法
    if (difficulty === 'noCarry') {
      // 不退位：被减数个位数大于等于减数个位数
      return (num1 % 10) >= (num2 % 10);
    } else {
      // 退位：被减数个位数小于减数个位数
      return (num1 % 10) < (num2 % 10);
    }
  } else if (operation === 'multiplication') {
    // 乘法
    if (difficulty === 'noCarry') {
      // 不进位：个位数相乘不超过10
      return (num1 % 10) * (num2 % 10) < 10;
    } else {
      // 进位：个位数相乘超过或等于10
      return (num1 % 10) * (num2 % 10) >= 10;
    }
  } else if (operation === 'division') {
    // 除法
    if (difficulty === 'noCarry') {
      // 不退位：整除
      return num1 % num2 === 0;
    } else {
      // 退位：不能整除
      return num1 % num2 !== 0;
    }
  }
  return true;
}

// 选择选项
function selectOption(selected) {
  if (!gameActive || hasAnswered) return;
  
  hasAnswered = true; // 标记已答题，防止重复选择
  totalQuestions++;
  
  const feedback = document.getElementById('feedback');
  
  // 高亮显示用户选择的选项
  if (selected === 'A') {
    document.getElementById('optionA').style.backgroundColor = '#0056cc';
  } else if (selected === 'B') {
    document.getElementById('optionB').style.backgroundColor = '#0056cc';
  } else if (selected === 'C') {
    document.getElementById('optionC').style.backgroundColor = '#0056cc';
  }
  
  // 检查答案是否正确
  if (selected === correctOption) {
    // 答对了
    correctAnswers++;
    currentScore += 10;
    
    // 高亮显示正确选项为绿色
    if (correctOption === 'A') {
      document.getElementById('optionA').style.backgroundColor = '#34c759';
    } else if (correctOption === 'B') {
      document.getElementById('optionB').style.backgroundColor = '#34c759';
    } else if (correctOption === 'C') {
      document.getElementById('optionC').style.backgroundColor = '#34c759';
    }
    
    feedback.textContent = '🎉 答对了！+10分';
    feedback.className = 'feedback correct';
    playSound('correctSound'); // 播放正确音效
  } else {
    // 答错了
    wrongAnswers++;
    
    // 高亮显示错误选项为红色
    if (selected === 'A') {
      document.getElementById('optionA').style.backgroundColor = '#ff3b30';
    } else if (selected === 'B') {
      document.getElementById('optionB').style.backgroundColor = '#ff3b30';
    } else if (selected === 'C') {
      document.getElementById('optionC').style.backgroundColor = '#ff3b30';
    }
    
    // 高亮显示正确选项为绿色
    if (correctOption === 'A') {
      document.getElementById('optionA').style.backgroundColor = '#34c759';
    } else if (correctOption === 'B') {
      document.getElementById('optionB').style.backgroundColor = '#34c759';
    } else if (correctOption === 'C') {
      document.getElementById('optionC').style.backgroundColor = '#34c759';
    }
    
    feedback.textContent = `❌ 答错了！正确答案是 ${currentAnswer}`;
    feedback.className = 'feedback incorrect';
    playSound('wrongSound'); // 播放错误音效
  }
  
  // 更新显示
  document.getElementById('currentScore').textContent = currentScore;
  updateStats();
  
  // 自动进入下一题
  setTimeout(() => {
    if (gameActive) {
      generateQuestion();
    }
  }, 1500);
}

// 检查答案（保留原来的函数以保持兼容性）
function checkAnswer() {
  if (!gameActive || hasAnswered) return;
  
  const userAnswer = parseInt(document.getElementById('answerInput').value);
  const input = document.getElementById('answerInput');
  const feedback = document.getElementById('feedback');
  
  if (isNaN(userAnswer)) {
    feedback.textContent = '请输入一个数字！';
    feedback.className = 'feedback incorrect';
    return;
  }
  
  hasAnswered = true; // 标记已答题，防止重复校验
  totalQuestions++;
  
  // 清除输入定时器
  if (inputTimer) {
    clearTimeout(inputTimer);
    inputTimer = null;
  }
  
  if (userAnswer === currentAnswer) {
    // 答对了
    correctAnswers++;
    currentScore += 10;
    input.className = 'answer-input correct';
    feedback.textContent = '🎉 答对了！+10分';
    feedback.className = 'feedback correct';
    playSound('correctSound'); // 播放正确音效
  } else {
    // 答错了
    wrongAnswers++;
    input.className = 'answer-input incorrect';
    feedback.textContent = `❌ 答错了！正确答案是 ${currentAnswer}`;
    feedback.className = 'feedback incorrect';
    playSound('wrongSound'); // 播放错误音效
  }
  
  // 更新显示
  document.getElementById('currentScore').textContent = currentScore;
  updateStats();
  
  // 自动进入下一题
  setTimeout(() => {
    if (gameActive) {
      generateQuestion();
    }
  }, 1500);
}

// 开始游戏
function startGame() {
  // 初始化音频（需要用户交互）
  initAudio();
  
  gameActive = true;
  currentScore = 0;
  timeLeft = selectedTime; // 使用用户选择的时间
  totalQuestions = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  
  // 更新UI
  document.getElementById('currentScore').textContent = currentScore;
  document.getElementById('timeLeft').textContent = timeLeft;
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';
  document.getElementById('answerInput').style.display = 'none'; // 隐藏输入框
  document.getElementById('optionsContainer').style.display = 'block'; // 显示选项
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('gameSettings').style.display = 'none'; // 隐藏游戏设置
  document.getElementById('timeSettings').style.display = 'none'; // 隐藏时间设置
  
  // 开始计时
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timeLeft').textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
  
  // 生成第一题
  generateQuestion();
  updateStats();
}

// 更新统计数据
function updateStats() {
  document.getElementById('totalQuestions').textContent = totalQuestions;
  document.getElementById('correctAnswers').textContent = correctAnswers;
  document.getElementById('wrongAnswers').textContent = wrongAnswers;
  
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  document.getElementById('accuracy').textContent = accuracy + '%';
}

// 结束游戏
function endGame() {
  gameActive = false;
  clearInterval(timer);
  
  // 隐藏游戏元素
  document.getElementById('answerInput').style.display = 'none';
  document.getElementById('optionsContainer').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'inline-block';
  
  // 显示结果
  const gameOver = document.getElementById('gameOver');
  gameOver.style.display = 'block';
  
  document.getElementById('finalScore').textContent = `最终得分: ${currentScore} 分`;
  
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  document.getElementById('finalStats').innerHTML = `
    <p>总共完成 ${totalQuestions} 道题</p>
    <p>答对 ${correctAnswers} 题，答错 ${wrongAnswers} 题</p>
    <p>正确率: ${accuracy}%</p>
    ${accuracy >= 90 ? '<p>🏆 优秀！你是乘法小能手！</p>' : 
      accuracy >= 70 ? '<p>👍 不错！继续努力！</p>' : 
      '<p>💪 加油！多多练习会更好！</p>'}
  `;
  
  document.getElementById('question').textContent = '游戏结束！';
}

// 重新开始游戏
function restartGame() {
  // 清除任何正在进行的定时器
  if (inputTimer) {
    clearTimeout(inputTimer);
    inputTimer = null;
  }
  
  document.getElementById('startBtn').style.display = 'inline-block';
  document.getElementById('restartBtn').style.display = 'none';
  document.getElementById('gameOver').style.display = 'none';
  document.getElementById('gameSettings').style.display = 'block'; // 显示游戏设置
  document.getElementById('timeSettings').style.display = 'block'; // 显示时间设置
  document.getElementById('optionsContainer').style.display = 'none'; // 隐藏选项
  document.getElementById('question').textContent = '点击开始按钮开始游戏！';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  
  // 重置选项按钮样式
  document.getElementById('optionA').style.backgroundColor = '#007aff';
  document.getElementById('optionB').style.backgroundColor = '#007aff';
  document.getElementById('optionC').style.backgroundColor = '#007aff';
  
  // 重置上一题记录
  lastQuestion = {
    num1: 0,
    num2: 0,
    operation: '',
    answer: 0
  };
}

// 输入事件监听器 - 实现停止输入时自动校验
document.getElementById('answerInput').addEventListener('input', function(e) {
  if (!gameActive || hasAnswered) return;
  
  const value = this.value.trim();
  
  // 清除之前的定时器
  if (inputTimer) {
    clearTimeout(inputTimer);
    inputTimer = null;
  }
  
  // 如果输入了有效数字，设置定时器
  if (value !== '' && !isNaN(parseInt(value))) {
    inputTimer = setTimeout(() => {
      if (gameActive && !hasAnswered && this.value.trim() !== '') {
        checkAnswer();
      }
    }, 800); // 800毫秒后自动校验
  }
});

// 回车键立即提交答案
document.getElementById('answerInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    checkAnswer();
  }
});

// 输入框失去焦点时也检查答案
document.getElementById('answerInput').addEventListener('blur', function() {
  if (gameActive && !hasAnswered && this.value.trim() !== '') {
    setTimeout(() => checkAnswer(), 100);
  }
});

// 页面加载完成后自动打开设置对话框
window.onload = function() {
  // 页面加载时始终弹出设置对话框
  // 稍微延迟一下再打开，确保页面完全加载
  setTimeout(function() {
    openSettingsModal();
  }, 500);
};