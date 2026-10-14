/**
 * EYE OF ODIN - Lost & Found Item Tracker for Campus
 * Multi-Step Reporting Modal with Priority Urgency Selection and "Others / Custom" Category.
 */

import { stateManager, CAMPUS_BUILDINGS, CATEGORIES } from './data.js';
import { aiMatchingEngine } from './aiEngine.js';
import { audioEngine } from './audioEngine.js';

export class ReportModalController {
  constructor(modalId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.options = options;
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {
      type: 'lost',
      priority: 'standard',
      title: '',
      category: 'electronics',
      customCategory: '',
      description: '',
      buildingId: 'bldg-lib',
      specificLocation: '',
      color: '#38bdf8',
      colorName: 'University Blue',
      rewardBounty: 0,
      secretQuestion: '',
      secretAnswerHint: '',
      tags: [],
      custody: 'self',
      previewType: 'laptop',
      reporter: {
        name: 'Campus Student',
        role: 'Student',
        email: 'student@campus.edu',
        verified: true
      },
      imageDataUrl: null,
      imageName: null,
      hasImage: false
    };
  }

  resetForm() {
    this.formData = {
      type: 'lost',
      priority: 'standard',
      title: '',
      category: 'electronics',
      customCategory: '',
      description: '',
      buildingId: 'bldg-lib',
      specificLocation: '',
      color: '#38bdf8',
      colorName: 'University Blue',
      rewardBounty: 0,
      secretQuestion: '',
      secretAnswerHint: '',
      tags: [],
      custody: 'self',
      previewType: 'laptop',
      reporter: {
        name: 'Campus Student',
        role: 'Student',
        email: 'student@campus.edu',
        verified: true
      },
      imageDataUrl: null,
      imageName: null,
      hasImage: false
    };
    this.currentStep = 1;
  }

  init() {
    this.bindEvents();
  }

  open(initialType = 'lost') {
    this.formData.type = initialType;
    this.currentStep = 1;
    this.renderStep();
    this.modal.classList.remove('hidden');
    this.modal.classList.add('flex');
    audioEngine.playClick();
  }

  close() {
    this.modal.classList.add('hidden');
    this.modal.classList.remove('flex');
    audioEngine.playClick();
  }

