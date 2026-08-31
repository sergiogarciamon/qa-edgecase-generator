function parseTargetDomain(inputUrl) {
  try {
    const formatted =
      inputUrl.indexOf('http') === 0 ? inputUrl : 'https://' + inputUrl;
    const parsed = new URL(formatted);
    const host = parsed.hostname.replace('www.', '');
    const brand = host.split('.')[0] || 'target';
    return {
      fullUrl: parsed.origin,
      hostname: host,
      brandName: brand,
      brandUpper: brand.toUpperCase(),
      cleanDomain: brand,
    };
  } catch (err) {
    return {
      fullUrl: inputUrl,
      hostname: 'example.com',
      brandName: 'target',
      brandUpper: 'TARGET',
      cleanDomain: 'target',
    };
  }
}

function generateScenarios(targetUrl) {
  const data = parseTargetDomain(targetUrl);

  const pool = [
    {
      id: 'TC-01',
      tag: 'Boundary Scenario',
      title: `Verify input length validation boundary on ${data.brandUpper} search bar exceeding 80 characters limit`,
      targetModule: 'Search Bar / Form Input',
      targetLocators: `input[name="${data.cleanDomain}-search"] | button[id="${data.cleanDomain}-submit"]`,
      steps: [
        `Navigate to target URL: ${data.fullUrl}`,
        `Locate input element using target selector input[name="${data.cleanDomain}-search"]`,
        'Inject test payload string exceeding 80 characters limit',
        'Submit form and observe input field constraint behavior',
      ],
      payload: `${data.cleanDomain}_super_long_search_query_string_exceeding_standard_boundary_limit_validation_check_12345`,
      expected:
        'UI gracefully wraps text or clips at max boundary without overflowing or breaking layout.',
    },
    {
      id: 'TC-02',
      tag: 'Security / XSS',
      title: `Reflected Cross-Site Scripting (XSS) input payload handling on ${data.hostname}`,
      targetModule: 'Global Query / Search Component',
      targetLocators: `form[data-component="${data.cleanDomain}-search-form"] | input[type="search"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        `Focus on main query input field input[aria-label="Search ${data.brandUpper}"]`,
        'Paste script execution payload directly into query input field',
        'Trigger form submit and verify HTML entity encoding on execution',
      ],
      payload: `<script>alert('XSS_${data.brandUpper}_TEST')</script>`,
      expected:
        'Input string is safely encoded as plain literal text in DOM with zero script execution.',
    },
    {
      id: 'TC-03',
      tag: 'Edge Case / Sanitization',
      title: `Unicode and non-ASCII character sanitization on ${data.brandName} query processing`,
      targetModule: 'Navigation Bar / Filter Endpoint',
      targetLocators: `div[id="${data.cleanDomain}-header"] input[type="text"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        'Enter multi-byte Unicode characters combined with leading/trailing whitespace',
        'Execute query search request',
        'Validate payload response state in network tab',
      ],
      payload: `   🚀 𝒬𝒜_${data.brandUpper}_𝒯𝑒𝓈𝓉   `,
      expected:
        'Whitespace is auto-trimmed and Unicode symbols sanitize gracefully without throwing 500 server errors.',
    },
    {
      id: 'TC-04',
      tag: 'Security / SQLi',
      title: `SQL Injection payload escaping on ${data.brandUpper} search endpoint`,
      targetModule: 'API Query Parameters / Search Endpoint',
      targetLocators: `input[id="${data.cleanDomain}-query-input"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        'Inject single-quote boolean tautology SQL payload into input field',
        'Submit query and inspect HTTP response status and body',
        'Verify no database syntax error backtraces or standard SQL errors leak in response',
      ],
      payload: `' OR '1'='1' -- ${data.brandUpper}_SQLI_TEST`,
      expected:
        'Server treats string as literal search parameter, returning standard 200 OK or empty results.',
    },
    {
      id: 'TC-05',
      tag: 'UI Concurrency',
      title: `Rapid double-click form submission debouncing on ${data.hostname}`,
      targetModule: 'Submit Button / Action Handler',
      targetLocators: `button[type="submit"] | form[action*="${data.cleanDomain}"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        'Enter valid query string in input box',
        'Execute 5 rapid consecutive click events on submit button within 300ms',
        'Observe network calls to verify request deduplication/debouncing',
      ],
      payload: `Double_Submit_Debounce_${data.brandUpper}`,
      expected:
        'Button disables immediately after first click; exactly one HTTP POST/GET request is dispatched.',
    },
    {
      id: 'TC-06',
      tag: 'Input Validation',
      title: `Empty and whitespace-only payload submission handling`,
      targetModule: 'Form Controller / Client Validator',
      targetLocators: `form[id="${data.cleanDomain}-search-form"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        'Clear search input completely or fill with only spaces',
        'Attempt submission via Enter keypress or submit button click',
        'Check client-side DOM validation state',
      ],
      payload: '          ',
      expected:
        'Form prevents submission, triggers inline error callout, or highlights input without making network request.',
    },
    {
      id: 'TC-07',
      tag: 'Security / Command Injection',
      title: `OS Command Injection payload validation on ${data.cleanDomain} input handlers`,
      targetModule: 'Backend Router / Command Sanitizer',
      targetLocators: `input[name="${data.cleanDomain}-filter"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        'Inject shell command delimiter characters into input query',
        'Submit request and examine network payload response',
        'Verify system commands do not execute on backend host',
      ],
      payload: `; ls -la /var/www/${data.cleanDomain} #`,
      expected:
        'Backend sanitizes or rejects request; returns 400 Bad Request or escapes shell meta-characters.',
    },
    {
      id: 'TC-08',
      tag: 'Path Traversal',
      title: `Directory Path Traversal payload handling on ${data.hostname} resource endpoints`,
      targetModule: 'Asset Handler / Query Parser',
      targetLocators: `input[data-field="${data.cleanDomain}-path"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        'Inject relative directory traversal sequence into target input',
        'Send GET request and verify file access permissions',
        'Ensure no system or configuration files are returned',
      ],
      payload: `../../../../etc/passwd?domain=${data.cleanDomain}`,
      expected:
        'Application returns 404 or sanitized path without exposing file system contents.',
    },
    {
      id: 'TC-09',
      tag: 'Special Characters',
      title: `HTML entity and reserved markup escaping on ${data.brandUpper}`,
      targetModule: 'Template Renderer / View Engine',
      targetLocators: `input[id="${data.cleanDomain}-input-field"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        'Input reserved HTML markup characters (<, >, &, ", \')',
        'Submit form and check DOM rendering structure',
        'Confirm characters are safely escaped in rendered DOM',
      ],
      payload: `<div class="${data.cleanDomain}-test">& "quote" 'single'</div>`,
      expected:
        'Entities render as plain text string without breaking DOM tree hierarchy.',
    },
    {
      id: 'TC-10',
      tag: 'Payload / DoS',
      title: `Large payload stress handling on ${data.hostname} input controller`,
      targetModule: 'HTTP Request Parser / Middleware',
      targetLocators: `textarea[id="${data.cleanDomain}-comment"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        'Generate 1MB repeated character string payload',
        'Post payload to target endpoint',
        'Verify server response time and client memory stability',
      ],
      payload: `[50KB Buffer Payload: "A" x 51200]_${data.brandUpper}_OVERSIZED`,
      expected:
        'Server handles request via 413 Payload Too Large or truncates gracefully without crashing.',
    },
    {
      id: 'TC-11',
      tag: 'Security / CSRF',
      title: `Validate Anti-CSRF token presence on ${data.brandName} form submissions`,
      targetModule: 'Form Token Validation Middleware',
      targetLocators: `form[action*="${data.cleanDomain}"] input[name="csrf_token"]`,
      steps: [
        `Navigate to ${data.fullUrl}`,
        'Inspect hidden DOM elements for CSRF token presence',
        'Tamper with or remove CSRF token header/payload',
        'Submit state-changing request',
      ],
      payload: `CSRF_INVALID_TOKEN_${data.brandUpper}`,
      expected:
        'Request is rejected with 403 Forbidden status when token is missing or corrupted.',
    },
    {
      id: 'TC-12',
      tag: 'Protocol Edge Case',
      title: `Forced HTTP to HTTPS parameter redirect validation for ${data.hostname}`,
      targetModule: 'TLS Router / Headers',
      targetLocators: `a[href*="${data.cleanDomain}"] | form[method="POST"]`,
      steps: [
        `Attempt connection to http://${data.hostname}`,
        'Verify automatic HTTP 301/302 redirect to secure HTTPS origin',
        'Ensure sensitive form fields enforce secure transmission attribute',
      ],
      payload: `http://${data.hostname}/?test_secure=true`,
      expected:
        'All unencrypted traffic automatically upgrades to HTTPS with HSTS headers enabled.',
    },
  ];

  const domainHash = data.cleanDomain
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const targetCount = 10 + (domainHash % 3);

  return pool.slice(0, targetCount).map((item, idx) => ({
    ...item,
    id: `${idx + 1}. TC-0${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}`,
  }));
}

