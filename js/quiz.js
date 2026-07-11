// Symptom quiz — demo widget. Guidance only, never a diagnosis; the live
// version would be tuned with the clinicians and could use a real LLM.

(function () {
  var THERAPIES = {
    chiro: {
      name: 'Chiropractic',
      url: 'chiropractic.html',
      img: 'assets/chiropractic.jpg',
      price: 'Initial consultation £55 · sessions £42',
      why: 'Spinal and joint problems respond well to chiropractic assessment and gentle adjustment — Dr Donovan has treated these daily since 2002.'
    },
    physio: {
      name: 'Physiotherapy',
      url: 'physiotherapy.html',
      img: 'assets/general.jpg',
      price: 'Sessions £50',
      why: 'Injuries and post-surgery recovery benefit from a structured rehabilitation plan — exactly what our physiotherapy team builds.'
    },
    massage: {
      name: 'Therapeutic Massage',
      url: 'massage.html',
      img: 'assets/sports_massage.jpg',
      price: '60 minutes £45',
      why: 'Muscle tension and stress-related tightness respond quickly to targeted therapeutic massage.'
    },
    acu: {
      name: 'Acupuncture',
      url: 'acupuncture.html',
      img: 'assets/acupuncture.jpg',
      price: 'Sessions £48',
      why: 'Persistent pain and general wellbeing concerns are where acupuncture shines, often alongside another therapy.'
    }
  };

  var STEPS = [
    {
      q: 'Where is the problem?',
      opts: [
        { label: 'Back or spine', v: 'back' },
        { label: 'Neck or shoulders', v: 'neck' },
        { label: 'Arm, leg or joint', v: 'limb' },
        { label: 'General muscle tension', v: 'tension' },
        { label: 'Overall wellbeing / stress', v: 'wellbeing' }
      ]
    },
    {
      q: 'How long has it been bothering you?',
      opts: [
        { label: 'Just started (days)', v: 'new' },
        { label: 'A few weeks', v: 'weeks' },
        { label: 'Months or longer', v: 'chronic' }
      ]
    },
    {
      q: 'Which sounds most like you?',
      opts: [
        { label: 'It flared up after sport or activity', v: 'activity' },
        { label: 'It’s worse after desk work', v: 'desk' },
        { label: 'It’s there most of the time', v: 'constant' },
        { label: 'It builds up when I’m stressed', v: 'stress' }
      ]
    }
  ];

  function recommend(a) {
    // Simple demo mapping: location leads, then character refines.
    if (a[0] === 'wellbeing') return a[2] === 'stress' ? 'massage' : 'acu';
    if (a[0] === 'tension') return a[2] === 'constant' ? 'acu' : 'massage';
    if (a[0] === 'limb') return a[2] === 'activity' ? 'physio' : (a[1] === 'chronic' ? 'acu' : 'physio');
    // back or neck:
    if (a[2] === 'activity') return 'physio';
    if (a[2] === 'stress') return 'massage';
    return 'chiro';
  }

  function progressHTML(step) {
    var out = '<div class="quiz-progress">';
    for (var i = 0; i < STEPS.length; i++) {
      out += '<span class="' + (i < step ? 'done' : '') + '"></span>';
    }
    return out + '</div>';
  }

  function stepHTML(step) {
    var s = STEPS[step];
    var out = progressHTML(step) + '<div class="quiz-q">' + s.q + '</div><div class="quiz-opts">';
    s.opts.forEach(function (o) {
      out += '<button type="button" class="quiz-opt" data-v="' + o.v + '">' + o.label + '</button>';
    });
    out += '</div>';
    if (step > 0) out += '<button type="button" class="quiz-back" data-back>← Back</button>';
    out += '<p class="quiz-note">Guidance only, not a diagnosis — we confirm the right approach at your first assessment.</p>';
    return out;
  }

  function resultHTML(key) {
    var t = THERAPIES[key];
    return progressHTML(STEPS.length) +
      '<div class="quiz-result">' +
      '  <img src="' + t.img + '" alt="' + t.name + ' at Cat Hill Clinic">' +
      '  <div>' +
      '    <div class="r-label">Our suggestion for you</div>' +
      '    <h4>' + t.name + '</h4>' +
      '    <p>' + t.why + '</p>' +
      '    <div class="r-price">' + t.price + '</div>' +
      '    <div class="quiz-actions">' +
      '      <a class="btn btn-sea" href="contact.html">Book an appointment</a>' +
      '      <a class="btn btn-outline" href="' + t.url + '">About ' + t.name.toLowerCase() + '</a>' +
      '    </div>' +
      '    <button type="button" class="quiz-back" data-restart>Start again</button>' +
      '  </div>' +
      '</div>' +
      '<p class="quiz-note">Guidance only, not a diagnosis — we confirm the right approach at your first assessment.</p>';
  }

  function init(mount) {
    var body = mount.querySelector('.quiz-body');
    var step = 0;
    var answers = [];

    function render() { body.innerHTML = stepHTML(step); }

    render();

    body.addEventListener('click', function (ev) {
      var opt = ev.target.closest('.quiz-opt');
      if (opt) {
        answers[step] = opt.getAttribute('data-v');
        if (step < STEPS.length - 1) {
          step++;
          render();
        } else {
          body.innerHTML = resultHTML(recommend(answers));
        }
        return;
      }
      if (ev.target.closest('[data-back]')) {
        step = Math.max(0, step - 1);
        render();
      }
      if (ev.target.closest('[data-restart]')) {
        step = 0;
        answers = [];
        render();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-quiz]').forEach(init);
  });
})();
