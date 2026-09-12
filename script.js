/**
 * CertiFlow - Bulk Certificate Generator
 * Free-Size & CodeUdaan 1448x1086 Native Resolution Engine
 * Zero Backend - 100% Client-Side Local Browser Processing
 */

/* ==========================================================================
   APP STATE MANAGEMENT
   ========================================================================== */
const MAX_CERTIFICATES = 223;

const appState = {
  currentStep: 1, // 1: Template, 2: Position, 3: Students, 4: Generate
  template: {
    image: null,      // HTMLImageElement
    src: null,        // Data URL
    width: 1448,      // Native CodeUdaan Certificate Width
    height: 1086,     // Native CodeUdaan Certificate Height
    filename: 'Coordinator Certificate.png',
    type: 'image'     // 'image' or 'pdf'
  },
  students: [
    "Rahul Sharma",
    "Priya Das",
    "Aman Kumar",
    "Sneha Patel",
    "Rohit Singh",
    "Krishna Kumar Choudhary"
  ],
  selectedStudentIndex: 0,
  namePosition: {
    xPercent: 20.0,      // Top-Left X = 20% (approx 290px on 1448px width)
    yPercent: 60.3,      // Top-Left Y = 60.3% (approx 655px on 1086px height)
    widthPercent: 60.0,  // Width = 60% (approx 870px on 1448px width)
    heightPercent: 6.9   // Height = 6.9% (approx 75px on 1086px height)
  },
  textStyle: {
    fontFamily: "Poppins",
    fontSize: 42,       // Default initial font size (42px)
    color: "#000000",   // Black
    alignment: "center",// "left", "center", "right"
    fontWeight: "600",  // Semi-Bold (600)
    textTransform: "none"
  },
  sampleName: "Rahul Sharma",
  outputFormat: "pdf",  // "pdf" or "png"
  isGenerating: false,
  cancelRequested: false,
  generatedZipBlob: null
};

/* ==========================================================================
   BUILT-IN CODEUDAAN & SAMPLE TEMPLATES (NATIVE 1448x1086 4:3)
   ========================================================================== */
const SAMPLE_TEMPLATES = {
  academic: createSvgTemplateDataUrl('codeudaan'),
  tech: createSvgTemplateDataUrl('tech'),
  portrait: createSvgTemplateDataUrl('portrait'),
  minimal: createSvgTemplateDataUrl('minimal')
};

