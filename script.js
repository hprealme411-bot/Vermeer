/* ===== Simulator ===== */
const preview = document.getElementById('preview');
const photo = document.getElementById('photo');
const sliders = {brightness:'o-b', contrast:'o-c', saturation:'o-s'};

function applyFilter(){
  const b = document.getElementById('brightness').value;
  const c = document.getElementById('contrast').value;
  const s = document.getElementById('saturation').value;
  preview.style.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
  document.getElementById('o-b').textContent = b + '%';
  document.getElementById('o-c').textContent = c + '%';
  document.getElementById('o-s').textContent = s + '%';
}
Object.keys(sliders).forEach(id => document.getElementById(id).addEventListener('input', applyFilter));

document.getElementById('file').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  photo.src = URL.createObjectURL(f);
  photo.hidden = false;
});
document.getElementById('reset').addEventListener('click', () => {
  Object.keys(sliders).forEach(id => document.getElementById(id).value = 100);
  applyFilter();
});

/* ===== Quiz ===== */
const questions = [
  {q:'Jenis color grading apa yang cocok untuk film horor?', o:['Orange sunset yang hangat','Moody: gelap, dingin, saturation rendah','Vintage kuning pudar','Warna pastel cerah'], a:1},
  {q:'Warna dominan pada gaya Teal & Orange adalah...', o:['Hijau dan ungu','Merah dan biru tua','Teal dan oranye','Kuning dan abu-abu'], a:2},
  {q:'Apa tujuan utama color correction?', o:['Membuat gambar bergaya dramatis','Membuat warna gambar akurat dan natural','Menambah efek grain','Mengubah semua warna jadi hitam putih'], a:1},
  {q:'Kombinasi warna yang saling berseberangan di color wheel disebut...', o:['Analogous','Triadic','Complementary','Monochrome'], a:2},
  {q:'Pengaturan apa yang mengubah kekuatan atau intensitas warna?', o:['Saturation','Exposure','Highlights','Sharpness'], a:0},
  {q:'Foto terlihat terlalu kebiruan. Apa yang sebaiknya disesuaikan?', o:['Contrast','White balance','Vignette','Resolusi'], a:1},
  {q:'Gaya yang terasa seperti foto lama dan nostalgia adalah...', o:['Vintage','Cinematic','Teal & Orange','Moody'], a:0},
  {q:'Warna kuning, oranye, dan merah yang bersebelahan termasuk skema...', o:['Complementary','Analogous','Triadic','Split'], a:1}
];
let idx = 0, score = 0;
const $ = id => document.getElementById(id);

function show(){
  const item = questions[idx];
  $('q-count').textContent = `Pertanyaan ${idx+1} dari ${questions.length}`;
  $('q-text').textContent = item.q;
  $('q-fb').textContent = '';
  $('q-next').hidden = true;
  $('q-opts').innerHTML = '';
  item.o.forEach((text, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.addEventListener('click', () => answer(i));
    $('q-opts').appendChild(b);
  });
}
function answer(i){
  const item = questions[idx];
  const btns = $('q-opts').children;
  [...btns].forEach((b, n) => {
    b.disabled = true;
    if (n === item.a) b.classList.add('ok');
    else if (n === i) b.classList.add('no');
  });
  if (i === item.a){ score++; $('q-fb').textContent = 'Benar!'; }
  else $('q-fb').textContent = 'Kurang tepat. Jawaban yang benar ditandai hijau.';
  $('q-next').textContent = idx === questions.length-1 ? 'Lihat skor' : 'Lanjut';
  $('q-next').hidden = false;
}
$('q-next').addEventListener('click', () => {
  idx++;
  if (idx < questions.length) return show();
  $('q-count').textContent = 'Quiz selesai';
  $('q-text').textContent = `Skor kamu ${score} dari ${questions.length}`;
  $('q-opts').innerHTML = '';
  $('q-fb').textContent = score >= 6 ? 'Mantap, kamu sudah paham dasar color grading.' : 'Coba baca tutorial lagi, lalu ulangi quiz-nya.';
  $('q-next').textContent = 'Ulangi quiz';
  $('q-next').onclick = () => location.reload();
});
show();