  handleClipboardPaste(e) {
    const items = (e.clipboardData || window.clipboardData)?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          this.handleImageFile(file, `Pasted_Image_${timestamp}.png`);
          break;
        }
      }
    }
  }

  handleImageFile(file, customName = null) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please provide a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      this.formData.imageDataUrl = dataUrl;
      this.formData.imageName = customName || file.name || 'uploaded_image.png';
      this.formData.hasImage = true;

      // Run ML Kit / AI vision heuristic analysis on the image name and title
      const sampleKey = (this.formData.imageName + ' ' + (this.formData.title || '')).toLowerCase();
      const result = aiMatchingEngine.simulateImageLabeling(sampleKey);
      if (result) {
        if (result.category && this.formData.category === 'others') {
          this.formData.category = result.category;
        }
        this.formData.tags = Array.from(new Set([...(this.formData.tags || []), ...(result.tags || [])]));
        this.formData.color = result.color || this.formData.color;
        this.formData.colorName = result.colorName || this.formData.colorName;

        if (sampleKey.includes('mac') || sampleKey.includes('laptop')) this.formData.previewType = 'laptop';
        else if (sampleKey.includes('airpod') || sampleKey.includes('earbud') || sampleKey.includes('pod')) this.formData.previewType = 'earbuds';
        else if (sampleKey.includes('key')) this.formData.previewType = 'keys';
        else if (sampleKey.includes('card') || sampleKey.includes('id') || sampleKey.includes('badge')) this.formData.previewType = 'id_card';
      }

      audioEngine.playScan();
      if (this.currentStep === 2) {
        this.renderStep();
      }
    };
    reader.readAsDataURL(file);
  }

  bindEvents() {
    const closeBtn = document.getElementById('report-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) this.close();
    });

    // Global paste listener when modal is open
    document.addEventListener('paste', e => {
      if (!this.modal || this.modal.classList.contains('hidden')) return;
      this.handleClipboardPaste(e);
    });

    const prevBtn = document.getElementById('report-prev-btn');
    const nextBtn = document.getElementById('report-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 1) {
          audioEngine.playClick();
          this.currentStep--;
          this.renderStep();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentStep < this.totalSteps) {
          if (this.validateCurrentStep()) {
            audioEngine.playClick();
            this.currentStep++;
            this.renderStep();
          }
        } else {
          this.submitForm();
        }
      });
    }
  }

  validateCurrentStep() {
    if (this.currentStep === 1) {
      const titleInput = document.getElementById('report-title-input');
      if (!titleInput || !titleInput.value.trim()) {
        alert('Please specify the item title.');
        return false;
      }
      this.formData.title = titleInput.value.trim();

      const catSelect = document.getElementById('report-category-select');
      if (catSelect) this.formData.category = catSelect.value;

      const customCatInput = document.getElementById('report-custom-category-input');
      if (customCatInput) this.formData.customCategory = customCatInput.value.trim();

      const descInput = document.getElementById('report-desc-input');
      if (descInput) this.formData.description = descInput.value.trim();

      const prioritySelect = document.getElementById('report-priority-select');
      if (prioritySelect) this.formData.priority = prioritySelect.value;
    }

    if (this.currentStep === 2) {
      const bldgSelect = document.getElementById('report-bldg-select');
      if (bldgSelect) this.formData.buildingId = bldgSelect.value;

      const locInput = document.getElementById('report-loc-input');
      if (locInput) this.formData.specificLocation = locInput.value.trim();
    }

    if (this.currentStep === 3) {
      const qInput = document.getElementById('report-question-input');
      if (qInput) this.formData.secretQuestion = qInput.value.trim();

      const hintInput = document.getElementById('report-hint-input');
      if (hintInput) this.formData.secretAnswerHint = hintInput.value.trim();

      const bountyInput = document.getElementById('report-bounty-input');
      if (bountyInput) this.formData.rewardBounty = parseInt(bountyInput.value) || 0;
    }

    return true;
  }

  renderStep() {
    const content = document.getElementById('report-step-content');
    const stepIndicators = document.getElementById('report-step-indicators');
    const prevBtn = document.getElementById('report-prev-btn');
    const nextBtn = document.getElementById('report-next-btn');

    if (stepIndicators) {
      stepIndicators.innerHTML = Array.from({ length: this.totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const active = stepNum === this.currentStep ? 'bg-cyan-500 text-black font-bold' : stepNum < this.currentStep ? 'bg-emerald-500/80 text-white' : 'bg-white/10 text-slate-400';
        return `
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs ${active}">
              ${stepNum < this.currentStep ? '✓' : stepNum}
            </span>
            ${stepNum < this.totalSteps ? '<div class="w-6 h-0.5 bg-white/10"></div>' : ''}
          </div>
        `;
      }).join('');
    }

    if (prevBtn) {
      prevBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      nextBtn.textContent = this.currentStep === this.totalSteps ? 'Broadcast to Eye of Odin' : 'Next Step →';
      if (this.currentStep === this.totalSteps) {
        nextBtn.className = 'px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all font-mono';
      } else {
        nextBtn.className = 'px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-all font-mono';
      }
    }

    if (!content) return;

    if (this.currentStep === 1) {
      content.innerHTML = `
        <div class="space-y-4">
          <!-- Type Toggle -->
          <div class="flex rounded-xl bg-white/5 p-1 border border-white/10 font-mono">
            <button type="button" id="type-btn-lost" class="flex-1 py-2 rounded-lg text-xs font-bold transition-all ${this.formData.type === 'lost' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-300 hover:text-white'}">
              Report Lost Item
            </button>
            <button type="button" id="type-btn-found" class="flex-1 py-2 rounded-lg text-xs font-bold transition-all ${this.formData.type === 'found' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-300 hover:text-white'}">
              Post Found Item
            </button>
          </div>

          <!-- Priority Urgency Selector -->
          <div class="p-3 rounded-xl bg-slate-900 border border-white/10">
            <label class="block text-xs font-bold text-white mb-1">Item Urgency & Priority Level</label>
            <select id="report-priority-select" class="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono">
              <option value="standard" ${this.formData.priority === 'standard' ? 'selected' : ''}>Standard Priority (Bottles, Apparel, Books, Accessories)</option>
              <option value="high" ${this.formData.priority === 'high' ? 'selected' : ''}>High Priority (Smartphones, AirPods, Student IDs, Wallets)</option>
              <option value="critical" ${this.formData.priority === 'critical' ? 'selected' : ''}>CRITICAL URGENCY (Exam Laptops, Car/Dorm Keys, Medical Inhalers, Passports)</option>
            </select>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Item Name & Model *</label>
            <input id="report-title-input" type="text" value="${this.formData.title}" placeholder="e.g. Space Gray MacBook Pro 14, Prescription Inhaler, Dorm Keys..." class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors" required />
          </div>

          <!-- Category (Includes Others) -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
            <select id="report-category-select" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors">
              ${CATEGORIES.filter(c => c.id !== 'all').map(c => `
                <option value="${c.id}" ${this.formData.category === c.id ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Custom Category Write-In (Only if 'others' selected) -->
          <div id="custom-category-group" class="${this.formData.category === 'others' ? '' : 'hidden'}">
            <label class="block text-xs font-semibold text-cyan-300 mb-1.5">Specify Custom Category / Item Type</label>
            <input id="report-custom-category-input" type="text" value="${this.formData.customCategory || ''}" placeholder="e.g. Medical Device, Lab Tool, Musical Instrument, Umbrella..." class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-cyan-500/40 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Description & Distinguishing Features</label>
            <textarea id="report-desc-input" rows="2" placeholder="Mention stickers, unique scratches, case color, lock screen, or key tags..." class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none">${this.formData.description}</textarea>
          </div>
        </div>
      `;

      const btnLost = document.getElementById('type-btn-lost');
      const btnFound = document.getElementById('type-btn-found');
      if (btnLost && btnFound) {
        btnLost.addEventListener('click', () => {
          audioEngine.playClick();
          this.formData.type = 'lost';
          this.renderStep();
        });
        btnFound.addEventListener('click', () => {
          audioEngine.playClick();
          this.formData.type = 'found';
          this.renderStep();
        });
      }

      const catSelect = document.getElementById('report-category-select');
      const customGroup = document.getElementById('custom-category-group');
      if (catSelect && customGroup) {
        catSelect.addEventListener('change', e => {
          this.formData.category = e.target.value;
          if (e.target.value === 'others') {
            customGroup.classList.remove('hidden');
          } else {
            customGroup.classList.add('hidden');
          }
        });
      }
    } else if (this.currentStep === 2) {
      content.innerHTML = `
        <div class="space-y-4">
          <!-- Campus Building Picker -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Campus Building / Zone *</label>
            <select id="report-bldg-select" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors">
              ${CAMPUS_BUILDINGS.map(b => `
                <option value="${b.id}" ${this.formData.buildingId === b.id ? 'selected' : ''}>
                  ${b.name} (${b.code}) - ${b.area}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Specific Room or Spot -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Specific Room, Floor, or Landmark</label>
            <input id="report-loc-input" type="text" value="${this.formData.specificLocation}" placeholder="e.g. 2nd Floor Quiet Study table #4, Cafeteria booth..." class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>

          <!-- Drag, Paste & Simulated AI Photo Upload -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-semibold text-slate-300">
                Item Photo / Image Evidence (Optional)
              </label>
              <span class="text-[10px] text-cyan-400 font-mono">Drag & Drop or Paste (Ctrl+V)</span>
            </div>

            ${this.formData.imageDataUrl ? `
              <!-- Uploaded Image Preview Box -->
              <div class="p-3 rounded-xl border border-cyan-500/50 bg-slate-900/90 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center gap-3 relative group">
                <div class="relative w-20 h-20 rounded-lg overflow-hidden border border-cyan-400/40 bg-black flex-shrink-0 flex items-center justify-center">
                  <img src="${this.formData.imageDataUrl}" alt="Item preview" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0 font-mono">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="truncate">${this.formData.imageName || 'Attached Photo'}</span>
                  </div>
                  <p class="text-[10px] text-slate-400 mt-0.5">Image loaded & analyzed by ML Vision</p>
                  <div class="flex items-center gap-2 mt-2">
                    <button type="button" id="btn-change-image" class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold border border-white/10 transition-all">
                      Change Photo
                    </button>
                    <button type="button" id="btn-remove-image" class="px-2.5 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-semibold border border-red-500/40 transition-all">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ` : `
              <!-- Drop & Paste Target Area -->
              <div id="image-drop-area" class="p-5 rounded-xl border-2 border-dashed border-cyan-500/40 bg-cyan-950/10 hover:bg-cyan-950/20 hover:border-cyan-400 text-center transition-all cursor-pointer group">
                <input type="file" id="report-file-input" accept="image/*" class="hidden" />
                <div class="w-12 h-12 mx-auto mb-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <h5 class="text-xs font-bold text-cyan-300 mb-1">
                  Drag & Drop photo here, or <span class="underline decoration-cyan-400 text-white">Click to Browse</span>
                </h5>
                <p class="text-[11px] text-slate-400 font-mono mb-2">
                  Clipboard paste enabled: Copy image and press <kbd class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/10 text-[10px]">Ctrl+V</kbd> anywhere!
                </p>
                <div class="flex items-center justify-center gap-1 text-[10px] text-slate-500 font-mono">
                  <span>PNG, JPG, WEBP, GIF supported</span>
                </div>
              </div>
            `}

            <!-- Preset Samples Bar -->
            <div class="flex items-center justify-between pt-1">
              <span class="text-[10px] text-slate-400 font-mono">Or quick-test with presets:</span>
              <div class="flex items-center gap-1.5">
                <button type="button" class="btn-sample-upload px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[10px] text-slate-300 hover:text-white border border-white/10 font-mono transition-all" data-sample="macbook.jpg">
                  Laptop
                </button>
                <button type="button" class="btn-sample-upload px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[10px] text-slate-300 hover:text-white border border-white/10 font-mono transition-all" data-sample="airpods.jpg">
                  AirPods
                </button>
                <button type="button" class="btn-sample-upload px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[10px] text-slate-300 hover:text-white border border-white/10 font-mono transition-all" data-sample="keys.jpg">
                  Keys
                </button>
              </div>
            </div>

            <!-- Detected Tags Preview -->
            <div id="ai-detected-tags-box" class="p-2.5 rounded-lg bg-black/40 border border-white/5 text-left text-xs ${this.formData.tags.length > 0 ? '' : 'hidden'}">
              <span class="text-cyan-400 font-semibold text-[11px] block mb-1 font-mono">AI Extracted Features:</span>
              <div class="flex flex-wrap gap-1.5 mb-1" id="ai-tags-list">
                ${this.formData.tags.map(t => `<span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/30">#${t}</span>`).join('')}
              </div>
              <span class="text-slate-400 text-[10px]">Detected Color: <strong>${this.formData.colorName}</strong></span>
            </div>
          </div>
        </div>
      `;

      // Bind drag, drop, and file input events
      const dropArea = document.getElementById('image-drop-area');
      const fileInput = document.getElementById('report-file-input');

      if (dropArea && fileInput) {
        dropArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', e => {
          if (e.target.files && e.target.files[0]) {
            this.handleImageFile(e.target.files[0]);
          }
        });

        dropArea.addEventListener('dragover', e => {
          e.preventDefault();
          e.stopPropagation();
          dropArea.classList.add('border-cyan-400', 'bg-cyan-500/20', 'scale-[1.01]');
        });

        dropArea.addEventListener('dragleave', e => {
          e.preventDefault();
          e.stopPropagation();
          dropArea.classList.remove('border-cyan-400', 'bg-cyan-500/20', 'scale-[1.01]');
        });

        dropArea.addEventListener('drop', e => {
          e.preventDefault();
          e.stopPropagation();
          dropArea.classList.remove('border-cyan-400', 'bg-cyan-500/20', 'scale-[1.01]');
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.handleImageFile(e.dataTransfer.files[0]);
          }
        });
      }

      const btnChangeImage = document.getElementById('btn-change-image');
      if (btnChangeImage) {
        btnChangeImage.addEventListener('click', () => {
          const tempInput = document.createElement('input');
          tempInput.type = 'file';
          tempInput.accept = 'image/*';
          tempInput.onchange = e => {
            if (e.target.files && e.target.files[0]) {
              this.handleImageFile(e.target.files[0]);
            }
          };
          tempInput.click();
        });
      }

      const btnRemoveImage = document.getElementById('btn-remove-image');
      if (btnRemoveImage) {
        btnRemoveImage.addEventListener('click', () => {
          audioEngine.playClick();
          this.formData.imageDataUrl = null;
          this.formData.imageName = null;
          this.formData.hasImage = false;
          this.renderStep();
        });
      }

      content.querySelectorAll('.btn-sample-upload').forEach(btn => {
        btn.addEventListener('click', () => {
          audioEngine.playScan();
          const sample = btn.getAttribute('data-sample');
          const result = aiMatchingEngine.simulateImageLabeling(sample);
          this.formData.category = result.category;
          this.formData.tags = result.tags;
          this.formData.color = result.color;
          this.formData.colorName = result.colorName;
          if (sample.includes('mac')) this.formData.previewType = 'laptop';
          if (sample.includes('airpod')) this.formData.previewType = 'earbuds';
          if (sample.includes('key')) this.formData.previewType = 'keys';

          const box = document.getElementById('ai-detected-tags-box');
          if (box) {
            box.classList.remove('hidden');
            const tagsList = document.getElementById('ai-tags-list');
            if (tagsList) {
              tagsList.innerHTML = this.formData.tags.map(t => `<span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/30">#${t}</span>`).join('');
            }
          }
        });
      });
    } else if (this.currentStep === 3) {
      content.innerHTML = `
        <div class="space-y-4">
          <div class="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
            <h5 class="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Anti-Scam Ownership Challenge</span>
            </h5>
            <p class="text-[11px] text-slate-400">
              Only the genuine owner will know this answer. Claimants must answer before hand-off details are released.
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Secret Ownership Question *</label>
            <input id="report-question-input" type="text" value="${this.formData.secretQuestion}" placeholder="e.g. What is the lockscreen wallpaper? What sticker is on bottom? Serial suffix?" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Answer Guidance / Hint (Optional)</label>
            <input id="report-hint-input" type="text" value="${this.formData.secretAnswerHint}" placeholder="e.g. A four-letter code, or graduation year" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>

          ${this.formData.type === 'lost' ? `
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Optional Good Samaritan Bounty ($ USD)</label>
              <div class="relative">
                <span class="absolute left-3.5 top-2.5 text-slate-400 text-sm">$</span>
                <input id="report-bounty-input" type="number" min="0" step="5" value="${this.formData.rewardBounty}" class="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
            </div>
          ` : `
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Current Custody Status</label>
              <select id="report-custody-select" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors">
                <option value="self">I am holding the item personally</option>
                <option value="security_locker">Turned into Campus Security Desk (Locker)</option>
              </select>
            </div>
          `}
        </div>
      `;

      const custodySelect = document.getElementById('report-custody-select');
      if (custodySelect) {
        custodySelect.addEventListener('change', e => {
          this.formData.custody = e.target.value;
          if (e.target.value === 'security_locker') {
            this.formData.lockerId = 'Locker ' + String.fromCharCode(65 + Math.floor(Math.random() * 5)) + '-' + Math.floor(10 + Math.random() * 80);
          }
        });
      }
    } else if (this.currentStep === 4) {
      const bldg = CAMPUS_BUILDINGS.find(b => b.id === this.formData.buildingId);
      const catLabel = this.formData.category === 'others' && this.formData.customCategory
        ? this.formData.customCategory
        : this.formData.category;

      content.innerHTML = `
        <div class="space-y-3">
          <div class="text-center py-2">
            <div class="w-12 h-12 mx-auto mb-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg>
            </div>
            <h4 class="text-base font-bold text-white">Review & Broadcast to Eye of Odin</h4>
            <p class="text-xs text-slate-400">Our neural vision engine will immediately search existing posts for high-probability matches.</p>
          </div>

          <div class="p-4 rounded-xl glass-panel border border-white/10 space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-400">Type:</span>
              <span class="font-bold ${this.formData.type === 'lost' ? 'text-amber-400' : 'text-emerald-400'} uppercase">${this.formData.type}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Priority Level:</span>
              <span class="font-bold uppercase ${this.formData.priority === 'critical' ? 'text-red-400' : this.formData.priority === 'high' ? 'text-amber-400' : 'text-cyan-400'}">${this.formData.priority}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Category:</span>
              <span class="text-white font-medium capitalize">${catLabel}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Item Title:</span>
              <span class="text-white font-medium text-right max-w-[200px] truncate">${this.formData.title}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Location:</span>
              <span class="text-white font-medium text-right max-w-[200px] truncate">${bldg?.name || 'Campus'}</span>
            </div>
            ${this.formData.rewardBounty > 0 ? `
              <div class="flex justify-between">
                <span class="text-slate-400">Reward Bounty:</span>
                <span class="text-amber-300 font-bold">\$${this.formData.rewardBounty}</span>
              </div>
            ` : ''}
            ${this.formData.imageDataUrl ? `
              <div class="flex items-center justify-between pt-2 border-t border-white/10">
                <span class="text-slate-400">Attached Photo:</span>
                <div class="flex items-center gap-2">
                  <img src="${this.formData.imageDataUrl}" alt="Thumbnail" class="w-8 h-8 rounded-lg object-cover border border-cyan-400/50" />
                  <span class="text-cyan-300 font-mono text-[10px] truncate max-w-[130px]">${this.formData.imageName || 'Photo Attached'}</span>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
  }

  submitForm() {
    audioEngine.playChime();
    const newItem = stateManager.addItem({
      type: this.formData.type,
      priority: this.formData.priority,
      title: this.formData.title,
      category: this.formData.category,
      customCategory: this.formData.customCategory || null,
      description: this.formData.description || `${this.formData.title} reported on campus.`,
      buildingId: this.formData.buildingId,
      specificLocation: this.formData.specificLocation || 'Campus Area',
      color: this.formData.color,
      colorName: this.formData.colorName,
      rewardBounty: this.formData.rewardBounty,
      secretQuestion: this.formData.secretQuestion || 'Describe distinguishing marks or serial number',
      secretAnswerHint: this.formData.secretAnswerHint || '',
      tags: this.formData.tags.length > 0 ? this.formData.tags : [this.formData.category, 'campus'],
      custody: this.formData.custody,
      lockerId: this.formData.lockerId || null,
      previewType: this.formData.previewType,
      hasImage: !!this.formData.imageDataUrl,
      imageDataUrl: this.formData.imageDataUrl || null,
      reporter: this.formData.reporter
    });

    this.resetForm();
    this.close();

    if (this.options.onItemCreated) {
      this.options.onItemCreated(newItem);
    }
  }
}