function createSvgTemplateDataUrl(theme) {
  let content = '';
  
  if (theme === 'codeudaan' || theme === 'academic') {
    // CodeUdaan Coordinator Certificate Specification: 1448 x 1086 (4:3)
    content = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1448 1086" width="1448" height="1086">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D4AF37"/>
          <stop offset="50%" stop-color="#FCF6BA"/>
          <stop offset="100%" stop-color="#AA771C"/>
        </linearGradient>
      </defs>
      <!-- Background Canvas -->
      <rect width="1448" height="1086" fill="#FAF9F6" />
      
      <!-- Outer & Inner Gold Borders -->
      <rect x="30" y="30" width="1388" height="1026" fill="none" stroke="url(#goldGrad)" stroke-width="10" rx="12" />
      <rect x="50" y="50" width="1348" height="986" fill="none" stroke="#0F172A" stroke-width="2" rx="8" />
      <rect x="58" y="58" width="1332" height="970" fill="none" stroke="url(#goldGrad)" stroke-width="2" rx="6" />

      <!-- Corner Ornaments -->
      <path d="M 50,110 L 110,50 M 50,120 L 120,50 M 1398,110 L 1338,50 M 1398,120 L 1328,50 M 50,976 L 110,1036 M 50,966 L 120,1036 M 1398,976 L 1338,1036 M 1398,966 L 1328,1036" stroke="url(#goldGrad)" stroke-width="2.5" fill="none"/>

      <!-- Header Crest / Logo Badge -->
      <circle cx="724" cy="170" r="46" fill="url(#goldGrad)"/>
      <circle cx="724" cy="170" r="38" fill="#0F172A"/>
      <text x="724" y="178" font-family="'Cinzel', serif" font-size="28" font-weight="700" fill="#FCF6BA" text-anchor="middle">CU</text>

      <!-- Organization Name -->
      <text x="724" y="255" font-family="'Poppins', sans-serif" font-size="22" font-weight="700" fill="#AA771C" text-anchor="middle" letter-spacing="6">CODEUDAAN WORKSHOP</text>

      <!-- Certificate Heading -->
      <text x="724" y="330" font-family="'Cinzel', serif" font-size="46" font-weight="700" fill="#0F172A" text-anchor="middle" letter-spacing="4">COORDINATOR CERTIFICATE</text>
      
      <!-- Subheading -->
      <text x="724" y="400" font-family="'Montserrat', sans-serif" font-size="18" font-weight="600" fill="#64748B" text-anchor="middle" letter-spacing="6">THIS IS TO CERTIFY THAT</text>
      
      <!-- Blank Area line guide for Name Field -->
      <line x1="290" y1="720" x2="1160" y2="720" stroke="url(#goldGrad)" stroke-width="2"/>
      
      <!-- Description Body -->
      <text x="724" y="780" font-family="'Cormorant Garamond', serif" font-size="24" font-style="italic" fill="#334155" text-anchor="middle">
        has successfully coordinated in the CodeUdaan Workshop and demonstrated outstanding leadership.
      </text>

      <!-- Signatures Block -->
      <g transform="translate(280, 920)">
        <line x1="0" y1="0" x2="260" y2="0" stroke="#64748B" stroke-width="1.5"/>
        <text x="130" y="28" font-family="'Montserrat', sans-serif" font-size="15" font-weight="600" fill="#0F172A" text-anchor="middle">EVENT COORDINATOR</text>
        <text x="130" y="46" font-family="'Inter', sans-serif" font-size="13" fill="#64748B" text-anchor="middle">CodeUdaan Executive</text>
      </g>

      <g transform="translate(908, 920)">
        <line x1="0" y1="0" x2="260" y2="0" stroke="#64748B" stroke-width="1.5"/>
        <text x="130" y="28" font-family="'Montserrat', sans-serif" font-size="15" font-weight="600" fill="#0F172A" text-anchor="middle">PROGRAM DIRECTOR</text>
        <text x="130" y="46" font-family="'Inter', sans-serif" font-size="13" fill="#64748B" text-anchor="middle">CodeUdaan Foundation</text>
      </g>
    </svg>`;
  } else if (theme === 'tech') {
    content = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" width="1600" height="1200">
      <defs>
        <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4F46E5"/>
          <stop offset="100%" stop-color="#06B6D4"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="1200" fill="#FFFFFF"/>
      <polygon points="0,0 400,0 0,400" fill="url(#indigoGrad)" opacity="0.9"/>
      <polygon points="1600,1200 1200,1200 1600,800" fill="url(#indigoGrad)" opacity="0.9"/>
      
      <rect x="50" y="50" width="1500" height="1100" fill="none" stroke="#E2E8F0" stroke-width="4" rx="16"/>
      <rect x="70" y="70" width="1460" height="1060" fill="none" stroke="#4F46E5" stroke-width="1" stroke-dasharray="8,6" rx="12"/>

      <text x="800" y="300" font-family="'Poppins', sans-serif" font-size="48" font-weight="800" fill="#0F172A" text-anchor="middle" letter-spacing="4">CERTIFICATE OF EXCELLENCE</text>
      <text x="800" y="370" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#4F46E5" text-anchor="middle" letter-spacing="6">PROUDLY PRESENTED TO</text>
      
      <line x1="300" y1="720" x2="1300" y2="720" stroke="#CBD5E1" stroke-width="2"/>
      
      <text x="800" y="780" font-family="'Inter', sans-serif" font-size="22" fill="#475569" text-anchor="middle">
        For mastering advanced full-stack application development &amp; AI architecture.
      </text>

      <g transform="translate(320, 960)">
        <line x1="0" y1="0" x2="260" y2="0" stroke="#64748B" stroke-width="2"/>
        <text x="130" y="30" font-family="'Poppins', sans-serif" font-size="16" font-weight="600" fill="#0F172A" text-anchor="middle">SARAH CONNOR</text>
        <text x="130" y="50" font-family="'Inter', sans-serif" font-size="14" fill="#64748B" text-anchor="middle">Lead Instructor</text>
      </g>
      
      <g transform="translate(1020, 960)">
        <line x1="0" y1="0" x2="260" y2="0" stroke="#64748B" stroke-width="2"/>
        <text x="130" y="30" font-family="'Poppins', sans-serif" font-size="16" font-weight="600" fill="#0F172A" text-anchor="middle">MARCUS VANCE</text>
        <text x="130" y="50" font-family="'Inter', sans-serif" font-size="14" fill="#64748B" text-anchor="middle">Head of Certification</text>
      </g>
    </svg>`;
  } else if (theme === 'portrait') {
    content = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
      <defs>
        <linearGradient id="goldPort" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D4AF37"/>
          <stop offset="100%" stop-color="#AA771C"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="1600" fill="#FAF9F6"/>
      <rect x="40" y="40" width="1120" height="1520" fill="none" stroke="url(#goldPort)" stroke-width="8" rx="12"/>
      <rect x="56" y="56" width="1088" height="1488" fill="none" stroke="#1E293B" stroke-width="2" rx="8"/>

      <circle cx="600" cy="240" r="55" fill="url(#goldPort)"/>
      <text x="600" y="248" font-family="'Cinzel', serif" font-size="32" font-weight="700" fill="#FFFFFF" text-anchor="middle">🎓</text>

      <text x="600" y="380" font-family="'Cinzel', serif" font-size="44" font-weight="700" fill="#0F172A" text-anchor="middle" letter-spacing="4">CERTIFICATE OF HONOR</text>
      <text x="600" y="440" font-family="'Montserrat', sans-serif" font-size="16" font-weight="600" fill="#AA771C" text-anchor="middle" letter-spacing="6">THIS IS PROUDLY PRESENTED TO</text>

      <line x1="200" y1="960" x2="1000" y2="960" stroke="url(#goldPort)" stroke-width="2"/>

      <text x="600" y="1030" font-family="'Cormorant Garamond', serif" font-size="24" font-style="italic" fill="#475569" text-anchor="middle">
        For exemplary performance, leadership, and dedicated service.
      </text>

      <g transform="translate(250, 1340)">
        <line x1="0" y1="0" x2="250" y2="0" stroke="#64748B" stroke-width="1.5"/>
        <text x="125" y="30" font-family="'Montserrat', sans-serif" font-size="14" font-weight="600" fill="#0F172A" text-anchor="middle">VICTORIA STERLING</text>
        <text x="125" y="48" font-family="'Inter', sans-serif" font-size="12" fill="#64748B" text-anchor="middle">Executive Chairperson</text>
      </g>

      <g transform="translate(700, 1340)">
        <line x1="0" y1="0" x2="250" y2="0" stroke="#64748B" stroke-width="1.5"/>
        <text x="125" y="30" font-family="'Montserrat', sans-serif" font-size="14" font-weight="600" fill="#0F172A" text-anchor="middle">DANIEL KINGSLEY</text>
        <text x="125" y="48" font-family="'Inter', sans-serif" font-size="12" fill="#64748B" text-anchor="middle">Managing Director</text>
      </g>
    </svg>`;
  } else {
    // minimal
    content = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 1200" width="1800" height="1200">
      <rect width="1800" height="1200" fill="#F8FAFC"/>
      <rect x="50" y="50" width="1700" height="1100" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" rx="12"/>
      <rect x="90" y="90" width="1620" height="1020" fill="none" stroke="#0F172A" stroke-width="3" rx="8"/>

      <text x="900" y="300" font-family="'Playfair Display', serif" font-size="56" font-weight="600" fill="#0F172A" text-anchor="middle">Certificate of Recognition</text>
      <text x="900" y="370" font-family="'Montserrat', sans-serif" font-size="16" font-weight="500" fill="#64748B" text-anchor="middle" letter-spacing="4">THIS ACKNOWLEDGES THAT</text>

      <line x1="400" y1="720" x2="1400" y2="720" stroke="#0F172A" stroke-width="1.5"/>

      <text x="900" y="780" font-family="'Playfair Display', serif" font-size="22" font-style="italic" fill="#334155" text-anchor="middle">
        has successfully participated in the Global Leadership &amp; Innovation Workshop.
      </text>

      <g transform="translate(420, 960)">
        <line x1="0" y1="0" x2="250" y2="0" stroke="#0F172A" stroke-width="1"/>
        <text x="125" y="28" font-family="'Montserrat', sans-serif" font-size="15" font-weight="600" fill="#0F172A" text-anchor="middle">ALEXANDER RIVERS</text>
        <text x="125" y="48" font-family="'Inter', sans-serif" font-size="13" fill="#64748B" text-anchor="middle">Program Director</text>
      </g>
      <g transform="translate(1130, 960)">
        <line x1="0" y1="0" x2="250" y2="0" stroke="#0F172A" stroke-width="1"/>
        <text x="125" y="28" font-family="'Montserrat', sans-serif" font-size="15" font-weight="600" fill="#0F172A" text-anchor="middle">HELENA ROSTOVA</text>
        <text x="125" y="48" font-family="'Inter', sans-serif" font-size="13" fill="#64748B" text-anchor="middle">Event Organizer</text>
      </g>
    </svg>`;
  }

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(content.trim());
}