/* ===== Animasi & efek futuristik ===== */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Bar progres scroll di paling atas
  const bar = document.createElement('div');
  bar.className = 'progress';
  document.body.prepend(bar);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  if (reduce) return;

  // Cahaya yang mengikuti kursor di hero
  const frame = document.querySelector('.frame');
  if (frame) {
    const spot = document.createElement('div');
    spot.className = 'spot';
    frame.prepend(spot);
    frame.addEventListener('pointermove', e => {
      const r = frame.getBoundingClientRect();
      frame.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      frame.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  // Elemen muncul pelan-pelan saat di-scroll
  if (!('IntersectionObserver' in window)) return;
  const items = document.querySelectorAll('.wrap h2, .wrap h3, .wrap .lead, .panel, .sim-view, .controls, .wheel');
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      io.unobserve(el);
      setTimeout(() => {
        el.classList.remove('reveal', 'in');
        el.style.transitionDelay = '';
      }, 1300);
    });
  }, {threshold: 0.15});
  items.forEach(el => {
    const i = [...el.parentElement.children].indexOf(el);
    el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
    el.classList.add('reveal');
    io.observe(el);
  });
})();

/* ===== Tour 3D isometrik berbasis scroll ===== */
(() => {
  const tour = document.getElementById('home');
  const stack = document.getElementById('stack');
  if (!tour || !stack) return;
  const $ = id => document.getElementById(id);
  const A = 'contrast(1.25) saturate(1.4) hue-rotate(-12deg) sepia(.3)';
  const S = [
    ['Import', 'Vermeer', 'Belajar color grading dari dasar sampai membuat look sinematik. Scroll untuk melihat alurnya.', 'Foto mentah siap diedit', 'none'],
    ['Exposure', 'Exposure.', 'Atur terang gelapnya gambar lebih dulu supaya detail tidak hilang.', 'Exposure +0,4', 'brightness(1.12)'],
    ['White balance', 'White balance.', 'Netralkan suhu warna agar putih benar-benar putih.', 'Temp 5600K ke 5200K', 'brightness(1.1) sepia(.2) hue-rotate(-8deg)'],
    ['Contrast', 'Contrast.', 'Bentuk kedalaman antara area terang dan gelap.', 'Contrast +25', 'brightness(1.1) sepia(.2) hue-rotate(-8deg) contrast(1.25)'],
    ['Color grade', 'Color grade.', 'Beri warna dan mood, misalnya teal dan oranye.', 'Look: Teal & Orange', A],
    ['Export', 'Siap dibagikan.', 'Simpan hasil akhir dan tunjukkan karyamu.', 'Export JPG kualitas tinggi', A + ' brightness(.95)']
  ];
  const planes = [...stack.children];
  const steps = $('steps');
  S.forEach(s => { const li = document.createElement('li'); li.textContent = s[0]; steps.appendChild(li); });
  let cur = -1;

  function setStage(n) {
    if (n === cur) return;
    const first = cur < 0;
    cur = n;
    const box = $('t-box');
    const apply = () => {
      $('t-step').textContent = `Langkah ${n + 1} dari ${S.length}: ${S[n][0]}`;
      $('t-title').textContent = S[n][1];
      $('t-desc').textContent = S[n][2];
      $('t-info').textContent = S[n][3];
      box.classList.remove('out');
    };
    if (first) apply(); else { box.classList.add('out'); setTimeout(apply, 180); }
    $('hero-scene').style.filter = S[n][4];
    planes.forEach((p, i) => p.classList.toggle('on', i === n));
    [...steps.children].forEach((li, i) => {
      li.classList.toggle('on', i === n);
      li.classList.toggle('done', i < n);
    });
  }

  let tick = false;
  function update() {
    tick = false;
    const r = tour.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (tour.offsetHeight - innerHeight)));
    stack.style.setProperty('--rz', (-40 + p * 32) + 'deg');
    stack.style.setProperty('--gap', (8 + 58 * Math.min(1, p * 5)) + 'px');
    tour.classList.toggle('dark', p > 0.4);
    setStage(Math.min(S.length - 1, Math.floor(p * S.length)));
  }
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, {passive: true});
  addEventListener('resize', update);
  update();
})();
