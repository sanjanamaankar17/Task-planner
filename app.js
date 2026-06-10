const App = (() => {
  const STORAGE_KEY = 'task-planner-data';

  // ===== SVG Helpers =====
  function iconCompleted(sz) {
    sz = sz || 14;
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="6"/><path d="M4.5 7.5L6 9L9.5 5"/></svg>`;
  }
  function iconInProgress(sz) {
    sz = sz || 14;
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="7" cy="7" r="6"/><circle cx="7" cy="7" r="3" fill="currentColor" stroke="none"/></svg>`;
  }
  function iconNotStarted(sz) {
    sz = sz || 14;
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14" fill="none" stroke="var(--text-muted)" stroke-width="1.2" opacity="0.5"><circle cx="7" cy="7" r="6"/></svg>`;
  }
  function iconBlocked(sz) {
    sz = sz || 14;
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="7" cy="7" r="6"/><line x1="7" y1="4.5" x2="7" y2="8"/><circle cx="7" cy="10.2" r="0.7" fill="currentColor" stroke="none"/></svg>`;
  }
  function progressRingSVG(pct) {
    const r = 14, circ = 2 * Math.PI * r, off = circ - (pct / 100) * circ;
    return `<svg class="progress-ring" width="38" height="38" viewBox="0 0 38 38"><circle class="progress-ring-bg" cx="19" cy="19" r="${r}" fill="none" stroke-width="3"/><circle class="progress-ring-fill" cx="19" cy="19" r="${r}" fill="none" stroke-width="3" stroke-dasharray="${circ}" stroke-dashoffset="${off}" transform="rotate(-90 19 19)"/><text x="19" y="20.5" text-anchor="middle" font-size="8.5" fill="var(--text-secondary)" font-weight="600">${pct}%</text></svg>`;
  }
  function emptyStateSVG() {
    return `<svg width="100" height="80" viewBox="0 0 100 80" fill="none" stroke="var(--border-color)" stroke-width="1.6"><rect x="25" y="10" width="50" height="60" rx="5" opacity="0.7"/><rect x="30" y="15" width="40" height="50" rx="3" opacity="0.4"/><line x1="36" y1="28" x2="64" y2="28" opacity="0.35"/><line x1="36" y1="36" x2="64" y2="36" opacity="0.35"/><line x1="36" y1="44" x2="54" y2="44" opacity="0.35"/><path d="M58 50L61 53L68 45" opacity="0.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 10V7a3 3 0 0 1 6 0v3" opacity="0.7"/><line x1="36" y1="18" x2="64" y2="18" opacity="0.7"/></svg>`;
  }
  function statusIcon(status, sz) {
    switch(status) {
      case 'completed': return iconCompleted(sz);
      case 'in-progress': return iconInProgress(sz);
      case 'blocked': return iconBlocked(sz);
      default: return iconNotStarted(sz);
    }
  }
  function projectColor(name) {
    if (!name) return 'var(--primary)';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const h = ((hash % 360) + 360) % 360;
    return `hsl(${h}, 60%, 55%)`;
  }

  const SCENIC_IMAGES = [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd0c?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1518173946687-a36f968f7db8?w=400&h=200&fit=crop&auto=format'
  ];

  const QUOTES = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
    { text: "It's not about having time. It's about making time.", author: "Unknown" },
    { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
    { text: "The best time to start was yesterday. The next best time is now.", author: "Unknown" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" }
  ];

  // ===== Toast =====
  function showToast(msg, type) {
    type = type || 'info';
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast toast-' + type;
    const icons = { success: '✓', error: '✕', info: '→' };
    el.innerHTML = '<span>' + (icons[type] || '') + '</span><span>' + escHtml(msg) + '</span>';
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('removing');
      setTimeout(() => el.remove(), 250);
    }, 2500);
  }

  // ===== Confetti =====
  function confetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--info)'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        top: -10px;
        background: ${color};
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${1.5 + Math.random() * 2}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      container.appendChild(piece);
    }
    setTimeout(() => container.innerHTML = '', 4000);
  }

  function checkAllDoneConfetti() {
    const today = todayStr();
    const todayTasks = state.tasks.filter(t => t.dueDate === today);
    const done = todayTasks.filter(t => t.status === 'completed').length;
    if (todayTasks.length > 0 && done === todayTasks.length) {
      confetti();
    }
  }

  let state = {
    tasks: [],
    view: 'today',
    searchQuery: '',
    sortBy: 'priority',
    filterPriority: 'all',
    filterStatus: 'all',
    darkMode: false,
    topPriorityIds: [],
    userName: 'User',
    userRole: 'ETL & AI Developer'
  };

  let editingTaskId = null;
  let taskIdCounter = Date.now();

  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const today = new Date(todayStr());
    const date = new Date(dateStr + 'T00:00:00');
    const diff = Math.round((date - today) / 86400000);

    if (diff === 0) return 'Today';
    if (diff === -1) return 'Yesterday';
    if (diff === 1) return 'Tomorrow';

    if (diff < -1 && diff > -7) {
      const days = Math.abs(diff);
      return `${days} days ago`;
    }

    if (diff > 1 && diff < 7) {
      return `In ${diff} days`;
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function isOverdue(task) {
    if (!task.dueDate || task.status === 'completed') return false;
    return task.dueDate < todayStr();
  }

  function isToday(dateStr) {
    return dateStr === todayStr();
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        state.tasks = saved.tasks || [];
        state.view = saved.view || 'today';
        state.darkMode = saved.darkMode || false;
        state.topPriorityIds = saved.topPriorityIds || [];
        state.userName = saved.userName || 'User';
        state.userRole = saved.userRole || 'ETL & AI Developer';
        taskIdCounter = saved.taskIdCounter || Date.now();
        if (saved.searchQuery) state.searchQuery = saved.searchQuery;
        if (saved.sortBy) state.sortBy = saved.sortBy;
        if (saved.filterPriority) state.filterPriority = saved.filterPriority;
        if (saved.filterStatus) state.filterStatus = saved.filterStatus;
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
    if (!state.tasks || state.tasks.length === 0) {
      state.tasks = [];
      saveState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tasks: state.tasks,
        view: state.view,
        darkMode: state.darkMode,
        topPriorityIds: state.topPriorityIds,
        userName: state.userName,
        userRole: state.userRole,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        filterPriority: state.filterPriority,
        filterStatus: state.filterStatus,
        taskIdCounter
      }));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  function generateId() {
    return 't' + (++taskIdCounter);
  }

  function getFilteredTasks() {
    let tasks = [...state.tasks];
    const today = todayStr();

    tasks = tasks.filter(t => {
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchProject = (t.project || '').toLowerCase().includes(q);
        const matchTags = (t.tags || []).some(tag => tag.toLowerCase().includes(q));
        if (!matchTitle && !matchProject && !matchTags) return false;
      }
      if (state.filterPriority !== 'all' && t.priority !== state.filterPriority) return false;
      if (state.filterStatus !== 'all' && t.status !== state.filterStatus) return false;
      return true;
    });

    switch (state.view) {
      case 'today':
        tasks = tasks.filter(t => t.dueDate === today);
        break;
      case 'overdue':
        tasks = tasks.filter(t => isOverdue(t));
        break;
      case 'upcoming':
        tasks = tasks.filter(t => t.dueDate && t.dueDate > today && t.status !== 'completed');
        break;
      case 'completed':
        tasks = tasks.filter(t => t.status === 'completed');
        break;
      case 'all':
        break;
    }

    tasks.sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 };
      switch (state.sortBy) {
        case 'priority':
          const pa = prioOrder[a.priority] ?? 1;
          const pb = prioOrder[b.priority] ?? 1;
          if (pa !== pb) return pa - pb;
          return (b.createdAt || 0) - (a.createdAt || 0);
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        case 'status': {
          const sOrder = { 'not-started': 0, 'in-progress': 1, 'blocked': 2, 'completed': 3 };
          const sa = sOrder[a.status] ?? 0;
          const sb = sOrder[b.status] ?? 0;
          return sa - sb;
        }
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return tasks;
  }

  function getSummaryStats() {
    const today = todayStr();
    const all = state.tasks;
    const totalToday = all.filter(t => t.dueDate === today).length;
    const inProgress = all.filter(t => t.status === 'in-progress').length;
    const completed = all.filter(t => t.status === 'completed').length;
    const overdue = all.filter(t => isOverdue(t)).length;
    return { totalToday, inProgress, completed, overdue };
  }

  function getTodayProgress() {
    const today = todayStr();
    const todayTasks = state.tasks.filter(t => t.dueDate === today);
    const total = todayTasks.length;
    const done = todayTasks.filter(t => t.status === 'completed').length;
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  function getTopPriorities() {
    const today = todayStr();
    const todayTasks = state.tasks.filter(t => t.dueDate === today);
    const pinned = todayTasks.filter(t => state.topPriorityIds.includes(t.id) && t.status !== 'completed');
    pinned.sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 };
      return (prioOrder[a.priority] ?? 1) - (prioOrder[b.priority] ?? 1);
    });
    if (pinned.length >= 3) return pinned.slice(0, 3);

    const unpinned = todayTasks.filter(t => !state.topPriorityIds.includes(t.id) && t.status !== 'completed');
    unpinned.sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 };
      return (prioOrder[a.priority] ?? 1) - (prioOrder[b.priority] ?? 1);
    });

    return [...pinned, ...unpinned].slice(0, 3);
  }

  function getTaskById(id) {
    return state.tasks.find(t => t.id === id);
  }

  function addTask(data) {
    const task = {
      id: generateId(),
      title: data.title.trim(),
      notes: (data.notes || '').trim(),
      project: (data.project || '').trim(),
      dueDate: data.dueDate || '',
      priority: data.priority || 'medium',
      status: data.status || 'not-started',
      estimatedTime: data.estimatedTime ? Number(data.estimatedTime) : 0,
      assignedDate: data.assignedDate || todayStr(),
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      important: data.important || false,
      createdAt: Date.now()
    };
    state.tasks.push(task);
    saveState();
    render();
    showToast('Task added', 'success');
    return task;
  }

  function updateTask(id, data) {
    const idx = state.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const task = state.tasks[idx];
    if (data.title !== undefined) task.title = data.title.trim();
    if (data.notes !== undefined) task.notes = data.notes.trim();
    if (data.project !== undefined) task.project = data.project.trim();
    if (data.dueDate !== undefined) task.dueDate = data.dueDate;
    if (data.priority !== undefined) task.priority = data.priority;
    if (data.status !== undefined) task.status = data.status;
    if (data.estimatedTime !== undefined) task.estimatedTime = Number(data.estimatedTime);
    if (data.assignedDate !== undefined) task.assignedDate = data.assignedDate;
    if (data.tags !== undefined) {
      task.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (data.important !== undefined) task.important = data.important;
    saveState();
    render();
    return task;
  }

  function deleteTask(id) {
    const delTask = getTaskById(id);
    state.tasks = state.tasks.filter(task => task.id !== id);
    state.topPriorityIds = state.topPriorityIds.filter(pid => pid !== id);
    saveState();
    render();
    if (delTask) showToast('"' + delTask.title + '" deleted', 'error');
  }

  function toggleComplete(id) {
    const task = getTaskById(id);
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
    updateTask(id, { status: newStatus });
    if (newStatus === 'completed') {
      showToast('"' + task.title + '" completed', 'success');
      checkAllDoneConfetti();
    }
  }

  function toggleImportant(id) {
    const task = getTaskById(id);
    if (!task) return;
    updateTask(id, { important: !task.important });
  }

  function toggleTopPriority(id) {
    const idx = state.topPriorityIds.indexOf(id);
    if (idx > -1) {
      state.topPriorityIds.splice(idx, 1);
    } else {
      if (state.topPriorityIds.length >= 3) {
        state.topPriorityIds.shift();
      }
      state.topPriorityIds.push(id);
    }
    saveState();
    render();
  }

  function isTopPriority(id) {
    return state.topPriorityIds.includes(id);
  }

  function updateStatus(id, status) {
    updateTask(id, { status });
  }

  function updatePriority(id, priority) {
    updateTask(id, { priority });
  }

  function rescheduleTask(id, newDate) {
    updateTask(id, { dueDate: newDate });
  }

  // ===== Rendering =====

  function render() {
    renderGreeting();
    renderTopCards();
    renderSidebar();
    renderControls();
    renderTaskList();
    renderRightWidgets();
    renderBottomStrip();
    updateDarkMode();
  }

  function renderGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const h = new Date().getHours();
    const time = h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
    const userName = state.userName || 'User';
    el.innerHTML = `Good ${time}, <span>${escHtml(userName)}</span>`;
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    // Update profile card
    const avatar = document.querySelector('.profile-avatar');
    const nameEl = document.querySelector('.profile-name');
    const roleEl = document.querySelector('.profile-role');
    const headerAvatar = document.querySelector('.header-avatar');
    if (avatar) avatar.textContent = (userName.charAt(0) || 'U').toUpperCase();
    if (nameEl) nameEl.textContent = userName;
    if (roleEl) roleEl.textContent = state.userRole || '';
    if (headerAvatar) headerAvatar.textContent = (userName.charAt(0) || 'U').toUpperCase();
  }

  function renderSidebar() {
    const total = state.tasks.length;
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === state.view);
    });
  }

  function openSettings() {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    modal.innerHTML = `
      <div class="modal-header">
        <span class="modal-title">Profile Settings</span>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <form id="settings-form">
        <div class="form-group">
          <label class="form-label" for="s-name">Your Name</label>
          <input type="text" class="form-input" id="s-name" value="${escHtml(state.userName)}" placeholder="Enter your name">
        </div>
        <div class="form-group">
          <label class="form-label" for="s-role">Your Role</label>
          <input type="text" class="form-input" id="s-role" value="${escHtml(state.userRole)}" placeholder="e.g. ETL & AI Developer">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    `;
    overlay.classList.add('open');

    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.getElementById('settings-form')?.addEventListener('submit', e => {
      e.preventDefault();
      state.userName = document.getElementById('s-name').value.trim() || 'User';
      state.userRole = document.getElementById('s-role').value.trim() || '';
      saveState();
      closeModal();
      render();
    });
    document.addEventListener('keydown', handleModalKeydown);
  }

  function renderTopCards() {
    const container = document.getElementById('top-cards');
    if (!container) return;
    const progress = getTodayProgress();
    const stats = getSummaryStats();

    const score = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

    const qi = Math.floor(Math.random() * QUOTES.length);

    container.innerHTML = `
      <div class="top-card top-card-progress">
        <div class="top-card-progress-ring">${progressRingSVG(progress.percent)}</div>
        <div class="top-card-progress-info">
          <div class="top-card-progress-label">Daily Progress</div>
          <div class="top-card-progress-value">${progress.done}<span style="font-size:1rem;color:var(--text-muted);font-weight:400;">/${progress.total}</span></div>
          <div class="top-card-progress-detail">${progress.percent}% complete</div>
        </div>
      </div>
      <div class="top-card top-card-quote" style="background-image:url(${SCENIC_IMAGES[Math.floor(Math.random() * SCENIC_IMAGES.length)]});">
        ${progress.total > 0 ? `
        <button class="quote-refresh" id="quote-refresh" title="New quote">↻</button>
        <div class="quote-text">"${escHtml(QUOTES[qi].text)}"</div>
        <div class="quote-author">— ${escHtml(QUOTES[qi].author)}</div>` : `
        <div class="quote-empty-inner">
          <div class="quote-empty-text">Add tasks to get inspired ✨</div>
        </div>`}
      </div>
      <div class="top-card top-card-score">
        <div class="score-header">
          <span class="score-label">Productivity</span>
          <span class="score-value">${Math.max(score, 0)}%</span>
        </div>
        <div class="score-bar-wrap">
          <div class="score-bar-fill" style="width:${Math.max(score, 0)}%"></div>
        </div>
        <div class="score-detail">${stats.completed} completed · ${stats.inProgress} in progress</div>
      </div>
    `;

    document.getElementById('quote-refresh')?.addEventListener('click', renderTopCards);
  }

  function renderControls() {
    const el = document.getElementById('controls');
    if (!el) return;
    el.innerHTML = `
      <span class="control-label">Sort</span>
      <select class="sort-select" id="sort-select">
        <option value="priority" ${state.sortBy === 'priority' ? 'selected' : ''}>Priority</option>
        <option value="dueDate" ${state.sortBy === 'dueDate' ? 'selected' : ''}>Due Date</option>
        <option value="status" ${state.sortBy === 'status' ? 'selected' : ''}>Status</option>
        <option value="title" ${state.sortBy === 'title' ? 'selected' : ''}>Title</option>
      </select>
    `;

    document.getElementById('sort-select')?.addEventListener('change', e => {
      state.sortBy = e.target.value;
      saveState();
      renderTaskList();
    });
  }

  function renderRightWidgets() {
    const today = todayStr();
    const allTasks = state.tasks;

    // Upcoming
    const upcoming = allTasks.filter(t => t.dueDate && t.dueDate >= today && t.status !== 'completed')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
    const upcomingCount = document.getElementById('upcoming-count');
    const upcomingList = document.getElementById('upcoming-list');
    if (upcomingCount) upcomingCount.textContent = upcoming.length;
    if (upcomingList) {
      upcomingList.innerHTML = upcoming.length > 0 ? upcoming.map(t => `
        <div class="upcoming-item">
          <span class="upcoming-dot" style="background:${projectColor(t.project)}"></span>
          <span class="upcoming-title">${escHtml(t.title)}</span>
          <span class="upcoming-date">${formatDate(t.dueDate)}</span>
        </div>
      `).join('') : '<div style="color:var(--text-muted);font-size:0.78rem;padding:8px 0;">No upcoming tasks</div>';
    }

    // Calendar
    renderCalendar();

    // Categories
    const projects = {};
    allTasks.forEach(t => {
      const p = t.project || 'Uncategorized';
      if (!projects[p]) projects[p] = { total: 0, done: 0 };
      projects[p].total++;
      if (t.status === 'completed') projects[p].done++;
    });
    const catList = document.getElementById('categories-list');
    if (catList) {
      const entries = Object.entries(projects);
      catList.innerHTML = entries.length > 0 ? entries.map(([name, data]) => {
        const pct = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
        return `
          <div class="category-item">
            <span class="category-color" style="background:${projectColor(name)}"></span>
            <span class="category-name">${escHtml(name)}</span>
            <span class="category-count">${data.done}/${data.total}</span>
          </div>
          <div class="category-bar-wrap">
            <div class="category-bar-fill" style="width:${pct}%;background:${projectColor(name)}"></div>
          </div>
        `;
      }).join('') : '<div style="color:var(--text-muted);font-size:0.78rem;padding:8px 0;">No categories yet</div>';
    }
  }

  function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    let html = `<div class="calendar-header">
      <span class="calendar-month">${monthName}</span>
    </div><div class="calendar-grid">`;

    dayHeaders.forEach(d => { html += `<span class="calendar-day-header">${d}</span>`; });

    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<span class="calendar-day other-month">${daysInPrev - i}</span>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      html += `<span class="calendar-day ${d === today ? 'today' : ''}">${d}</span>`;
    }

    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      html += `<span class="calendar-day other-month">${i}</span>`;
    }

    html += '</div>';
    grid.innerHTML = html;
  }

  function renderBottomStrip() {
    const today = todayStr();
    const all = state.tasks;
    const streak = calculateStreak();
    const totalFocus = all.reduce((s, t) => s + (t.estimatedTime || 0), 0);
    const completed = all.filter(t => t.status === 'completed').length;
    const achievements = completed >= 10 ? Math.floor(completed / 10) : 0;
    setText('streak-val', streak);
    setText('focus-val', totalFocus);
    setText('done-val', completed);
    setText('achieve-val', achievements);
  }

  function calculateStreak() {
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dateStr = d.toISOString().split('T')[0];
      const hasCompleted = state.tasks.some(t => t.dueDate === dateStr && t.status === 'completed');
      if (hasCompleted) streak++;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderTaskList() {
    const container = document.getElementById('task-list');
    if (!container) return;
    const tasks = getFilteredTasks();
    const activeTasks = tasks.filter(t => t.status !== 'completed');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    if (tasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-illustration">${emptyStateSVG()}</div>
          <div class="empty-state-text">No tasks to show</div>
          <div class="empty-state-hint">${state.view === 'today' ? 'Add a task for today to get started.' : 'Try adjusting your filters.'}</div>
        </div>
      `;
      return;
    }

    let html = '';
    activeTasks.forEach((t, i) => { html += renderTaskCard(t, i); });

    if (completedTasks.length > 0) {
      html += `<div class="completed-separator">Completed (${completedTasks.length})</div>`;
      completedTasks.forEach((t, i) => { html += renderTaskCard(t, activeTasks.length + i); });
    }

    container.innerHTML = html;
    bindTaskEvents();
  }

  function renderTaskCard(task, index) {
    index = index || 0;
    const priorityClass = 'priority-' + (task.priority || 'medium');
    const isCompleted = task.status === 'completed';
    const overdue = isOverdue(task) && !isCompleted;
    const pColor = projectColor(task.project);

    let dateHtml = '';
    if (task.dueDate) {
      const label = formatDate(task.dueDate);
      let cls = '';
      if (overdue) cls = 'overdue-text';
      else if (isToday(task.dueDate)) cls = 'today-text';
      dateHtml = `<span class="task-due ${cls}">${escHtml(label)}</span>`;
    }

    const tagsHtml = (task.tags || []).map(tag =>
      `<span class="task-tag">${escHtml(tag)}</span>`
    ).join('');

    const notesHtml = task.notes ? `<div class="task-notes">${escHtml(task.notes)}</div>` : '';
    const estimateHtml = task.estimatedTime ? `<span class="task-estimate">${task.estimatedTime}m</span>` : '';

    return `
      <div class="task-card ${overdue ? 'overdue' : ''} ${isCompleted ? 'completed' : ''}" data-id="${task.id}" style="animation-delay:${index * 0.04}s">
        <div class="task-card-header">
          <div class="task-checkbox-wrap">
            <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''} data-id="${task.id}">
          </div>
          <div class="task-content">
            <div class="task-title ${isCompleted ? 'completed-text' : ''}">${escHtml(task.title)}</div>
            <div class="task-meta">
              ${task.project ? `<span class="task-project" style="background:${pColor}18;color:${pColor};"><span class="task-project-dot" style="background:${pColor};"></span>${escHtml(task.project)}</span>` : ''}
              ${dateHtml}
              <span class="status-indicator">${statusIcon(task.status, 12)}<span style="text-transform:capitalize;">${task.status.replace('-', ' ')}</span></span>
            </div>
            ${notesHtml}
            ${tagsHtml ? `<div class="task-tags">${tagsHtml}</div>` : ''}
          </div>
          <div class="task-card-actions">
            <button class="important-btn ${task.important ? 'active' : ''}" data-id="${task.id}" title="Mark important">${task.important ? '★' : '☆'}</button>
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
            <select class="status-select" data-id="${task.id}">
              <option value="not-started" ${task.status === 'not-started' ? 'selected' : ''}>Not Started</option>
              <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
              <option value="blocked" ${task.status === 'blocked' ? 'selected' : ''}>Blocked</option>
              <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Complete</option>
            </select>
          </div>
        </div>
        <div class="task-card-footer">
          <div style="display:flex;align-items:center;gap:8px;">
            ${estimateHtml}
            <input type="date" class="reschedule-input" value="${task.dueDate || ''}" data-id="${task.id}" title="Reschedule">
          </div>
          <div style="display:flex;align-items:center;gap:4px;">
            <button class="task-action-btn" data-id="${task.id}" data-action="edit" title="Edit">✎</button>
            <button class="task-action-btn danger" data-id="${task.id}" data-action="delete" title="Delete">✕</button>
          </div>
        </div>
      </div>
    `;
  }

  function bindTaskEvents() {
    document.querySelectorAll('.task-checkbox').forEach(cb => {
      cb.addEventListener('change', () => toggleComplete(cb.dataset.id));
    });

    document.querySelectorAll('.important-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleImportant(btn.dataset.id));
    });

    document.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', () => updateStatus(sel.dataset.id, sel.value));
    });

    document.querySelectorAll('.reschedule-input').forEach(inp => {
      inp.addEventListener('change', () => {
        if (inp.value) rescheduleTask(inp.dataset.id, inp.value);
      });
    });

    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });

    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => confirmDelete(btn.dataset.id));
    });
  }

  // ===== Modals =====

  function openAddModal() {
    editingTaskId = null;
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    modal.innerHTML = `
      <div class="modal-header">
        <span class="modal-title">New Task</span>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <form id="task-form">
        <div class="form-group">
          <label class="form-label" for="f-title">Title *</label>
          <input type="text" class="form-input" id="f-title" required placeholder="e.g. Build data pipeline for sales ingestion">
        </div>
        <div class="form-group">
          <label class="form-label" for="f-notes">Notes</label>
          <textarea class="form-textarea" id="f-notes" placeholder="Source tables, transformation logic, LLM agent config..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-project">Project</label>
            <input type="text" class="form-input" id="f-project" placeholder="e.g. Data Platform, AI Agent, Analytics">
          </div>
          <div class="form-group">
            <label class="form-label" for="f-due">Due Date</label>
            <input type="date" class="form-input" id="f-due" value="${todayStr()}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-priority">Priority</label>
            <select class="form-select" id="f-priority">
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="f-status">Status</label>
            <select class="form-select" id="f-status">
              <option value="not-started" selected>Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-estimate">Est. Time (minutes)</label>
            <input type="number" class="form-input" id="f-estimate" min="0" step="5" placeholder="e.g. 30">
          </div>
          <div class="form-group">
            <label class="form-label" for="f-assigned">Assigned Date</label>
            <input type="date" class="form-input" id="f-assigned" value="${todayStr()}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="f-tags">Tags (comma separated)</label>
          <input type="text" class="form-input" id="f-tags" placeholder="e.g. python, sql, langchain, airflow">
        </div>
        <div class="form-checkbox">
          <input type="checkbox" id="f-important">
          <label for="f-important">Mark as important</label>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Task</button>
        </div>
      </form>
    `;
    overlay.classList.add('open');
    setupModalEvents();
  }

  function openEditModal(id) {
    const task = getTaskById(id);
    if (!task) return;
    editingTaskId = id;
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    modal.innerHTML = `
      <div class="modal-header">
        <span class="modal-title">Edit Task</span>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <form id="task-form">
        <div class="form-group">
          <label class="form-label" for="f-title">Title *</label>
          <input type="text" class="form-input" id="f-title" required value="${escHtml(task.title)}">
        </div>
        <div class="form-group">
          <label class="form-label" for="f-notes">Notes</label>
          <textarea class="form-textarea" id="f-notes">${escHtml(task.notes || '')}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-project">Project</label>
            <input type="text" class="form-input" id="f-project" value="${escHtml(task.project || '')}">
          </div>
          <div class="form-group">
            <label class="form-label" for="f-due">Due Date</label>
            <input type="date" class="form-input" id="f-due" value="${task.dueDate || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-priority">Priority</label>
            <select class="form-select" id="f-priority">
              <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
              <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="f-status">Status</label>
            <select class="form-select" id="f-status">
              <option value="not-started" ${task.status === 'not-started' ? 'selected' : ''}>Not Started</option>
              <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
              <option value="blocked" ${task.status === 'blocked' ? 'selected' : ''}>Blocked</option>
              <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="f-estimate">Est. Time (minutes)</label>
            <input type="number" class="form-input" id="f-estimate" min="0" step="5" value="${task.estimatedTime || ''}">
          </div>
          <div class="form-group">
            <label class="form-label" for="f-assigned">Assigned Date</label>
            <input type="date" class="form-input" id="f-assigned" value="${task.assignedDate || todayStr()}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="f-tags">Tags (comma separated)</label>
          <input type="text" class="form-input" id="f-tags" value="${(task.tags || []).join(', ')}">
        </div>
        <div class="form-checkbox">
          <input type="checkbox" id="f-important" ${task.important ? 'checked' : ''}>
          <label for="f-important">Mark as important</label>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-danger" id="modal-delete" style="margin-right:auto;">Delete</button>
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    `;
    overlay.classList.add('open');
    setupModalEvents();
    document.getElementById('modal-delete')?.addEventListener('click', () => {
      const id = editingTaskId;
      if (id) {
        closeModal();
        confirmDelete(id);
      }
    });
  }

  function setupModalEvents() {
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.getElementById('task-form')?.addEventListener('submit', handleFormSubmit);
    document.addEventListener('keydown', handleModalKeydown);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const data = {
      title: document.getElementById('f-title').value,
      notes: document.getElementById('f-notes').value,
      project: document.getElementById('f-project').value,
      dueDate: document.getElementById('f-due').value,
      priority: document.getElementById('f-priority').value,
      status: document.getElementById('f-status').value,
      estimatedTime: document.getElementById('f-estimate').value,
      assignedDate: document.getElementById('f-assigned').value,
      tags: document.getElementById('f-tags').value,
      important: document.getElementById('f-important').checked
    };
    if (!data.title.trim()) return;
    if (editingTaskId) {
      updateTask(editingTaskId, data);
    } else {
      addTask(data);
    }
    closeModal();
  }

  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('open');
    editingTaskId = null;
    document.removeEventListener('keydown', handleModalKeydown);
  }

  function handleModalKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  function confirmDelete(id) {
    const task = getTaskById(id);
    if (!task) return;
    const overlay = document.getElementById('confirm-overlay');
    const dialog = document.getElementById('confirm-dialog');
    dialog.innerHTML = `
      <div class="confirm-title">Delete Task</div>
      <div class="confirm-message">Are you sure you want to delete "${escHtml(task.title)}"? This cannot be undone.</div>
      <div class="confirm-actions">
        <button class="btn btn-secondary" id="confirm-cancel">Cancel</button>
        <button class="btn btn-danger" id="confirm-ok">Delete</button>
      </div>
    `;
    overlay.classList.add('open');

    document.getElementById('confirm-cancel')?.addEventListener('click', () => overlay.classList.remove('open'));
    document.getElementById('confirm-ok')?.addEventListener('click', () => {
      deleteTask(id);
      overlay.classList.remove('open');
    });
    overlay.addEventListener('click', e => {
      if (e.target === e.currentTarget) overlay.classList.remove('open');
    });
  }

  // ===== Dark Mode =====

  function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    saveState();
    updateDarkMode();
  }

  function updateDarkMode() {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    const btn = document.getElementById('dark-mode-toggle');
    if (btn) btn.textContent = state.darkMode ? '☀' : '☾';
  }

  // ===== Utility =====

  function escHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== Init =====

  function init() {
    loadState();
    setupEventListeners();
    render();
  }

  function setupEventListeners() {
    document.getElementById('dark-mode-toggle')?.addEventListener('click', toggleDarkMode);

    document.querySelectorAll('.sidebar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.view = btn.dataset.view;
        state.searchQuery = '';
        state.filterPriority = 'all';
        state.filterStatus = 'all';
        state.sortBy = 'priority';
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        saveState();
        render();
      });
    });

    document.querySelectorAll('.task-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.task-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        if (f === 'all') { state.filterPriority = 'all'; state.filterStatus = 'all'; }
        else if (f === 'high') { state.filterPriority = 'high'; state.filterStatus = 'all'; }
        else if (f === 'pending') { state.filterPriority = 'all'; state.filterStatus = 'not-started'; }
        else if (f === 'completed') { state.filterPriority = 'all'; state.filterStatus = 'completed'; }
        saveState();
        renderTaskList();
      });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        state.searchQuery = e.target.value;
        saveState();
        renderTaskList();
      });
    }

    document.getElementById('add-task-btn')?.addEventListener('click', openAddModal);

    document.querySelector('.profile-card')?.addEventListener('click', openSettings);

    document.addEventListener('keydown', e => {
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !e.target.closest('input,textarea,select')) {
        e.preventDefault();
        openAddModal();
      }
      if (e.key === '/' && !e.target.closest('input,textarea,select')) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    });

    const hint = document.getElementById('kbd-hint');
    let hintTimer;
    if (hint) {
      hint.classList.add('visible');
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => hint.classList.remove('visible'), 4000);
    }
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