/* ==========================================================================
   INITIALIZATION & DOM EVENT BINDING
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  bindNavigationEvents();
  bindUploadEvents();
  bindPositionControlEvents();
  bindStudentInputEvents();
  bindGeneratorEvents();
  bindCanvasDragEvents();
  bindPreviewStudentSelector();
  
  // Resize listeners to adjust preview overlay scale dynamically on window or container resize
  window.addEventListener('resize', () => {
    updateOverlayPosition();
  });

  if (typeof ResizeObserver !== 'undefined') {
    const wrapper = document.getElementById('canvasWrapper');
    if (wrapper) {
      const observer = new ResizeObserver(() => {
        updateOverlayPosition();
      });
      observer.observe(wrapper);
    }
  }

  // Load CodeUdaan initial template (1448 x 1086)
  loadSampleTemplate('academic', false);
  updateUI();
}

/* ==========================================================================
   STEP NAVIGATION
   ========================================================================== */
function bindNavigationEvents() {
  const stepItems = document.querySelectorAll('.step-item');
  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      goToStep(step);
    });
  });
}

function goToStep(step) {
  if (appState.isGenerating) return;
  
  // Validation checks before moving forward
  if (step > 1 && !appState.template.image) {
    showToast("Please upload or select a certificate template first.", "error");
    return;
  }
  if (step > 3 && appState.students.length === 0) {
    showToast("Please add at least one student name before generating.", "error");
    return;
  }

  appState.currentStep = step;
  updateUI();
}

window.goToStep = goToStep;
window.loadSampleTemplate = loadSampleTemplate;

function updateUI() {
  // Update step indicators
  const stepItems = document.querySelectorAll('.step-item');
  stepItems.forEach(item => {
    const step = parseInt(item.getAttribute('data-step'), 10);
    item.classList.remove('active', 'completed', 'disabled');
    
    if (step === appState.currentStep) {
      item.classList.add('active');
    } else if (step < appState.currentStep) {
      item.classList.add('completed');
    }
  });

  // Toggle Control Cards by Step
  document.querySelectorAll('.step-card').forEach(card => {
    const cardStep = parseInt(card.getAttribute('data-step'), 10);
    if (cardStep === appState.currentStep) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  // Toggle Workspace Layout mode
  const progressCard = document.getElementById('progressCard');
  const completionCard = document.getElementById('completionCard');
  const workspaceGrid = document.querySelector('.workspace-grid');
  
  if (progressCard) progressCard.style.display = 'none';
  if (completionCard) completionCard.style.display = 'none';
  if (workspaceGrid) workspaceGrid.style.display = 'grid';

  // Update Summary card data if on step 4
  if (appState.currentStep === 4) {
    updateSummaryCard();
  }

  // Sync Student Preview Select
  updatePreviewStudentSelect();

  // Render Preview Canvas
  renderCertificateCanvas();
}

/* ==========================================================================
   STEP 1: TEMPLATE UPLOAD & SAMPLES
   ========================================================================== */
function bindUploadEvents() {
  const dropzone = document.getElementById('templateDropzone');
  const fileInput = document.getElementById('templateFileInput');
  const browseBtn = document.getElementById('browseTemplateBtn');
  const loadDemoBtn = document.getElementById('loadDemoDataBtn');

  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (dropzone) {
    dropzone.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-over');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        handleTemplateFile(files[0]);
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleTemplateFile(e.target.files[0]);
      }
    });
  }

  // Sample card triggers
  document.querySelectorAll('.sample-card').forEach(card => {
    card.addEventListener('click', () => {
      const theme = card.getAttribute('data-theme');
      loadSampleTemplate(theme, true);
    });
  });

  if (loadDemoBtn) {
    loadDemoBtn.addEventListener('click', () => {
      loadDemoData();
    });
  }
}