function buildCardElement(tc) {
  const card = document.createElement('article');
  card.className =
    'bg-cardDark border border-slate-800 rounded-2xl p-6 shadow-xl transition-all hover:border-slate-700/80';

  const badgeContainer = document.createElement('div');
  badgeContainer.className = 'flex items-center justify-between mb-4';

  const idBadge = document.createElement('span');
  idBadge.className =
    'bg-sky-500/10 text-sky-400 font-bold text-xs px-3 py-1 rounded-md border border-sky-500/20';
  idBadge.textContent = tc.id;

  const tagBadge = document.createElement('span');
  tagBadge.className =
    'bg-slate-800/80 text-slate-300 font-medium text-xs px-3 py-1 rounded-md border border-slate-700';
  tagBadge.textContent = tc.tag;

  badgeContainer.appendChild(idBadge);
  badgeContainer.appendChild(tagBadge);

  const titleEl = document.createElement('h3');
  titleEl.className =
    'text-base md:text-lg font-bold text-white mb-5 leading-snug';
  titleEl.textContent = tc.title;

  const grid = document.createElement('div');
  grid.className =
    'bg-innerDark/90 border border-slate-800/80 rounded-xl p-4 mb-5 text-xs md:text-sm grid grid-cols-1 md:grid-cols-2 gap-3';

  const modCol = document.createElement('div');
  modCol.innerHTML = `<span class="text-slate-400 block mb-1">Target Module:</span><span class="text-sky-400 font-medium">${tc.targetModule}</span>`;

  const locCol = document.createElement('div');
  locCol.innerHTML =
    '<span class="text-slate-400 block mb-1">Target Locators:</span>';
  const locCode = document.createElement('code');
  locCode.className =
    'text-emerald-400 font-mono bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800';
  locCode.textContent = tc.targetLocators;
  locCol.appendChild(locCode);

  grid.appendChild(modCol);
  grid.appendChild(locCol);

  const stepsWrap = document.createElement('div');
  stepsWrap.className = 'mb-5 text-xs md:text-sm space-y-2';

  const stepsLabel = document.createElement('span');
  stepsLabel.className =
    'font-bold text-slate-400 block tracking-wider text-xs';
  stepsLabel.textContent = 'EXECUTION STEPS:';

  const ol = document.createElement('ol');
  ol.className = 'list-decimal list-inside space-y-1 pl-1';
  tc.steps.forEach((step) => {
    const li = document.createElement('li');
    li.className = 'text-slate-300';
    li.textContent = step;
    ol.appendChild(li);
  });

  stepsWrap.appendChild(stepsLabel);
  stepsWrap.appendChild(ol);

  const payloadBox = document.createElement('div');
  payloadBox.className =
    'bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5 mb-3 text-xs md:text-sm max-h-32 overflow-y-auto';
  payloadBox.innerHTML =
    '<span class="font-bold text-amber-400 mr-2">Payload:</span>';
  const payloadCode = document.createElement('code');
  payloadCode.className = 'text-amber-300 font-mono break-all';
  payloadCode.textContent = tc.payload;
  payloadBox.appendChild(payloadCode);

  const expectedBox = document.createElement('div');
  expectedBox.className =
    'bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5 text-xs md:text-sm';
  expectedBox.innerHTML =
    '<span class="font-bold text-emerald-400 mr-2">Expected Outcome:</span>';
  const expectedSpan = document.createElement('span');
  expectedSpan.className = 'text-emerald-300 font-medium';
  expectedSpan.textContent = tc.expected;
  expectedBox.appendChild(expectedSpan);

  card.appendChild(badgeContainer);
  card.appendChild(titleEl);
  card.appendChild(grid);
  card.appendChild(stepsWrap);
  card.appendChild(payloadBox);
  card.appendChild(expectedBox);

  return card;
}

function renderTestCases(scenarios) {
  const casesList = document.getElementById('casesList');
  if (!casesList) return;

  casesList.innerHTML = '';
  scenarios.forEach((tc) => {
    casesList.appendChild(buildCardElement(tc));
  });
}

function handleGenerate() {
  const urlInput = document.getElementById('urlInput') as HTMLInputElement | null;
  if (urlInput && urlInput.value.trim()) {
    renderTestCases(generateScenarios(urlInput.value.trim()));
  }
}

function setupApp() {
  const form = document.getElementById('generatorForm');
  const generateBtn = document.getElementById('generateBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleGenerate();
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleGenerate();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupApp);
} else {
  setupApp();
}
