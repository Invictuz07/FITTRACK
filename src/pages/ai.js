import { html, on } from '../utils/dom.js';
import { navigateTo } from '../router.js';
import { 
  getUser, getStats, getWorkouts, getNutritionLog, 
  getWeightLog, getAISettings, getChatHistory, saveChatHistory 
} from '../store.js';
import { 
  chatWithGemini, streamChatWithGemini, buildUserContext 
} from '../utils/gemini.js';
import { createNavbar } from '../components/navbar.js';
import { showToast, showSuccess } from '../components/toast.js';
import { initScrollReveal, addRipple } from '../utils/scrollReveal.js';
import gsap from 'gsap';

export default async function aiCoachPage() {
  const user = getUser();
  const stats = getStats();
  const aiSettings = getAISettings();
  
  let activeTab = 'chat'; // 'chat' | 'workout' | 'nutrition' | 'progress'
  let chatMessages = getChatHistory();
  let isGenerating = false;

  const page = html(`
    <div class=\"page ai-coach\">
      <div id=\"ai-nav-container\"></div>
      
      <div class=\"page-content\">
        <div class=\"ambient-orb ambient-orb--blue\"></div>
        <div class=\"ambient-orb ambient-orb--purple\"></div>
        
        <div class=\"ai-coach__header reveal\">
          <h2 class=\"ai-coach__header-title\">✨ AI Coach</h2>
          <p class=\"ai-coach__header-desc\">Your personal AI fitness trainer & nutritionist powered by Google Gemini</p>
        </div>

        ${!aiSettings.apiKey ? `
          <div class=\"ai-coach__setup card reveal-scale\">
            <div class=\"ai-coach__setup-icon\">🤖</div>
            <h3 class=\"ai-coach__setup-title\">AI Key Required</h3>
            <p class=\"ai-coach__setup-desc\">To start chatting with your AI coach and generating personalized plans, please add a free Gemini API key in your settings page.</p>
            <button class=\"btn-primary ripple-container\" id=\"go-settings-btn\">Go to Settings →</button>
          </div>
        ` : `
          <div class=\"ai-coach__tabs reveal\">
            <button class=\"ai-coach__tab active\" data-tab=\"chat\">💬 Chat Coach</button>
            <button class=\"ai-coach__tab\" data-tab=\"workout\">💪 Workout Planner</button>
            <button class=\"ai-coach__tab\" data-tab=\"nutrition\">🍳 Meal Planner</button>
            <button class=\"ai-coach__tab\" data-tab=\"progress\">📈 Progress Analysis</button>
          </div>
          
          <div class=\"ai-coach__content\" id=\"ai-tab-content\"></div>
        `}
      </div>
    </div>
  `);

  // Mount Navbar
  page.querySelector('#ai-nav-container').appendChild(createNavbar());

  // Setup button if no API Key
  const goSettingsBtn = page.querySelector('#go-settings-btn');
  if (goSettingsBtn) {
    on(goSettingsBtn, 'click', (e) => {
      addRipple(e);
      setTimeout(() => navigateTo('/settings'), 300);
    });
  }

  // Tabs navigation
  const tabContent = page.querySelector('#ai-tab-content');
  const tabButtons = page.querySelectorAll('.ai-coach__tab');

  function switchTab(tabName) {
    activeTab = tabName;
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    if (tabContent) {
      tabContent.innerHTML = '';
      switch (tabName) {
        case 'chat': renderChatTab(tabContent); break;
        case 'workout': renderWorkoutTab(tabContent); break;
        case 'nutrition': renderNutritionTab(tabContent); break;
        case 'progress': renderProgressTab(tabContent); break;
      }
      
      // Animate tab change
      gsap.fromTo(tabContent.children, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 }
      );
    }
  }

  tabButtons.forEach(btn => {
    on(btn, 'click', (e) => {
      addRipple(e);
      switchTab(btn.dataset.tab);
    });
  });

  // ── Render CHAT Tab ────────────────────────────────────────────────────────
  function renderChatTab(container) {
    container.innerHTML = `
      <div class=\"ai-coach__quick-actions\">
        <button class=\"ai-coach__quick-btn ripple-container\" data-prompt=\"Generate a 15-minute home workout for core strength.\">
          <span class=\"ai-coach__quick-btn-icon\">🏠</span>
          <span class=\"ai-coach__quick-btn-title\">Core Home Workout</span>
          <span class=\"ai-coach__quick-btn-desc\">Quick home core routine</span>
        </button>
        <button class=\"ai-coach__quick-btn ripple-container\" data-prompt=\"What are some healthy high-protein snack alternatives to chips?\">
          <span class=\"ai-coach__quick-btn-icon\">🥚</span>
          <span class=\"ai-coach__quick-btn-title\">High-Protein Snacks</span>
          <span class=\"ai-coach__quick-btn-desc\">Encouraging nutrition tips</span>
        </button>
        <button class=\"ai-coach__quick-btn ripple-container\" data-prompt=\"Give me 5 essential tips to improve my sleep and muscle recovery.\">
          <span class=\"ai-coach__quick-btn-icon\">💤</span>
          <span class=\"ai-coach__quick-btn-title\">Recovery & Sleep</span>
          <span class=\"ai-coach__quick-btn-desc\">Maximize muscle recovery</span>
        </button>
      </div>

      <div class=\"ai-coach__chat\" id=\"chat-box\">
        ${chatMessages.length === 0 ? `
          <div class=\"ai-coach__message ai-coach__message--ai\">
            Hello! I am your AI Coach. How can I help you with your fitness journey today? You can ask me to design custom workouts, critique your diet, or analyze your habits!
          </div>
        ` : chatMessages.map(msg => `
          <div class=\"ai-coach__message ai-coach__message--${msg.role === 'user' ? 'user' : 'ai'}\">
            ${msg.role === 'user' ? msg.content : renderMarkdown(msg.content)}
          </div>
        `).join('')}
      </div>

      <div class=\"ai-coach__input-area\">
        <input class=\"ai-coach__input\" id=\"chat-input\" type=\"text\" placeholder=\"Type a message to your coach...\" />
        <button class=\"ai-coach__send-btn ripple-container\" id=\"send-chat-btn\">Send</button>
      </div>
    `;

    const chatBox = container.querySelector('#chat-box');
    const chatInput = container.querySelector('#chat-input');
    const sendBtn = container.querySelector('#send-chat-btn');
    
    // Auto scroll chat box
    chatBox.scrollTop = chatBox.scrollHeight;

    async function handleSendMessage() {
      const text = chatInput.value.trim();
      if (!text || isGenerating) return;

      chatInput.value = '';
      isGenerating = true;

      // Add user message to UI & history
      chatMessages.push({ role: 'user', content: text });
      saveChatHistory(chatMessages);
      
      const userMsgEl = document.createElement('div');
      userMsgEl.className = 'ai-coach__message ai-coach__message--user';
      userMsgEl.textContent = text;
      chatBox.appendChild(userMsgEl);
      chatBox.scrollTop = chatBox.scrollHeight;

      // Add typing indicator
      const typingEl = document.createElement('div');
      typingEl.className = 'ai-coach__message ai-coach__message--ai typing-indicator';
      typingEl.innerHTML = '<span></span><span></span><span></span>';
      chatBox.appendChild(typingEl);
      chatBox.scrollTop = chatBox.scrollHeight;

      // Build context & send
      const context = buildUserContext(user, stats);
      
      try {
        const responseEl = document.createElement('div');
        responseEl.className = 'ai-coach__message ai-coach__message--ai';
        
        let aiFullText = '';
        
        await streamChatWithGemini(
          aiSettings.apiKey,
          aiSettings.model,
          chatMessages,
          context,
          (chunkText) => {
            if (typingEl.parentNode) typingEl.remove();
            if (!responseEl.parentNode) chatBox.appendChild(responseEl);
            aiFullText = chunkText;
            responseEl.innerHTML = renderMarkdown(chunkText);
            chatBox.scrollTop = chatBox.scrollHeight;
          }
        );

        chatMessages.push({ role: 'ai', content: aiFullText });
        saveChatHistory(chatMessages);
      } catch (err) {
        if (typingEl.parentNode) typingEl.remove();
        showToast({ message: err.message, type: 'error' });
      } finally {
        isGenerating = false;
      }
    }

    on(sendBtn, 'click', (e) => {
      addRipple(e);
      handleSendMessage();
    });

    on(chatInput, 'keypress', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });

    // Quick prompt buttons
    container.querySelectorAll('.ai-coach__quick-btn').forEach(btn => {
      on(btn, 'click', (e) => {
        addRipple(e);
        chatInput.value = btn.dataset.prompt;
        chatInput.focus();
      });
    });
  }

  // ── Render WORKOUT Tab ─────────────────────────────────────────────────────
  function renderWorkoutTab(container) {
    container.innerHTML = `
      <div class=\"card\" style=\"padding:1.5rem; margin-bottom: 2rem;\">
        <h3 style=\"margin-bottom:1rem;\">Customize Your Workout Plan</h3>
        <div class=\"ai-coach__form\">
          <div class=\"settings__group\">
            <label class=\"settings__label\">Focus Area</label>
            <select class=\"input\" id=\"wp-focus\">
              <option value=\"Full Body\">Full Body</option>
              <option value=\"Push Pull Legs (PPL)\">Push Pull Legs (PPL)</option>
              <option value=\"Upper Body\">Upper Body</option>
              <option value=\"Lower Body / Legs\">Lower Body / Legs</option>
              <option value=\"Core / Abs\">Core / Abs</option>
            </select>
          </div>
          <div class=\"settings__group\">
            <label class=\"settings__label\">Equipment Available</label>
            <select class=\"input\" id=\"wp-equip\">
              <option value=\"Full Gym Equipment\">Full Gym Equipment</option>
              <option value=\"Dumbbells & Bench\">Dumbbells Only</option>
              <option value=\"Bodyweight Only\">Bodyweight / Calisthenics</option>
              <option value=\"Resistance Bands\">Resistance Bands</option>
            </select>
          </div>
          <div class=\"settings__group\">
            <label class=\"settings__label\">Duration per Session</label>
            <select class=\"input\" id=\"wp-duration\">
              <option value=\"30\">30 Minutes</option>
              <option value=\"45\" selected>45 Minutes</option>
              <option value=\"60\">60 Minutes</option>
              <option value=\"90\">90 Minutes</option>
            </select>
          </div>
          <div class=\"settings__group\">
            <label class=\"settings__label\">Workout Frequency</label>
            <select class=\"input\" id=\"wp-days\">
              <option value=\"3 days/week\">3 Days / week</option>
              <option value=\"4 days/week\" selected>4 Days / week</option>
              <option value=\"5 days/week\">5 Days / week</option>
            </select>
          </div>
        </div>
        <button class=\"btn-primary ripple-container\" id=\"gen-workout-btn\" style=\"width:100%;\">Generate Plan ✨</button>
      </div>

      <div class=\"ai-coach__plan-container\" id=\"workout-result-box\"></div>
    `;

    const genBtn = container.querySelector('#gen-workout-btn');
    const resultBox = container.querySelector('#workout-result-box');

    on(genBtn, 'click', async (e) => {
      addRipple(e);
      if (isGenerating) return;

      const focus = container.querySelector('#wp-focus').value;
      const equip = container.querySelector('#wp-equip').value;
      const duration = container.querySelector('#wp-duration').value;
      const days = container.querySelector('#wp-days').value;

      isGenerating = true;
      resultBox.innerHTML = `
        <div class=\"ai-coach__plan-card\">
          <h4>Generating Plan...</h4>
          <div class=\"typing-indicator\"><span></span><span></span><span></span></div>
        </div>
      `;

      const prompt = `Create a detailed weekly workout plan focusing on ${focus} using ${equip}. Frequency is ${days} with each session lasting approximately ${duration} minutes. Give concrete exercises, sets, and rep ranges.`;
      
      try {
        const userCtx = buildUserContext(user, stats);
        let planHtml = '';
        
        await streamChatWithGemini(
          aiSettings.apiKey,
          aiSettings.model,
          [{ role: 'user', content: prompt }],
          userCtx,
          (chunkText) => {
            resultBox.innerHTML = `
              <div class=\"ai-coach__plan-card\">
                <h4>Weekly Workout Plan 💪</h4>
                <div style=\"color:var(--text-primary);line-height:1.6;\">${renderMarkdown(chunkText)}</div>
              </div>
            `;
          }
        );
        showSuccess('Workout plan generated successfully!');
      } catch (err) {
        resultBox.innerHTML = `<div class=\"card\" style=\"padding:1.5rem;color:var(--error);\">Error: ${err.message}</div>`;
      } finally {
        isGenerating = false;
      }
    });
  }

  // ── Render NUTRITION Tab ───────────────────────────────────────────────────
  function renderNutritionTab(container) {
    container.innerHTML = `
      <div class=\"card\" style=\"padding:1.5rem; margin-bottom: 2rem;\">
        <h3 style=\"margin-bottom:1rem;\">Customize Your Meal Plan</h3>
        <div class=\"ai-coach__form\">
          <div class=\"settings__group\">
            <label class=\"settings__label\">Dietary Preference</label>
            <select class=\"input\" id=\"np-diet\">
              <option value=\"Balanced / Standard\">Balanced / Standard</option>
              <option value=\"High-Protein Veg\">High-Protein Vegetarian</option>
              <option value=\"Vegan\">Vegan</option>
              <option value=\"Keto\">Ketogenic (Low Carb)</option>
              <option value=\"Mediterranean\">Mediterranean</option>
            </select>
          </div>
          <div class=\"settings__group\">
            <label class=\"settings__label\">Meals per Day</label>
            <select class=\"input\" id=\"np-meals\">
              <option value=\"3 meals\">3 Meals</option>
              <option value=\"3 meals + 1 snack\" selected>3 Meals + 1 Snack</option>
              <option value=\"4 meals\">4 Meals</option>
              <option value=\"5 meals\">5 Meals (Small portions)</option>
            </select>
          </div>
          <div class=\"settings__group\" style=\"grid-column: span 2;\">
            <label class=\"settings__label\">Allergies / Dislikes (Optional)</label>
            <input class=\"input\" id=\"np-allergies\" type=\"text\" placeholder=\"e.g., Peanuts, Seafood, Dairy, Eggs\" />
          </div>
        </div>
        <button class=\"btn-primary ripple-container\" id=\"gen-nutrition-btn\" style=\"width:100%;\">Generate Meal Plan ✨</button>
      </div>

      <div class=\"ai-coach__plan-container\" id=\"nutrition-result-box\"></div>
    `;

    const genBtn = container.querySelector('#gen-nutrition-btn');
    const resultBox = container.querySelector('#nutrition-result-box');

    on(genBtn, 'click', async (e) => {
      addRipple(e);
      if (isGenerating) return;

      const diet = container.querySelector('#np-diet').value;
      const meals = container.querySelector('#np-meals').value;
      const allergies = container.querySelector('#np-allergies').value.trim();

      isGenerating = true;
      resultBox.innerHTML = `
        <div class=\"ai-coach__plan-card\">
          <h4>Generating Nutrition Plan...</h4>
          <div class=\"typing-indicator\"><span></span><span></span><span></span></div>
        </div>
      `;

      const prompt = `Generate a daily meal plan following a ${diet} diet consisting of ${meals}. ${allergies ? `Avoid these items: ${allergies}.` : ''} Make sure the total daily calories and macros align with my target targets.`;
      
      try {
        const userCtx = buildUserContext(user, stats);
        
        await streamChatWithGemini(
          aiSettings.apiKey,
          aiSettings.model,
          [{ role: 'user', content: prompt }],
          userCtx,
          (chunkText) => {
            resultBox.innerHTML = `
              <div class=\"ai-coach__plan-card\">
                <h4>Daily Meal Plan 🍳</h4>
                <div style=\"color:var(--text-primary);line-height:1.6;\">${renderMarkdown(chunkText)}</div>
              </div>
            `;
          }
        );
        showSuccess('Nutrition plan generated successfully!');
      } catch (err) {
        resultBox.innerHTML = `<div class=\"card\" style=\"padding:1.5rem;color:var(--error);\">Error: ${err.message}</div>`;
      } finally {
        isGenerating = false;
      }
    });
  }

  // ── Render PROGRESS Tab ────────────────────────────────────────────────────
  function renderProgressTab(container) {
    container.innerHTML = `
      <div class=\"card\" style=\"padding:1.5rem; margin-bottom:2rem;\">
        <h3 style=\"margin-bottom:0.5rem;\">AI Progress Analyst</h3>
        <p class=\"text-muted\" style=\"margin-bottom:1.5rem;\">Let AI analyze your workout sessions, weight trends, and calories logs to give you specific recommendations.</p>
        <button class=\"btn-primary ripple-container\" id=\"analyze-progress-btn\" style=\"width:100%;\">Run Progress Analysis ✨</button>
      </div>
      <div class=\"ai-coach__plan-container\" id=\"progress-result-box\"></div>
    `;

    const analyzeBtn = container.querySelector('#analyze-progress-btn');
    const resultBox = container.querySelector('#progress-result-box');

    on(analyzeBtn, 'click', async (e) => {
      addRipple(e);
      if (isGenerating) return;

      // Extract details
      const workouts = getWorkouts() || [];
      const weights = getWeightLog() || [];
      const nutrition = getNutritionLog() || [];

      isGenerating = true;
      resultBox.innerHTML = `
        <div class=\"ai-coach__plan-card\">
          <h4>Analyzing Logs...</h4>
          <div class=\"typing-indicator\"><span></span><span></span><span></span></div>
        </div>
      `;

      let progressData = `Log Data Summary:\n`;
      progressData += `- Total Workouts Logged: ${workouts.length}\n`;
      if (workouts.length > 0) {
        progressData += `  - Last workout date: ${workouts[workouts.length - 1].date || 'N/A'}\n`;
      }
      progressData += `- Total Weight Log Entries: ${weights.length}\n`;
      if (weights.length > 0) {
        progressData += `  - Current Weight: ${weights[weights.length - 1].weight} kg (Target: ${user.weight} kg)\n`;
      }
      progressData += `- Total Days Nutrition Tracked: ${nutrition.length}\n`;
      
      const prompt = `Analyze my progress based on this logging data and profile context. Give me 3 constructive insights and 2 actions to focus on next. \n\n${progressData}`;

      try {
        const userCtx = buildUserContext(user, stats);
        
        await streamChatWithGemini(
          aiSettings.apiKey,
          aiSettings.model,
          [{ role: 'user', content: prompt }],
          userCtx,
          (chunkText) => {
            resultBox.innerHTML = `
              <div class=\"ai-coach__plan-card\">
                <h4>AI Progress Insights 📈</h4>
                <div style=\"color:var(--text-primary);line-height:1.6;\">${renderMarkdown(chunkText)}</div>
              </div>
            `;
          }
        );
        showSuccess('Analysis complete!');
      } catch (err) {
        resultBox.innerHTML = `<div class=\"card\" style=\"padding:1.5rem;color:var(--error);\">Error: ${err.message}</div>`;
      } finally {
        isGenerating = false;
      }
    });
  }

  // Helper markdown parser
  function renderMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Headers
    escaped = escaped.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    escaped = escaped.replace(/^## (.*?)$/gm, '<h3>$1</h3>');
    escaped = escaped.replace(/^# (.*?)$/gm, '<h3>$1</h3>');
    
    // Bold
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Lists
    escaped = escaped.replace(/^\s*[-*] (.*?)$/gm, '<li>$1</li>');
    escaped = escaped.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    
    // Line breaks
    escaped = escaped.replace(/\n\n/g, '</p><p>');
    escaped = escaped.replace(/\n/g, '<br>');
    
    return `<p>${escaped}</p>`
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<p><(h3|ul)/g, '<$1')
      .replace(/<\/(h3|ul)><\/p>/g, '</$1>');
  }

  // Initialize
  setTimeout(() => {
    if (aiSettings.apiKey) {
      switchTab('chat');
    }
    initScrollReveal(page);
  }, 0);

  return page;
}