function handleTemplateFile(file) {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpe?g|pdf)$/i)) {
    showToast('Unsupported file type. Please upload a PNG, JPG, JPEG, or PDF certificate template.', 'error');
    return;
  }

  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    renderPdfTemplate(file);
  } else {
    const reader = new FileReader();
    reader.onload = (e) => {
      loadTemplateFromSrc(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
  }
}

function loadTemplateFromSrc(src, filename) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    appState.template.image = img;
    appState.template.src = src;
    appState.template.width = img.naturalWidth || 1448;
    appState.template.height = img.naturalHeight || 1086;
    appState.template.filename = filename || 'Coordinator Certificate.png';
    appState.template.type = 'image';

    updateTemplateInfoBar();
    showToast(`Loaded ${appState.template.width} × ${appState.template.height} px template!`, 'success');
    renderCertificateCanvas();
  };
  img.src = src;
}

function renderPdfTemplate(file) {
  if (typeof pdfjsLib === 'undefined') {
    showToast("PDF rendering library loading... Please try PNG/JPG or wait a moment.", "error");
    return;
  }
  
  showToast("Processing PDF template page 1...", "info");
  
  const fileReader = new FileReader();
  fileReader.onload = function() {
    const typedarray = new Uint8Array(this.result);
    pdfjsLib.getDocument(typedarray).promise.then(pdf => {
      pdf.getPage(1).then(page => {
        const viewport = page.getViewport({ scale: 2.0 }); // High DPI
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext).promise.then(() => {
          const dataUrl = canvas.toDataURL('image/png');
          loadTemplateFromSrc(dataUrl, file.name);
        });
      });
    }).catch(err => {
      console.error(err);
      showToast("Could not parse PDF file. Please convert it to PNG/JPG.", "error");
    });
  };
  fileReader.readAsArrayBuffer(file);
}

function loadSampleTemplate(theme, notify = true) {
  const src = SAMPLE_TEMPLATES[theme] || SAMPLE_TEMPLATES['academic'];
  const name = theme === 'academic' ? 'Coordinator Certificate.png' : (theme.charAt(0).toUpperCase() + theme.slice(1) + '_Template.png');
  loadTemplateFromSrc(src, name);
}

function loadDemoData() {
  loadSampleTemplate('academic', false);
  appState.students = [
    "Rahul Sharma",
    "Priya Das",
    "Aman Kumar",
    "Sneha Patel",
    "Rohit Singh",
    "Krishna Kumar Choudhary"
  ];
  appState.selectedStudentIndex = 0;
  appState.sampleName = appState.students[0];

  updateStudentTable();
  updatePreviewStudentSelect();

  const pasteTextarea = document.getElementById('pasteStudentNames');
  if (pasteTextarea) {
    pasteTextarea.value = appState.students.join('\n');
  }
  showToast("CodeUdaan Demo data loaded (6 students)", "success");
  goToStep(2);
}

function updateTemplateInfoBar() {
  const bar = document.getElementById('activeTemplateBar');
  const thumb = document.getElementById('activeTemplateThumb');
  const nameEl = document.getElementById('activeTemplateName');
  const dimsEl = document.getElementById('activeTemplateDims');

  if (bar && appState.template.image) {
    bar.style.display = 'flex';
    if (thumb) thumb.src = appState.template.src;
    if (nameEl) nameEl.textContent = appState.template.filename;
    if (dimsEl) dimsEl.textContent = `${appState.template.width} × ${appState.template.height} px`;
  }
}

/* ==========================================================================
   STEP 2: NAME POSITION & TEXT STYLING
   ========================================================================== */
function bindPositionControlEvents() {
  const fontSelect = document.getElementById('fontFamilySelect');
  const fontSizeInput = document.getElementById('fontSizeInput');
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const colorPicker = document.getElementById('textColorPicker');
  const hexInput = document.getElementById('textColorHex');
  const fontWeightSelect = document.getElementById('fontWeightSelect');
  const sampleNameInput = document.getElementById('sampleNameInput');
  
  // Alignment buttons
  document.querySelectorAll('.align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.textStyle.alignment = btn.getAttribute('data-align');
      renderCertificateCanvas();
    });
  });

  // Color Swatches
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      setColorStyle(color);
    });
  });

  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      appState.textStyle.fontFamily = e.target.value;
      renderCertificateCanvas();
    });
  }

  if (fontSizeInput && fontSizeSlider) {
    fontSizeInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) || 42;
      appState.textStyle.fontSize = val;
      fontSizeSlider.value = val;
      renderCertificateCanvas();
    });
    fontSizeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) || 42;
      appState.textStyle.fontSize = val;
      fontSizeInput.value = val;
      renderCertificateCanvas();
    });
  }

  if (colorPicker && hexInput) {
    colorPicker.addEventListener('input', (e) => {
      setColorStyle(e.target.value);
    });
    hexInput.addEventListener('change', (e) => {
      setColorStyle(e.target.value);
    });
  }

  if (fontWeightSelect) {
    fontWeightSelect.addEventListener('change', (e) => {
      appState.textStyle.fontWeight = e.target.value;
      renderCertificateCanvas();
    });
  }

  if (sampleNameInput) {
    sampleNameInput.addEventListener('input', (e) => {
      appState.sampleName = e.target.value || "Rahul Sharma";
      renderCertificateCanvas();
    });
  }

  // Alignment shortcuts (Center Horizontally / Vertically)
  const centerHBtn = document.getElementById('centerHBtn');
  const centerVBtn = document.getElementById('centerVBtn');

  if (centerHBtn) {
    centerHBtn.addEventListener('click', () => {
      appState.namePosition.xPercent = (100 - appState.namePosition.widthPercent) / 2;
      renderCertificateCanvas();
      showToast("Name box centered horizontally", "info");
    });
  }

  if (centerVBtn) {
    centerVBtn.addEventListener('click', () => {
      appState.namePosition.yPercent = 60.3;
      renderCertificateCanvas();
      showToast("Name box set to default vertical position", "info");
    });
  }
}

function setColorStyle(colorHex) {
  if (!colorHex) return;
  if (!colorHex.startsWith('#')) colorHex = '#' + colorHex;
  appState.textStyle.color = colorHex;
  
  const colorPicker = document.getElementById('textColorPicker');
  const hexInput = document.getElementById('textColorHex');
  if (colorPicker) colorPicker.value = colorHex;
  if (hexInput) hexInput.value = colorHex;
  
  renderCertificateCanvas();
}

