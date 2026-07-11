// Cat Hill Assistant — scripted demo chat. A live deployment would connect
// this UI to an LLM grounded in the clinic's own documents, with wording
// approved by the clinicians. Guidance only — never diagnosis.

(function () {
  var BOOK_STEER = ' The best next step is a first assessment — call 020 8275 0656 or use the contact page and we’ll find you a convenient time.';

  var BRAIN = [
    {
      keys: ['back', 'spine', 'sciatica', 'slipped', 'disc', 'lumbar'],
      reply: 'Back and spine problems are what Cat Hill Clinic has treated most since 1997 — chiropractic care with Dr Jenny Donovan is usually the right starting point, sometimes alongside massage. I can’t diagnose anything from here, but the symptom checker on the home page can point you the right way.' + BOOK_STEER
    },
    {
      keys: ['neck', 'shoulder', 'headache', 'migraine', 'stiff'],
      reply: 'Neck and shoulder trouble — especially the desk-work kind — typically responds well to chiropractic assessment, with therapeutic massage a good companion for muscle tension. We’ll confirm the right approach at a first assessment rather than guess.' + BOOK_STEER
    },
    {
      keys: ['sport', 'injury', 'knee', 'ankle', 'running', 'gym', 'surgery', 'rehab', 'physio'],
      reply: 'That sounds like one for our physiotherapy team (Elements Physiotherapy, led by James Galea) — sports injuries, joint problems and pre/post-surgery rehabilitation are their bread and butter. Sessions are £50 (illustrative demo pricing).' + BOOK_STEER
    },
    {
      keys: ['stress', 'tension', 'relax', 'massage', 'aromatherapy', 'indian head'],
      reply: 'Therapeutic massage with Tracy Ward would be the one to look at — she’s been a massage therapist since 1997 and also offers aromatherapy and Indian head massage. A 60-minute session is £45 (illustrative demo pricing).' + BOOK_STEER
    },
    {
      keys: ['acupunctur', 'needle', 'chronic pain'],
      reply: 'Acupuncture at Cat Hill is often used for persistent pain and general wellbeing, on its own or alongside another therapy. Sessions are £48 (illustrative demo pricing). Many patients are surprised how comfortable it is — the needles are hair-thin.' + BOOK_STEER
    },
    {
      keys: ['price', 'cost', 'fee', 'much', 'charge'],
      reply: 'Illustrative demo pricing: initial chiropractic consultation £55, chiropractic sessions £42, physiotherapy £50, acupuncture £48, therapeutic massage (60 min) £45. The live site would show the clinic’s confirmed fees.'
    },
    {
      keys: ['open', 'hours', 'time', 'saturday', 'weekend', 'today'],
      reply: 'Typical clinic hours are Monday to Friday 9:00–6:30 with Saturday mornings by appointment (demo values — the live site would show the clinic’s confirmed diary). Call 020 8275 0656 to check availability today.'
    },
    {
      keys: ['first', 'visit', 'expect', 'assessment', 'consultation', 'appointment long'],
      reply: 'Your first visit is a full assessment: a chat about your history, an examination, and a clear explanation of what we find and what we recommend — with treatment usually beginning the same day if appropriate. Allow about 45 minutes.'
    },
    {
      keys: ['wear', 'clothes', 'undress'],
      reply: 'Wear comfortable clothing you can move in — gym-style is ideal. For some assessments we may ask you to remove outer layers, and we’ll always explain why and make sure you’re comfortable first.'
    },
    {
      keys: ['referral', 'gp', 'doctor', 'insurance'],
      reply: 'No GP referral is needed — you can book directly. If you’re claiming through private health insurance, check your policy first; our physiotherapy team regularly works with insurer referrals.'
    },
    {
      keys: ['park', 'parking', 'car', 'bus', 'train', 'get to', 'directions', 'where'],
      reply: 'We’re at 103 Cat Hill, East Barnet EN4 8HP — free local parking is usually easy to find nearby (demo note; the live site would confirm), and we’re on local bus routes from Barnet and Southgate.'
    },
    {
      keys: ['pregnan', 'baby', 'child', 'kid', 'paediatric'],
      reply: 'Dr Donovan has a particular interest in chiropractic care during pregnancy and for children — it’s one of the things Cat Hill is known for locally. She’ll adapt every technique to be appropriate and gentle.' + BOOK_STEER
    },
    {
      keys: ['who', 'team', 'jenny', 'donovan', 'james', 'tracy', 'chiropractor'],
      reply: 'The team: Dr Jenny Donovan (Doctor of Chiropractic, running the clinic since 2008), James Galea (physiotherapist, Elements Physiotherapy) and Tracy Ward (therapeutic massage). You’ll find their full bios on the About page.'
    },
    {
      keys: ['book', 'contact', 'phone', 'call', 'email', 'speak', 'human'],
      reply: 'You can call the clinic on 020 8275 0656, or use the form on the contact page and reception will come back to you. We’re at 103 Cat Hill, East Barnet EN4 8HP.'
    },
    {
      keys: ['hello', 'hi', 'hey', 'morning', 'afternoon'],
      reply: 'Hello! I’m the Cat Hill Assistant. Tell me what’s bothering you — a bad back, a sports injury, tension — or ask about prices, opening hours or your first visit.'
    }
  ];

  var FALLBACK = 'That’s one for the clinic team to answer properly. Call 020 8275 0656, or leave your number via the contact page and reception will call you back. You could also try the symptom checker on the home page.';

  var CHIPS = [
    'I’ve got lower back pain',
    'What are your prices?',
    'What happens on a first visit?',
    'Do I need a GP referral?'
  ];

  function answer(text) {
    var q = text.toLowerCase();
    var best = null, bestScore = 0;
    BRAIN.forEach(function (item) {
      var score = 0;
      item.keys.forEach(function (k) { if (q.indexOf(k) !== -1) score++; });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return best && bestScore > 0 ? best.reply : FALLBACK;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text; // user input is never parsed as HTML
    return node;
  }

  function build() {
    var fab = el('button', 'chat-fab');
    fab.setAttribute('aria-label', 'Open chat with the Cat Hill Assistant');
    fab.textContent = '💬';

    var panel = el('div', 'chat-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Cat Hill Assistant chat');

    var head = el('div', 'chat-head');
    head.appendChild(el('div', 'avatar', 'CH'));
    var title = el('div');
    title.appendChild(el('b', null, 'Cat Hill Assistant'));
    title.appendChild(el('span', null, '● Online — AI demo'));
    head.appendChild(title);
    var close = el('button', 'chat-close', '✕');
    close.setAttribute('aria-label', 'Close chat');
    head.appendChild(close);

    var body = el('div', 'chat-body');

    var chips = el('div', 'chat-chips');
    CHIPS.forEach(function (c) {
      var chip = el('button', 'chip', c);
      chip.addEventListener('click', function () { send(c); });
      chips.appendChild(chip);
    });

    var inputBar = el('div', 'chat-input');
    var input = el('input');
    input.type = 'text';
    input.placeholder = 'Ask about symptoms, prices, visits…';
    input.setAttribute('aria-label', 'Type your question');
    var sendBtn = el('button', null, '➤');
    sendBtn.setAttribute('aria-label', 'Send message');
    inputBar.appendChild(input);
    inputBar.appendChild(sendBtn);

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(chips);
    panel.appendChild(inputBar);

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    function addMsg(text, who) {
      var m = el('div', 'msg ' + who, text);
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
      return m;
    }

    function send(text) {
      var value = (text || input.value).trim();
      if (!value) return;
      input.value = '';
      addMsg(value, 'user');

      var typing = el('div', 'msg bot typing');
      typing.appendChild(el('span'));
      typing.appendChild(el('span'));
      typing.appendChild(el('span'));
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;

      setTimeout(function () {
        typing.remove();
        addMsg(answer(value), 'bot');
      }, 850 + Math.random() * 500);
    }

    var greeted = false;
    function toggle(open) {
      panel.classList.toggle('open', open);
      if (open && !greeted) {
        greeted = true;
        setTimeout(function () {
          addMsg('Hi — I’m the Cat Hill Assistant. Tell me what’s bothering you and I’ll point you to the right therapy, or ask me about prices, opening hours and first visits. I give guidance, not diagnosis.', 'bot');
        }, 350);
      }
      if (open) input.focus();
    }

    fab.addEventListener('click', function () { toggle(!panel.classList.contains('open')); });
    close.addEventListener('click', function () { toggle(false); });
    sendBtn.addEventListener('click', function () { send(); });
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') send(); });
  }

  document.addEventListener('DOMContentLoaded', build);
})();