/* ==========================================================================
   PREVIEW STUDENT SELECTOR
   ========================================================================== */
function bindPreviewStudentSelector() {
  const select = document.getElementById('previewStudentSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value, 10);
      if (!isNaN(idx) && appState.students[idx]) {
        appState.selectedStudentIndex = idx;
        appState.sampleName = appState.students[idx];
        const sampleInput = document.getElementById('sampleNameInput');
        if (sampleInput) sampleInput.value = appState.sampleName;
        renderCertificateCanvas();
      }
    });
  }
}

function updatePreviewStudentSelect() {
  const select = document.getElementById('previewStudentSelect');
  if (!select) return;

  select.innerHTML = '';
  if (appState.students.length === 0) {
    const opt = document.createElement('option');
    opt.value = "0";
    opt.textContent = appState.sampleName || "Rahul Sharma";
    select.appendChild(opt);
    return;
  }

  appState.students.forEach((student, idx) => {
    const opt = document.createElement('option');
    opt.value = idx.toString();
    opt.textContent = `${idx + 1}. ${student}`;
    if (idx === appState.selectedStudentIndex) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

/* ==========================================================================
   STEP 3: STUDENT NAMES (PASTE & CSV)
   ========================================================================== */
function bindStudentInputEvents() {
  const pasteTextarea = document.getElementById('pasteStudentNames');
  const csvFileInput = document.getElementById('csvFileInput');
  const uploadCsvBtn = document.getElementById('uploadCsvBtn');
  const addStudentBtn = document.getElementById('addStudentBtn');
  const newStudentInput = document.getElementById('newStudentInput');
  const clearAllBtn = document.getElementById('clearAllStudentsBtn');

  // Tabs toggle
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  if (pasteTextarea) {
    pasteTextarea.value = appState.students.join('\n');
    pasteTextarea.addEventListener('input', () => {
      parsePastedNames(pasteTextarea.value);
    });
  }

  if (uploadCsvBtn && csvFileInput) {
    uploadCsvBtn.addEventListener('click', () => csvFileInput.click());
    csvFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        parseCSVFile(e.target.files[0]);
      }
    });
  }

  if (addStudentBtn && newStudentInput) {
    const doAdd = () => {
      const name = newStudentInput.value.trim();
      if (name) {
        if (appState.students.length >= MAX_CERTIFICATES) {
          showToast(`Maximum limit of ${MAX_CERTIFICATES} certificates reached!`, 'error');
          return;
        }
        appState.students.push(name);
        newStudentInput.value = '';
        updateStudentTable();
        updatePreviewStudentSelect();
        showToast(`Added "${name}"`, 'success');
      }
    };

    addStudentBtn.addEventListener('click', doAdd);
    newStudentInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') doAdd();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all student names?')) {
        appState.students = [];
        if (pasteTextarea) pasteTextarea.value = '';
        updateStudentTable();
        updatePreviewStudentSelect();
        showToast('Student list cleared', 'info');
      }
    });
  }

  updateStudentTable();
}

function parsePastedNames(text) {
  let lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
    
  if (lines.length > MAX_CERTIFICATES) {
    lines = lines.slice(0, MAX_CERTIFICATES);
    showToast(`Maximum batch size is ${MAX_CERTIFICATES}. Trimmed to first ${MAX_CERTIFICATES} names.`, 'info');
  }

  appState.students = lines;
  if (appState.students.length > 0) {
    appState.selectedStudentIndex = 0;
    appState.sampleName = appState.students[0];
  }
  updateStudentTable();
  updatePreviewStudentSelect();
  renderCertificateCanvas();
}

function parseCSVFile(file) {
  if (typeof Papa === 'undefined') {
    showToast("CSV Parser not ready. Please retry.", "error");
    return;
  }

  Papa.parse(file, {
    skipEmptyLines: true,
    complete: function(results) {
      if (!results.data || results.data.length === 0) {
        showToast("We couldn't find any student names in this CSV.", "error");
        return;
      }

      const rows = results.data;
      let names = [];
      let nameColIndex = 0;

      // Check if first row is header
      const firstRow = rows[0];
      if (firstRow && firstRow.length > 1) {
        const headerIndex = firstRow.findIndex(cell => 
          /name|student|fullname/i.test(String(cell).trim())
        );
        if (headerIndex !== -1) {
          nameColIndex = headerIndex;
          rows.shift();
        }
      }

      rows.forEach(row => {
        if (row[nameColIndex]) {
          const val = String(row[nameColIndex]).trim();
          if (val) names.push(val);
        }
      });

      if (names.length === 0) {
        showToast("No valid student names found in CSV.", "error");
        return;
      }

      if (names.length > MAX_CERTIFICATES) {
        names = names.slice(0, MAX_CERTIFICATES);
        showToast(`CSV contained more than ${MAX_CERTIFICATES} names. Trimmed to first ${MAX_CERTIFICATES}.`, 'info');
      }

      appState.students = names;
      appState.selectedStudentIndex = 0;
      appState.sampleName = appState.students[0];

      const pasteTextarea = document.getElementById('pasteStudentNames');
      if (pasteTextarea) pasteTextarea.value = names.join('\n');
      
      updateStudentTable();
      updatePreviewStudentSelect();
      renderCertificateCanvas();
      showToast(`Imported ${names.length} students from CSV!`, "success");
    },
    error: function(err) {
      console.error(err);
      showToast("Error parsing CSV file.", "error");
    }
  });
}

function updateStudentTable() {
  const tbody = document.getElementById('studentTableBody');
  const countBadge = document.getElementById('studentCountBadge');
  const totalCountEl = document.getElementById('totalStudentCountText');

  if (countBadge) countBadge.textContent = `${appState.students.length} / ${MAX_CERTIFICATES} Loaded`;
  if (totalCountEl) totalCountEl.textContent = `${appState.students.length} / ${MAX_CERTIFICATES} students`;

  if (!tbody) return;
  tbody.innerHTML = '';

  if (appState.students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No student names added yet.</td></tr>`;
    return;
  }

  appState.students.forEach((student, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600; color: var(--text-muted); width: 40px;">${index + 1}</td>
      <td class="student-name-cell" contenteditable="true" data-index="${index}">${escapeHtml(student)}</td>
      <td style="width: 50px; text-align: right;">
        <button class="btn btn-sm btn-danger delete-student-btn" data-index="${index}" title="Delete">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Bind inline edit & delete
  tbody.querySelectorAll('.student-name-cell').forEach(cell => {
    cell.addEventListener('blur', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      const newName = e.target.textContent.trim();
      if (newName) {
        appState.students[idx] = newName;
      } else {
        appState.students.splice(idx, 1);
        updateStudentTable();
      }
      updatePreviewStudentSelect();
    });
  });

  tbody.querySelectorAll('.delete-student-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      appState.students.splice(idx, 1);
      
      const pasteTextarea = document.getElementById('pasteStudentNames');
      if (pasteTextarea) pasteTextarea.value = appState.students.join('\n');
      
      updateStudentTable();
      updatePreviewStudentSelect();
      renderCertificateCanvas();
    });
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   CANVAS RENDERING, AUTO FONT-SHRINKING & DRAG OVERLAY
   ========================================================================== */
function renderCertificateCanvas() {
  const canvas = document.getElementById('certificateCanvas');
  const wrapper = document.getElementById('canvasWrapper');
  const emptyState = document.getElementById('emptyCanvasState');
  
  if (!canvas || !appState.template.image) {
    if (wrapper) wrapper.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }

  if (wrapper) {
    wrapper.style.display = 'block';
    // Dynamically set aspect ratio to maintain uploaded template proportions
    wrapper.style.aspectRatio = `${appState.template.width} / ${appState.template.height}`;
  }
  if (emptyState) emptyState.style.display = 'none';

  const ctx = canvas.getContext('2d');
  const img = appState.template.image;
  
  canvas.width = appState.template.width;
  canvas.height = appState.template.height;

  // 1. Draw Template Image at Native Resolution
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // 2. Draw Currently Selected Student Name on Canvas with Auto-Shrink Logic
  const activeStudentName = appState.sampleName || (appState.students[appState.selectedStudentIndex] || "Rahul Sharma");
  drawStudentNameOnCanvas(ctx, activeStudentName, canvas.width, canvas.height);

  // 3. Update Name Box Overlay Position & Font Size
  updateOverlayPosition();
}

/**
 * Renders student name on original canvas at native resolution
 */
function drawStudentNameOnCanvas(ctx, studentName, canvasW, canvasH) {
  const pos = appState.namePosition;
  const style = appState.textStyle;

  // Calculate actual rendering coordinates on native canvas from percentage state
  const x = (pos.xPercent / 100) * canvasW;
  const y = (pos.yPercent / 100) * canvasH;
  const width = (pos.widthPercent / 100) * canvasW;
  const height = (pos.heightPercent / 100) * canvasH;

  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const maxAllowedWidth = Math.max(10, width - 20); // 20px padding margin

  // Reference font size scaled to native template height (1086px baseline)
  let targetFontSize = style.fontSize * (canvasH / 1086);

  ctx.save();
  ctx.font = `${style.fontWeight} ${targetFontSize}px "${style.fontFamily}", sans-serif`;

  let textToDraw = studentName;
  if (style.textTransform === "uppercase") {
    textToDraw = textToDraw.toUpperCase();
  }

  // Measure text width to auto-shrink if name is long (e.g. Krishna Kumar Choudhary)
  let measuredWidth = ctx.measureText(textToDraw).width;
  if (measuredWidth > maxAllowedWidth && measuredWidth > 0) {
    const scaleRatio = maxAllowedWidth / measuredWidth;
    targetFontSize = Math.max(12, targetFontSize * scaleRatio);
    ctx.font = `${style.fontWeight} ${targetFontSize}px "${style.fontFamily}", sans-serif`;
  }

  ctx.fillStyle = style.color;
  ctx.textBaseline = "middle";

  let drawX = centerX;
  if (style.alignment === "left") {
    ctx.textAlign = "left";
    drawX = x + 10;
  } else if (style.alignment === "right") {
    ctx.textAlign = "right";
    drawX = x + width - 10;
  } else {
    ctx.textAlign = "center";
    drawX = centerX;
  }

  ctx.fillText(textToDraw, drawX, centerY);
  ctx.restore();
}

function updateOverlayPosition() {
  const overlay = document.getElementById('nameBoxOverlay');
  const wrapper = document.getElementById('canvasWrapper');
  const overlayText = document.getElementById('nameBoxText');
  
  if (!overlay || !wrapper) return;

  const pos = appState.namePosition;
  const style = appState.textStyle;

  // Position overlay relative to .certificate-wrap using percentage coordinates
  overlay.style.left = `${pos.xPercent}%`;
  overlay.style.top = `${pos.yPercent}%`;
  overlay.style.width = `${pos.widthPercent}%`;
  overlay.style.height = `${pos.heightPercent}%`;

  // Scale preview overlay font size proportionally: fontSize * (previewWidth / nativeWidth)
  const wrapperWidth = wrapper.clientWidth || 800;
  const nativeWidth = appState.template.width || 1448;
  const scale = wrapperWidth / nativeWidth;
  const previewFontSize = Math.max(10, style.fontSize * scale);

  if (overlayText) {
    overlayText.textContent = appState.sampleName || (appState.students[appState.selectedStudentIndex] || "Rahul Sharma");
    overlayText.style.fontFamily = `"${style.fontFamily}", sans-serif`;
    overlayText.style.color = style.color;
    overlayText.style.fontWeight = style.fontWeight;
    overlayText.style.fontSize = `${previewFontSize}px`;
    overlayText.style.justifyContent = style.alignment === 'left' ? 'flex-start' : (style.alignment === 'right' ? 'flex-end' : 'center');
  }

  // Update numerical coordinates display
  const coordsLabel = document.getElementById('coordsDisplay');
  if (coordsLabel) {
    const absX = Math.round((pos.xPercent / 100) * nativeWidth);
    const absY = Math.round((pos.yPercent / 100) * appState.template.height);
    const absW = Math.round((pos.widthPercent / 100) * nativeWidth);
    const absH = Math.round((pos.heightPercent / 100) * appState.template.height);
    coordsLabel.textContent = `X: ${absX}px (${pos.xPercent.toFixed(1)}%), Y: ${absY}px (${pos.yPercent.toFixed(1)}%) | ${absW}×${absH}px`;
  }
}

function bindCanvasDragEvents() {
  const overlay = document.getElementById('nameBoxOverlay');
  const wrapper = document.getElementById('canvasWrapper');

  if (!overlay || !wrapper) return;

  let isDragging = false;
  let isResizing = false;
  let activeHandle = null;
  let startX, startY;
  let initialPos = {};

  const getEventPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const onStart = (e) => {
    const target = e.target;
    if (target.classList.contains('resize-handle')) {
      isResizing = true;
      activeHandle = target.getAttribute('data-handle');
    } else {
      isDragging = true;
    }

    const pos = getEventPos(e);
    startX = pos.clientX;
    startY = pos.clientY;
    initialPos = { ...appState.namePosition };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  };

  overlay.addEventListener('mousedown', onStart);
  overlay.addEventListener('touchstart', onStart, { passive: false });

  function onMove(e) {
    if (!isDragging && !isResizing) return;
    if (e.cancelable) e.preventDefault();

    const pos = getEventPos(e);
    const rect = wrapper.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Movement delta relative to displayed preview size
    const deltaXPercent = ((pos.clientX - startX) / rect.width) * 100;
    const deltaYPercent = ((pos.clientY - startY) / rect.height) * 100;

    if (isDragging) {
      let newXPercent = initialPos.xPercent + deltaXPercent;
      let newYPercent = initialPos.yPercent + deltaYPercent;

      // Clamp coordinates so name box cannot move outside certificate
      newXPercent = Math.max(0, Math.min(100 - initialPos.widthPercent, newXPercent));
      newYPercent = Math.max(0, Math.min(100 - initialPos.heightPercent, newYPercent));

      appState.namePosition.xPercent = newXPercent;
      appState.namePosition.yPercent = newYPercent;
    } else if (isResizing && activeHandle) {
      let newXPercent = initialPos.xPercent;
      let newYPercent = initialPos.yPercent;
      let newWPercent = initialPos.widthPercent;
      let newHPercent = initialPos.heightPercent;

      if (activeHandle.includes('e')) {
        newWPercent = Math.max(5, Math.min(100 - initialPos.xPercent, initialPos.widthPercent + deltaXPercent));
      }
      if (activeHandle.includes('w')) {
        const possibleW = initialPos.widthPercent - deltaXPercent;
        if (possibleW >= 5 && initialPos.xPercent + deltaXPercent >= 0) {
          newXPercent = initialPos.xPercent + deltaXPercent;
          newWPercent = possibleW;
        }
      }
      if (activeHandle.includes('s')) {
        newHPercent = Math.max(3, Math.min(100 - initialPos.yPercent, initialPos.heightPercent + deltaYPercent));
      }
      if (activeHandle.includes('n')) {
        const possibleH = initialPos.heightPercent - deltaYPercent;
        if (possibleH >= 3 && initialPos.yPercent + deltaYPercent >= 0) {
          newYPercent = initialPos.yPercent + deltaYPercent;
          newHPercent = possibleH;
        }
      }

      appState.namePosition.xPercent = newXPercent;
      appState.namePosition.yPercent = newYPercent;
      appState.namePosition.widthPercent = newWPercent;
      appState.namePosition.heightPercent = newHPercent;
    }

    renderCertificateCanvas();
  }

  function onEnd() {
    isDragging = false;
    isResizing = false;
    activeHandle = null;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
  }
}

/* ==========================================================================
   STEP 4: SUMMARY & BULK GENERATION ENGINE
   ========================================================================== */
function bindGeneratorEvents() {
  const startBtn = document.getElementById('startGenerationBtn');
  const cancelBtn = document.getElementById('cancelGenerationBtn');
  const downloadZipBtn = document.getElementById('downloadZipBtn');
  const resetBtn = document.getElementById('generateAnotherBtn');
  const formatSelect = document.getElementById('outputFormatSelect');

  if (formatSelect) {
    formatSelect.addEventListener('change', (e) => {
      appState.outputFormat = e.target.value;
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startBulkGeneration();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      appState.cancelRequested = true;
      showToast('Cancelling generation process...', 'info');
    });
  }

  if (downloadZipBtn) {
    downloadZipBtn.addEventListener('click', () => {
      if (appState.generatedZipBlob) {
        downloadFile(appState.generatedZipBlob, 'CertiFlow_Certificates.zip');
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      goToStep(1);
    });
  }
}

function updateSummaryCard() {
  const tStatus = document.getElementById('summaryTemplateStatus');
  const sStatus = document.getElementById('summaryStudentsStatus');
  const pStatus = document.getElementById('summaryPositionStatus');

  if (tStatus) {
    tStatus.textContent = appState.template.image ? `✓ ${appState.template.filename}` : "✗ Not Uploaded";
  }
  if (sStatus) {
    sStatus.textContent = `✓ ${appState.students.length} / ${MAX_CERTIFICATES} Students Configured`;
  }
  if (pStatus) {
    pStatus.textContent = `✓ Font: ${appState.textStyle.fontFamily}, Size: ${appState.textStyle.fontSize}px`;
  }
}

async function startBulkGeneration() {
  if (!appState.template.image || appState.students.length === 0) {
    showToast("Please ensure a template and student names are provided.", "error");
    return;
  }

  appState.isGenerating = true;
  appState.cancelRequested = false;

  const workspaceGrid = document.querySelector('.workspace-grid');
  const progressCard = document.getElementById('progressCard');
  const completionCard = document.getElementById('completionCard');

  if (workspaceGrid) workspaceGrid.style.display = 'none';
  if (completionCard) completionCard.style.display = 'none';
  if (progressCard) progressCard.style.display = 'flex';

  const total = appState.students.length;
  const zip = new JSZip();

  // Extract template's native dimensions directly from loaded image / template state
  const img = appState.template.image;
  const nativeWidth = (img && (img.naturalWidth || img.width)) || appState.template.width || 1448;
  const nativeHeight = (img && (img.naturalHeight || img.height)) || appState.template.height || 1086;

  // Keep state synchronized with native template dimensions
  appState.template.width = nativeWidth;
  appState.template.height = nativeHeight;

  // Create high-res offscreen canvas with native dimensions
  const offCanvas = document.createElement('canvas');
  offCanvas.width = nativeWidth;
  offCanvas.height = nativeHeight;
  const offCtx = offCanvas.getContext('2d');

  const filenameCounts = {};

  for (let i = 0; i < total; i++) {
    if (appState.cancelRequested) {
      showToast("Generation cancelled.", "info");
      appState.isGenerating = false;
      updateUI();
      return;
    }

    const studentName = appState.students[i];

    // 1. Render Certificate to Offscreen Canvas at Native Resolution
    offCtx.clearRect(0, 0, nativeWidth, nativeHeight);
    offCtx.drawImage(img, 0, 0, nativeWidth, nativeHeight);
    drawStudentNameOnCanvas(offCtx, studentName, nativeWidth, nativeHeight);

    // 2. Sanitize filename
    let cleanName = studentName.replace(/[^a-zA-Z0-9_\- ]/g, "").trim().replace(/\s+/g, "_") || `Certificate_${i+1}`;
    if (filenameCounts[cleanName]) {
      filenameCounts[cleanName]++;
      cleanName = `${cleanName}_${filenameCounts[cleanName]}`;
    } else {
      filenameCounts[cleanName] = 1;
    }

    // 3. Export PDF or PNG preserving native template dimensions & aspect ratio
    if (appState.outputFormat === 'png') {
      const dataUrl = offCanvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
      zip.file(`${cleanName}.png`, base64Data, { base64: true });
    } else {
      // PDF generation using createPDF helper with document metadata properties
      const pdf = createPDF(offCanvas, studentName, nativeWidth, nativeHeight);
      const pdfBlob = pdf.output('blob');
      zip.file(`${cleanName}.pdf`, pdfBlob);
    }

    // Update Progress UI
    const current = i + 1;
    const percent = Math.round((current / total) * 100);
    updateProgressUI(current, total, percent);

    // Yield execution to allow UI rendering
    await new Promise(r => setTimeout(r, 12));
  }

  // Generate final ZIP
  const progressText = document.getElementById('progressStatusText');
  if (progressText) progressText.textContent = "Compressing certificates into CertiFlow_Certificates.zip archive...";

  appState.generatedZipBlob = await zip.generateAsync({ type: 'blob' });
  appState.isGenerating = false;

  // Auto-download ZIP file directly!
  downloadFile(appState.generatedZipBlob, 'CertiFlow_Certificates.zip');

  // Show Completion Screen
  if (progressCard) progressCard.style.display = 'none';
  if (completionCard) completionCard.style.display = 'flex';

  const compCountEl = document.getElementById('completionCountText');
  if (compCountEl) {
    compCountEl.textContent = `${total} / ${total} Certificates Successfully Created & Saved as CertiFlow_Certificates.zip!`;
  }
}

function updateProgressUI(current, total, percent) {
  const progressBarFill = document.getElementById('progressBarFill');
  const progressPercent = document.getElementById('progressPercentText');
  const progressStats = document.getElementById('progressStatsText');

  if (progressBarFill) progressBarFill.style.width = `${percent}%`;
  if (progressPercent) progressPercent.textContent = `${percent}%`;
  if (progressStats) progressStats.textContent = `${current} / ${total} Certificates`;
}

/* ==========================================================================
   TOAST MESSAGES
   ========================================================================== */
function showToast(message, type = 'info') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.className = `toast toast-${type} show`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : (type === 'error' ? '⚠️' : 'ℹ️')}</span> <span>${message}</span>`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   PDF CREATION HELPER WITH METADATA PROPERTIES
   ========================================================================== */
function createPDF(canvas, studentName, width, height) {
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const isLandscape = width >= height;
  
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling']
  });

  // Set document metadata properties for professional and searchable PDF files
  pdf.setProperties({
    title: `Certificate of Completion - ${studentName}`,
    subject: 'Official Certificate',
    author: 'CertiFlow Bulk Certificate Generator',
    keywords: 'Certificate, CodeUdaan, CertiFlow, Award',
    creator: 'CertiFlow Engine'
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
  return pdf;
}

/* ==========================================================================
   DOWNLOAD HELPER WITH FALLBACK (FIXES saveAs IS NOT DEFINED)
   ========================================================================== */
function downloadFile(blob, filename) {
  if (typeof window.saveAs === 'function' && window.saveAs !== downloadFile) {
    window.saveAs(blob, filename);
  } else if (window.FileSaver && typeof window.FileSaver.saveAs === 'function') {
    window.FileSaver.saveAs(blob, filename);
  } else {
    // Native browser DOM anchor download fallback
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  }
}

// Global fallback definition
if (typeof window.saveAs === 'undefined') {
  window.saveAs = downloadFile;
}

